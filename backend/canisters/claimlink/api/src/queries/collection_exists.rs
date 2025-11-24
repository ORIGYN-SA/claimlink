use candid::Principal;

pub type Args = CollectionExistsArgs;
pub type Response = bool;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct CollectionExistsArgs {
    pub canister_id: Principal,
}
