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
