use crate::{
    claimlink_suite::{
        init::{init, OGY_TO_PAY},
        tests::test_collection_queries::create_test_collection,
        tests::test_create_collection::create_template,
        TestEnv,
    },
    utils::random_principal,
};
use candid::{Nat, Principal};
use claimlink_api::{
    collection::CollectionSearchParam, mint::MintRequestStatus, updates::proxy_upload,
};
use icrc_ledger_types::{icrc::generic_value::ICRC3Value, icrc1::account::Account};
use utils::consts::E8S_FEE_OGY;

// OGY price: $0.006 per OGY in e8s
const TEST_OGY_PRICE_E8S: u64 = 600_000;

/// Set the OGY price via the test-only endpoint.
fn set_ogy_price(pic: &mut pocket_ic::PocketIc, sender: Principal, claimlink: Principal) {
    let result = crate::client::claimlink::set_ogy_price(
        pic,
        sender,
        claimlink,
        &claimlink_api::updates::set_ogy_price::SetOgyPriceArgs {
            usd_per_ogy_e8s: TEST_OGY_PRICE_E8S,
        },
    );
    assert!(result.is_ok(), "set_ogy_price failed: {:?}", result);
}

/// Helper: create a collection, set OGY price, and return the collection canister ID.
fn setup_collection_with_price(
    pic: &mut pocket_ic::PocketIc,
    caller: Principal,
    claimlink: Principal,
    ogy_ledger: Principal,
) -> Principal {
    create_test_collection(
        pic,
        caller,
        claimlink,
        ogy_ledger,
        "Mint Test",
        "MT",
        "Test",
    );

    set_ogy_price(pic, caller, claimlink);

    // Get the collection canister ID
    let collections = crate::client::claimlink::get_collections_by_owner(
        pic,
        caller,
        claimlink,
        &claimlink_api::queries::get_collections_by_owner::Args {
            owner: caller,
            pagination: Default::default(),
        },
    );
    assert_eq!(collections.total_count, 1);
    collections.collections[0].canister_id.unwrap()
}

/// Helper: approve OGY for claimlink to spend on behalf of caller.
fn approve_ogy(
    pic: &mut pocket_ic::PocketIc,
    caller: Principal,
    ogy_ledger: Principal,
    claimlink: Principal,
    amount: u64,
) {
    let result = crate::client::icrc1_icrc2_token::icrc2_approve(
        pic,
        caller,
        ogy_ledger,
        &crate::client::icrc1_icrc2_token::icrc2_approve::Args {
            from_subaccount: None,
            spender: Account {
                owner: claimlink,
                subaccount: None,
            },
            amount: Nat::from(amount),
            expected_allowance: None,
            expires_at: None,
            fee: None,
            memo: None,
            created_at_time: None,
        },
    );
    assert!(
        matches!(
            result,
            crate::client::icrc1_icrc2_token::icrc2_approve::Response::Ok(_)
        ),
        "Approval failed: {:?}",
        result
    );
}

/// Helper: initialize a mint request and return the mint_request_id.
fn initialize_mint(
    pic: &mut pocket_ic::PocketIc,
    caller: Principal,
    claimlink: Principal,
    ogy_ledger: Principal,
    collection_canister_id: Principal,
    num_mints: u64,
    total_file_size_bytes: u64,
) -> u64 {
    // Approve enough OGY (generous amount to cover fees + buffer)
    approve_ogy(pic, caller, ogy_ledger, claimlink, 50_000_000_000_000);

    let result = crate::client::claimlink::initialize_mint(
        pic,
        caller,
        claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id,
            num_mints,
            total_file_size_bytes: Nat::from(total_file_size_bytes),
        },
    );
    result.expect("initialize_mint failed")
}

// ============================================================
// set_ogy_price tests
// ============================================================

#[test]
fn test_set_ogy_price_and_query() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Initially no price
    let price = crate::client::claimlink::get_ogy_usd_price(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );
    assert!(price.is_none(), "Price should be None initially");

    // Set price
    set_ogy_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
    );

    // Query price
    let price = crate::client::claimlink::get_ogy_usd_price(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );
    assert!(price.is_some());
    assert_eq!(price.unwrap().usd_per_ogy_e8s, TEST_OGY_PRICE_E8S);
}

// ============================================================
// estimate_mint_cost tests
// ============================================================

#[test]
fn test_estimate_mint_cost_no_price() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;

    // Without setting price, estimate should fail
    let result = crate::client::claimlink::estimate_mint_cost(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::estimate_mint_cost::EstimateMintCostArgs {
            collection_canister_id: random_principal(),
            num_mints: 10,
            total_file_size_bytes: Nat::from(1_048_576u64), // 1 MB
        },
    );
    assert!(result.is_err());
}

#[test]
fn test_estimate_mint_cost_with_price() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    set_ogy_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
    );

    let result = crate::client::claimlink::estimate_mint_cost(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::estimate_mint_cost::EstimateMintCostArgs {
            collection_canister_id: random_principal(),
            num_mints: 10,
            total_file_size_bytes: Nat::from(1_048_576u64), // 1 MB
        },
    );
    let estimate = result.expect("estimate_mint_cost should succeed");
    assert!(estimate.total_ogy_e8s > 0, "OGY cost should be > 0");
    assert!(estimate.total_usd_e8s > 0, "USD cost should be > 0");
    assert_eq!(estimate.ogy_usd_price_e8s, TEST_OGY_PRICE_E8S);
    assert!(
        estimate.breakdown.base_fee_usd_e8s > 0,
        "Base fee should be > 0"
    );
    assert!(
        estimate.breakdown.storage_fee_usd_e8s > 0,
        "Storage fee should be > 0 for 1MB"
    );
}

#[test]
fn test_estimate_mint_cost_zero_storage() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    set_ogy_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
    );

    let result = crate::client::claimlink::estimate_mint_cost(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::estimate_mint_cost::EstimateMintCostArgs {
            collection_canister_id: random_principal(),
            num_mints: 5,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    let estimate = result.expect("estimate_mint_cost should succeed");
    assert_eq!(
        estimate.breakdown.storage_fee_usd_e8s, 0,
        "Storage fee should be 0 when no bytes"
    );
    assert!(estimate.breakdown.base_fee_usd_e8s > 0);
}

// ============================================================
// initialize_mint tests
// ============================================================

#[test]
fn test_initialize_mint_success() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        5,
        1_048_576,
    );

    // Verify mint request was created
    let request = crate::client::claimlink::get_mint_request(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &mint_request_id,
    );
    assert!(request.is_some(), "Mint request should exist");
    let info = request.unwrap();
    assert_eq!(info.owner, principal_ids.principal_100k_ogy);
    assert_eq!(info.collection_canister_id, collection_canister_id);
    assert_eq!(info.num_mints, Nat::from(5u64));
    assert_eq!(info.minted_count, Nat::from(0u64));
    assert_eq!(info.status, MintRequestStatus::Initialized);
}

#[test]
fn test_initialize_mint_zero_mints_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    approve_ogy(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.ogy_sns_ledger,
        canister_ids.claimlink,
        50_000_000_000_000,
    );

    let result = crate::client::claimlink::initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id,
            num_mints: 0,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::InitializeMintError::InvalidNumMints
    );
}

#[test]
fn test_initialize_mint_no_price_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create collection but do NOT set OGY price
    create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "No Price",
        "NP",
        "Test",
    );

    let collections = crate::client::claimlink::get_collections_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_by_owner::Args {
            owner: principal_ids.principal_100k_ogy,
            pagination: Default::default(),
        },
    );
    let collection_canister_id = collections.collections[0].canister_id.unwrap();

    approve_ogy(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.ogy_sns_ledger,
        canister_ids.claimlink,
        50_000_000_000_000,
    );

    let result = crate::client::claimlink::initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id,
            num_mints: 1,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::InitializeMintError::OgyPriceNotAvailable
    );
}

#[test]
fn test_initialize_mint_wrong_owner_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    // Try to initialize as a different principal
    approve_ogy(
        &mut pic,
        principal_ids.principal_1m_ogy,
        canister_ids.ogy_sns_ledger,
        canister_ids.claimlink,
        50_000_000_000_000,
    );

    let result = crate::client::claimlink::initialize_mint(
        &mut pic,
        principal_ids.principal_1m_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id,
            num_mints: 1,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::InitializeMintError::CallerNotCollectionOwner
    );
}

#[test]
fn test_initialize_mint_collection_not_found_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    set_ogy_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
    );

    approve_ogy(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.ogy_sns_ledger,
        canister_ids.claimlink,
        50_000_000_000_000,
    );

    let result = crate::client::claimlink::initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id: random_principal(),
            num_mints: 1,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::InitializeMintError::CollectionNotFound
    );
}

#[test]
fn test_initialize_mint_insufficient_allowance_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    // Do NOT approve any OGY
    let result = crate::client::claimlink::initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::initialize_mint::InitializeMintArgs {
            collection_canister_id,
            num_mints: 1,
            total_file_size_bytes: Nat::from(0u64),
        },
    );
    assert!(result.is_err());
    assert!(matches!(
        result.unwrap_err(),
        claimlink_api::errors::InitializeMintError::TransferFromError(_)
    ));
}

// ============================================================
// get_mint_request / get_mint_requests_by_owner tests
// ============================================================

#[test]
fn test_get_mint_request_not_found() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;

    let result = crate::client::claimlink::get_mint_request(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &999u64,
    );
    assert!(result.is_none());
}

#[test]
fn test_get_mint_requests_by_owner() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    // Create two mint requests
    let id1 = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        3,
        0,
    );
    let id2 = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        5,
        0,
    );

    let requests = crate::client::claimlink::get_mint_requests_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::queries::get_mint_requests_by_owner::GetMintRequestsByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
            offset: None,
            limit: None,
        },
    );
    assert_eq!(requests.len(), 2);

    // Different owner should have none
    let other_requests = crate::client::claimlink::get_mint_requests_by_owner(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_mint_requests_by_owner::GetMintRequestsByOwnerArgs {
            owner: random_principal(),
            offset: None,
            limit: None,
        },
    );
    assert_eq!(other_requests.len(), 0);
}

// ============================================================
// mint_nfts tests
// ============================================================

#[test]
fn test_mint_nfts_success() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        3,
        0,
    );

    // Mint 2 NFTs
    let mint_result = crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: principal_ids.principal_100k_ogy,
                        subaccount: None,
                    },
                    metadata: vec![(
                        "icrc7:name".to_string(),
                        ICRC3Value::Text("NFT #1".to_string()),
                    )],
                    memo: None,
                },
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: principal_ids.principal_100k_ogy,
                        subaccount: None,
                    },
                    metadata: vec![(
                        "icrc7:name".to_string(),
                        ICRC3Value::Text("NFT #2".to_string()),
                    )],
                    memo: None,
                },
            ],
        },
    );
    let token_ids = mint_result.expect("mint_nfts should succeed");
    assert_eq!(token_ids.len(), 2);

    // Check mint request status (should still be Initialized since 2/3 minted)
    let request = crate::client::claimlink::get_mint_request(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &mint_request_id,
    )
    .unwrap();
    assert_eq!(request.minted_count, Nat::from(2u64));
    assert_eq!(request.status, MintRequestStatus::Initialized);

    // Mint the last one → should transition to Completed
    let mint_result = crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![claimlink_api::updates::mint_nfts::MintItemArg {
                token_owner: Account {
                    owner: principal_ids.principal_100k_ogy,
                    subaccount: None,
                },
                metadata: vec![(
                    "icrc7:name".to_string(),
                    ICRC3Value::Text("NFT #3".to_string()),
                )],
                memo: None,
            }],
        },
    );
    assert!(mint_result.is_ok());

    let request = crate::client::claimlink::get_mint_request(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &mint_request_id,
    )
    .unwrap();
    assert_eq!(request.minted_count, Nat::from(3u64));
    assert_eq!(request.status, MintRequestStatus::Completed);
}

#[test]
fn test_mint_nfts_exceeds_limit_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        2,
        0,
    );

    // Try to mint 3 when only 2 allowed
    let result = crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: principal_ids.principal_100k_ogy,
                        subaccount: None,
                    },
                    metadata: vec![],
                    memo: None,
                },
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: principal_ids.principal_100k_ogy,
                        subaccount: None,
                    },
                    metadata: vec![],
                    memo: None,
                },
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: principal_ids.principal_100k_ogy,
                        subaccount: None,
                    },
                    metadata: vec![],
                    memo: None,
                },
            ],
        },
    );
    assert!(result.is_err());
    assert!(matches!(
        result.unwrap_err(),
        claimlink_api::errors::MintNftsError::MintLimitExceeded { .. }
    ));
}

#[test]
fn test_mint_nfts_empty_items_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        1,
        0,
    );

    let result = crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![],
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::MintNftsError::NoItemsProvided
    );
}

#[test]
fn test_mint_nfts_wrong_owner_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        1,
        0,
    );

    // Try to mint as a different principal
    let result = crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_1m_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![claimlink_api::updates::mint_nfts::MintItemArg {
                token_owner: Account {
                    owner: principal_ids.principal_1m_ogy,
                    subaccount: None,
                },
                metadata: vec![],
                memo: None,
            }],
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::MintNftsError::Unauthorized
    );
}

// ============================================================
// request_mint_refund tests
// ============================================================

#[test]
fn test_request_refund_success() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        5,
        0,
    );

    // Request refund (no credits used yet)
    let result = crate::client::claimlink::request_mint_refund(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::request_mint_refund::RequestMintRefundArgs { mint_request_id },
    );
    assert!(
        result.is_ok(),
        "Refund request should succeed: {:?}",
        result
    );

    // Verify status changed
    let request = crate::client::claimlink::get_mint_request(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &mint_request_id,
    )
    .unwrap();
    assert_eq!(request.status, MintRequestStatus::RefundRequested);
}

#[test]
fn test_request_refund_after_minting_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        5,
        0,
    );

    // Mint 1 NFT (use some credits)
    crate::client::claimlink::mint_nfts(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![claimlink_api::updates::mint_nfts::MintItemArg {
                token_owner: Account {
                    owner: principal_ids.principal_100k_ogy,
                    subaccount: None,
                },
                metadata: vec![(
                    "icrc7:name".to_string(),
                    ICRC3Value::Text("NFT".to_string()),
                )],
                memo: None,
            }],
        },
    )
    .expect("mint should succeed");

    // Now try refund — should fail because credits were used
    let result = crate::client::claimlink::request_mint_refund(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::request_mint_refund::RequestMintRefundArgs { mint_request_id },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::RefundError::CreditsAlreadyUsed
    );
}

#[test]
fn test_request_refund_wrong_owner_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        1,
        0,
    );

    let result = crate::client::claimlink::request_mint_refund(
        &mut pic,
        principal_ids.principal_1m_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::request_mint_refund::RequestMintRefundArgs { mint_request_id },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::RefundError::Unauthorized
    );
}

#[test]
fn test_request_refund_double_refund_fails() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        1,
        0,
    );

    // First refund succeeds
    crate::client::claimlink::request_mint_refund(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::request_mint_refund::RequestMintRefundArgs { mint_request_id },
    )
    .expect("First refund should succeed");

    // Second refund fails
    let result = crate::client::claimlink::request_mint_refund(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &claimlink_api::updates::request_mint_refund::RequestMintRefundArgs { mint_request_id },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::RefundError::AlreadyRefunded
    );
}

// ============================================================
// proxy upload tests
// ============================================================

#[test]
fn test_proxy_upload_mint_request_not_found() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let result = crate::client::claimlink::proxy_init_upload(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &proxy_upload::init::ProxyInitUploadArgs {
            mint_request_id: 999,
            file_path: "test.png".to_string(),
            file_hash: "abc123".to_string(),
            file_size: 1024,
            chunk_size: None,
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::ProxyUploadError::MintRequestNotFound
    );
}

#[test]
fn test_proxy_upload_wrong_owner() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    let mint_request_id = initialize_mint(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        1,
        1_048_576,
    );

    // Try upload as different user
    let result = crate::client::claimlink::proxy_init_upload(
        &mut pic,
        principal_ids.principal_1m_ogy,
        canister_ids.claimlink,
        &proxy_upload::init::ProxyInitUploadArgs {
            mint_request_id,
            file_path: "test.png".to_string(),
            file_hash: "abc123".to_string(),
            file_size: 1024,
            chunk_size: None,
        },
    );
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err(),
        claimlink_api::errors::ProxyUploadError::Unauthorized
    );
}

// ============================================================
// Full flow: initialize → mint → verify
// ============================================================

#[test]
fn test_full_mint_flow() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let caller = principal_ids.principal_100k_ogy;

    // 1. Create collection
    let collection_canister_id = setup_collection_with_price(
        &mut pic,
        caller,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
    );

    // 2. Estimate cost
    let estimate = crate::client::claimlink::estimate_mint_cost(
        &pic,
        caller,
        canister_ids.claimlink,
        &claimlink_api::queries::estimate_mint_cost::EstimateMintCostArgs {
            collection_canister_id,
            num_mints: 3,
            total_file_size_bytes: Nat::from(0u64),
        },
    )
    .expect("estimate should succeed");
    assert!(estimate.total_ogy_e8s > 0);

    // 3. Initialize mint
    let mint_request_id = initialize_mint(
        &mut pic,
        caller,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        collection_canister_id,
        3,
        0,
    );

    // 4. Verify OGY was deducted from caller
    let balance = crate::client::icrc1_icrc2_token::icrc1_balance_of(
        &pic,
        caller,
        canister_ids.ogy_sns_ledger,
        &Account {
            owner: caller,
            subaccount: None,
        },
    );
    // Balance should be less than initial (100k OGY minus collection fee minus mint fee)
    assert!(balance < Nat::from(100_000 * utils::consts::E8S_PER_OGY));

    // 5. Mint NFTs in batches
    let batch1_result = crate::client::claimlink::mint_nfts(
        &mut pic,
        caller,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: caller,
                        subaccount: None,
                    },
                    metadata: vec![(
                        "icrc7:name".to_string(),
                        ICRC3Value::Text("Certificate #1".to_string()),
                    )],
                    memo: None,
                },
                claimlink_api::updates::mint_nfts::MintItemArg {
                    token_owner: Account {
                        owner: caller,
                        subaccount: None,
                    },
                    metadata: vec![(
                        "icrc7:name".to_string(),
                        ICRC3Value::Text("Certificate #2".to_string()),
                    )],
                    memo: None,
                },
            ],
        },
    )
    .expect("Batch 1 should succeed");
    assert_eq!(batch1_result.len(), 2);

    // Verify partial progress
    let info = crate::client::claimlink::get_mint_request(
        &pic,
        caller,
        canister_ids.claimlink,
        &mint_request_id,
    )
    .unwrap();
    assert_eq!(info.minted_count, Nat::from(2u64));
    assert_eq!(info.status, MintRequestStatus::Initialized);

    // Final batch
    let batch2_result = crate::client::claimlink::mint_nfts(
        &mut pic,
        caller,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![claimlink_api::updates::mint_nfts::MintItemArg {
                token_owner: Account {
                    owner: caller,
                    subaccount: None,
                },
                metadata: vec![(
                    "icrc7:name".to_string(),
                    ICRC3Value::Text("Certificate #3".to_string()),
                )],
                memo: None,
            }],
        },
    )
    .expect("Batch 2 should succeed");
    assert_eq!(batch2_result.len(), 1);

    // 6. Verify completed
    let info = crate::client::claimlink::get_mint_request(
        &pic,
        caller,
        canister_ids.claimlink,
        &mint_request_id,
    )
    .unwrap();
    assert_eq!(info.minted_count, Nat::from(3u64));
    assert_eq!(info.status, MintRequestStatus::Completed);

    // 7. Verify NFTs exist on collection canister
    let nfts = crate::client::claimlink::get_collection_nfts(
        &pic,
        caller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collection_nfts::Args {
            canister_id: collection_canister_id,
            prev: None,
            take: None,
        },
    );
    assert_eq!(nfts.len(), 3, "Collection should have 3 NFTs");

    // 8. Cannot mint more after completion
    let over_mint = crate::client::claimlink::mint_nfts(
        &mut pic,
        caller,
        canister_ids.claimlink,
        &claimlink_api::updates::mint_nfts::MintNftsArgs {
            mint_request_id,
            mint_items: vec![claimlink_api::updates::mint_nfts::MintItemArg {
                token_owner: Account {
                    owner: caller,
                    subaccount: None,
                },
                metadata: vec![],
                memo: None,
            }],
        },
    );
    assert!(over_mint.is_err());
    assert!(matches!(
        over_mint.unwrap_err(),
        claimlink_api::errors::MintNftsError::MintRequestNotActive
    ));
}
