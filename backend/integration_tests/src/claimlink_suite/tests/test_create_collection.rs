use crate::claimlink_suite::{
    init::{init, OGY_TO_PAY},
    TestEnv,
};
use candid::{Nat, Principal};
use claimlink_api::{
    collection::{CollectionStatus, PaginationArgs},
    create_template::CreateTemplateArgs,
    get_collections_by_owner::GetCollectionsByOwnerArgs,
};
use icrc_ledger_types::icrc1::account::Account;
use pocket_ic::PocketIc;
use utils::consts::E8S_FEE_OGY;

#[test]
fn create_collection_basic() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let template_id = create_template(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
    );

    let total_approval_with_fee = OGY_TO_PAY + E8S_FEE_OGY;
    let approval_result = crate::client::icrc1_icrc2_token::icrc2_approve(
        &mut pic,
        principal_ids.principal_100k_ogy,
        canister_ids.ogy_sns_ledger,
        &crate::client::icrc1_icrc2_token::icrc2_approve::Args {
            from_subaccount: None,
            spender: Account {
                owner: claimlink,
                subaccount: None,
            },
            amount: Nat::from(total_approval_with_fee),
            expected_allowance: Some(Nat::from(0_u64)),
            expires_at: None,
            fee: None,
            memo: None,
            created_at_time: None,
        },
    );

    assert!(matches!(
        approval_result,
        crate::client::icrc1_icrc2_token::icrc2_approve::Response::Ok(_)
    ));

    let create_collection_args = claimlink_api::updates::create_collection::Args {
        name: "Test Collection".to_string(),
        symbol: "TC".to_string(),
        description: "Test Description".to_string(),
        template_id: template_id.clone(),
    };

    let create_collection_result = crate::client::claimlink::create_collection(
        &mut pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &create_collection_args,
    );

    assert!(create_collection_result.is_ok());

    for _i in 0..20 {
        pic.tick();
    }

    let collections = crate::client::claimlink::get_collections_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        canister_ids.claimlink,
        &GetCollectionsByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
            pagination: PaginationArgs {
                offset: Some(0),
                limit: None,
            },
        },
    );

    print!("{:?}", collections);

    assert_eq!(collections.total_count, Nat::from(1_u8));
    assert_eq!(
        collections.collections[0].status,
        CollectionStatus::TemplateUploaded
    );
    assert_eq!(collections.collections[0].metadata.template_id, template_id);
}

#[test]
fn create_collection_fails_if_insufficient_allowance() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;

    let template_id = create_template(&mut pic, principal_ids.controller, canister_ids.claimlink);

    let create_collection_args = claimlink_api::updates::create_collection::Args {
        name: "Test Collection".to_string(),
        symbol: "TC".to_string(),
        description: "Test Description".to_string(),
        template_id,
    };

    // try to create collection without approval - should fail with insufficient allowance
    let create_collection_result = crate::client::claimlink::create_collection(
        &mut pic,
        principal_ids.controller,
        canister_ids.claimlink,
        &create_collection_args,
    );

    assert!(create_collection_result.is_err());
    println!("{:?}", create_collection_result);
    let error = create_collection_result.unwrap_err();
    assert!(matches!(
        error,
        claimlink_api::errors::CreateCollectionError::TransferFromError(
            icrc_ledger_types::icrc2::transfer_from::TransferFromError::InsufficientAllowance {
                allowance: _,
            }
        )
    ));
}

pub fn create_template(pic: &mut PocketIc, owner: Principal, canister_id: Principal) -> Nat {
    let template_json_string = r#"
        {
            "name": "John Doe",
            "age": 43,
            "phones": [
                "+44 1234567",
                "+44 2345678"
            ]
        }"#;

    crate::client::claimlink::create_template(
        pic,
        owner,
        canister_id,
        &CreateTemplateArgs {
            template_json: template_json_string.to_string(),
        },
    )
    .unwrap()
}
