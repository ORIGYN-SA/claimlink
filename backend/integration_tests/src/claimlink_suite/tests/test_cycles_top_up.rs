use std::time::Duration;

use crate::claimlink_suite::{
    init::init, tests::test_collection_queries::create_test_collection, TestEnv,
};
use crate::utils::T;

/// Helper: get the sub-canister principal for a collection
fn get_collection_canister_id(
    pic: &pocket_ic::PocketIc,
    caller: candid::Principal,
    claimlink: candid::Principal,
    collection_id: candid::Nat,
) -> candid::Principal {
    crate::client::claimlink::get_collection_info(
        pic,
        caller,
        claimlink,
        &claimlink_api::collection::CollectionSearchParam::CollectionId(collection_id),
    )
    .expect("Collection info should exist")
    .canister_id
    .expect("Collection should have a canister_id")
}

/// Advance time by the cycles top-up interval (1 hour) and tick enough
/// for the timer callback and async work to execute.
fn trigger_cycles_top_up(pic: &pocket_ic::PocketIc) {
    pic.advance_time(Duration::from_secs(60 * 60));
    for _ in 0..30 {
        pic.tick();
    }
}

#[test]
fn test_cycles_top_up_basic() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "TopUp Collection",
        "TU",
        "Test top-up",
    );

    let sub_canister = get_collection_canister_id(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        collection_id,
    );

    let initial_balance = pic.cycle_balance(sub_canister);
    // Sub-canister created with 2.5T, threshold is 5T, so it should be below
    assert!(
        initial_balance < 5 * T,
        "Sub-canister should start below the 5T threshold, got {}",
        initial_balance
    );

    trigger_cycles_top_up(&pic);

    let new_balance = pic.cycle_balance(sub_canister);
    assert!(
        new_balance > initial_balance,
        "Sub-canister balance should have increased after top-up: before={}, after={}",
        initial_balance,
        new_balance
    );

    // The increment is 5T, so the balance should have increased by approximately that
    let increase = new_balance - initial_balance;
    assert!(
        increase >= 4 * T,
        "Top-up increment should be ~5T, got {}",
        increase
    );
}

#[test]
fn test_cycles_top_up_multiple_collections() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let id1 = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Collection A",
        "CA",
        "First",
    );

    let id2 = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Collection B",
        "CB",
        "Second",
    );

    let canister1 =
        get_collection_canister_id(&pic, principal_ids.controller, canister_ids.claimlink, id1);
    let canister2 =
        get_collection_canister_id(&pic, principal_ids.controller, canister_ids.claimlink, id2);

    let balance1_before = pic.cycle_balance(canister1);
    let balance2_before = pic.cycle_balance(canister2);

    trigger_cycles_top_up(&pic);

    let balance1_after = pic.cycle_balance(canister1);
    let balance2_after = pic.cycle_balance(canister2);

    assert!(
        balance1_after > balance1_before,
        "Collection A should have been topped up: before={}, after={}",
        balance1_before,
        balance1_after
    );
    assert!(
        balance2_after > balance2_before,
        "Collection B should have been topped up: before={}, after={}",
        balance2_before,
        balance2_after
    );
}

#[test]
fn test_cycles_top_up_skips_sufficient_canisters() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Rich Collection",
        "RC",
        "Already has enough cycles",
    );

    let sub_canister = get_collection_canister_id(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        collection_id,
    );

    // Add enough cycles so the sub-canister is well above the 5T threshold
    pic.add_cycles(sub_canister, 10 * T);

    let balance_before = pic.cycle_balance(sub_canister);
    assert!(
        balance_before >= 5 * T,
        "Sub-canister should be above threshold after adding cycles, got {}",
        balance_before
    );

    trigger_cycles_top_up(&pic);

    let balance_after = pic.cycle_balance(sub_canister);

    // Balance should not have increased by a top-up increment.
    // Allow small decrease from execution costs, but no big increase.
    let diff = if balance_after > balance_before {
        balance_after - balance_before
    } else {
        0
    };
    assert!(
        diff < T,
        "Sub-canister above threshold should NOT receive a top-up, but balance increased by {}",
        diff
    );
}
