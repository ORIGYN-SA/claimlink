use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

pub type MintRequestId = u64;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct UploadedFileInfo {
    pub file_path: String,
    pub file_url: String,
    pub file_size: u64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize, PartialEq, Eq)]
pub enum MintRequestStatus {
    Initialized,
    Completed,
    RefundRequested,
    Refunded { tx_index: Nat },
    RefundFailed { reason: String },
}

/// API return type for mint request queries (Candid-serializable).
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct MintRequestInfo {
    pub id: Nat,
    pub owner: Principal,
    pub collection_canister_id: Principal,
    pub ogy_charged: Nat,
    pub num_mints: Nat,
    pub minted_count: Nat,
    pub allocated_bytes: Nat,
    pub bytes_uploaded: Nat,
    pub uploaded_files: Vec<UploadedFileInfo>,
    pub status: MintRequestStatus,
    pub created_at: Nat,
    pub updated_at: Nat,
}
