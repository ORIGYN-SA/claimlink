use crate::{guards, state::read_state};
pub use claimlink_api::queries::get_mint_requests_by_owner::{
    Args as GetMintRequestsByOwnerArgs, Response as GetMintRequestsByOwnerResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_mint_requests_by_owner(
    args: GetMintRequestsByOwnerArgs,
) -> GetMintRequestsByOwnerResponse {
    read_state(|s| {
        let requests = s.data.get_mint_requests_by_owner(&args.owner);
        let offset = args.offset.unwrap_or(0) as usize;
        let limit = args.limit.unwrap_or(50) as usize;

        requests
            .into_iter()
            .skip(offset)
            .take(limit)
            .map(|r| r.to_info())
            .collect()
    })
}
