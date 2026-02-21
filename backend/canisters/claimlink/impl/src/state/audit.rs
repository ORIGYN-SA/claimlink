use crate::{
    state::RuntimeState,
    storage::events::{record_event, with_event_iter},
    types::events::{Event, EventType},
};

/// Updates the state to reflect the given state transition.
// public because it's used in tests since process_event
// requires canister infrastructure to retrieve time
pub fn apply_state_transition(state: &mut RuntimeState, payload: &EventType) {
    match payload {
        EventType::Init(init_arg) => {
            panic!("state re-initialization is not allowed: {init_arg:?}");
        }
        EventType::Upgrade(upgrade_args) => state
            .upgrade(upgrade_args.clone())
            .expect("applying upgrade event should succeed"),
        EventType::RecordedWasm(wasm_hash) => state.data.origyn_nft_wasm_hash = *wasm_hash,
        EventType::CreateCollectionRequest {
            metadata,
            ogy_payment_index,
            created_at,
            ogy_charged,
            owner,
        } => state.data.record_pending_collection_request(
            metadata.clone(),
            *ogy_payment_index,
            *ogy_charged,
            *created_at,
            *owner,
        ),
        EventType::CreatedCanister {
            ogy_payment_index,
            canister_id,
        } => {
            state
                .data
                .record_created_canister(*ogy_payment_index, *canister_id);
        }
        EventType::InstalledWasm {
            ogy_payment_index,
            wasm_hash,
        } => state
            .data
            .record_installed_canister(*ogy_payment_index, *wasm_hash),
        EventType::FailedInstallation {
            ogy_payment_index,
            reason,
        } => state
            .data
            .record_failed_installation(*ogy_payment_index, reason.to_string()),
        EventType::ReimbursementRequest { ogy_payment_index } => {
            state.data.record_reimbursement_request(*ogy_payment_index)
        }
        EventType::QuarantinedReimbursement {
            ogy_payment_index,
            reason,
        } => {
            state
                .data
                .record_quarantined_reimbursement(*ogy_payment_index, reason.to_string());
        }
        EventType::ReimbursedCollection {
            ogy_payment_index,
            reimbursement_index,
        } => state
            .data
            .record_reimbursed_colllection(*ogy_payment_index, *reimbursement_index),
        EventType::BurnedOGY {
            ogy_burn_index: _,
            burn_amount,
        } => state.data.record_ogy_burn(*burn_amount),
        EventType::CreatedTemplate { template_id, owner } => {
            state.data.record_created_template(*template_id, *owner);
        }
        EventType::UploadedTemplate {
            ogy_payment_index,
            template_url,
        } => state
            .data
            .record_uploaded_template(*ogy_payment_index, template_url.to_string()),
        EventType::DeletedTemplate { template_id, owner } => {
            state.data.record_deleted_template(*template_id, *owner)
        }
        EventType::InitializeMintRequest {
            mint_request_id: _,
            owner,
            collection_canister_id,
            ogy_payment_index,
            ogy_charged,
            num_mints,
            allocated_bytes,
            created_at,
        } => {
            state.data.record_mint_request(
                *owner,
                *collection_canister_id,
                *ogy_payment_index,
                *ogy_charged,
                *num_mints,
                *allocated_bytes,
                *created_at,
            );
        }
        EventType::FileUploaded {
            mint_request_id,
            file_path,
            file_url,
            file_size,
        } => {
            state.data.record_file_uploaded(
                *mint_request_id,
                file_path.clone(),
                file_url.clone(),
                *file_size,
            );
        }
        EventType::NftsMinted {
            mint_request_id,
            count,
            token_ids: _,
        } => {
            state.data.record_nfts_minted(*mint_request_id, *count);
        }
        EventType::MintRequestCompleted {
            mint_request_id: _,
        } => {
            // Status already updated by record_nfts_minted when count reaches num_mints
        }
        EventType::UpdatedOgyPrice { usd_per_ogy_e8s } => {
            state.data.update_ogy_price(*usd_per_ogy_e8s);
        }
        EventType::MintRefundRequested { mint_request_id } => {
            state.data.record_mint_refund_requested(*mint_request_id);
        }
        EventType::MintRefunded {
            mint_request_id,
            refund_tx_index,
        } => {
            state
                .data
                .record_mint_refunded(*mint_request_id, *refund_tx_index);
        }
        EventType::MintRefundFailed {
            mint_request_id,
            reason,
        } => {
            state
                .data
                .record_mint_refund_failed(*mint_request_id, reason.clone());
        }
    }
}

/// Records the given event payload in the event log and updates the state to reflect the change.
pub fn process_event(state: &mut RuntimeState, payload: EventType) {
    apply_state_transition(state, &payload);
    record_event(payload);
}

/// Recomputes the minter state from the event log.
///
/// # Panics
///
/// This function panics if:
///   * The event log is empty.
///   * The first event in the log is not an Init event.
///   * One of the events in the log invalidates the minter's state invariants.
pub fn replay_events() -> RuntimeState {
    with_event_iter(|iter| replay_events_internal(iter))
}

fn replay_events_internal<T: IntoIterator<Item = Event>>(events: T) -> RuntimeState {
    let mut events_iter = events.into_iter();
    let mut state = match events_iter
        .next()
        .expect("the event log should not be empty")
    {
        Event {
            payload: EventType::Init(init_arg),
            ..
        } => RuntimeState::try_from(init_arg).expect("state initialization should succeed"),
        other => panic!("the first event must be an Init event, got: {other:?}"),
    };
    for event in events_iter {
        apply_state_transition(&mut state, &event.payload);
    }
    state
}
