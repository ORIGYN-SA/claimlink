use std::fmt::Debug;

use candid::{CandidType, Encode, Principal};
use ic_cdk::management_canister::{install_code, CanisterInstallMode, InstallCodeArgs};

use tracing::{error, info};

use crate::state::audit::process_event;
use crate::state::{mutate_state, read_state};
use crate::storage::read_stable_storage;
use crate::task_manager::TaskError;
use crate::types::collections::OgyTransferIndex;
use crate::types::events::EventType;
use crate::types::wasm::WasmHash;

pub async fn install_canister_once<I>(
    ogy_payment_index: OgyTransferIndex,
    canister_id: Principal,
    wasm_hash: &WasmHash,
    init_args: &I,
) -> Result<(), TaskError>
where
    I: Debug + CandidType,
{
    // check if collection is already installed
    if read_state(|s| s.data.is_collection_installed(ogy_payment_index)) {
        return Ok(());
    }

    let wasm = match read_stable_storage(|s| s.get_wasm(wasm_hash)) {
        Some(wasm) => wasm,
        None => {
            error!(
                "ERROR: failed to install canister for ogy transfer index {} at '{}': wasm hash {:?} not found",
                ogy_payment_index,
                canister_id,
                wasm_hash
            );
            return Err(TaskError::WasmHashNotFound(*wasm_hash));
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
                "successfully installed canister for ogy transfer index {} at '{}' with init args {:?}",
                ogy_payment_index,
                canister_id,
                init_args
            );

            mutate_state(|s| {
                process_event(
                    s,
                    EventType::InstalledWasm {
                        ogy_payment_index,
                        wasm_hash: wasm_hash.clone(),
                    },
                )
            })
        }
        Err(e) => {
            error!(
                "failed to install canister for ogy transfer index {} at '{}' with init args {:?}: {}",
                ogy_payment_index,
                canister_id,
                init_args,
                e
            );
            mutate_state(|s| {
                process_event(
                    s,
                    EventType::FailedInstallation {
                        ogy_payment_index,
                        reason: e.to_string(),
                    },
                )
            });
            return Err(TaskError::InstallCodeError(e));
        }
    };

    Ok(())
}
