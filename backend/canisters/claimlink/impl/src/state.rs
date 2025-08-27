use bity_ic_canister_state_macros::canister_state;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use types::{CanisterId, TimestampMillis};
use utils::{
    env::{CanisterEnv, Environment},
    memory::MemorySize,
};

canister_state!(RuntimeState);

#[derive(Serialize, Deserialize)]
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
            authorized_principals: self.data.authorized_principals.clone(),
            ledger_canister_id: self.data.ledger_canister_id,
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
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct CanisterInfo {
    pub now: TimestampMillis,
    pub test_mode: bool,
    pub memory_used: MemorySize,
    pub cycles_balance_in_tc: f64,
}

#[derive(Serialize, Deserialize)]
pub struct Data {
    /// SNS OGY ledger canister
    pub ledger_canister_id: Principal,
    /// authorized Principals for guarded calls
    pub authorized_principals: Vec<Principal>,
}

impl Data {
    pub fn new(ledger_canister_id: CanisterId, authorized_principals: Vec<Principal>) -> Self {
        Self {
            ledger_canister_id,
            authorized_principals,
        }
    }
}
