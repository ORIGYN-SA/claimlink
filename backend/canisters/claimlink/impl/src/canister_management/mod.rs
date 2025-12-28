use std::fmt::Debug;
use std::vec;

use candid::{CandidType, Encode, Principal};
use claimlink_api::collection_exists;
use ic_cdk::call::Error as CallError;
use ic_cdk::management_canister::{
    create_canister_with_extra_cycles, install_code, CanisterInstallMode, CanisterSettings,
    CreateCanisterArgs, InstallCodeArgs,
};

use tracing::{error, info};

use crate::storage::read_stable_storage;
use crate::types::collections::CollectionRequest;
use crate::types::wasm::WasmHash;

#[derive(Clone, Debug)]
pub enum TaskError {
    CanisterCreationError(CallError),
    InstallCodeError(CallError),
    CanisterStatusError(CallError),
    WasmHashNotFound(WasmHash),
    InterCanisterCallError(CallError),
    InsufficientCyclesToTopUp { required: u128, available: u128 },
}

async fn create_canister_once(
    collection: CollectionRequest,
    cycles_for_canister_creation: u128,
) -> Result<Principal, TaskError> {
    // check if the canister already exists
    if let Some(canister_id) = collection.status.canister_id() {
        return Ok(canister_id);
    }

    // request to create a canister with extera cycles
    let canister_id = match create_canister_with_extra_cycles(
        &CreateCanisterArgs {
            settings: Some(CanisterSettings {
                controllers: Some(vec![ic_cdk::api::canister_self()]),
                ..Default::default()
            }),
        },
        cycles_for_canister_creation,
    )
    .await
    {
        Ok(canister_id_record) => {
            info!(
                "created {} canister for {:?} with transfer index {}",
                canister_id_record.canister_id.to_text(),
                &collection.metadata.name,
                &collection.ogy_payment_index
            );

            canister_id_record.canister_id
        }
        Err(error) => {
            error!(
                "failed to create {} collection with transfer index {:?}: {}",
                collection.metadata.name, collection.ogy_payment_index, error
            );
            return Err(TaskError::CanisterCreationError(error));
        }
    };

    // event management
    //mutate_state(|s| s.record_created_canister::<C>(token, canister_id));
    Ok(canister_id)
}

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
