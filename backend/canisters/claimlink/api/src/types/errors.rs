#[derive(Debug, candid::CandidType, serde::Deserialize, serde::Serialize, PartialEq)]

pub enum GenericError {
    Other(String),
}
#[derive(Debug, candid::CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum CreateCollectionError {
    InsufficientCycles,
    // We would need to update bity_ic_subcanister_manager::NewCanisterError
    // to derive CandidType and Serialize
    CreateOrigynNftCanisterError,
    TransferFromError(icrc_ledger_types::icrc2::transfer_from::TransferFromError),
    ExternalCanisterError(String),
    Generic(GenericError),
}

impl From<crate::sub_canister::CreateOrigynNftCanisterError> for CreateCollectionError {
    fn from(_error: crate::sub_canister::CreateOrigynNftCanisterError) -> Self {
        CreateCollectionError::CreateOrigynNftCanisterError
    }
}
