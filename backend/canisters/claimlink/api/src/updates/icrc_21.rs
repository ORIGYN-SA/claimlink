use icrc_ledger_types::icrc21::{
    errors::Icrc21Error, requests::ConsentMessageRequest, responses::ConsentInfo,
};

pub type Args = ConsentMessageRequest;
pub type Response = Result<ConsentInfo, Icrc21Error>;
