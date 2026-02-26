use std::time::Duration;

use ic_cdk::export_candid;

mod guards;
pub mod lifecycle;
pub mod queries;
pub mod state;
pub mod storage;
pub mod task_manager;
pub mod types;
pub mod updates;
pub mod utils;

use lifecycle::*;
use queries::*;
use updates::*;

use crate::task_manager::{
    burn_ogy::burn_ogy, cycles_top_up::top_up_collection_canisters,
    reimburse_ogy::process_reimbursements, retry_installation::retry_installation,
};

pub const RETRY_COLLECTION_INSTALLTION_INTERVAL: Duration = Duration::from_secs(1 * 60);

pub const PROCESS_REIMBURSEMENTS: Duration = Duration::from_secs(1 * 60);

pub const PROCESS_OGY_BURN: Duration = Duration::from_secs(1 * 60 * 60);

pub const CYCLES_TOP_UP_INTERVAL: Duration = Duration::from_secs(60 * 60);

pub fn setup_timers() {
    ic_cdk_timers::set_timer_interval(RETRY_COLLECTION_INSTALLTION_INTERVAL, || {
        ic_cdk::futures::spawn_017_compat(retry_installation())
    });

    ic_cdk_timers::set_timer_interval(PROCESS_REIMBURSEMENTS, || {
        ic_cdk::futures::spawn_017_compat(process_reimbursements())
    });

    ic_cdk_timers::set_timer_interval(PROCESS_OGY_BURN, || {
        ic_cdk::futures::spawn_017_compat(burn_ogy())
    });

    ic_cdk_timers::set_timer_interval(CYCLES_TOP_UP_INTERVAL, || {
        ic_cdk::futures::spawn_017_compat(top_up_collection_canisters())
    });
}

export_candid!();
