use candid::{Nat, Principal};
use claimlink_api::mint::{MintRequestId, MintRequestInfo, MintRequestStatus, UploadedFileInfo};
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

#[cfg(test)]
mod tests {
    use super::*;

    fn make_request(
        num_mints: u64,
        minted_count: u64,
        allocated_bytes: u64,
        bytes_uploaded: u64,
        status: MintRequestStatus,
    ) -> MintRequest {
        MintRequest {
            id: 0,
            owner: Principal::anonymous(),
            collection_canister_id: Principal::anonymous(),
            ogy_payment_index: 0,
            ogy_charged: 0,
            num_mints,
            minted_count,
            allocated_bytes,
            bytes_uploaded,
            uploaded_files: vec![],
            status,
            created_at: 0,
            updated_at: 0,
        }
    }

    #[test]
    fn can_mint_within_limit() {
        let r = make_request(10, 5, 0, 0, MintRequestStatus::Initialized);
        assert!(r.can_mint(5));
    }

    #[test]
    fn can_mint_exact_limit() {
        let r = make_request(10, 9, 0, 0, MintRequestStatus::Initialized);
        assert!(r.can_mint(1));
    }

    #[test]
    fn can_mint_exceeds_limit() {
        let r = make_request(10, 9, 0, 0, MintRequestStatus::Initialized);
        assert!(!r.can_mint(2));
    }

    #[test]
    fn can_mint_all_used() {
        let r = make_request(10, 10, 0, 0, MintRequestStatus::Initialized);
        assert!(!r.can_mint(1));
        assert!(r.can_mint(0));
    }

    #[test]
    fn can_upload_within_limit() {
        let r = make_request(0, 0, 1_000_000, 500_000, MintRequestStatus::Initialized);
        assert!(r.can_upload(500_000));
    }

    #[test]
    fn can_upload_exact_limit() {
        let r = make_request(0, 0, 1_000_000, 999_999, MintRequestStatus::Initialized);
        assert!(r.can_upload(1));
    }

    #[test]
    fn can_upload_exceeds_limit() {
        let r = make_request(0, 0, 1_000_000, 999_999, MintRequestStatus::Initialized);
        assert!(!r.can_upload(2));
    }

    #[test]
    fn can_upload_zero_allocated() {
        let r = make_request(0, 0, 0, 0, MintRequestStatus::Initialized);
        assert!(r.can_upload(0));
        assert!(!r.can_upload(1));
    }

    #[test]
    fn is_active_initialized() {
        let r = make_request(1, 0, 0, 0, MintRequestStatus::Initialized);
        assert!(r.is_active());
    }

    #[test]
    fn is_active_completed() {
        let r = make_request(1, 1, 0, 0, MintRequestStatus::Completed);
        assert!(!r.is_active());
    }

    #[test]
    fn is_active_refund_requested() {
        let r = make_request(1, 0, 0, 0, MintRequestStatus::RefundRequested);
        assert!(!r.is_active());
    }

    #[test]
    fn is_active_refunded() {
        let r = make_request(
            1,
            0,
            0,
            0,
            MintRequestStatus::Refunded {
                tx_index: Nat::from(0u64),
            },
        );
        assert!(!r.is_active());
    }

    #[test]
    fn is_active_refund_failed() {
        let r = make_request(
            1,
            0,
            0,
            0,
            MintRequestStatus::RefundFailed {
                reason: "err".into(),
            },
        );
        assert!(!r.is_active());
    }
}
