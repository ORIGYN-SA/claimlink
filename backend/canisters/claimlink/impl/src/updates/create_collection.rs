use crate::{guards, state::mutate_state};
use bity_ic_subcanister_manager::Canister;
use candid::{Nat, Principal};
pub use claimlink_api::updates::create_collection::{
    Args as CreateCollectionArgs, Response as CreateCollectionResponse,
};
use claimlink_api::{
    errors::{CreateCollectionError, GenericError},
    types,
};
use icrc_ledger_canister_c2c_client::icrc2_transfer_from;
use icrc_ledger_types::icrc1::account::Account;
use utils::env::Environment;

const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy
const INITIAL_COLLECTION_CYCLES: u128 = 800_000_000_000;

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn create_collection(args: CreateCollectionArgs) -> CreateCollectionResponse {
    let available_cycles = mutate_state(|state| state.env.cycles_balance());
    let ledger_id = mutate_state(|state| state.data.ledger_canister_id);
    let caller = ic_cdk::api::msg_caller();
    // TODO: Change this / move to state
    let bank_principal: Principal = Principal::from_text("qjd6w-7yaaa-aaaaa-qaaca-cai").unwrap();

    if available_cycles < INITIAL_COLLECTION_CYCLES {
        return Err(CreateCollectionError::InsufficientCycles);
    }

    let caller_balance = icrc_ledger_canister_c2c_client::icrc1_balance_of(
        ledger_id,
        &(Account {
            owner: caller,
            subaccount: None,
        }),
    )
    .await
    .map_err(|e| CreateCollectionError::Generic(GenericError::Other(e.to_string())))?;

    if caller_balance < OGY_TO_PAY {
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
        memo: None,
        created_at_time: None,
    };

    icrc2_transfer_from(ledger_id, &transfer_from_args)
        .await
        .map_err(|e| CreateCollectionError::Generic(GenericError::Other(e.to_string())))?;

    let mut sub_canister_manager = mutate_state(|state| state.data.sub_canister_manager.clone());

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

    Ok(claimlink_api::create_collection::CreateCollectionResult {
        origyn_nft_canister_id: origyn_nft_canister.canister_id(),
    })
}
