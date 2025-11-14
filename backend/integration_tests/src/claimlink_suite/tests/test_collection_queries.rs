use crate::{
    claimlink_suite::{init::init, TestEnv},
    utils::random_principal,
};
use candid::{Nat, Principal};
use claimlink_api::types::collection::PaginationArgs;
use icrc_ledger_types::icrc1::account::Account;
use utils::consts::E8S_FEE_OGY;

const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy

/// Helper function to approve and create a collection
fn create_test_collection(
    pic: &mut pocket_ic::PocketIc,
    caller: Principal,
    claimlink_canister: Principal,
    ogy_ledger: Principal,
    name: &str,
    symbol: &str,
    description: &str,
) -> Principal {
    let total_approval_with_fee = OGY_TO_PAY + E8S_FEE_OGY as u64;

    // Approve the transfer
    let _approval_result = crate::client::icrc1_icrc2_token::icrc2_approve(
        pic,
        caller,
        ogy_ledger,
        &crate::client::icrc1_icrc2_token::icrc2_approve::Args {
            from_subaccount: None,
            spender: Account {
                owner: claimlink_canister,
                subaccount: None,
            },
            amount: Nat::from(total_approval_with_fee),
            expected_allowance: None,
            expires_at: None,
            fee: None,
            memo: None,
            created_at_time: None,
        },
    );

    // Create the collection
    let create_args = claimlink_api::updates::create_collection::Args {
        name: name.to_string(),
        symbol: symbol.to_string(),
        description: description.to_string(),
    };

    let result = crate::client::claimlink::create_collection(
        pic,
        caller,
        claimlink_canister,
        &create_args,
    )
    .expect("Failed to create collection");

    result.origyn_nft_canister_id
}

#[test]
fn test_get_collection_count_empty() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;

    let count = crate::client::claimlink::get_collection_count(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );

    assert_eq!(count, 0, "Initial collection count should be 0");
}

#[test]
fn test_get_collection_count_after_creation() {
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

    let count = crate::client::claimlink::get_collection_count(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );

    assert_eq!(count, 1, "Collection count should be 1 after creating one");
}

#[test]
fn test_list_all_collections_empty() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;

    let result = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );

    assert_eq!(result.collections.len(), 0);
    assert_eq!(result.total_count, 0);
}

#[test]
fn test_list_all_collections_single() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let canister_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Test Collection",
        "TC",
        "Test Description",
    );

    let result = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );

    assert_eq!(result.collections.len(), 1);
    assert_eq!(result.total_count, 1);
    assert_eq!(result.collections[0].canister_id, canister_id);
    assert_eq!(result.collections[0].name, "Test Collection");
    assert_eq!(result.collections[0].symbol, "TC");
    assert_eq!(result.collections[0].description, "Test Description");
    assert_eq!(result.collections[0].creator, principal_ids.principal_100k_ogy);
}

#[test]
fn test_list_all_collections_with_pagination() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create 5 collections
    for i in 0..5 {
        create_test_collection(
            &mut pic,
            principal_ids.principal_100k_ogy,
            canister_ids.claimlink,
            canister_ids.ogy_sns_ledger,
            &format!("Collection {}", i),
            &format!("C{}", i),
            &format!("Description {}", i),
        );
    }

    // Test first page (limit 2)
    let result_page1 = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs {
            offset: Some(0),
            limit: Some(2),
        },
    );

    assert_eq!(result_page1.collections.len(), 2);
    assert_eq!(result_page1.total_count, 5);

    // Test second page (offset 2, limit 2)
    let result_page2 = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs {
            offset: Some(2),
            limit: Some(2),
        },
    );

    assert_eq!(result_page2.collections.len(), 2);
    assert_eq!(result_page2.total_count, 5);

    // Test last page (offset 4, limit 2)
    let result_page3 = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs {
            offset: Some(4),
            limit: Some(2),
        },
    );

    assert_eq!(result_page3.collections.len(), 1); // Only one remaining
    assert_eq!(result_page3.total_count, 5);
}

#[test]
fn test_list_my_collections_empty() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids: _,
    } = env;

    let random_user = random_principal();

    let result = crate::client::claimlink::list_my_collections(
        &pic,
        random_user,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );

    assert_eq!(result.collections.len(), 0);
    assert_eq!(result.total_count, 0);
}

#[test]
fn test_list_my_collections() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create 2 collections as principal_100k_ogy
    let canister_id_1 = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "My Collection 1",
        "MC1",
        "Description 1",
    );

    let canister_id_2 = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "My Collection 2",
        "MC2",
        "Description 2",
    );

    // Query as the creator
    let result = crate::client::claimlink::list_my_collections(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );

    assert_eq!(result.collections.len(), 2);
    assert_eq!(result.total_count, 2);

    let canister_ids_found: Vec<Principal> = result
        .collections
        .iter()
        .map(|c| c.canister_id)
        .collect();

    assert!(canister_ids_found.contains(&canister_id_1));
    assert!(canister_ids_found.contains(&canister_id_2));

    // Query as a different user (should be empty)
    let result_other = crate::client::claimlink::list_my_collections(
        &pic,
        random_principal(),
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );

    assert_eq!(result_other.collections.len(), 0);
    assert_eq!(result_other.total_count, 0);
}

#[test]
fn test_get_collections_by_owner() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create 3 collections as principal_100k_ogy
    for i in 0..3 {
        create_test_collection(
            &mut pic,
            principal_ids.principal_100k_ogy,
            canister_ids.claimlink,
            canister_ids.ogy_sns_ledger,
            &format!("Collection {}", i),
            &format!("C{}", i),
            &format!("Description {}", i),
        );
    }

    // Query by owner
    let result = crate::client::claimlink::get_collections_by_owner(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_by_owner::Args {
            owner: principal_ids.principal_100k_ogy,
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result.collections.len(), 3);
    assert_eq!(result.total_count, 3);

    // Verify all have the correct owner
    for collection in &result.collections {
        assert_eq!(collection.creator, principal_ids.principal_100k_ogy);
    }

    // Query for a different owner
    let result_other = crate::client::claimlink::get_collections_by_owner(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_by_owner::Args {
            owner: random_principal(),
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result_other.collections.len(), 0);
    assert_eq!(result_other.total_count, 0);
}

#[test]
fn test_get_collection_info() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let canister_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Test Collection",
        "TC",
        "Test Description",
    );

    // Query existing collection
    let result = crate::client::claimlink::get_collection_info(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collection_info::Args { canister_id },
    );

    assert!(result.is_some());
    let info = result.unwrap();
    assert_eq!(info.canister_id, canister_id);
    assert_eq!(info.name, "Test Collection");
    assert_eq!(info.symbol, "TC");
    assert_eq!(info.description, "Test Description");
    assert_eq!(info.creator, principal_ids.principal_100k_ogy);
    assert!(info.created_at > 0);

    // Query non-existent collection
    let result_none = crate::client::claimlink::get_collection_info(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collection_info::Args {
            canister_id: random_principal(),
        },
    );

    assert!(result_none.is_none());
}

#[test]
fn test_collection_exists() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let canister_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Test Collection",
        "TC",
        "Test Description",
    );

    // Check existing collection
    let exists = crate::client::claimlink::collection_exists(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::collection_exists::Args { canister_id },
    );

    assert!(exists, "Collection should exist");

    // Check non-existent collection
    let not_exists = crate::client::claimlink::collection_exists(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::collection_exists::Args {
            canister_id: random_principal(),
        },
    );

    assert!(!not_exists, "Collection should not exist");
}

#[test]
fn test_pagination_limit_capping() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Create 5 collections
    for i in 0..5 {
        create_test_collection(
            &mut pic,
            principal_ids.principal_100k_ogy,
            canister_ids.claimlink,
            canister_ids.ogy_sns_ledger,
            &format!("Collection {}", i),
            &format!("C{}", i),
            &format!("Description {}", i),
        );
    }

    // Request with limit > MAX_LIMIT (should be capped at 100)
    let result = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs {
            offset: Some(0),
            limit: Some(500), // Exceeds max
        },
    );

    // Should return all 5, but the limit is capped
    assert_eq!(result.collections.len(), 5);
    assert_eq!(result.total_count, 5);
}

#[test]
fn test_update_create_collection_stores_in_registry() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    // Verify initial count is 0
    let initial_count = crate::client::claimlink::get_collection_count(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );
    assert_eq!(initial_count, 0);

    // Create a collection
    let canister_id = create_test_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Stored Collection",
        "SC",
        "Should be stored in registry",
    );

    // Verify count increased
    let new_count = crate::client::claimlink::get_collection_count(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &(),
    );
    assert_eq!(new_count, 1);

    // Verify it exists
    let exists = crate::client::claimlink::collection_exists(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::collection_exists::Args { canister_id },
    );
    assert!(exists);

    // Verify we can retrieve it
    let info = crate::client::claimlink::get_collection_info(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collection_info::Args { canister_id },
    );
    assert!(info.is_some());

    // Verify it appears in list_all_collections
    let all_collections = crate::client::claimlink::list_all_collections(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );
    assert_eq!(all_collections.collections.len(), 1);
    assert_eq!(all_collections.collections[0].canister_id, canister_id);

    // Verify it appears in list_my_collections for the creator
    let my_collections = crate::client::claimlink::list_my_collections(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &PaginationArgs::default(),
    );
    assert_eq!(my_collections.collections.len(), 1);
    assert_eq!(my_collections.collections[0].canister_id, canister_id);
}
