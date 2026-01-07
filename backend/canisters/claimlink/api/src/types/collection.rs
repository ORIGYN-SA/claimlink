use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionInfo {
    pub owner: Principal,
    pub collection_id: Nat, // unique collection request Identifier
    pub ogy_charged: Nat,
    pub metadata: CollectionMetadata,
    pub status: CollectionStatus,
    pub canister_id: Option<Principal>,
    pub wasm_hash: Option<String>,
    pub created_at: Nat,
    pub updated_at: Nat,
}

// Collection Metadata
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub template_id: Nat,
}

//  Distinct states for the lifecycle
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CollectionStatus {
    Queued,
    Created,
    Installed,
    TemplateUploaded,
    Failed { reason: String, attempsts: Nat },
    ReimbursingQueued,
    Reimbursed { tx_index: Nat },
    QuarantinedReimbursement { reason: String },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CollectionSearchParam {
    CanisterId(Principal),
    CollectionId(Nat),
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
