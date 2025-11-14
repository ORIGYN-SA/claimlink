use crate::state::read_state;
use claimlink_api::types::collection::CollectionsResult;
pub use claimlink_api::queries::list_my_collections::{
    Args as ListMyCollectionsArgs, Response as ListMyCollectionsResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn list_my_collections(args: ListMyCollectionsArgs) -> ListMyCollectionsResponse {
    let caller = ic_cdk::api::msg_caller();

    read_state(|state| {
        let offset = args.get_offset();
        let limit = args.get_limit();

        // Get all collection IDs owned by caller
        let owned_collection_ids = state
            .data
            .collections_by_owner
            .get(&caller)
            .cloned()
            .unwrap_or_default();

        let total_count = owned_collection_ids.len() as u64;

        // Apply pagination
        let collections = owned_collection_ids
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
