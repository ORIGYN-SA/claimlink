use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use types::TimestampMillis;

/// Information about a created collection
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct CollectionInfo {
    pub canister_id: Principal,
    pub creator: Principal,
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub created_at: TimestampMillis,
}

/// Arguments for paginated collection queries
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct PaginationArgs {
    pub offset: Option<u64>,
    pub limit: Option<u64>,
}

impl PaginationArgs {
    pub const MAX_LIMIT: u64 = 100;

    pub fn get_offset(&self) -> usize {
        self.offset.unwrap_or(0) as usize
    }

    pub fn get_limit(&self) -> usize {
        let limit = self.limit.unwrap_or(Self::MAX_LIMIT);
        limit.min(Self::MAX_LIMIT) as usize
    }
}

/// Result for paginated collection queries
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionsResult {
    pub collections: Vec<CollectionInfo>,
    pub total_count: u64,
}

// Storable implementation for CollectionInfo
use candid::{Decode, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use std::borrow::Cow;

const MAX_COLLECTION_INFO_BYTES_SIZE: u32 = 1000;

impl Storable for CollectionInfo {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(&bytes, Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_COLLECTION_INFO_BYTES_SIZE,
        is_fixed_size: false,
    };
}

/// Wrapper type for storing a list of collection canister IDs owned by a principal
/// This allows implementing Storable for Vec<Principal> without violating orphan rules
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct OwnerCollectionList(pub Vec<Principal>);

const MAX_OWNER_COLLECTION_LIST_BYTES_SIZE: u32 = 10000;

impl Storable for OwnerCollectionList {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(&bytes, Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_OWNER_COLLECTION_LIST_BYTES_SIZE,
        is_fixed_size: false,
    };
}
