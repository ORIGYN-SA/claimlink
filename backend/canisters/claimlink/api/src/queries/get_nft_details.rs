use candid::{Nat, Principal};
use icrc_ledger_types::icrc::generic_value::ICRC3Value as Value;
use icrc_ledger_types::icrc1::account::Account;

pub type Args = GetNftDetailsArgs;
pub type Response = GetNftDetailsResponse;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetNftDetailsArgs {
    pub canister_id: Principal,
    pub token_ids: Vec<Nat>,
}

pub type GetNftDetailsResponse = Vec<NftDetails>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct NftDetails {
    pub token_id: Nat,
    pub metadata: Option<Vec<(String, Value)>>,
    pub owner: Option<Account>,
}
