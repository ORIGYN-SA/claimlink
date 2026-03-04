use crate::{guards, state::read_state, types::collections::InstallationStatus};
use candid::Principal;
use claimlink_api::errors::ProxyLogoUploadError;
pub use claimlink_api::updates::proxy_logo_upload::{
    finalize::{Args as ProxyLogoFinalizeUploadArgs, Response as ProxyLogoFinalizeUploadResponse},
    init::{Args as ProxyLogoInitUploadArgs, Response as ProxyLogoInitUploadResponse},
    store::{Args as ProxyLogoStoreChunkArgs, Response as ProxyLogoStoreChunkResponse},
};
use utils::env::Environment;

const MAX_LOGO_FILE_SIZE: u64 = 5 * 1024 * 1024; // 5MB

/// Validate that the caller owns the collection and it's ready.
/// Returns the collection_canister_id.
fn validate_collection_ownership(
    collection_canister_id: Principal,
) -> Result<Principal, ProxyLogoUploadError> {
    read_state(|s| {
        let caller = s.env.caller();

        let collection = s
            .data
            .collection_requests
            .values()
            .find(|c| c.canister_id == Some(collection_canister_id))
            .ok_or(ProxyLogoUploadError::CollectionNotFound)?;

        if collection.owner != caller {
            return Err(ProxyLogoUploadError::Unauthorized);
        }

        if !matches!(collection.status, InstallationStatus::TemplateUploaded) {
            return Err(ProxyLogoUploadError::CollectionNotReady);
        }

        Ok(collection_canister_id)
    })
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_logo_init_upload(args: ProxyLogoInitUploadArgs) -> ProxyLogoInitUploadResponse {
    let collection_canister_id = validate_collection_ownership(args.collection_canister_id)?;

    if args.file_size > MAX_LOGO_FILE_SIZE {
        return Err(ProxyLogoUploadError::FileTooLarge {
            max_bytes: MAX_LOGO_FILE_SIZE,
            requested: args.file_size,
        });
    }

    let init_args = origyn_nft_canister_api::init_upload::Args {
        file_path: args.file_path,
        file_hash: args.file_hash,
        file_size: args.file_size,
        chunk_size: args.chunk_size,
    };

    let result =
        origyn_nft_canister_c2c_client::init_upload(collection_canister_id, &init_args).await;

    match result {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(ProxyLogoUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyLogoUploadError::UploadError(e.to_string())),
    }
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_logo_store_chunk(args: ProxyLogoStoreChunkArgs) -> ProxyLogoStoreChunkResponse {
    let collection_canister_id = validate_collection_ownership(args.collection_canister_id)?;

    let store_args = origyn_nft_canister_api::store_chunk::Args {
        file_path: args.file_path,
        chunk_id: args.chunk_id,
        chunk_data: args.chunk_data,
    };

    let result =
        origyn_nft_canister_c2c_client::store_chunk(collection_canister_id, &store_args).await;

    match result {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(ProxyLogoUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyLogoUploadError::UploadError(e.to_string())),
    }
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_logo_finalize_upload(
    args: ProxyLogoFinalizeUploadArgs,
) -> ProxyLogoFinalizeUploadResponse {
    let collection_canister_id = validate_collection_ownership(args.collection_canister_id)?;

    let finalize_args = origyn_nft_canister_api::finalize_upload::Args {
        file_path: args.file_path,
    };

    let result =
        origyn_nft_canister_c2c_client::finalize_upload(collection_canister_id, &finalize_args)
            .await;

    match result {
        Ok(Ok(resp)) => Ok(resp.url),
        Ok(Err(e)) => Err(ProxyLogoUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyLogoUploadError::UploadError(e.to_string())),
    }
}
