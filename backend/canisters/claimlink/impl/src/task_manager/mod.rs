use crate::state::read_state;
use crate::task_manager::burn_ogy::burn_ogy;
use crate::task_manager::create_canister::create_canister_once;
use crate::task_manager::install_canister::install_canister_once;
use crate::task_manager::upload_template::upload_template_once;
use crate::types::collections::{CollectionMetadata, OgyTransferIndex};
use crate::types::templates::NftTemplateId;
use crate::types::wasm::WasmHash;
use bity_ic_types::BuildVersion;
use candid::{Nat, Principal};
use claimlink_api::create_collection::CreateCollectionArgs;
use ic_cdk::call::Error as CallError;
use icrc_ledger_types::icrc2::transfer_from::TransferFromError;
use origyn_nft_canister_api::finalize_upload::FinalizeUploadError;
use origyn_nft_canister_api::init_upload::InitUploadError;
use origyn_nft_canister_api::lifecycle::{Args as OrigynNftArgs, InitArgs as OrigynNftInitArgs};
use origyn_nft_canister_api::store_chunk::StoreChunkError;
use origyn_nft_canister_api::{InitApprovalsArg, Permission, PermissionManager};
use std::collections::HashMap;
use std::fmt;
use std::time::Duration;
use std::vec;

pub mod burn_ogy;
pub mod create_canister;
pub mod install_canister;
pub mod reimburse_ogy;
pub mod retry_installation;
pub mod upload_template;

#[derive(Debug)]
pub enum TaskError {
    CanisterCreationError(CallError),
    InstallCodeError(CallError),
    CanisterStatusError(CallError),
    WasmHashNotFound(WasmHash),
    InterCanisterCallError(CallError),
    CanisterCallError(String),
    InsufficientCyclesToTopUp { required: u128, available: u128 },
    ReimbursementError(TransferFromError),
    InvalidTemplateId,
    InitUploadError(InitUploadError),
    StoreChunkError(StoreChunkError),
    FinalizeUploadError(FinalizeUploadError),
}

impl fmt::Display for TaskError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TaskError::CanisterCreationError(e) => {
                write!(f, "Failed to create canister: {:?}", e)
            }
            TaskError::InstallCodeError(e) => {
                write!(f, "Failed to install code: {:?}", e)
            }
            TaskError::CanisterStatusError(e) => {
                write!(f, "Failed to check canister status: {:?}", e)
            }
            TaskError::WasmHashNotFound(hash) => {
                write!(f, "WASM hash not found: {:?}", hash)
            }
            TaskError::InterCanisterCallError(e) => {
                write!(f, "Inter-canister call error: {:?}", e)
            }
            TaskError::CanisterCallError(msg) => {
                write!(f, "Canister call error: {}", msg)
            }
            TaskError::InsufficientCyclesToTopUp {
                required,
                available,
            } => {
                write!(
                    f,
                    "Insufficient cycles for top-up. Required: {}, Available: {}",
                    required, available
                )
            }
            TaskError::ReimbursementError(e) => {
                write!(f, "Reimbursement failed: {:?}", e)
            }
            TaskError::InvalidTemplateId => write!(f, "Invalid tempalte id"),
            TaskError::InitUploadError(e) => write!(f, "Failed to initiate upload: {:?}", e),
            TaskError::StoreChunkError(e) => {
                write!(f, "Failed to store file chunk: {:?}", e)
            }
            TaskError::FinalizeUploadError(e) => {
                write!(f, "Failed to finalaize upload {:?}", e)
            }
        }
    }
}

pub async fn create_and_install_canister(
    args: CreateCollectionArgs,
    owner: Principal,
    ogy_payment_index: OgyTransferIndex,
    template_id: NftTemplateId,
    wasm_hash: WasmHash,
) {
    let (cycles_for_canister_creation, test_mode) = read_state(|s| {
        (
            s.data.cycles_management.cycles_for_collection_creation,
            s.env.is_test_mode(),
        )
    });

    // create canister
    let canister_id =
        match create_canister_once(ogy_payment_index, cycles_for_canister_creation).await {
            Ok(canister_id) => canister_id,
            Err(_e) => {
                return;
            }
        };

    // install wasm
    let nft_init_args = build_origyn_nft_init_args(
        test_mode,
        &wasm_hash,
        owner,
        &CollectionMetadata {
            name: args.name,
            symbol: args.symbol,
            description: args.description,
            template_id,
        },
    );

    if let Err(_e) =
        install_canister_once(ogy_payment_index, canister_id, &wasm_hash, &nft_init_args).await
    {
        return;
    };

    // upload template
    let _ = upload_template_once(ogy_payment_index, canister_id, template_id).await;

    ic_cdk_timers::set_timer(Duration::ZERO, || {
        ic_cdk::futures::spawn_017_compat(burn_ogy())
    });
}

pub fn build_origyn_nft_init_args(
    test_mode: bool,
    wasm_hash: &WasmHash,
    owner: Principal,
    metadata: &CollectionMetadata,
) -> OrigynNftArgs {
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

    OrigynNftArgs::Init(OrigynNftInitArgs {
        test_mode,
        version: BuildVersion::default(),
        commit_hash: wasm_hash.to_string(),
        permissions: PermissionManager::new(permissions_map),
        description: Some(metadata.description.clone()),
        symbol: metadata.symbol.clone(),
        name: metadata.name.clone(),
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
        base_url: None,
    })
}
