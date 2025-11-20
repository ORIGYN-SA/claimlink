// TODO: Temporarily commented out due to Candid encoding issues with icrc7_tokens_of.
// The c2c call needs custom implementation to properly encode multiple Candid arguments.
// Clients can call icrc7_tokens_of directly on the NFT canister for now.
// Can be revisited later when the encoding issue is resolved.

/*
use candid::{Nat, Principal};
use icrc_ledger_types::icrc1::account::Account;

pub type Args = GetUserNftsArgs;
pub type Response = GetUserNftsResponse;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetUserNftsArgs {
    pub canister_id: Principal,
    pub account: Account,
    pub prev: Option<Nat>,
    pub take: Option<Nat>,
}

pub type GetUserNftsResponse = Vec<Nat>;
*/
