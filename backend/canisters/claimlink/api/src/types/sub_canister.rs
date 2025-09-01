use std::collections::HashMap;

use bity_ic_subcanister_manager;
use bity_ic_types::BuildVersion;
use candid::Nat;
use candid::{CandidType, Principal};
use canfund::manager::options::{CyclesThreshold, FundManagerOptions, FundStrategy};
use origyn_nft_canister_api::lifecycle::{
    Args as OrigynNftSetupArgs, InitArgs as OrigynNftInitArgs,
};
use origyn_nft_canister_api::{InitApprovalsArg, PermissionManager};
use serde::{Deserialize, Serialize};

pub const INITIAL_CYCLES_BALANCE: u128 = 2_000_000_000_000; // 2T cycles
pub const RESERVED_CYCLES_BALANCE: u128 = 1_000_000_000_000; // 1T cycles

pub struct CreateOrigynNftCanisterArgs {
    pub creator: Principal,
    pub symbol: String,
    pub name: String,
    pub description: Option<String>,
    pub logo: Option<String>,
}

#[derive(Debug)]
pub enum CreateOrigynNftCanisterError {
    BityNewCanisterError(bity_ic_subcanister_manager::NewCanisterError),
}

impl From<bity_ic_subcanister_manager::NewCanisterError> for CreateOrigynNftCanisterError {
    fn from(error: bity_ic_subcanister_manager::NewCanisterError) -> Self {
        CreateOrigynNftCanisterError::BityNewCanisterError(error)
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct OrigynNftCanister {
    canister_id: Principal,
    state: bity_ic_subcanister_manager::CanisterState,
    canister_param: OrigynNftSetupArgs,
}

impl bity_ic_subcanister_manager::Canister for OrigynNftCanister {
    type ParamType = OrigynNftSetupArgs;

    fn new(
        canister_id: Principal,
        state: bity_ic_subcanister_manager::CanisterState,
        canister_param: Self::ParamType,
    ) -> Self {
        Self {
            canister_id,
            state,
            canister_param,
        }
    }

    fn canister_id(&self) -> Principal {
        self.canister_id.clone()
    }

    fn state(&self) -> bity_ic_subcanister_manager::CanisterState {
        self.state.clone()
    }

    fn canister_param(&self) -> Self::ParamType {
        self.canister_param.clone()
    }

    fn as_any(&self) -> &dyn std::any::Any {
        self
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OrigynSubCanisterManager {
    wasm: Vec<u8>,
    commit_hash: String,
    test_mode: bool,
}

impl OrigynSubCanisterManager {
    pub fn new(test_mode: bool, commit_hash: String, wasm: Vec<u8>) -> Self {
        Self {
            wasm,
            commit_hash,
            test_mode,
        }
    }

    pub async fn create_canister(
        &mut self,
        data: CreateOrigynNftCanisterArgs,
    ) -> Result<OrigynNftCanister, CreateOrigynNftCanisterError> {
        let funding_config = FundManagerOptions::new().with_strategy(FundStrategy::BelowThreshold(
            CyclesThreshold::new()
                .with_min_cycles(RESERVED_CYCLES_BALANCE)
                .with_fund_cycles(INITIAL_CYCLES_BALANCE),
        ));

        let init_args = OrigynNftInitArgs {
            test_mode: self.test_mode,
            version: BuildVersion::default(),
            commit_hash: self.commit_hash.clone(),
            permissions: PermissionManager::new(HashMap::new()),
            description: data.description,
            symbol: data.symbol,
            name: data.name,
            logo: data.logo,
            collection_metadata: HashMap::new(),
            approval_init: InitApprovalsArg {
                max_approvals_per_token_or_collection: Some(Nat::from(10u64)),
                max_revoke_approvals: Some(Nat::from(10u64)),
            },
            atomic_batch_transfers: None,
            default_take_value: None,
            max_canister_storage_threshold: None,
            max_memo_size: None,
            max_query_batch_size: None,
            max_take_value: None,
            max_update_batch_size: None,
            permitted_drift: None,
            supply_cap: None,
            tx_window: None,
        };

        let mut sub_canister_manager: bity_ic_subcanister_manager::SubCanisterManager<
            OrigynNftCanister,
        > = bity_ic_subcanister_manager::SubCanisterManager::new(
            ic_cdk::api::canister_self(),
            HashMap::new(),
            vec![data.creator],
            vec![data.creator],
            INITIAL_CYCLES_BALANCE,
            RESERVED_CYCLES_BALANCE,
            self.test_mode,
            self.commit_hash.clone(),
            self.wasm.clone(),
            funding_config,
        );

        Ok(*sub_canister_manager
            .create_canister(OrigynNftSetupArgs::Init(init_args))
            .await?)
    }
}
