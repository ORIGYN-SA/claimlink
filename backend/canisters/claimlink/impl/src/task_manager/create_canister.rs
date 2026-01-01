use std::vec;

use candid::Principal;
use ic_cdk::management_canister::{
    create_canister_with_extra_cycles, CanisterSettings, CreateCanisterArgs,
};

use tracing::{error, info};

use crate::task_manager::TaskError;
use crate::types::collections::CollectionRequest;

pub async fn create_canister_once(
    collection: &CollectionRequest,
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
