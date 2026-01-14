pub use claimlink_api::metrics::Metrics;

use crate::state::read_state;

#[ic_cdk::query]
pub fn get_metrics() -> Metrics {
    read_state(|s| s.metrics())
}
