use std::fmt::Debug;

use bity_ic_utils::memory::MemorySize;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};
use types::TimestampNanos;

use crate::{
    cycles::CyclesManagement,
    init::AuthordiedPrincipal,
    pricing::{MintPricingConfig, OgyPriceData},
};

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct TimerMetrics {
    pub name: String,
    pub last_run: Option<TimestampNanos>,
    pub interval_seconds: u64,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct CollectionStatusCounts {
    pub queued: u64,
    pub created: u64,
    pub installed: u64,
    pub template_uploaded: u64,
    pub failed: u64,
    pub reimbursing_queued: u64,
    pub reimbursed: u64,
    pub quarantined: u64,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct MintRequestStatusCounts {
    pub initialized: u64,
    pub completed: u64,
    pub refund_requested: u64,
    pub refunded: u64,
    pub refund_failed: u64,
}

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

    // Timer status
    pub timers: Vec<TimerMetrics>,

    // Queue depths
    pub pending_queue_length: u64,
    pub reimbursement_queue_length: u64,
    pub mint_refund_queue_length: u64,

    // Status breakdowns
    pub collection_status_counts: CollectionStatusCounts,
    pub mint_request_status_counts: MintRequestStatusCounts,

    // Config/operational data
    pub base_url: Option<String>,
    pub mint_pricing: Option<MintPricingConfig>,
    pub ogy_price: Option<OgyPriceData>,
    pub kongswap_canister_id: Option<Principal>,
    pub total_collections: u64,
    pub total_templates: u64,
    pub total_mint_requests: u64,
    pub next_mint_request_id: u64,
    pub active_tasks: Vec<String>,

    // Aggregate mint/upload stats
    pub total_nfts_minted: u64,
    pub total_files_uploaded: u64,
    pub total_bytes_uploaded: u64,
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
            .field("timers", &self.timers)
            .field("pending_queue_length", &self.pending_queue_length)
            .field("reimbursement_queue_length", &self.reimbursement_queue_length)
            .field("mint_refund_queue_length", &self.mint_refund_queue_length)
            .field("collection_status_counts", &self.collection_status_counts)
            .field("mint_request_status_counts", &self.mint_request_status_counts)
            .field("base_url", &self.base_url)
            .field("mint_pricing", &self.mint_pricing)
            .field("ogy_price", &self.ogy_price)
            .field("kongswap_canister_id", &self.kongswap_canister_id)
            .field("total_collections", &self.total_collections)
            .field("total_templates", &self.total_templates)
            .field("total_mint_requests", &self.total_mint_requests)
            .field("next_mint_request_id", &self.next_mint_request_id)
            .field("active_tasks", &self.active_tasks)
            .field("total_nfts_minted", &self.total_nfts_minted)
            .field("total_files_uploaded", &self.total_files_uploaded)
            .field("total_bytes_uploaded", &self.total_bytes_uploaded)
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
