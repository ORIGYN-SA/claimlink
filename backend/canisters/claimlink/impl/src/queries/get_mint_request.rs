use crate::{guards, state::read_state};
pub use claimlink_api::queries::get_mint_request::{
    Args as GetMintRequestArgs, Response as GetMintRequestResponse,
};

#[ic_cdk::query(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_mint_request(args: GetMintRequestArgs) -> GetMintRequestResponse {
    read_state(|s| {
        s.data
            .get_mint_request(args)
            .map(|r| r.to_info())
    })
}
