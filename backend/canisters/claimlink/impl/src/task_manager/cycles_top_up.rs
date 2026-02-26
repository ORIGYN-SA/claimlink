use candid::Principal;
use futures::future::join_all;
use ic_canister_log::log;
use ic_cdk::management_canister::{
    canister_status, deposit_cycles, CanisterStatusArgs, DepositCyclesArgs,
};

use crate::{
    guards::{TaskType, TimerGuard},
    state::read_state,
    utils::log::{DEBUG, INFO},
};

const BATCH_SIZE: usize = 5;

pub async fn top_up_collection_canisters() {
    let _ = match TimerGuard::new(TaskType::CyclesTopUp) {
        Ok(guard) => guard,
        Err(e) => {
            log!(DEBUG, "Failed retrieving cycles top-up guard: {e:?}");
            return;
        }
    };

    let (canister_ids, minimum_canister_cycles, minimum_manager_cycles, top_up_increment) =
        read_state(|s| {
            (
                s.data.get_active_collection_canister_ids(),
                s.data.cycles_management.minimum_monitored_canister_cycles(),
                s.data.cycles_management.minimum_manager_cycles(),
                s.data.cycles_management.cycles_top_up_increment,
            )
        });

    if canister_ids.is_empty() {
        return;
    }

    log!(
        DEBUG,
        "Cycles top-up: checking {} collection canisters",
        canister_ids.len()
    );

    // Step 1: Check manager has minimum cycles before doing anything
    let manager_balance = ic_cdk::api::canister_cycle_balance();
    if manager_balance < minimum_manager_cycles {
        log!(
            INFO,
            "Cycles top-up aborted: manager balance {} < minimum required {}",
            manager_balance,
            minimum_manager_cycles
        );
        return;
    }

    // Step 2: Fetch status of all sub-canisters concurrently in batches of 5
    let mut canisters_to_top_up: Vec<(Principal, u128)> = Vec::new();

    for batch in canister_ids.chunks(BATCH_SIZE) {
        let status_futures: Vec<_> = batch
            .iter()
            .map(|&canister_id| async move {
                let result = canister_status(&CanisterStatusArgs { canister_id }).await;
                (canister_id, result)
            })
            .collect();

        let results = join_all(status_futures).await;

        for (canister_id, result) in results {
            match result {
                Ok(status) => {
                    let canister_cycles: u128 =
                        status.cycles.0.try_into().unwrap_or(u128::MAX);

                    if canister_cycles < minimum_canister_cycles {
                        log!(
                            DEBUG,
                            "Canister {} needs top-up: {} cycles (minimum: {})",
                            canister_id.to_text(),
                            canister_cycles,
                            minimum_canister_cycles
                        );
                        canisters_to_top_up.push((canister_id, canister_cycles));
                    }
                }
                Err(e) => {
                    log!(
                        DEBUG,
                        "Failed to check status of canister {}: {:?}",
                        canister_id.to_text(),
                        e
                    );
                }
            }
        }
    }

    if canisters_to_top_up.is_empty() {
        log!(DEBUG, "Cycles top-up: all canisters have sufficient cycles");
        return;
    }

    log!(
        INFO,
        "Cycles top-up: {} canisters need topping up",
        canisters_to_top_up.len()
    );

    // Step 3: Top up canisters that are low on cycles
    for (canister_id, canister_cycles) in canisters_to_top_up {
        // Re-check manager balance before each top-up
        let manager_balance = ic_cdk::api::canister_cycle_balance();
        let required = minimum_manager_cycles + top_up_increment;
        if manager_balance < required {
            log!(
                INFO,
                "Cycles top-up stopped: manager balance {} < required reserve {} \
                 (minimum: {} + top-up increment: {})",
                manager_balance,
                required,
                minimum_manager_cycles,
                top_up_increment
            );
            return;
        }

        match deposit_cycles(&DepositCyclesArgs { canister_id }, top_up_increment).await {
            Ok(()) => {
                log!(
                    INFO,
                    "Topped up canister {} with {} cycles (was at {})",
                    canister_id.to_text(),
                    top_up_increment,
                    canister_cycles
                );
            }
            Err(e) => {
                log!(
                    DEBUG,
                    "Failed to deposit cycles to canister {}: {:?}",
                    canister_id.to_text(),
                    e
                );
            }
        }
    }
}
