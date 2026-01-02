use bity_ic_canister_state_macros::canister_state;
use bity_ic_utils::principal::PrincipalDotAccountFormat;
use candid::{CandidType, Principal};
use claimlink_api::{
    cycles::CyclesManagement,
    init::{AuthordiedPrincipal, InitArg},
};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use types::TimestampNanos;
use utils::{
    env::{CanisterEnv, Environment},
    memory::MemorySize,
};

use crate::types::{
    collections::{
        CollectionMetadata, CollectionRequest, InstallationStatus, OgyChargedAmount,
        OgyTransferIndex,
    },
    templates::NftTemplateId,
    wasm::WasmHash,
};

pub mod audit;

canister_state!(RuntimeState);

pub struct RuntimeState {
    /// Runtime environment
    pub env: CanisterEnv,
    /// Runtime data
    pub data: Data,
}

impl RuntimeState {
    pub fn new(env: CanisterEnv, data: Data) -> Self {
        Self { env, data }
    }

    pub fn metrics(&self) -> Metrics {
        Metrics {
            canister_info: CanisterInfo {
                now_nanos: self.env.now(),
                test_mode: self.env.is_test_mode(),
                memory_used: MemorySize::used(),
                cycles_balance_in_tc: self.env.cycles_balance_in_tc(),
            },
            origyn_nft_wasm_hash: self.data.origyn_nft_wasm_hash.to_string(),
            authorized_principals: self.data.authorized_principals.clone(),
            ledger_canister_id: self.data.ledger_canister_id,
            bank_principal_id: self.data.bank_principal_id,
        }
    }
    pub fn is_caller_authorised_principal(&self) -> bool {
        let caller = self.env.caller();
        self.data
            .authorized_principals
            .iter()
            .find(|authordied_principal| authordied_principal.principal == caller)
            .is_some()
    }
}

#[derive(CandidType)]
pub struct Metrics {
    pub canister_info: CanisterInfo,
    pub authorized_principals: Vec<AuthordiedPrincipal>,
    pub ledger_canister_id: Principal,
    pub bank_principal_id: Principal,
    pub origyn_nft_wasm_hash: String,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct CanisterInfo {
    pub now_nanos: TimestampNanos,
    pub test_mode: bool,
    pub memory_used: MemorySize,
    pub cycles_balance_in_tc: f64,
}

pub struct Data {
    /// current origyn NFT commit hash
    pub origyn_nft_wasm_hash: WasmHash,

    /// SNS OGY ledger canister
    pub ledger_canister_id: Principal,

    /// authorized Principals for guarded calls
    pub authorized_principals: Vec<AuthordiedPrincipal>,

    /// Bank principal for burning OGY paid for NFT collection(canister) creations and installation
    pub bank_principal_id: Principal,

    // cycles mangement config
    pub cycles_management: CyclesManagement,

    // amount of OGY to charge per collection
    pub collection_request_fee: u128,

    // OGY transfer
    pub ogy_transfer_fee: u128,

    // owner to template map
    pub template_owners: BTreeMap<Principal, Vec<NftTemplateId>>,

    pub max_template_per_owner: u64,

    // nft collection requersts
    pub collection_requests: BTreeMap<OgyTransferIndex, CollectionRequest>,

    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: u64,

    // pending collections to be created and installed
    pub pending_queue: Vec<OgyTransferIndex>,

    // failed collections to be reimbursed
    pub reimbursement_queue: Vec<OgyTransferIndex>,
}

impl Data {
    // check if an owner principal owns a template
    pub fn owns_template(&self, owner: &Principal, template_id: NftTemplateId) -> bool {
        if let Some(template_ids) = self.template_owners.get(owner) {
            template_ids.iter().find(|id| **id == template_id).is_some()
        } else {
            false
        }
    }

    pub fn record_pending_collection_request(
        &mut self,
        metadata: CollectionMetadata,
        ogy_payment_index: OgyTransferIndex,
        ogy_charged: OgyChargedAmount,
        created_at: TimestampNanos,
        owner: Principal,
    ) {
        self.collection_requests.insert(
            ogy_payment_index,
            CollectionRequest {
                owner,
                ogy_payment_index,
                ogy_charged,
                metadata,
                status: InstallationStatus::Queued,
                created_at,
                updated_at: created_at,
            },
        );

        self.pending_queue.push(ogy_payment_index);
    }

    pub fn record_created_canister(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        canister_id: Principal,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::Created {
            principal: canister_id,
        }
    }

    pub fn record_installed_canister(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        wasm_hash: WasmHash,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        let canister_id = collection
            .status
            .canister_id()
            .expect("Bug: Canister id should be available at this point");
        collection.status = InstallationStatus::Installed {
            principal: canister_id,
            wasm_hash,
        };

        self.pending_queue
            .retain(|index| *index != ogy_payment_index);
    }

    pub fn record_failed_installation(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        reason: String,
        canister_id: Option<Principal>,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        match &collection.status {
            InstallationStatus::Failed {
                reason: _,
                attempsts,
                principal,
            } => {
                collection.status = InstallationStatus::Failed {
                    reason,
                    attempsts: *attempsts + 1,
                    principal: *principal,
                }
            }
            _ => {
                collection.status = InstallationStatus::Failed {
                    reason,
                    attempsts: 1,
                    principal: canister_id,
                }
            }
        }
    }

    pub fn record_reimbursement_request(&mut self, ogy_payment_index: OgyTransferIndex) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::ReimbursingQueued;

        self.pending_queue
            .retain(|index| *index != ogy_payment_index);

        self.reimbursement_queue.push(ogy_payment_index);
    }

    pub fn record_reimbursed_colllection(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        reimbursement_index: OgyTransferIndex,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::Reimbursed {
            tx_index: reimbursement_index,
        };

        self.reimbursement_queue
            .retain(|index| *index != ogy_payment_index);
    }

    pub fn record_failed_reimbursement(&mut self, ogy_payment_index: OgyTransferIndex) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::QuarantinedReimbursement;

        self.reimbursement_queue
            .retain(|index| *index != ogy_payment_index);
    }
}

impl TryFrom<InitArg> for RuntimeState {
    type Error = String;

    fn try_from(value: InitArg) -> Result<Self, Self::Error> {
        let collection_request_fee: u128 = value
            .collection_request_fee
            .0
            .try_into()
            .map_err(|_| "collection_request_fee too big".to_string())?;

        let ogy_transfer_fee: u128 = value
            .ogy_transfer_fee
            .0
            .try_into()
            .map_err(|_| "ogy_transfer_fee too big".to_string())?;

        let max_creation_retries: u64 = value
            .max_creation_retries
            .0
            .try_into()
            .map_err(|_| "max_creation_retries too big".to_string())?;

        let max_template_per_owner: u64 = value
            .max_template_per_owner
            .0
            .try_into()
            .map_err(|_| "max_template_per_owner too big".to_string())?;

        Ok(RuntimeState::new(
            CanisterEnv::new(value.test_mode),
            Data {
                origyn_nft_wasm_hash: WasmHash::default(),
                ledger_canister_id: value.ledger_canister_id,
                authorized_principals: value.authorized_principals,
                bank_principal_id: value.bank_principal_id,
                cycles_management: value.cycles_management,
                collection_request_fee,
                ogy_transfer_fee,
                template_owners: Default::default(),
                collection_requests: Default::default(),
                max_creation_retries,
                pending_queue: Default::default(),
                reimbursement_queue: Default::default(),
                max_template_per_owner,
            },
        ))
    }
}
