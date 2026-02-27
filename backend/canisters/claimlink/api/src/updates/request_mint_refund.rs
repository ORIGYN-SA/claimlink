use crate::errors::RefundError;
use crate::mint::MintRequestId;
use candid::CandidType;
use serde::{Deserialize, Serialize};

pub type Args = RequestMintRefundArgs;
pub type Response = Result<(), RefundError>;

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct RequestMintRefundArgs {
    pub mint_request_id: MintRequestId,
}
