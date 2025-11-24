use crate::types::collection::CollectionInfo;
use candid::Principal;

pub type Args = GetCollectionInfoArgs;
pub type Response = Option<CollectionInfo>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetCollectionInfoArgs {
    pub canister_id: Principal,
}
