use candid::{CandidType, Principal};
use minicbor::{Decode, Encode};
use types::TimestampNanos;

use crate::{
    task_manager::TaskError,
    types::{templates::NftTemplateId, wasm::WasmHash},
};

pub type OgyTransferIndex = u128;
pub type OgyChargedAmount = u128;

#[derive(Debug, Clone)]
pub struct CollectionRequest {
    pub owner: Principal,
    pub ogy_payment_index: OgyTransferIndex, // unique collection request Identifier
    pub ogy_charged: OgyChargedAmount,
    pub metadata: CollectionMetadata,
    pub status: InstallationStatus,
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
    Created {
        principal: Principal,
    },
    Installed {
        principal: Principal,
        wasm_hash: WasmHash,
    },
    Failed {
        reason: String,
        attempsts: u64,
        principal: Option<Principal>, // in case cansiter creation passes but installation fails
    },
    ReimbursingQueued,
    Reimbursed {
        tx_index: OgyTransferIndex,
    },
    QuarantinedReimbursement {
        reason: String,
    },
}

impl InstallationStatus {
    pub fn canister_id(&self) -> Option<Principal> {
        match self {
            InstallationStatus::Created { principal } => Some(*principal),
            InstallationStatus::Installed {
                principal,
                wasm_hash: _,
            } => Some(*principal),
            InstallationStatus::Failed {
                reason: _,
                attempsts: _,
                principal,
            } => *principal,
            _ => None,
        }
    }

    pub fn is_installed(&self) -> bool {
        match self {
            InstallationStatus::Installed { .. } => true,
            _ => false,
        }
    }

    pub fn is_failed(&self) -> bool {
        match self {
            InstallationStatus::Failed {
                reason: _,
                attempsts: _,
                principal: _,
            } => true,
            _ => false,
        }
    }

    pub fn attempeted_retries(&self) -> u64 {
        match self {
            InstallationStatus::Failed {
                reason: _,
                attempsts,
                principal: _,
            } => *attempsts,
            _ => 0,
        }
    }
}
