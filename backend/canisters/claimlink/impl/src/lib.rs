use ic_cdk::export_candid;

mod guards;
mod lifecycle;
mod memory;
pub mod state;
pub mod updates;
mod utils;

use lifecycle::*;
use updates::*;

export_candid!();
