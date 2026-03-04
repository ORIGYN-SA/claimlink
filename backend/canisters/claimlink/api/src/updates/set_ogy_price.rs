use candid::CandidType;
use serde::{Deserialize, Serialize};

pub type Args = SetOgyPriceArgs;
pub type Response = Result<(), String>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct SetOgyPriceArgs {
    pub usd_per_ogy_e8s: u64,
}
