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
pub enum UpdateTemplateError {
    JsonError(String),
    TemplateNotFound,
    UnauthorizedCall,
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum DeleteTemplateError {
    UnauthorizedCall,
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum GetTemplatesByOwnerError {
    UnauthorizedCall,
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum InitializeMintError {
    CollectionNotFound,
    CollectionNotReady,
    CallerNotCollectionOwner,
    OgyPriceNotAvailable,
    InvalidNumMints,
    TransferFromError(icrc_ledger_types::icrc2::transfer_from::TransferFromError),
    Generic(GenericError),
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum ProxyUploadError {
    MintRequestNotFound,
    Unauthorized,
    MintRequestNotActive,
    ByteLimitExceeded {
        allocated: Nat,
        used: Nat,
        requested: Nat,
    },
    UploadError(String),
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum MintNftsError {
    MintRequestNotFound,
    Unauthorized,
    MintRequestNotActive,
    MintLimitExceeded {
        allowed: Nat,
        already_minted: Nat,
        requested: Nat,
    },
    NoItemsProvided,
    TooManyItems { max: Nat },
    MintError(String),
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum BurnNftError {
    CollectionNotFound,
    CallerNotTokenOwner,
    BurnError(String),
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum RefundError {
    MintRequestNotFound,
    Unauthorized,
    CreditsAlreadyUsed,
    AlreadyRefunded,
    NotInRefundableState,
}

#[derive(Debug, CandidType, serde::Deserialize, serde::Serialize, PartialEq)]
pub enum EstimateMintCostError {
    OgyPriceNotAvailable,
    MintPricingNotConfigured,
}
