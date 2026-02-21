use candid::{Nat, Principal};
use claimlink_api::mint::{MintRequestId, MintRequestInfo, MintRequestStatus, UploadedFileInfo};
use claimlink_api::pricing::OgyPriceData;
use minicbor::{Decode, Encode};
use types::TimestampNanos;

use crate::types::collections::OgyTransferIndex;

/// Internal mint request stored in canister state.
#[derive(Clone, Debug)]
pub struct MintRequest {
    pub id: MintRequestId,
    pub owner: Principal,
    pub collection_canister_id: Principal,
    pub ogy_payment_index: OgyTransferIndex,
    pub ogy_charged: u128,
    /// How many NFTs the user paid for
    pub num_mints: u64,
    /// How many have been minted so far
    pub minted_count: u64,
    /// Storage bytes paid for
    pub allocated_bytes: u64,
    /// Storage bytes used so far
    pub bytes_uploaded: u64,
    /// Files uploaded through proxy endpoints
    pub uploaded_files: Vec<UploadedFileInfo>,
    pub status: MintRequestStatus,
    pub created_at: TimestampNanos,
    pub updated_at: TimestampNanos,
}

impl MintRequest {
    pub fn can_mint(&self, count: u64) -> bool {
        self.minted_count + count <= self.num_mints
    }

    pub fn can_upload(&self, bytes: u64) -> bool {
        self.bytes_uploaded + bytes <= self.allocated_bytes
    }

    pub fn is_active(&self) -> bool {
        self.status == MintRequestStatus::Initialized
    }

    pub fn to_info(&self) -> MintRequestInfo {
        MintRequestInfo {
            id: Nat::from(self.id),
            owner: self.owner,
            collection_canister_id: self.collection_canister_id,
            ogy_charged: Nat::from(self.ogy_charged),
            num_mints: Nat::from(self.num_mints),
            minted_count: Nat::from(self.minted_count),
            allocated_bytes: Nat::from(self.allocated_bytes),
            bytes_uploaded: Nat::from(self.bytes_uploaded),
            uploaded_files: self.uploaded_files.clone(),
            status: self.status.clone(),
            created_at: Nat::from(self.created_at),
            updated_at: Nat::from(self.updated_at),
        }
    }
}

/// Pricing data stored in state, re-exported from API for convenience.
pub use OgyPriceData as OgyPrice;
