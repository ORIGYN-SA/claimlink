use crate::errors::MintNftsError;
use crate::mint::MintRequestId;
use candid::{CandidType, Nat};
use icrc_ledger_types::icrc::generic_value::ICRC3Value;
use icrc_ledger_types::icrc1::account::Account;
use serde::{Deserialize, Serialize};

pub type Args = MintNftsArgs;
pub type Response = Result<Vec<Nat>, MintNftsError>;

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct MintNftsArgs {
    pub mint_request_id: MintRequestId,
    pub mint_items: Vec<MintItemArg>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct MintItemArg {
    pub token_owner: Account,
    pub metadata: Vec<(String, ICRC3Value)>,
    pub memo: Option<serde_bytes::ByteBuf>,
}
