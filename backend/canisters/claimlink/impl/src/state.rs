use bity_ic_canister_state_macros::canister_state;
use candid::{CandidType, Principal};
use ic_stable_structures::StableBTreeMap;
use serde::{Deserialize, Serialize};
use std::{
    cell::RefCell,
    collections::{BTreeMap, VecDeque},
};
use types::{CanisterId, TimestampMillis};
use utils::{
    env::{CanisterEnv, Environment},
    memory::MemorySize,
};

use crate::{
    memory::{
        get_collections_by_owner_memory, get_collections_memory, get_collections_ordered_memory, VM,
    },
    types::collections::Collection,
};
use claimlink_api::types::{
    collection::{CollectionInfo, OwnerCollectionList},
    sub_canister::OrigynSubCanisterManager,
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
                now: self.env.now(),
                test_mode: self.env.is_test_mode(),
                memory_used: MemorySize::used(),
                cycles_balance_in_tc: self.env.cycles_balance_in_tc(),
            },
            origyn_nft_commit_hash: self.data.origyn_nft_commit_hash.clone(),
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
    pub origyn_nft_commit_hash: String,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct CanisterInfo {
    pub now: TimestampMillis,
    pub test_mode: bool,
    pub memory_used: MemorySize,
    pub cycles_balance_in_tc: f64,
}

pub struct Data {
    /// current origyn NFT commit hash
    pub origyn_nft_commit_hash: String,
    /// SNS OGY ledger canister
    pub ledger_canister_id: Principal,
    /// authorized Principals for guarded calls
    pub authorized_principals: Vec<Principal>,
    /// Bank principal for burning OGY paid for NFT collection(canister) creations and installation
    pub bank_principal_id: Principal,
    /// Manages the ORIGYN NFT canister (create_canister)
    pub sub_canister_manager: OrigynSubCanisterManager,

    ///  NFT collection(canister) requests waiting to be created and installed
    pub collections_to_install: VecDeque<Collection>,
    /// Created and Installed NFT collections(canisters)
    pub collections: BTreeMap<Principal, Collection>,
}

impl Data {
    pub fn new(
        is_test_mode: bool,
        ledger_canister_id: CanisterId,
        authorized_principals: Vec<Principal>,
        bank_principal_id: Principal,
        origyn_nft_commit_hash: String,
    ) -> Self {
        Self {
            ledger_canister_id,
            authorized_principals,
            bank_principal_id,
            origyn_nft_commit_hash: origyn_nft_commit_hash.clone(),
            sub_canister_manager: OrigynSubCanisterManager::new(
                is_test_mode,
                origyn_nft_commit_hash,
                include_bytes!("../wasm/origyn_nft_canister.wasm.gz").to_vec(),
            ),
            collections_to_install: VecDeque::new(),
            collections: BTreeMap::new(),
        }
    }
}
