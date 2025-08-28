use crate::errors::CreateCollectionError;
use candid::Principal;

pub type Args = CreateCollectionArgs;
pub type Response = Result<CreateCollectionResult, CreateCollectionError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug)]
pub struct CreateCollectionArgs {
    pub name: String,
    pub symbol: String,
    pub description: String,
}

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug)]
pub struct CreateCollectionResult {
    pub origyn_nft_canister_id: Principal,
}
