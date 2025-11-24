use bity_ic_canister_state_macros::canister_state;
use candid::{CandidType, Principal};
use ic_stable_structures::StableBTreeMap;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use types::{CanisterId, TimestampMillis};
use utils::{
    env::{CanisterEnv, Environment},
    memory::MemorySize,
};

use crate::memory::{
    get_collections_by_owner_memory, get_collections_memory, get_collections_ordered_memory, VM,
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

// Serializable version of RuntimeState for upgrades
#[derive(Serialize, Deserialize)]
pub struct RuntimeStateToSerialize {
    pub env: CanisterEnv,
    pub data: DataToSerialize,
}

impl RuntimeState {
    pub fn new(env: CanisterEnv, data: Data) -> Self {
        Self { env, data }
    }

    pub fn to_serializable(&self) -> RuntimeStateToSerialize {
        RuntimeStateToSerialize {
            env: self.env.clone(),
            data: self.data.to_serializable(),
        }
    }

    pub fn from_serializable(serializable: RuntimeStateToSerialize) -> Self {
        Self {
            env: serializable.env,
            data: Data::from_serializable(serializable.data),
        }
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
    /// Origyn NFT commit hash
    pub origyn_nft_commit_hash: String,
    /// SNS OGY ledger canister
    pub ledger_canister_id: Principal,
    /// authorized Principals for guarded calls
    pub authorized_principals: Vec<Principal>,
    /// Bank principal for paying OGY to create canisters
    pub bank_principal_id: Principal,
    /// Manages the ORIGYN NFT canister (create_canister)
    pub sub_canister_manager: OrigynSubCanisterManager,
    /// Collection registry: canister_id -> collection info
    pub collections: RefCell<StableBTreeMap<Principal, CollectionInfo, VM>>,
    /// Secondary index: owner -> list of collection canister IDs
    pub collections_by_owner: RefCell<StableBTreeMap<Principal, OwnerCollectionList, VM>>,
    /// Ordered list of collection canister IDs (creation order)
    pub collections_ordered: RefCell<StableBTreeMap<u64, Principal, VM>>,
    /// Counter for maintaining insertion order
    pub next_collection_index: u64,
}

// Serializable version of Data for upgrades
#[derive(Serialize, Deserialize)]
pub struct DataToSerialize {
    pub origyn_nft_commit_hash: String,
    pub ledger_canister_id: Principal,
    pub authorized_principals: Vec<Principal>,
    pub bank_principal_id: Principal,
    pub sub_canister_manager: OrigynSubCanisterManager,
    pub next_collection_index: u64,
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
            collections: RefCell::new(StableBTreeMap::init(get_collections_memory())),
            collections_by_owner: RefCell::new(StableBTreeMap::init(
                get_collections_by_owner_memory(),
            )),
            collections_ordered: RefCell::new(StableBTreeMap::init(
                get_collections_ordered_memory(),
            )),
            next_collection_index: 0,
        }
    }

    pub fn to_serializable(&self) -> DataToSerialize {
        DataToSerialize {
            origyn_nft_commit_hash: self.origyn_nft_commit_hash.clone(),
            ledger_canister_id: self.ledger_canister_id,
            authorized_principals: self.authorized_principals.clone(),
            bank_principal_id: self.bank_principal_id,
            sub_canister_manager: self.sub_canister_manager.clone(),
            next_collection_index: self.next_collection_index,
        }
    }

    pub fn from_serializable(serializable: DataToSerialize) -> Self {
        Self {
            origyn_nft_commit_hash: serializable.origyn_nft_commit_hash,
            ledger_canister_id: serializable.ledger_canister_id,
            authorized_principals: serializable.authorized_principals,
            bank_principal_id: serializable.bank_principal_id,
            sub_canister_manager: serializable.sub_canister_manager,
            collections: RefCell::new(StableBTreeMap::init(get_collections_memory())),
            collections_by_owner: RefCell::new(StableBTreeMap::init(
                get_collections_by_owner_memory(),
            )),
            collections_ordered: RefCell::new(StableBTreeMap::init(
                get_collections_ordered_memory(),
            )),
            next_collection_index: serializable.next_collection_index,
        }
    }
}
