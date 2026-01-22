use std::fmt::Debug;

use bity_ic_utils::memory::MemorySize;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};
use types::TimestampNanos;

use crate::{cycles::CyclesManagement, init::AuthordiedPrincipal};

#[derive(CandidType, Serialize, Deserialize)]
pub struct Metrics {
    pub canister_info: CanisterInfo,
    pub authorized_principals: Vec<AuthordiedPrincipal>,
    pub ledger_canister_id: Principal,
    pub bank_principal_id: Principal,
    pub origyn_nft_wasm_hash: String,
    pub cycles_management: CyclesManagement,
    pub collection_request_fee: Nat,
    pub ogy_transfer_fee: Nat,
    pub ogy_to_burn: Nat,
    pub total_ogy_burned: Nat,
    pub max_template_per_owner: Nat,
    pub next_template_id: Nat,
    pub max_creation_retries: Nat,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct CanisterInfo {
    pub now_nanos: TimestampNanos,
    pub test_mode: bool,
    pub memory_used: MemorySize,
    pub cycles_balance_in_tc: f64,
}

impl Debug for Metrics {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Metrics")
            .field("canister_info", &self.canister_info)
            .field("authorized_principals", &self.authorized_principals)
            .field("ledger_canister_id", &self.ledger_canister_id.to_text())
            .field("bank_principal_id", &self.bank_principal_id.to_text())
            .field("origyn_nft_wasm_hash", &self.origyn_nft_wasm_hash)
            .field("cycles_management", &self.cycles_management)
            .field("collection_request_fee", &self.collection_request_fee)
            .field("ogy_transfer_fee", &self.ogy_transfer_fee)
            .field("ogy_to_burn", &self.ogy_to_burn)
            .field("total_ogy_burned", &self.total_ogy_burned)
            .field("max_template_per_owner", &self.max_template_per_owner)
            .field("next_template_id", &self.next_template_id)
            .field("max_creation_retries", &self.max_creation_retries)
            .finish()
    }
}

impl Debug for CanisterInfo {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("CanisterInfo")
            .field("now_nanos", &self.now_nanos)
            .field("test_mode", &self.test_mode)
            .field("memory_used", &"".to_string())
            .field("cycles_balance_in_tc", &self.cycles_balance_in_tc)
            .finish()
    }
}
