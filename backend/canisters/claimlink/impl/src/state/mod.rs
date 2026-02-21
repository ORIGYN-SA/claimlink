use bity_ic_canister_state_macros::canister_state;

use bity_ic_types::BuildVersion;
use bity_ic_utils::memory::MemorySize;
use candid::Principal;
use claimlink_api::{
    collection::CollectionSearchParam,
    cycles::CyclesManagement,
    init::{AuthordiedPrincipal, InitArg},
    metrics::{CanisterInfo, Metrics},
    mint::{MintRequestId, MintRequestStatus, UploadedFileInfo},
    post_upgrade::UpgradeArgs,
    pricing::{MintPricingConfig, OgyPriceData},
};
use std::{
    collections::{BTreeMap, HashSet},
    str::FromStr,
};
use types::TimestampNanos;
use utils::env::{CanisterEnv, Environment};

use crate::{
    guards::TaskType,
    types::{
        collections::{
            CollectionMetadata, CollectionRequest, InstallationStatus, OgyChargedAmount,
            OgyTransferIndex,
        },
        mint_requests::MintRequest,
        templates::NftTemplateId,
        wasm::WasmHash,
    },
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
            cycles_management: self.data.cycles_management.clone(),
            collection_request_fee: self.data.collection_request_fee.into(),
            ogy_transfer_fee: self.data.ogy_transfer_fee.into(),
            ogy_to_burn: self.data.ogy_to_burn.into(),
            total_ogy_burned: self.data.total_ogy_burned.into(),
            max_template_per_owner: self.data.max_template_per_owner.into(),
            next_template_id: self.data.next_template_id.into(),
            max_creation_retries: self.data.max_creation_retries.into(),
        }
    }

    pub fn is_caller_authorised_principal(&self) -> bool {
        let caller = self.env.caller();
        self.data
            .authorized_principals
            .iter()
            .any(|authordied_principal| authordied_principal.principal == caller)
    }

    pub fn upgrade(
        &mut self,
        UpgradeArgs {
            commit_hash,
            build_version,
            origyn_nft_wasm_hash,
            bank_principal_id,
            cycles_management,
            collection_request_fee,
            ogy_transfer_fee,
            max_creation_retries,
            max_template_per_owner,
            new_authorized_principals,
            ledger_canister_id,
            mint_pricing,
            icpswap_pool_canister_id,
        }: UpgradeArgs,
    ) -> Result<(), String> {
        if let Some(origyn_nft_wasm_hash) = origyn_nft_wasm_hash {
            self.data.origyn_nft_wasm_hash = WasmHash::from_str(&origyn_nft_wasm_hash)?;
        }

        if let Some(bank_principal_id) = bank_principal_id {
            self.data.bank_principal_id = bank_principal_id;
        }

        if let Some(ledger_canister_id) = ledger_canister_id {
            self.data.ledger_canister_id = ledger_canister_id;
        }

        if let Some(cycles_management) = cycles_management {
            self.data.cycles_management = cycles_management;
        }

        if let Some(collection_request_fee) = collection_request_fee {
            self.data.collection_request_fee = collection_request_fee
                .0
                .try_into()
                .map_err(|_| "Invlaid collection_request_fee")?;
        }

        if let Some(ogy_transfer_fee) = ogy_transfer_fee {
            self.data.ogy_transfer_fee = ogy_transfer_fee
                .0
                .try_into()
                .map_err(|_| "Invlaid ogy_transfer_fee")?;
        }

        if let Some(max_creation_retries) = max_creation_retries {
            self.data.max_creation_retries = max_creation_retries
                .0
                .try_into()
                .map_err(|_| "Invlaid max_creation_retries")?;
        }

        if let Some(max_template_per_owner) = max_template_per_owner {
            self.data.max_template_per_owner = max_template_per_owner
                .0
                .try_into()
                .map_err(|_| "Invlaid max_template_per_owner")?;
        }

        if let Some(new_authorized_principals) = new_authorized_principals {
            self.data
                .authorized_principals
                .extend(new_authorized_principals);
        }

        if let Some(mint_pricing) = mint_pricing {
            self.data.mint_pricing = mint_pricing;
        }

        if let Some(icpswap_pool_canister_id) = icpswap_pool_canister_id {
            self.data.icpswap_pool_canister_id = icpswap_pool_canister_id;
        }

        self.env.set_version(build_version);
        self.env.set_commit_hash(commit_hash);

        Ok(())
    }
}

pub struct Data {
    /// current origyn NFT commit hash
    pub origyn_nft_wasm_hash: WasmHash,

    /// Locks preventing concurrent execution timer tasks
    pub active_tasks: HashSet<TaskType>,

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

    // collected OGY token after successful collection creation ready to be burned
    pub ogy_to_burn: u128,

    pub total_ogy_burned: u128,

    // owner to template map
    pub template_owners: BTreeMap<Principal, Vec<NftTemplateId>>,

    pub max_template_per_owner: u64,

    pub next_template_id: u64,

    // nft collection requersts
    pub collection_requests: BTreeMap<OgyTransferIndex, CollectionRequest>,

    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: u64,

    // pending collections to be created and installed
    pub pending_queue: Vec<OgyTransferIndex>,

    // failed collections to be reimbursed
    pub reimbursement_queue: Vec<OgyTransferIndex>,

    pub base_url: Option<String>,

    // Mint pricing
    pub mint_pricing: MintPricingConfig,
    pub ogy_price: Option<OgyPriceData>,
    pub icpswap_pool_canister_id: Principal,

    // Mint requests
    pub mint_requests: BTreeMap<MintRequestId, MintRequest>,
    pub next_mint_request_id: u64,
    pub mint_refund_queue: Vec<MintRequestId>,
}

impl Data {
    // check if an owner principal owns a template
    pub fn owns_template(&self, owner: &Principal, template_id: NftTemplateId) -> bool {
        if let Some(template_ids) = self.template_owners.get(owner) {
            template_ids.contains(&template_id)
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
                canister_id: None,
                wasm_hash: None,
                temaplte_url: None,
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

        collection.status = InstallationStatus::Created;
        collection.canister_id = Some(canister_id);
        collection.updated_at = ic_cdk::api::time();
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

        collection.status = InstallationStatus::Installed;
        collection.wasm_hash = Some(wasm_hash);
        collection.updated_at = ic_cdk::api::time();
    }

    // last step of the installation, at this point collection is successfully create, installed,
    // and collection template is uploaded
    pub fn record_uploaded_template(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        template_url: String,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::TemplateUploaded;
        collection.temaplte_url = Some(template_url);
        collection.updated_at = ic_cdk::api::time();

        self.pending_queue
            .retain(|index| *index != ogy_payment_index);

        self.ogy_to_burn += self.ogy_to_burn.wrapping_add(collection.ogy_charged);
    }

    pub fn record_failed_installation(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        reason: String,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        match &collection.status {
            InstallationStatus::Failed {
                reason: _,
                attempsts,
            } => {
                collection.status = InstallationStatus::Failed {
                    reason,
                    attempsts: *attempsts + 1,
                }
            }
            _ => {
                collection.status = InstallationStatus::Failed {
                    reason,
                    attempsts: 1,
                }
            }
        }
        collection.updated_at = ic_cdk::api::time();
    }

    pub fn record_reimbursement_request(&mut self, ogy_payment_index: OgyTransferIndex) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::ReimbursingQueued;
        collection.updated_at = ic_cdk::api::time();

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
        collection.updated_at = ic_cdk::api::time();

        self.reimbursement_queue
            .retain(|index| *index != ogy_payment_index);
    }

    pub fn record_quarantined_reimbursement(
        &mut self,
        ogy_payment_index: OgyTransferIndex,
        reason: String,
    ) {
        let collection = self
            .collection_requests
            .get_mut(&ogy_payment_index)
            .expect("Bug: collection should exist at this point");

        collection.status = InstallationStatus::QuarantinedReimbursement { reason };
        collection.updated_at = ic_cdk::api::time();

        self.reimbursement_queue
            .retain(|index| *index != ogy_payment_index);
    }

    pub fn get_failed_installations(&self) -> Vec<(u128, CollectionRequest)> {
        self.collection_requests
            .iter()
            .filter_map(|(id, request)| {
                if request.status.is_failed() {
                    Some((*id, request.clone()))
                } else {
                    None
                }
            })
            .collect()
    }

    pub fn get_reimbusements(&self) -> Vec<u128> {
        self.reimbursement_queue.clone()
    }

    pub fn get_collection(
        &self,
        ogy_payment_index: OgyTransferIndex,
    ) -> Option<&CollectionRequest> {
        self.collection_requests.get(&ogy_payment_index)
    }

    pub fn get_collection_by_search_params(
        &self,
        search_param: CollectionSearchParam,
    ) -> Option<CollectionRequest> {
        match search_param {
            CollectionSearchParam::CanisterId(principal) => {
                self.collection_requests.iter().find_map(|(_, collection)| {
                    if collection.canister_id == Some(principal) {
                        Some(collection.clone())
                    } else {
                        None
                    }
                })
            }
            CollectionSearchParam::CollectionId(id_nat) => self
                .collection_requests
                .get(&id_nat.0.try_into().unwrap())
                .cloned(),
        }
    }

    pub fn get_collections_by_owner(&self, owner: Principal) -> Vec<CollectionRequest> {
        self.collection_requests
            .iter()
            .filter_map(|(_, collection)| {
                if collection.owner == owner {
                    Some(collection.clone())
                } else {
                    None
                }
            })
            .collect()
    }

    pub fn get_collection_canister_id(
        &self,
        ogy_payment_index: OgyTransferIndex,
    ) -> Option<Principal> {
        self.collection_requests
            .get(&ogy_payment_index)
            .map(|request| request.canister_id)?
    }

    pub fn is_collection_installed(&self, ogy_payment_index: OgyTransferIndex) -> bool {
        self.collection_requests
            .get(&ogy_payment_index)
            .map(|collection| collection.wasm_hash.is_some())
            .unwrap_or(false)
    }

    pub fn is_template_uploaded(&self, ogy_payment_index: OgyTransferIndex) -> bool {
        self.collection_requests
            .get(&ogy_payment_index)
            .map(|collection| collection.temaplte_url.is_some())
            .unwrap_or(false)
    }

    pub fn record_ogy_burn(&mut self, burned_ogy_amount: u128) {
        self.ogy_to_burn = self
            .ogy_to_burn
            .checked_sub(burned_ogy_amount)
            .expect("Bug: Burned ogy exceeds ogy_to_burn");

        self.total_ogy_burned += self.total_ogy_burned.wrapping_add(burned_ogy_amount);
    }

    pub fn record_created_template(&mut self, template_id: NftTemplateId, owner: Principal) {
        if let Some(templates) = self.template_owners.get_mut(&owner) {
            templates.push(template_id);
        } else {
            self.template_owners.insert(owner, vec![template_id]);
        }
        self.next_template_id += 1;
    }

    pub fn record_deleted_template(&mut self, template_id: NftTemplateId, owner: Principal) {
        if let Some(templates) = self.template_owners.get_mut(&owner) {
            templates.retain(|id| *id != template_id);
        }
    }

    pub fn get_template_ids_by_owner(&self, owner: &Principal) -> Vec<NftTemplateId> {
        self.template_owners.get(owner).unwrap_or(&vec![]).to_vec()
    }

    // --- Mint request helpers ---

    pub fn record_mint_request(
        &mut self,
        owner: Principal,
        collection_canister_id: Principal,
        ogy_payment_index: OgyTransferIndex,
        ogy_charged: u128,
        num_mints: u64,
        allocated_bytes: u64,
        created_at: TimestampNanos,
    ) -> MintRequestId {
        let id = self.next_mint_request_id;
        self.next_mint_request_id += 1;

        self.mint_requests.insert(
            id,
            MintRequest {
                id,
                owner,
                collection_canister_id,
                ogy_payment_index,
                ogy_charged,
                num_mints,
                minted_count: 0,
                allocated_bytes,
                bytes_uploaded: 0,
                uploaded_files: Vec::new(),
                status: MintRequestStatus::Initialized,
                created_at,
                updated_at: created_at,
            },
        );

        id
    }

    pub fn record_file_uploaded(
        &mut self,
        mint_request_id: MintRequestId,
        file_path: String,
        file_url: String,
        file_size: u64,
    ) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");

        request.uploaded_files.push(UploadedFileInfo {
            file_path,
            file_url,
            file_size,
        });
        request.updated_at = ic_cdk::api::time();
    }

    pub fn record_bytes_uploaded(&mut self, mint_request_id: MintRequestId, bytes: u64) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");
        request.bytes_uploaded += bytes;
        request.updated_at = ic_cdk::api::time();
    }

    pub fn record_nfts_minted(&mut self, mint_request_id: MintRequestId, count: u64) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");

        request.minted_count += count;
        request.updated_at = ic_cdk::api::time();

        if request.minted_count == request.num_mints {
            request.status = MintRequestStatus::Completed;
            self.ogy_to_burn += request.ogy_charged;
        }
    }

    pub fn record_mint_refund_requested(&mut self, mint_request_id: MintRequestId) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");

        request.status = MintRequestStatus::RefundRequested;
        request.updated_at = ic_cdk::api::time();

        self.mint_refund_queue.push(mint_request_id);
    }

    pub fn record_mint_refunded(&mut self, mint_request_id: MintRequestId, tx_index: u128) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");

        request.status = MintRequestStatus::Refunded {
            tx_index: candid::Nat::from(tx_index),
        };
        request.updated_at = ic_cdk::api::time();

        self.mint_refund_queue.retain(|id| *id != mint_request_id);
    }

    pub fn record_mint_refund_failed(&mut self, mint_request_id: MintRequestId, reason: String) {
        let request = self
            .mint_requests
            .get_mut(&mint_request_id)
            .expect("Bug: mint request should exist");

        request.status = MintRequestStatus::RefundFailed { reason };
        request.updated_at = ic_cdk::api::time();

        self.mint_refund_queue.retain(|id| *id != mint_request_id);
    }

    pub fn update_ogy_price(&mut self, usd_per_ogy_e8s: u64) {
        self.ogy_price = Some(OgyPriceData {
            usd_per_ogy_e8s,
            updated_at: ic_cdk::api::time(),
        });
    }

    pub fn get_mint_request(&self, id: MintRequestId) -> Option<&MintRequest> {
        self.mint_requests.get(&id)
    }

    pub fn get_mint_requests_by_owner(&self, owner: &Principal) -> Vec<&MintRequest> {
        self.mint_requests
            .values()
            .filter(|r| r.owner == *owner)
            .collect()
    }

    pub fn get_mint_refund_queue(&self) -> Vec<MintRequestId> {
        self.mint_refund_queue.clone()
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
            CanisterEnv::new(
                value.test_mode,
                BuildVersion::new(1, 0, 0),
                value.commit_hash,
            ),
            Data {
                origyn_nft_wasm_hash: Default::default(),
                active_tasks: HashSet::new(),
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
                ogy_to_burn: Default::default(),
                total_ogy_burned: Default::default(),
                next_template_id: Default::default(),
                base_url: value.base_url,
                mint_pricing: value.mint_pricing,
                ogy_price: None,
                icpswap_pool_canister_id: value.icpswap_pool_canister_id,
                mint_requests: Default::default(),
                next_mint_request_id: 0,
                mint_refund_queue: Default::default(),
            },
        ))
    }
}
