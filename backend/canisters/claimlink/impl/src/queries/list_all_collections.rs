use crate::state::read_state;
pub use claimlink_api::queries::list_all_collections::{
    Args as ListAllCollectionsArgs, Response as ListAllCollectionsResponse,
};
use claimlink_api::{collection::CollectionInfo, types::collection::CollectionsResult};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn list_all_collections(args: ListAllCollectionsArgs) -> ListAllCollectionsResponse {
    let (total_count, collections) = read_state(|state| {
        let offset = args.get_offset();
        let limit = args.get_limit();

        let total_count = state.data.collection_requests.len() as u64;

        // Use ordered list for pagination (maintains creation order)
        // Iterate over the StableBTreeMap, extract the values (Principal canister_ids)
        let collections = state
            .data
            .collection_requests
            .iter()
            .skip(offset)
            .take(limit)
            .map(|(_, collection)| CollectionInfo::from(collection.clone()))
            .collect();

        (total_count, collections)
    });

    CollectionsResult {
        collections,
        total_count,
    }
}
