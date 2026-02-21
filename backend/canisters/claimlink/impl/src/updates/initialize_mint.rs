use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    types::{collections::InstallationStatus, events::EventType},
};
use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
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
    // Base fee = base_fee * num_mints
    let base_fee_usd_e8s = (base_mint_fee_usd_e8s as u128) * (num_mints as u128);

    // Storage fee = storage_per_mb * (total_bytes / 1_048_576)
    // Use ceiling division so even 1 byte costs something
    let total_bytes = total_file_size_bytes as u128;
    let storage_fee_usd_e8s = if total_bytes == 0 {
        0u128
    } else {
        // Multiply first to avoid precision loss, then divide
        (storage_fee_per_mb_usd_e8s as u128) * total_bytes / 1_048_576
    };

    let total_usd_e8s = base_fee_usd_e8s + storage_fee_usd_e8s;

    // Convert USD to OGY: ogy_e8s = total_usd_e8s * 10^8 / usd_per_ogy_e8s
    let ogy_e8s = total_usd_e8s * 100_000_000 / (usd_per_ogy_e8s as u128);

    // Apply 2% price fluctuation buffer
    let ogy_with_buffer = ogy_e8s * 102 / 100;

    (total_usd_e8s as u64, ogy_with_buffer)
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn initialize_mint(args: InitializeMintArgs) -> InitializeMintResponse {
    // Validate num_mints
    if args.num_mints == 0 {
        return Err(InitializeMintError::InvalidNumMints);
    }

    let total_file_size_bytes: u64 = args
        .total_file_size_bytes
        .0
        .try_into()
        .map_err(|_| InitializeMintError::Generic(claimlink_api::errors::GenericError::Other(
            "total_file_size_bytes too large".to_string(),
        )))?;

    let (ledger_id, caller, ogy_price, mint_pricing, collection) = read_state(|s| {
        let caller = s.env.caller();

        // Find collection by canister_id
        let collection = s
            .data
            .collection_requests
            .values()
            .find(|c| c.canister_id == Some(args.collection_canister_id))
            .cloned();

        (
            s.data.ledger_canister_id,
            caller,
            s.data.ogy_price.clone(),
            s.data.mint_pricing.clone(),
            collection,
        )
    });

    // Validate collection exists
    let collection = collection.ok_or(InitializeMintError::CollectionNotFound)?;

    // Validate caller owns the collection
    if collection.owner != caller {
        return Err(InitializeMintError::CallerNotCollectionOwner);
    }

    // Validate collection is ready (template uploaded)
    if !matches!(collection.status, InstallationStatus::TemplateUploaded) {
        return Err(InitializeMintError::CollectionNotReady);
    }

    // Get OGY price
    let price = ogy_price.ok_or(InitializeMintError::OgyPriceNotAvailable)?;

    // Calculate cost
    let (_total_usd_e8s, ogy_to_charge) = calculate_mint_cost(
        args.num_mints,
        total_file_size_bytes,
        mint_pricing.base_mint_fee_usd_e8s,
        mint_pricing.storage_fee_per_mb_usd_e8s,
        price.usd_per_ogy_e8s,
    );

    // Transfer OGY from caller to claimlink via ICRC-2 transfer_from
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
            format!("Mint init: {} x{}", args.collection_canister_id, args.num_mints)
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
