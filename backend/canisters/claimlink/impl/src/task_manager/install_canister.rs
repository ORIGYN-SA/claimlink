use std::fmt::Debug;

use candid::{CandidType, Encode};
use ic_cdk::management_canister::{install_code, CanisterInstallMode, InstallCodeArgs};

use tracing::{error, info};

use crate::storage::read_stable_storage;
use crate::task_manager::TaskError;
use crate::types::collections::CollectionRequest;
use crate::types::wasm::WasmHash;

async fn install_canister_once<I>(
    collection: &CollectionRequest,
    wasm_hash: &WasmHash,
    init_args: &I,
) -> Result<(), TaskError>
where
    I: Debug + CandidType,
{
    if collection.status.is_installed() {
        return Ok(());
    }

    let canister_id = match collection.status.canister_id() {
        None => {
            panic!(
                "BUG: {} canister with ogy transfer index {} is not yet created",
                collection.metadata.name, collection.ogy_payment_index
            )
        }
        Some(canister_id) => canister_id,
    };

    let wasm = match read_stable_storage(|s| s.get_wasm(wasm_hash)) {
        Some(wasm) => wasm,
        None => {
            error!(
                "ERROR: failed to install {} canister with ogy transfer index {} at '{}': wasm hash {:?} not found",
                collection.metadata.name,
                collection.ogy_payment_index,
                canister_id,
                wasm_hash
            );
            return Err(TaskError::WasmHashNotFound(wasm_hash.clone()));
        }
    };

    match install_code(&InstallCodeArgs {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: wasm.to_bytes(),
        arg: Encode!(init_args).expect("BUG: failed to encode init arg"),
    })
    .await
    {
        Ok(_) => {
            info!(
                "successfully installed {} canister with ogy transfer index {} at '{}' with init args {:?}",
                collection.metadata.name,
                collection.ogy_payment_index,
                canister_id,
                init_args
            );
        }
        Err(e) => {
            error!(
                "failed to install {} canister with ogy transfer index {} at '{}' with init args {:?}: {}",
                collection.metadata.name,
                collection.ogy_payment_index,
                canister_id,
                init_args,
                e
            );
            return Err(TaskError::InstallCodeError(e));
        }
    };

    // event management
    //mutate_state(|s| s.record_created_canister::<C>(token, canister_id));

    Ok(())
}
