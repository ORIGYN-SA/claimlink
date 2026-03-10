use crate::state::read_state;
pub use claimlink_api::queries::get_ogy_usd_price::Response as GetOgyUsdPriceResponse;

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_ogy_usd_price() -> GetOgyUsdPriceResponse {
    read_state(|s| s.data.ogy_price)
}
