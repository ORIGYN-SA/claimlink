use crate::{
    claimlink_suite::{
        init::init,
        tests::test_collection_queries::{create_test_collection, mint_nft_to_owner},
        TestEnv,
    },
    utils::random_principal,
};
use claimlink_api::types::collection::PaginationArgs;

#[test]
fn test_get_collections_for_user_no_collections() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;

    let user = random_principal();

    let result = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result.collections.len(), 0);
    assert_eq!(result.total_count, 0);
}

#[test]
fn test_get_collections_for_user_with_nfts() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let user = random_principal();
    let creator = principal_ids.principal_100k_ogy;

    // Create a collection
    let collection_id = create_test_collection(
        &mut pic,
        creator,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "User Collection",
        "UC",
        "Collection for user test",
    );

    // Get the collection canister id
    let canister_id = crate::client::claimlink::get_collection_info(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::collection::CollectionSearchParam::CollectionId(collection_id),
    )
    .unwrap()
    .canister_id
    .unwrap();

    // Mint an NFT to the user
    mint_nft_to_owner(&mut pic, creator, user, canister_id, 1);

    // Query collections for user - should find the collection
    let result = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result.collections.len(), 1);
    assert_eq!(result.total_count, 1);
    assert_eq!(result.collections[0].metadata.name, "User Collection");
}

#[test]
fn test_get_collections_for_user_without_nfts_in_collection() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let user = random_principal();
    let other_user = random_principal();
    let creator = principal_ids.principal_100k_ogy;

    // Create a collection
    let collection_id = create_test_collection(
        &mut pic,
        creator,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Other Collection",
        "OC",
        "Collection with NFTs for another user",
    );

    let canister_id = crate::client::claimlink::get_collection_info(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::collection::CollectionSearchParam::CollectionId(collection_id),
    )
    .unwrap()
    .canister_id
    .unwrap();

    // Mint NFTs to a different user, not our target user
    mint_nft_to_owner(&mut pic, creator, other_user, canister_id, 1);
    mint_nft_to_owner(&mut pic, creator, other_user, canister_id, 2);

    // Query collections for user who owns nothing
    let result = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result.collections.len(), 0);
    assert_eq!(result.total_count, 0);
}

#[test]
fn test_get_collections_for_user_multiple_collections() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let user = random_principal();
    let creator = principal_ids.principal_100k_ogy;

    // Create 3 collections
    let mut collection_canister_ids = Vec::new();
    for i in 0..3 {
        let collection_id = create_test_collection(
            &mut pic,
            creator,
            canister_ids.claimlink,
            canister_ids.ogy_sns_ledger,
            &format!("Collection {}", i),
            &format!("C{}", i),
            &format!("Description {}", i),
        );

        let canister_id = crate::client::claimlink::get_collection_info(
            &pic,
            principal_ids.controller,
            canister_ids.claimlink,
            &claimlink_api::collection::CollectionSearchParam::CollectionId(collection_id),
        )
        .unwrap()
        .canister_id
        .unwrap();

        collection_canister_ids.push(canister_id);
    }

    // Mint NFTs to user in collection 0 and 2, but NOT collection 1
    mint_nft_to_owner(&mut pic, creator, user, collection_canister_ids[0], 1);
    mint_nft_to_owner(&mut pic, creator, user, collection_canister_ids[2], 1);

    // Query collections for user
    let result = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs::default(),
        },
    );

    assert_eq!(result.total_count, 2, "User should be in 2 collections");
    assert_eq!(result.collections.len(), 2);
}

#[test]
fn test_get_collections_for_user_with_pagination() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let user = random_principal();
    let creator = principal_ids.principal_100k_ogy;

    // Create 3 collections and mint NFTs for the user in all of them
    for i in 0..3 {
        let collection_id = create_test_collection(
            &mut pic,
            creator,
            canister_ids.claimlink,
            canister_ids.ogy_sns_ledger,
            &format!("Collection {}", i),
            &format!("C{}", i),
            &format!("Description {}", i),
        );

        let canister_id = crate::client::claimlink::get_collection_info(
            &pic,
            principal_ids.controller,
            canister_ids.claimlink,
            &claimlink_api::collection::CollectionSearchParam::CollectionId(collection_id),
        )
        .unwrap()
        .canister_id
        .unwrap();

        mint_nft_to_owner(&mut pic, creator, user, canister_id, 1);
    }

    // Page 1: offset 0, limit 2
    let page1 = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs {
                offset: Some(0),
                limit: Some(2),
            },
        },
    );

    assert_eq!(page1.total_count, 3);
    assert_eq!(page1.collections.len(), 2);

    // Page 2: offset 2, limit 2
    let page2 = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user,
            pagination: PaginationArgs {
                offset: Some(2),
                limit: Some(2),
            },
        },
    );

    assert_eq!(page2.total_count, 3);
    assert_eq!(page2.collections.len(), 1);
}

#[test]
fn test_get_collections_for_user_owner_is_not_user() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let creator = principal_ids.principal_100k_ogy;

    // Create a collection - the creator owns the collection but has no NFTs minted to them
    create_test_collection(
        &mut pic,
        creator,
        canister_ids.claimlink,
        canister_ids.ogy_sns_ledger,
        "Creator Collection",
        "CC",
        "Collection owned by creator",
    );

    // Query collections for the creator (who owns the collection but has no NFTs)
    let result = crate::client::claimlink::get_collections_for_user(
        &pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &claimlink_api::queries::get_collections_for_user::Args {
            user: creator,
            pagination: PaginationArgs::default(),
        },
    );

    // Creator owns the collection but has no NFTs in it, so should NOT appear
    assert_eq!(
        result.collections.len(),
        0,
        "Collection owner without NFTs should not appear in get_collections_for_user"
    );
}
