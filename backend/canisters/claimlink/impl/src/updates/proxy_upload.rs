use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
};
use candid::Nat;
use claimlink_api::errors::ProxyUploadError;
pub use claimlink_api::updates::proxy_upload::{
    finalize::{Args as ProxyFinalizeUploadArgs, Response as ProxyFinalizeUploadResponse},
    init::{Args as ProxyInitUploadArgs, Response as ProxyInitUploadResponse},
    store::{Args as ProxyStoreChunkArgs, Response as ProxyStoreChunkResponse},
};
use utils::env::Environment;

/// Validate mint request ownership and active status. Returns collection_canister_id.
fn validate_mint_request(mint_request_id: u64) -> Result<candid::Principal, ProxyUploadError> {
    read_state(|s| {
        let caller = s.env.caller();
        let request = s
            .data
            .get_mint_request(mint_request_id)
            .ok_or(ProxyUploadError::MintRequestNotFound)?;

        if request.owner != caller {
            return Err(ProxyUploadError::Unauthorized);
        }

        if !request.is_active() {
            return Err(ProxyUploadError::MintRequestNotActive);
        }

        Ok(request.collection_canister_id)
    })
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_init_upload(args: ProxyInitUploadArgs) -> ProxyInitUploadResponse {
    let collection_canister_id = validate_mint_request(args.mint_request_id)?;

    // Check byte limit
    read_state(|s| {
        let request = s.data.get_mint_request(args.mint_request_id).unwrap();
        if !request.can_upload(args.file_size) {
            return Err(ProxyUploadError::ByteLimitExceeded {
                allocated: Nat::from(request.allocated_bytes),
                used: Nat::from(request.bytes_uploaded),
                requested: Nat::from(args.file_size),
            });
        }
        Ok(())
    })?;

    // Forward init_upload to collection canister
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
        Ok(Err(e)) => Err(ProxyUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyUploadError::UploadError(e.to_string())),
    }
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_store_chunk(args: ProxyStoreChunkArgs) -> ProxyStoreChunkResponse {
    let collection_canister_id = validate_mint_request(args.mint_request_id)?;

    let chunk_len = args.chunk_data.len() as u64;

    // Check byte limit
    read_state(|s| {
        let request = s.data.get_mint_request(args.mint_request_id).unwrap();
        if !request.can_upload(chunk_len) {
            return Err(ProxyUploadError::ByteLimitExceeded {
                allocated: Nat::from(request.allocated_bytes),
                used: Nat::from(request.bytes_uploaded),
                requested: Nat::from(chunk_len),
            });
        }
        Ok(())
    })?;

    // Forward store_chunk to collection canister
    let store_args = origyn_nft_canister_api::store_chunk::Args {
        file_path: args.file_path,
        chunk_id: args.chunk_id,
        chunk_data: args.chunk_data,
    };

    let result =
        origyn_nft_canister_c2c_client::store_chunk(collection_canister_id, &store_args).await;

    match result {
        Ok(Ok(_)) => {
            // Update bytes_uploaded in state (no event for individual chunks)
            mutate_state(|s| {
                s.data
                    .record_bytes_uploaded(args.mint_request_id, chunk_len);
            });
            Ok(())
        }
        Ok(Err(e)) => Err(ProxyUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyUploadError::UploadError(e.to_string())),
    }
}

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn proxy_finalize_upload(args: ProxyFinalizeUploadArgs) -> ProxyFinalizeUploadResponse {
    let collection_canister_id = validate_mint_request(args.mint_request_id)?;

    let file_path = args.file_path;

    // Forward finalize_upload to collection canister
    let finalize_args = origyn_nft_canister_api::finalize_upload::Args {
        file_path: file_path.clone(),
    };

    let result =
        origyn_nft_canister_c2c_client::finalize_upload(collection_canister_id, &finalize_args)
            .await;

    match result {
        Ok(Ok(resp)) => {
            let file_size = read_state(|s| {
                s.data
                    .get_mint_request(args.mint_request_id)
                    .unwrap()
                    .bytes_uploaded
            });

            let file_url = resp.url;

            mutate_state(|s| {
                process_event(
                    s,
                    EventType::FileUploaded {
                        mint_request_id: args.mint_request_id,
                        file_path,
                        file_url: file_url.clone(),
                        file_size,
                    },
                );
            });

            Ok(file_url)
        }
        Ok(Err(e)) => Err(ProxyUploadError::UploadError(format!("{e:?}"))),
        Err(e) => Err(ProxyUploadError::UploadError(e.to_string())),
    }
}
