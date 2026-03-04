use crate::mint::MintRequestInfo;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

pub type Args = GetMintRequestsByOwnerArgs;
pub type Response = Vec<MintRequestInfo>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct GetMintRequestsByOwnerArgs {
    pub owner: Principal,
    pub offset: Option<u64>,
    pub limit: Option<u64>,
}
