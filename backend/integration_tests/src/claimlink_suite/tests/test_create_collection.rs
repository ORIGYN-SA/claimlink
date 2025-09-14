use crate::{
    claimlink_suite::{init::init, TestEnv},
    utils::random_principal,
};
use candid::Nat;
use icrc_ledger_types::icrc1::account::Account;
use utils::consts::E8S_FEE_OGY;

const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy

#[test]
fn create_collection_basic() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let total_approval_with_fee = OGY_TO_PAY + E8S_FEE_OGY as u64;
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

    let bank_account = Account {
        owner: principal_ids.bank_principal_id,
        subaccount: None,
    };
    let balance_before = crate::client::icrc1_icrc2_token::icrc1_balance_of(
        &pic,
        principal_ids.controller,
        canister_ids.ogy_sns_ledger,
        &bank_account,
    );
    println!("Bank balance before create_collection: {}", balance_before);

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
    let _created_canister_id = create_collection_result.unwrap().origyn_nft_canister_id;

    // check bank balance after create_collection
    let balance_after = crate::client::icrc1_icrc2_token::icrc1_balance_of(
        &pic,
        principal_ids.controller,
        canister_ids.ogy_sns_ledger,
        &bank_account,
    );
    println!("Bank balance after create_collection: {}", balance_after);

    // verify that the bank received the expected amount
    let balance_increase = balance_after - balance_before;
    assert_eq!(
        balance_increase,
        Nat::from(OGY_TO_PAY),
        "Bank should have received {} OGY, but got {}",
        OGY_TO_PAY,
        balance_increase
    );
}

#[test]
fn create_collection_fails_if_insufficient_allowance() {
    let mut env = init();

    let create_collection_args = claimlink_api::updates::create_collection::Args {
        name: "Test Collection".to_string(),
        symbol: "TC".to_string(),
        description: "Test Description".to_string(),
    };

    // try to create collection without approval - should fail with insufficient allowance
    let create_collection_result = crate::client::claimlink::create_collection(
        &mut env.pic,
        random_principal(),
        env.canister_ids.claimlink,
        &create_collection_args,
    );

    assert!(create_collection_result.is_err());
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
