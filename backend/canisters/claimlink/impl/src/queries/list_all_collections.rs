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

        let total_count = state.data.collections_ordered.borrow().len() as u64;

        // Use ordered list for pagination (maintains creation order)
        // Iterate over the StableBTreeMap, extract the values (Principal canister_ids)
        let collections = state
            .data
            .collections_ordered
            .borrow()
            .iter()
            .skip(offset)
            .take(limit)
            .filter_map(|(_index, canister_id)| state.data.collections.borrow().get(&canister_id))
            .collect();

        CollectionsResult {
            collections,
            total_count,
        }
    })
}
