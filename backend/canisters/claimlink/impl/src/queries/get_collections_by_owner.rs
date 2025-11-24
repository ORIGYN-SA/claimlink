use crate::state::read_state;
use claimlink_api::types::collection::CollectionsResult;
pub use claimlink_api::queries::get_collections_by_owner::{
    Args as GetCollectionsByOwnerArgs, Response as GetCollectionsByOwnerResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_collections_by_owner(args: GetCollectionsByOwnerArgs) -> GetCollectionsByOwnerResponse {
    read_state(|state| {
        let offset = args.pagination.get_offset();
        let limit = args.pagination.get_limit();

        // Get all collection IDs owned by the specified owner
        let owned_collection_ids = state
            .data
            .collections_by_owner
            .borrow()
            .get(&args.owner)
            .map(|list| list.0.clone())
            .unwrap_or_default();

        let total_count = owned_collection_ids.len() as u64;

        // Apply pagination
        let collections = owned_collection_ids
            .iter()
            .skip(offset)
            .take(limit)
            .filter_map(|canister_id| state.data.collections.borrow().get(canister_id))
            .collect();

        CollectionsResult {
            collections,
            total_count,
        }
    })
}
