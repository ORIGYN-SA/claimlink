use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use types::TimestampNanos;

use crate::{
    canister_management::TaskError,
    types::{templates::NftTemplateId, wasm::WasmHash},
};

pub type OgyTransferIndex = u128;

#[derive(Debug, Clone)]
pub struct CollectionRequest {
    pub owner: Principal,
    pub ogy_payment_index: OgyTransferIndex, // unique collection request Identifier
    pub metadata: CollectionMetadata,
    pub status: InstallationStatus,
    pub created_at: TimestampNanos,
    pub updated_at: TimestampNanos,
}

// Collection Metadata
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: Option<String>,
    pub description: Option<String>,
    pub template_id: NftTemplateId,
}

//  Distinct states for the lifecycle
#[derive(Clone, Debug)]
pub enum InstallationStatus {
    Queued,
    Created { principal: Principal },
    Installed { wasm_hash: WasmHash },
    Failed { reason: TaskError, attempsts: u64 }, // Ready for reimbursement
    ReimbursingQueued,
    Reimbursed { tx_index: OgyTransferIndex },
    QuarantinedReimbursement,
}
