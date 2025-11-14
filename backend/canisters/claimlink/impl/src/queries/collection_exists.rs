use crate::state::read_state;
pub use claimlink_api::queries::collection_exists::{
    Args as CollectionExistsArgs, Response as CollectionExistsResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn collection_exists(args: CollectionExistsArgs) -> CollectionExistsResponse {
    read_state(|state| state.data.collections.contains_key(&args.canister_id))
}
