use crate::{
    guards,
    state::{mutate_state, read_state},
};
use bity_ic_canister_time::timestamp_nanos;
use bity_ic_subcanister_manager::Canister;
use candid::{Nat, Principal};
use claimlink_api::errors::{CreateCollectionError, GenericError};
pub use claimlink_api::updates::create_collection::{
    Args as CreateCollectionArgs, Response as CreateCollectionResponse,
};
use icrc_ledger_types::icrc1::account::Account;
use utils::{consts, env::Environment};

const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy
const INITIAL_COLLECTION_CYCLES: u128 = 1 * consts::T;

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn create_collection(args: CreateCollectionArgs) -> CreateCollectionResponse {
    let available_cycles = read_state(|state| {
        if state.env.is_test_mode() {
            INITIAL_COLLECTION_CYCLES
        } else {
            state.env.cycles_balance()
        }
    });
    let ledger_id = read_state(|state| state.data.ledger_canister_id);
    let caller = ic_cdk::api::msg_caller();
    let bank_principal: Principal = read_state(|state| state.data.bank_principal_id);

    if available_cycles < INITIAL_COLLECTION_CYCLES {
        return Err(CreateCollectionError::InsufficientCycles);
    }

    let transfer_from_args = icrc_ledger_types::icrc2::transfer_from::TransferFromArgs {
        spender_subaccount: None,
        from: Account {
            owner: caller,
            subaccount: None,
        },
        to: Account {
            owner: bank_principal,
            subaccount: None,
        },
        amount: Nat::from(OGY_TO_PAY),
        fee: Some(Nat::from(utils::consts::E8S_FEE_OGY)),
        memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
            format!("Canister creation: {}", args.symbol).into_bytes(),
        )),
        created_at_time: Some(timestamp_nanos()),
    };

    let response =
        icrc_ledger_canister_c2c_client::icrc2_transfer_from(ledger_id, &transfer_from_args)
            .await
            .map_err(|e| CreateCollectionError::Generic(GenericError::Other(e.to_string())))?;

    println!("Response: {:?}", response);
    if let icrc_ledger_canister::icrc2_transfer_from::Response::Err(e) = response {
        return Err(CreateCollectionError::TransferFromError(e));
    }

    let mut sub_canister_manager = read_state(|state| state.data.sub_canister_manager.clone());

    let origyn_nft_canister = sub_canister_manager
        .create_canister(
            claimlink_api::types::sub_canister::CreateOrigynNftCanisterArgs {
                creator: caller,
                logo: None,
                name: args.name.clone(),
                symbol: args.symbol.clone(),
                description: Some(args.description),
            },
        )
        .await?;

    mutate_state(|state| state.data.sub_canister_manager = sub_canister_manager);

    Ok(claimlink_api::create_collection::CreateCollectionResult {
        origyn_nft_canister_id: origyn_nft_canister.canister_id(),
    })
}
