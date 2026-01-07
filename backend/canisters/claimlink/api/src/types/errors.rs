use candid::{CandidType, Nat};

#[derive(Debug, candid::CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum GenericError {
    Other(String),
}
#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum CreateCollectionError {
    CreateOrigynNftCanisterError,
    TransferFromError(icrc_ledger_types::icrc2::transfer_from::TransferFromError),
    ExternalCanisterError(String),
    Generic(GenericError),
    InvalidNftTemplateId,
}

impl From<crate::sub_canister::CreateOrigynNftCanisterError> for CreateCollectionError {
    fn from(_error: crate::sub_canister::CreateOrigynNftCanisterError) -> Self {
        CreateCollectionError::CreateOrigynNftCanisterError
    }
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum CreateTemplateError {
    LimitExceeded { max_templates: Nat },
    JsonError(String),
}
