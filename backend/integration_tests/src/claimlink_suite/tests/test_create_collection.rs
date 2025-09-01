use crate::{
    claimlink_suite::{init::init, TestEnv},
    utils::random_principal,
};

#[test]
fn create_collection_basic() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let controller = principal_ids.controller;
    let claimlink = canister_ids.claimlink;

    let create_collection_args = claimlink_api::updates::create_collection::Args {
        name: "Test Collection".to_string(),
        symbol: "TC".to_string(),
        description: "Test Description".to_string(),
    };

    let create_collection_result = crate::client::claimlink::create_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &create_collection_args,
    );

    assert!(create_collection_result.is_ok());
    let created_canister_id = create_collection_result.unwrap().origyn_nft_canister_id;

    let canister_info = crate::client::origyn_nft::icrc7_collection_metadata(
        &pic,
        controller,
        created_canister_id,
        &(),
    );

    println!("{:?}", canister_info);
}

#[test]
fn create_collection_fails_if_insufficient_balance() {
    let mut env = init();

    let create_collection_args = claimlink_api::updates::create_collection::Args {
        name: "Test Collection".to_string(),
        symbol: "TC".to_string(),
        description: "Test Description".to_string(),
    };

    let create_collection_result = crate::client::claimlink::create_collection(
        &mut env.pic,
        random_principal(),
        env.canister_ids.claimlink,
        &create_collection_args,
    );

    assert_eq!(
        create_collection_result.unwrap_err(),
        claimlink_api::errors::CreateCollectionError::InsufficientBalance
    );
}
