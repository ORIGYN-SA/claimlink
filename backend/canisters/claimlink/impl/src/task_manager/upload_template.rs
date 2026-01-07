use crate::state::audit::process_event;
use crate::state::{mutate_state, read_state};
use crate::storage::read_stable_storage;
use crate::task_manager::TaskError;
use crate::types::collections::OgyTransferIndex;
use crate::types::events::EventType;
use crate::types::templates::NftTemplateId;
use candid::{Nat, Principal};
use origyn_nft_canister_api::finalize_upload::Args as FinalizeUploadArgs;
use origyn_nft_canister_api::init_upload::Args as InitUploadArgs;
use origyn_nft_canister_api::store_chunk::Args as StoreChunkArgs;
use origyn_nft_canister_c2c_client::{finalize_upload, init_upload, store_chunk};
use sha2::{Digest, Sha256};
use tracing::{debug, error, info};

pub const UPLOAD_CHUNK_SIZE: u64 = 1_000_000; // 1MB
const FILE_PATH: &str = "template.json";

pub async fn upload_template_once(
    ogy_payment_index: OgyTransferIndex,
    canister_id: Principal,
    template_id: NftTemplateId,
) -> Result<(), TaskError> {
    if read_state(|s| s.data.is_template_uploaded(ogy_payment_index)) {
        info!(
            "Template already uploaded for index {:?}",
            ogy_payment_index
        );
        return Ok(());
    }

    match perform_upload(canister_id, &template_id).await {
        Ok(_) => {
            mutate_state(|s| process_event(s, EventType::UploadedTemplate { ogy_payment_index }));
            info!("Successfully uploaded template for ID: {:?}", template_id);
            Ok(())
        }
        Err(e) => {
            error!("Failed to upload template: {:?}", e);
            mutate_state(|s| {
                process_event(
                    s,
                    EventType::FailedInstallation {
                        ogy_payment_index,
                        reason: e.to_string(),
                    },
                )
            });
            Err(e)
        }
    }
}

/// Inner helper that handles the linear logic of the upload: Init -> Chunk -> Finalize
async fn perform_upload(
    canister_id: Principal,
    template_id: &NftTemplateId,
) -> Result<(), TaskError> {
    let template_bytes = read_stable_storage(|s| s.get_template(template_id)).ok_or_else(|| {
        TaskError::CanisterCallError(
            "Bug: template should be available in stable storage".to_string(),
        )
    })?;

    let raw_bytes = template_bytes.as_ref();
    let file_size = raw_bytes.len() as u64;
    let file_hash = format!("{:x}", Sha256::digest(raw_bytes));

    debug!("Template size: {} bytes, Hash: {}", file_size, file_hash);

    // Init Upload
    execute_init_upload(
        canister_id,
        InitUploadArgs {
            file_path: FILE_PATH.to_string(),
            file_hash,
            file_size,
            chunk_size: Some(UPLOAD_CHUNK_SIZE),
        },
    )
    .await?;

    // Store Chunks
    let chunks = raw_bytes.chunks(UPLOAD_CHUNK_SIZE as usize);

    for (i, chunk_data) in chunks.enumerate() {
        execute_store_chunk(
            canister_id,
            StoreChunkArgs {
                file_path: FILE_PATH.to_string(),
                chunk_id: Nat::from(i),
                chunk_data: chunk_data.to_vec(),
            },
        )
        .await?;
    }

    //  Finalize
    execute_finalize_upload(
        canister_id,
        FinalizeUploadArgs {
            file_path: FILE_PATH.to_string(),
        },
    )
    .await?;

    Ok(())
}

// These handle the specific IC error mapping (Result<Result<T, E>, String>)
async fn execute_init_upload(
    canister_id: Principal,
    args: InitUploadArgs,
) -> Result<(), TaskError> {
    match init_upload(canister_id, args).await {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(TaskError::InitUploadError(e)),
        Err(e) => Err(TaskError::CanisterCallError(e.to_string())),
    }
}

async fn execute_store_chunk(
    canister_id: Principal,
    args: StoreChunkArgs,
) -> Result<(), TaskError> {
    match store_chunk(canister_id, args).await {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(TaskError::StoreChunkError(e)),
        Err(e) => Err(TaskError::CanisterCallError(e.to_string())),
    }
}

async fn execute_finalize_upload(
    canister_id: Principal,
    args: FinalizeUploadArgs,
) -> Result<(), TaskError> {
    match finalize_upload(canister_id, args).await {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(TaskError::FinalizeUploadError(e)),
        Err(e) => Err(TaskError::CanisterCallError(e.to_string())),
    }
}
