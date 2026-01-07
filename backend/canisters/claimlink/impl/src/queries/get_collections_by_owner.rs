use crate::state::read_state;
pub use claimlink_api::queries::get_collections_by_owner::{
    Args as GetCollectionsByOwnerArgs, Response as GetCollectionsByOwnerResponse,
};
use claimlink_api::types::collection::CollectionsResult;

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_collections_by_owner(args: GetCollectionsByOwnerArgs) -> GetCollectionsByOwnerResponse {
    let offset = args.pagination.get_offset();
    let limit = args.pagination.get_limit();

    // Apply pagination
    let collections = read_state(|s| s.data.get_collections_by_owner(args.owner));
    let total_count = collections.len() as u64;

    // apply pagination and switch to candid type
    let collections = collections
        .into_iter()
        .skip(offset)
        .take(limit)
        .map(|collection| collection.into())
        .collect();

    CollectionsResult {
        collections,
        total_count,
    }
}
