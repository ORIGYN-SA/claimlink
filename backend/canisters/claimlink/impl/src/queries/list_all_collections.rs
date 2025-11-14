use crate::state::read_state;
use claimlink_api::types::collection::CollectionsResult;
pub use claimlink_api::queries::list_all_collections::{
    Args as ListAllCollectionsArgs, Response as ListAllCollectionsResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn list_all_collections(args: ListAllCollectionsArgs) -> ListAllCollectionsResponse {
    read_state(|state| {
        let offset = args.get_offset();
        let limit = args.get_limit();

        let total_count = state.data.collections_ordered.len() as u64;

        // Use ordered list for pagination (maintains creation order)
        let collections = state
            .data
            .collections_ordered
            .iter()
            .skip(offset)
            .take(limit)
            .filter_map(|canister_id| state.data.collections.get(canister_id).cloned())
            .collect();

        CollectionsResult {
            collections,
            total_count,
        }
    })
}
