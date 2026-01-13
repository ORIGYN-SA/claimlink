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

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum CreateTemplateError {
    LimitExceeded { max_templates: Nat },
    JsonError(String),
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum GetTemplatesByOwnerError {
    UnauthorizedCall,
}
