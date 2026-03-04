use candid::CandidType;
use serde::Deserialize;
use std::fmt::Debug;

use crate::{init::InitArg, post_upgrade::UpgradeArgs};

#[derive(Deserialize, CandidType, Debug)]
pub enum ClaimlinkArgs {
    InitArg(InitArg),
    UpgradeArg(UpgradeArgs),
}
