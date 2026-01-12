use std::vec;

use candid::Principal;
use ic_canister_log::log;
use ic_cdk::management_canister::{
    create_canister_with_extra_cycles, CanisterSettings, CreateCanisterArgs,
};

use crate::state::audit::process_event;
use crate::state::{mutate_state, read_state};
use crate::task_manager::TaskError;
use crate::types::collections::OgyTransferIndex;
use crate::types::events::EventType;
use crate::utils::log::{DEBUG, INFO};

pub async fn create_canister_once(
    ogy_payment_index: OgyTransferIndex,
    cycles_for_canister_creation: u128,
) -> Result<Principal, TaskError> {
    // check if the canister id already exists
    if let Some(canister_id) = read_state(|s| s.data.get_collection_canister_id(ogy_payment_index))
    {
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
            log!(
                INFO,
                "created canister for {:?} for transfer index {}",
                canister_id_record.canister_id.to_text(),
                ogy_payment_index
            );

            mutate_state(|s| {
                process_event(
                    s,
                    EventType::CreatedCanister {
                        ogy_payment_index,
                        canister_id: canister_id_record.canister_id,
                    },
                )
            });
            canister_id_record.canister_id
        }
        Err(error) => {
            log!(
                DEBUG,
                "failed to create canister collection for transfer index {:?}: {}",
                ogy_payment_index,
                error
            );
            mutate_state(|s| {
                process_event(
                    s,
                    EventType::FailedInstallation {
                        ogy_payment_index,
                        reason: error.to_string(),
                    },
                )
            });
            return Err(TaskError::CanisterCreationError(error));
        }
    };

    Ok(canister_id)
}
