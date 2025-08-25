use ic_cdk::export_candid;

mod guards;
mod lifecycle;
mod memory;
// pub mod queries;
pub mod state;

use lifecycle::*;
// use queries::*;

export_candid!();
