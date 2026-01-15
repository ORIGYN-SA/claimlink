use crate::{
    claimlink_suite::{
        init::init, tests::test_collection_queries::create_test_collection, TestEnv,
    },
    client::{claimlink::get_metrics, pocket::upgrade_canister},
    utils::random_principal,
    wasms::CLAIMLINK,
};
use candid::Nat;
use claimlink_api::types::lifecycle::ClaimlinkArgs;

#[test]
fn upgrade_claimlink() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create a collection
    create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Test Collection",
        "TC",
        "Test Description",
    );

    let metrics_before_upgrade =
        get_metrics(&pic, principal_ids.controller, canister_ids.claimlink, &());

    println!("{:?}", metrics_before_upgrade);
    let new_bank = random_principal();
    let new_creation_fee: Nat = 10_000_000_000_000_u64.into();

    upgrade_canister(
        &mut pic,
        principal_ids.controller,
        canister_ids.claimlink,
        CLAIMLINK.to_vec(),
        ClaimlinkArgs::UpgradeArg(claimlink_api::post_upgrade::UpgradeArgs {
            build_version: Default::default(),
            commit_hash: "dapkfakmaefd".to_string(),
            origyn_nft_wasm_hash: None,
            bank_principal_id: Some(new_bank),
            cycles_management: None,
            collection_request_fee: Some(new_creation_fee),
            ogy_transfer_fee: None,
            max_creation_retries: Some(10_u8.into()),
            max_template_per_owner: Some(10_u8.into()),
            new_authorized_principals: None,
        }),
    );

    let metrics_after_upgrade =
        get_metrics(&pic, principal_ids.controller, canister_ids.claimlink, &());

    assert_ne!(
        metrics_after_upgrade.bank_principal_id,
        metrics_before_upgrade.bank_principal_id
    );

    assert_ne!(
        metrics_after_upgrade.max_creation_retries,
        metrics_before_upgrade.max_creation_retries
    );
    assert_ne!(
        metrics_after_upgrade.max_template_per_owner,
        metrics_before_upgrade.max_template_per_owner
    );
}
