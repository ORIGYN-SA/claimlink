#[derive(Debug, candid::CandidType, serde::Deserialize, serde::Serialize, PartialEq)]

pub enum GenericError {
    Other(String),
}
#[derive(Debug, candid::CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum CreateCollectionError {
    InsufficientCycles,
    InsufficientBalance,
    // We would need to update bity_ic_subcanister_manager::NewCanisterError
    // to derive CandidType and Serialize
    CreateOrigynNftCanisterError,
    Generic(GenericError),
}

impl From<crate::sub_canister::CreateOrigynNftCanisterError> for CreateCollectionError {
    fn from(_error: crate::sub_canister::CreateOrigynNftCanisterError) -> Self {
        CreateCollectionError::CreateOrigynNftCanisterError
    }
}
