use crate::types::collection::{CollectionsResult, PaginationArgs};
use candid::Principal;

pub type Args = GetCollectionsForUserArgs;
pub type Response = CollectionsResult;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetCollectionsForUserArgs {
    pub user: Principal,
    pub pagination: PaginationArgs,
}
