use crate::state::read_state;
pub use claimlink_api::queries::get_collection_info::{
    Args as GetCollectionInfoArgs, Response as GetCollectionInfoResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_collection_info(args: GetCollectionInfoArgs) -> GetCollectionInfoResponse {
    read_state(|state| {
        state
            .data
            .get_collection_by_search_params(args)
            .map(|collection| collection.into())
    })
}
