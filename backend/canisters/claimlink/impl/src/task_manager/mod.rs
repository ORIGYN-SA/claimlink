use std::collections::HashMap;
use std::fmt::Debug;
use std::vec;

use bity_ic_types::BuildVersion;
use candid::{Nat, Principal};
use claimlink_api::create_collection::CreateCollectionArgs;
use ic_cdk::call::Error as CallError;

use icrc_ledger_types::icrc2::transfer_from::TransferFromError;
use origyn_nft_canister_api::{InitApprovalsArg, Permission, PermissionManager};

use crate::state::audit::process_event;
use crate::state::{mutate_state, read_state};
use crate::task_manager::create_canister::create_canister_once;
use crate::task_manager::install_canister::install_canister_once;
use crate::types::collections::{
    CollectionMetadata, CollectionRequest, InstallationStatus, OgyChargedAmount, OgyTransferIndex,
};
use crate::types::events::EventType;
use crate::types::templates::NftTemplateId;
use crate::types::wasm::WasmHash;
use origyn_nft_canister_api::lifecycle::InitArgs as OrigynNftInitArgs;

pub mod create_canister;
pub mod install_canister;
pub mod reimburse_ogy;

#[derive(Clone, Debug)]
pub enum TaskError {
    CanisterCreationError(CallError),
    InstallCodeError(CallError),
    CanisterStatusError(CallError),
    WasmHashNotFound(WasmHash),
    InterCanisterCallError(CallError),
    CanisterCallError(String),
    InsufficientCyclesToTopUp { required: u128, available: u128 },
    ReimbursementError(TransferFromError),
}

pub async fn create_and_install_canister(
    args: CreateCollectionArgs,
    owner: Principal,
    ogy_payment_index: OgyTransferIndex,
    ogy_charged: OgyChargedAmount,
    template_id: NftTemplateId,
    wasm_hash: WasmHash,
) {
    let mut collection_request = CollectionRequest {
        owner,
        ogy_payment_index,
        ogy_charged,
        metadata: CollectionMetadata {
            name: args.name,
            symbol: args.symbol,
            description: args.description,
            template_id,
        },
        status: InstallationStatus::Queued,
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    let (cycles_for_canister_creation, test_mode) = read_state(|s| {
        (
            s.data.cycles_management.cycles_for_collection_creation,
            s.env.is_test_mode(),
        )
    });

    // create canister
    match create_canister_once(&collection_request, cycles_for_canister_creation).await {
        Ok(canister_id) => {
            collection_request.status = InstallationStatus::Created {
                principal: canister_id,
            };
            mutate_state(|s| {
                process_event(
                    s,
                    EventType::CreatedCansiter {
                        ogy_payment_index,
                        canister_id,
                    },
                )
            });
            canister_id
        }
        Err(_) => todo!(),
    };

    // install wasm

    let mut permissions_map = HashMap::new();
    permissions_map.insert(
        owner,
        vec![
            Permission::Minting,
            Permission::ManageAuthorities,
            Permission::ReadUploads,
            Permission::UpdateUploads,
            Permission::UpdateCollectionMetadata,
            Permission::UpdateMetadata,
        ],
    );

    let nft_init_args = OrigynNftInitArgs {
        test_mode,
        version: BuildVersion::default(),
        commit_hash: wasm_hash.to_string(),
        permissions: PermissionManager::new(permissions_map),
        description: Some(collection_request.metadata.description.clone()),
        symbol: collection_request.metadata.symbol.clone(),
        name: collection_request.metadata.name.clone(),
        logo: None,
        collection_metadata: HashMap::new(),
        approval_init: InitApprovalsArg {
            max_approvals_per_token_or_collection: Some(Nat::from(100u64)),
            max_revoke_approvals: Some(Nat::from(100u64)),
        },
        atomic_batch_transfers: None,
        default_take_value: None,
        max_canister_storage_threshold: None,
        max_memo_size: None,
        max_query_batch_size: None,
        max_take_value: None,
        max_update_batch_size: None,
        permitted_drift: None,
        supply_cap: None,
        tx_window: None,
    };

    match install_canister_once(&collection_request, &wasm_hash, &nft_init_args).await {
        Ok(()) => mutate_state(|s| {
            process_event(
                s,
                EventType::InstalledWasm {
                    ogy_payment_index,
                    wasm_hash,
                },
            )
        }),
        Err(_) => todo!(),
    }
}
