use crate::errors::InitializeMintError;
use crate::mint::MintRequestId;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

pub type Args = InitializeMintArgs;
pub type Response = Result<MintRequestId, InitializeMintError>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct InitializeMintArgs {
    pub collection_canister_id: Principal,
    pub num_mints: u64,
    pub total_file_size_bytes: Nat,
}
