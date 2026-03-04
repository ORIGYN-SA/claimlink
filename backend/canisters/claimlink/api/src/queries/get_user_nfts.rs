//use candid::{Nat, Principal};
//use icrc_ledger_types::icrc1::account::Account;
//
//pub type Args = GetUserNftsArgs;
//pub type Response = GetUserNftsResponse;
//
//#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
//pub struct GetUserNftsArgs {
//    pub canister_id: Principal,
//    pub account: Account,
//    pub prev: Option<Nat>,
//    pub take: Option<Nat>,
//}
//
//pub type GetUserNftsResponse = Vec<Nat>;
