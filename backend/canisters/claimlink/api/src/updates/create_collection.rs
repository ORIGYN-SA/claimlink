use crate::errors::CreateCollectionError;
use candid::Nat;

pub type Args = CreateCollectionArgs;
pub type Response = Result<CollectionRequestId, CreateCollectionError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug)]
pub struct CreateCollectionArgs {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub template_id: Nat,
}

pub type CollectionRequestId = Nat;
