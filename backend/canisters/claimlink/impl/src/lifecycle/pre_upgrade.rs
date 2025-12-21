use bity_ic_stable_memory::get_writer;
use ic_cdk_macros::pre_upgrade;
use tracing::info;

use crate::state::take_state;

#[pre_upgrade]
fn pre_upgrade() {
    info!("Pre upgrade.");
}
