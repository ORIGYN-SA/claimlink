use crate::types::collection::{CollectionsResult, PaginationArgs};
use candid::Principal;

pub type Args = GetCollectionsByOwnerArgs;
pub type Response = CollectionsResult;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetCollectionsByOwnerArgs {
    pub owner: Principal,
    pub pagination: PaginationArgs,
}
