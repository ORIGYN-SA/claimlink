use candid::{CandidType, Principal};
use serde::Deserialize;

#[derive(Deserialize, CandidType)]
pub struct InitArgs {
    pub test_mode: bool,
    pub ledger_canister_id: Principal,
    pub authorized_principals: Vec<Principal>,
    pub origyn_nft_commit_hash: String,
}
