use crate::errors::BurnNftError;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

pub type Args = BurnNftArgs;
pub type Response = Result<(), BurnNftError>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct BurnNftArgs {
    pub collection_canister_id: Principal,
    pub token_id: Nat,
}
