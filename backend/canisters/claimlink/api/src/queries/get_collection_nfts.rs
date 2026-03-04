use candid::{Nat, Principal};

pub type Args = GetCollectionNftsArgs;
pub type Response = GetCollectionNftsResponse;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetCollectionNftsArgs {
    pub canister_id: Principal,
    pub prev: Option<Nat>,
    pub take: Option<Nat>,
}

pub type GetCollectionNftsResponse = Vec<Nat>;
