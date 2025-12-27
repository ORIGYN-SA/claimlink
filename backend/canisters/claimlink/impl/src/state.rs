use bity_ic_canister_state_macros::canister_state;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use types::TimestampNanos;
use utils::{
    env::{CanisterEnv, Environment},
    memory::MemorySize,
};

use crate::types::{
    collections::{CollectionRequest, OgyTransferIndex},
    cycles::CyclesManagement,
    templates::NftTemplateId,
};

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
            origyn_nft_wasm_hash: self.data.origyn_nft_wasm_hash.clone(),
            authorized_principals: self.data.authorized_principals.clone(),
            ledger_canister_id: self.data.ledger_canister_id,
            bank_principal_id: self.data.bank_principal_id,
        }
    }
    pub fn is_caller_authorised_principal(&self) -> bool {
        let caller = self.env.caller();
        self.data.authorized_principals.contains(&caller)
    }
}

#[derive(CandidType, Serialize)]
pub struct Metrics {
    pub canister_info: CanisterInfo,
    pub authorized_principals: Vec<Principal>,
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
    pub origyn_nft_wasm_hash: String,

    /// SNS OGY ledger canister
    pub ledger_canister_id: Principal,

    /// authorized Principals for guarded calls
    pub authorized_principals: Vec<Principal>,

    /// Bank principal for burning OGY paid for NFT collection(canister) creations and installation
    pub bank_principal_id: Principal,

    // cycles mangement config
    pub cycles_management: CyclesManagement,

    // amount of OGY to charge per collection
    pub collection_request_fee: u128,

    // OGY transfer
    pub ogy_transfer_fee: u128,

    pub template_owners: BTreeMap<Principal, NftTemplateId>,

    // nft collection requersts
    pub collection_requests: BTreeMap<OgyTransferIndex, CollectionRequest>,

    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: u64,

    // pending collections to be created and installed
    pub pending_queue: Vec<OgyTransferIndex>,

    // failed collections to be reimbursed
    pub reimbursement_queue: Vec<OgyTransferIndex>,
}

impl Data {}
