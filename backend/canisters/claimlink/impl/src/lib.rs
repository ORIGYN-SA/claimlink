use claimlink_api::init::ClaimlinkArgs;
use ic_cdk::export_candid;

mod guards;
mod lifecycle;
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

export_candid!();
