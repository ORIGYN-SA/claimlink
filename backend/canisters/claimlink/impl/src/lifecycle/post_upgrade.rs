use bity_ic_canister_tracing_macros::trace;
use claimlink_api::{post_upgrade::UpgradeArgs, types::lifecycle::ClaimlinkArgs};
use ic_cdk_macros::post_upgrade;
use tracing::info;

use crate::{
    setup_timers,
    state::{
        audit::{process_event, replay_events},
        init_state, mutate_state,
    },
    storage::events::total_event_count,
    types::events::EventType,
};

#[post_upgrade]
#[trace]
fn post_upgrade(args: Option<ClaimlinkArgs>) {
    match args {
        Some(ClaimlinkArgs::InitArg(_)) => {
            ic_cdk::trap("cannot upgrade canister state with init args");
        }
        Some(ClaimlinkArgs::UpgradeArg(upgrade_args)) => execute_upgrade(Some(upgrade_args)),
        None => execute_upgrade(None),
    }

    setup_timers();

    info!("Post upgrade complete.")
}

pub fn execute_upgrade(upgrade_args: Option<UpgradeArgs>) {
    let start = ic_cdk::api::instruction_counter();

    init_state(replay_events());
    if let Some(args) = upgrade_args {
        mutate_state(|s| process_event(s, EventType::Upgrade(args)))
    }

    let end = ic_cdk::api::instruction_counter();

    let event_count = total_event_count();
    let instructions_consumed = end - start;

    info!(
        "[upgrade]: replaying {event_count} events consumed {instructions_consumed} instructions ({} instructions per event on average)",
        instructions_consumed / event_count
    );
}
