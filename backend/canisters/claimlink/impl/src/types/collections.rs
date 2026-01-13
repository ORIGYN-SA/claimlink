use candid::{CandidType, Nat, Principal};
use claimlink_api::collection::{
    CollectionInfo, CollectionMetadata as CandidCollectionMetadata, CollectionStatus,
};
use minicbor::{Decode, Encode};
use types::TimestampNanos;

use crate::types::{templates::NftTemplateId, wasm::WasmHash};

pub type OgyTransferIndex = u128;
pub type OgyChargedAmount = u128;

#[derive(Debug, Clone)]
pub struct CollectionRequest {
    pub owner: Principal,
    pub ogy_payment_index: OgyTransferIndex, // unique collection request Identifier
    pub ogy_charged: OgyChargedAmount,
    pub metadata: CollectionMetadata,
    pub status: InstallationStatus,
    pub canister_id: Option<Principal>,
    pub wasm_hash: Option<WasmHash>,
    pub temaplte_url: Option<String>,
    pub created_at: TimestampNanos,
    pub updated_at: TimestampNanos,
}

// Collection Metadata
#[derive(CandidType, Clone, Debug, Encode, Decode, PartialEq, Eq)]
pub struct CollectionMetadata {
    #[n(0)]
    pub name: String,
    #[n(1)]
    pub symbol: String,
    #[n(2)]
    pub description: String,
    #[n(3)]
    pub template_id: NftTemplateId,
}

//  Distinct states for the lifecycle
#[derive(Clone, Debug)]
pub enum InstallationStatus {
    Queued,
    Created,
    Installed,
    TemplateUploaded,
    Failed { reason: String, attempsts: u64 },
    ReimbursingQueued,
    Reimbursed { tx_index: OgyTransferIndex },
    QuarantinedReimbursement { reason: String },
}

impl InstallationStatus {
    pub fn is_failed(&self) -> bool {
        matches!(
            self,
            InstallationStatus::Failed {
                reason: _,
                attempsts: _,
            }
        )
    }

    pub fn attempeted_retries(&self) -> u64 {
        match self {
            InstallationStatus::Failed {
                reason: _,
                attempsts,
            } => *attempsts,
            _ => 0,
        }
    }
}

impl From<CollectionRequest> for CollectionInfo {
    fn from(
        CollectionRequest {
            owner,
            ogy_payment_index,
            ogy_charged,
            metadata,
            status,
            created_at,
            updated_at,
            canister_id,
            wasm_hash,
            temaplte_url,
        }: CollectionRequest,
    ) -> Self {
        Self {
            owner,
            collection_id: Nat::from(ogy_payment_index),
            ogy_charged: Nat::from(ogy_charged),
            metadata: CandidCollectionMetadata {
                name: metadata.name,
                symbol: metadata.symbol,
                description: metadata.description,
                template_id: Nat::from(metadata.template_id),
            },
            status: status.into(),
            created_at: Nat::from(created_at),
            updated_at: Nat::from(updated_at),
            canister_id,
            wasm_hash: wasm_hash.map(|hash| hash.to_string()),
            temaplte_url,
        }
    }
}

impl From<InstallationStatus> for CollectionStatus {
    fn from(value: InstallationStatus) -> Self {
        match value {
            InstallationStatus::Queued => CollectionStatus::Queued,
            InstallationStatus::Created => CollectionStatus::Created,
            InstallationStatus::Installed => CollectionStatus::Installed,
            InstallationStatus::TemplateUploaded => CollectionStatus::TemplateUploaded,
            InstallationStatus::Failed { reason, attempsts } => CollectionStatus::Failed {
                reason,
                attempsts: Nat::from(attempsts),
            },
            InstallationStatus::ReimbursingQueued => CollectionStatus::ReimbursingQueued,
            InstallationStatus::Reimbursed { tx_index } => CollectionStatus::Reimbursed {
                tx_index: Nat::from(tx_index),
            },
            InstallationStatus::QuarantinedReimbursement { reason } => {
                CollectionStatus::QuarantinedReimbursement { reason }
            }
        }
    }
}
