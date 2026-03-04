use crate::state::read_state;
pub use claimlink_api::queries::get_collection_count::{
    Args as GetCollectionCountArgs, Response as GetCollectionCountResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_collection_count() -> GetCollectionCountResponse {
    read_state(|state| state.data.collection_requests.len() as u64)
}
