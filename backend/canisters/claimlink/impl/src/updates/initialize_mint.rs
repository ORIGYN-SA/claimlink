use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    types::{collections::InstallationStatus, events::EventType},
};
use bity_ic_canister_time::timestamp_nanos;
use candid::{Nat, Principal};
use claimlink_api::errors::InitializeMintError;
pub use claimlink_api::updates::initialize_mint::{
    Args as InitializeMintArgs, Response as InitializeMintResponse,
};
use icrc_ledger_types::icrc1::account::Account;
use utils::env::Environment;

/// Calculate the OGY cost for minting.
/// Returns (total_usd_e8s, ogy_e8s_with_buffer)
pub fn calculate_mint_cost(
    num_mints: u64,
    total_file_size_bytes: u64,
    base_mint_fee_usd_e8s: u64,
    storage_fee_per_mb_usd_e8s: u64,
    usd_per_ogy_e8s: u64,
) -> (u64, u128) {
    let base_fee_usd_e8s = (base_mint_fee_usd_e8s as u128) * (num_mints as u128);

    let total_bytes = total_file_size_bytes as u128;
    let storage_fee_usd_e8s = if total_bytes == 0 {
        0u128
    } else {
        (storage_fee_per_mb_usd_e8s as u128) * total_bytes / 1_048_576
    };

    let total_usd_e8s = base_fee_usd_e8s + storage_fee_usd_e8s;

    // Convert USD to OGY: ogy_e8s = total_usd_e8s * 10^8 / usd_per_ogy_e8s
    let ogy_e8s = total_usd_e8s * 100_000_000 / (usd_per_ogy_e8s as u128);

    // Apply 2% price fluctuation buffer
    let ogy_with_buffer = ogy_e8s * 102 / 100;

    (total_usd_e8s as u64, ogy_with_buffer)
}

/// Data extracted from state for initialize_mint validation — avoids cloning.
struct CollectionValidation {
    owner: Principal,
    is_template_uploaded: bool,
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn initialize_mint(args: InitializeMintArgs) -> InitializeMintResponse {
    if args.num_mints == 0 {
        return Err(InitializeMintError::InvalidNumMints);
    }

    let total_file_size_bytes: u64 = args
        .total_file_size_bytes
        .0
        .try_into()
        .map_err(|_| {
            InitializeMintError::Generic(claimlink_api::errors::GenericError::Other(
                "total_file_size_bytes too large".to_string(),
            ))
        })?;

    let (ledger_id, caller, usd_per_ogy_e8s, base_mint_fee, storage_fee, collection_info) =
        read_state(|s| {
            let caller = s.env.caller();

            let collection_info = s
                .data
                .collection_requests
                .values()
                .find(|c| c.canister_id == Some(args.collection_canister_id))
                .map(|c| CollectionValidation {
                    owner: c.owner,
                    is_template_uploaded: matches!(c.status, InstallationStatus::TemplateUploaded),
                });

            (
                s.data.ledger_canister_id,
                caller,
                s.data.ogy_price.as_ref().map(|p| p.usd_per_ogy_e8s),
                s.data.mint_pricing.base_mint_fee_usd_e8s,
                s.data.mint_pricing.storage_fee_per_mb_usd_e8s,
                collection_info,
            )
        });

    let collection_info = collection_info.ok_or(InitializeMintError::CollectionNotFound)?;

    if collection_info.owner != caller {
        return Err(InitializeMintError::CallerNotCollectionOwner);
    }

    if !collection_info.is_template_uploaded {
        return Err(InitializeMintError::CollectionNotReady);
    }

    let usd_per_ogy_e8s = usd_per_ogy_e8s.ok_or(InitializeMintError::OgyPriceNotAvailable)?;

    let (_total_usd_e8s, ogy_to_charge) = calculate_mint_cost(
        args.num_mints,
        total_file_size_bytes,
        base_mint_fee,
        storage_fee,
        usd_per_ogy_e8s,
    );

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
        amount: Nat::from(ogy_to_charge),
        fee: Some(Nat::from(utils::consts::E8S_FEE_OGY)),
        memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
            format!(
                "Mint init: {} x{}",
                args.collection_canister_id, args.num_mints
            )
            .into_bytes(),
        )),
        created_at_time: Some(timestamp_nanos()),
    };

    let response =
        icrc_ledger_canister_c2c_client::icrc2_transfer_from(ledger_id, &transfer_from_args)
            .await
            .map_err(|e| {
                InitializeMintError::Generic(claimlink_api::errors::GenericError::Other(
                    e.to_string(),
                ))
            })?;

    let ogy_payment_index: u128 = match response {
        icrc_ledger_canister::icrc2_transfer_from::Response::Ok(index) => {
            index.0.try_into().unwrap()
        }
        icrc_ledger_canister::icrc2_transfer_from::Response::Err(e) => {
            return Err(InitializeMintError::TransferFromError(e));
        }
    };

    let mint_request_id = mutate_state(|s| {
        let now = ic_cdk::api::time();
        let id = s.data.next_mint_request_id;

        process_event(
            s,
            EventType::InitializeMintRequest {
                mint_request_id: id,
                owner: caller,
                collection_canister_id: args.collection_canister_id,
                ogy_payment_index,
                ogy_charged: ogy_to_charge,
                num_mints: args.num_mints,
                allocated_bytes: total_file_size_bytes,
                created_at: now,
            },
        );

        id
    });

    Ok(mint_request_id)
}
