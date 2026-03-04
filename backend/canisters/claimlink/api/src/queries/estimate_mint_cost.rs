use crate::errors::EstimateMintCostError;
use crate::pricing::MintCostEstimate;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

pub type Args = EstimateMintCostArgs;
pub type Response = Result<MintCostEstimate, EstimateMintCostError>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct EstimateMintCostArgs {
    pub collection_canister_id: Principal,
    pub num_mints: u64,
    pub total_file_size_bytes: Nat,
}
