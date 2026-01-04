use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    task_manager::{
        build_origyn_nft_init_args, create_canister::create_canister_once,
        install_canister::install_canister_once,
    },
    types::events::EventType,
};

pub async fn retry_installation() {
    // gaurd
    let _gaurd = TimerGuard::new(TaskType::RetryFailedInstallation);

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
            match create_canister_once(ogy_payment_index, cycles_for_collection_creation).await {
                Ok(canister_id) => canister_id,
                Err(e) => {
                    continue;
                }
            };

        // installtion request

        let nft_init_args = build_origyn_nft_init_args(
            test_mode,
            &wasm_hash,
            collection.owner,
            &collection.metadata,
        );

        let _ =
            install_canister_once(ogy_payment_index, canister_id, &wasm_hash, &nft_init_args).await;
    }
}
