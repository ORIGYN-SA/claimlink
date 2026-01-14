use std::time::Duration;

use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    task_manager::create_and_install_canister,
    types::{
        collections::{CollectionMetadata, OgyTransferIndex},
        events::EventType,
    },
};
use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
use claimlink_api::errors::{CreateCollectionError, GenericError};
pub use claimlink_api::updates::create_collection::{
    Args as CreateCollectionArgs, Response as CreateCollectionResponse,
};
use icrc_ledger_types::icrc1::account::Account;
use utils::env::Environment;

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn create_collection(args: CreateCollectionArgs) -> CreateCollectionResponse {
    let (ledger_id, cycles_management, cycles_available, caller, ogy_to_pay, wasm_hash) =
        read_state(|s| {
            (
                s.data.ledger_canister_id,
                s.data.cycles_management.clone(),
                s.env.cycles_balance(),
                s.env.caller(),
                s.data.collection_request_fee,
                s.data.origyn_nft_wasm_hash.clone(),
            )
        });

    let template_id = args.template_id.0.clone().try_into().unwrap();

    // in case the caller does not own the template
    if !read_state(|s| s.data.owns_template(&caller, template_id)) {
        return Err(CreateCollectionError::InvalidNftTemplateId);
    }

    if cycles_available < cycles_management.cycles_for_collection_creation {
        return Err(CreateCollectionError::Generic(GenericError::Other(
            "Canister Out of cycles to spwan a new collection".to_string(),
        )));
    }

    // Transfer OGY into claimlink as a temporary vault to refund user in case of a failure
    let transfer_from_args = icrc_ledger_types::icrc2::transfer_from::TransferFromArgs {
        spender_subaccount: None,
        from: Account {
            owner: caller,
            subaccount: None,
        },
        to: Account {
            owner: ic_cdk::api::canister_self(),
            subaccount: None,
        },
        amount: Nat::from(ogy_to_pay),
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

    let ogy_payment_index: OgyTransferIndex = match response {
        icrc_ledger_canister::icrc2_transfer_from::Response::Ok(index) => {
            index.0.try_into().unwrap()
        }
        icrc_ledger_canister::icrc2_transfer_from::Response::Err(e) => {
            return Err(CreateCollectionError::TransferFromError(e))
        }
    };

    let metadata = CollectionMetadata {
        name: args.name.clone(),
        symbol: args.symbol.clone(),
        description: args.description.clone(),
        template_id,
    };

    mutate_state(|s| {
        process_event(
            s,
            EventType::CreateCollectionRequest {
                metadata,
                ogy_payment_index,
                ogy_charged: ogy_to_pay,
                created_at: ic_cdk::api::time(),
                owner: caller,
            },
        )
    });

    ic_cdk_timers::set_timer(Duration::from_secs(0), move || {
        ic_cdk::futures::spawn_017_compat(create_and_install_canister(
            args,
            caller,
            ogy_payment_index,
            template_id,
            wasm_hash,
        ))
    });

    Ok(Nat::from(ogy_payment_index))
}
