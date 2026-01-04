use crate::{
    state::{audit::process_event, mutate_state, read_state},
    task_manager::{
        build_origyn_nft_init_args, create_canister::create_canister_once,
        install_canister::install_canister_once,
    },
    types::events::EventType,
};

pub async fn retry_installation() {
    // todo: guard

    let (
        failed_collecctions,
        cycles_for_collection_creation,
        max_creation_retries,
        test_mode,
        wasm_hash,
    ) = read_state(|s| {
        (
            s.data.get_failed_installations(),
            s.data.cycles_management.cycles_for_collection_creation,
            s.data.max_creation_retries,
            s.env.is_test_mode(),
            s.data.origyn_nft_wasm_hash.clone(),
        )
    });

    for (ogy_payment_index, collection) in failed_collecctions {
        // check if max retry threshold has been reached
        let retries = collection.status.attempeted_retries();

        if retries > max_creation_retries {
            mutate_state(|s| {
                process_event(s, EventType::ReimbursementRequest { ogy_payment_index })
            })
        }

        // creations canister
        let canister_id =
            match create_canister_once(&collection, cycles_for_collection_creation).await {
                Ok(canister_id) => {
                    mutate_state(|s| {
                        process_event(
                            s,
                            EventType::CreatedCanister {
                                ogy_payment_index,
                                canister_id,
                            },
                        )
                    });
                    canister_id
                }
                Err(e) => {
                    mutate_state(|s| {
                        process_event(
                            s,
                            EventType::FailedInstallation {
                                ogy_payment_index,
                                reason: e.to_string(),
                                canister_id: None,
                            },
                        )
                    });
                    return;
                }
            };

        // installtion request

        let nft_init_args =
            build_origyn_nft_init_args(test_mode, &wasm_hash, collection.owner, &collection);

        match install_canister_once(&collection, &wasm_hash, &nft_init_args).await {
            Ok(()) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::InstalledWasm {
                        ogy_payment_index,
                        wasm_hash: wasm_hash.clone(),
                    },
                )
            }),
            Err(e) => {
                mutate_state(|s| {
                    process_event(
                        s,
                        EventType::FailedInstallation {
                            ogy_payment_index,
                            reason: e.to_string(),
                            canister_id: Some(canister_id),
                        },
                    )
                });
                return;
            }
        }
    }
}
