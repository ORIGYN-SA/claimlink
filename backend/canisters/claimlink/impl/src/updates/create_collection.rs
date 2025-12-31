use crate::{
    guards,
    state::{mutate_state, read_state},
    types::collections::{
        CollectionMetadata, CollectionRequest, InstallationStatus, OgyTransferIndex,
    },
};
use bity_ic_canister_time::timestamp_nanos;
use bity_ic_subcanister_manager::Canister;
use candid::Nat;
use claimlink_api::errors::{CreateCollectionError, GenericError};
use claimlink_api::types::collection::{CollectionInfo, OwnerCollectionList};
pub use claimlink_api::updates::create_collection::{
    Args as CreateCollectionArgs, Response as CreateCollectionResponse,
};
use icrc_ledger_types::icrc1::account::Account;
use utils::{consts, env::Environment};

const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy
const INITIAL_COLLECTION_CYCLES: u128 = 1 * consts::T;

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn create_collection(args: CreateCollectionArgs) -> CreateCollectionResponse {
    let (ledger_id, bank_principal, cycles_management, cycles_available, caller, ogy_to_pay) =
        read_state(|s| {
            (
                s.data.ledger_canister_id,
                s.data.bank_principal_id,
                s.data.cycles_management,
                s.env.cycles_balance(),
                s.env.caller(),
                s.data.collection_request_fee,
            )
        });

    let template_id = args.template_id.0.try_into().unwrap();

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

    let ogy_payment_index: OgyTransferIndex = match response {
        icrc_ledger_canister::icrc2_transfer_from::Response::Ok(index) => {
            index.0.try_into().unwrap()
        }
        icrc_ledger_canister::icrc2_transfer_from::Response::Err(e) => {
            return Err(CreateCollectionError::TransferFromError(e))
        }
    };

    let collection_request = CollectionRequest {
        owner: caller,
        ogy_payment_index,
        metadata: CollectionMetadata {
            name: args.name,
            symbol: args.symbol,
            description: args.description,
            template_id,
        },
        status: InstallationStatus::Queued,
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
        ogy_charged: ogy_to_pay,
    };

    let canister_id = origyn_nft_canister.canister_id();

    // Store collection info in registry
    mutate_state(|state| {
        state.data.sub_canister_manager = sub_canister_manager;

        let collection_info = CollectionInfo {
            canister_id,
            creator: caller,
            name: args.name,
            symbol: args.symbol,
            description: args.description,
            created_at: state.env.now(),
        };

        // Store in main registry
        state
            .data
            .collections
            .borrow_mut()
            .insert(canister_id, collection_info);

        // Store in owner index
        let mut collections_by_owner = state.data.collections_by_owner.borrow_mut();
        let mut owner_collections = collections_by_owner
            .get(&caller)
            .unwrap_or(OwnerCollectionList(Vec::new()));
        owner_collections.0.push(canister_id);
        collections_by_owner.insert(caller, owner_collections);

        // Store in ordered list using counter
        let index = state.data.next_collection_index;
        state
            .data
            .collections_ordered
            .borrow_mut()
            .insert(index, canister_id);
        state.data.next_collection_index += 1;
    });

    Ok(claimlink_api::create_collection::CreateCollectionResult {
        origyn_nft_canister_id: canister_id,
    })
}
