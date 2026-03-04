use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
    utils::log::DEBUG,
};
use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
use ic_canister_log::log;
use icrc_ledger_canister::icrc1_transfer;
use icrc_ledger_types::icrc1::account::Account;

pub async fn process_reimbursements() {
    // timer guard
    let _ = match TimerGuard::new(TaskType::Reimbursement) {
        Ok(guard) => guard,
        Err(e) => {
            log!(DEBUG, "Failed retrieving reimbursement guard: {e:?}",);
            return;
        }
    };

    mutate_state(|s| {
        s.data
            .timer_last_run
            .insert(TaskType::Reimbursement, ic_cdk::api::time())
    });

    let (reimbursements, mint_refunds, ledger_id, ogy_transfer_fee) = read_state(|s| {
        (
            s.data.get_reimbusements(),
            s.data.get_mint_refund_queue(),
            s.data.ledger_canister_id,
            s.data.ogy_transfer_fee,
        )
    });

    for ogy_payment_index in reimbursements {
        let collection = read_state(|s| {
            s.data
                .get_collection(ogy_payment_index)
                .expect("BUG: Collection should be available at this point")
                .clone()
        });

        // check if the charged amount is less than transfer fee to prevent wrapping and panics.
        let reimbusement_amount = match collection.ogy_charged.checked_sub(ogy_transfer_fee) {
            Some(amount) => amount,
            None => {
                mutate_state(|s| {
                    process_event(
                        s,
                        EventType::QuarantinedReimbursement {
                            ogy_payment_index,
                            reason:
                                "Reimbursement amount underflow: ogy_charged < ogy_transfer_fee"
                                    .to_string(),
                        },
                    )
                });
                continue;
            }
        };

        // Transfer OGY from claimlink canister to the collection owner as a refund
        let transfer_args = icrc_ledger_types::icrc1::transfer::TransferArg {
            to: Account {
                owner: collection.owner,
                subaccount: None,
            },
            amount: Nat::from(reimbusement_amount),
            fee: Some(Nat::from(ogy_transfer_fee)),
            memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
                format!("Collection reimbursement: {}", collection.ogy_payment_index).into_bytes(),
            )),
            created_at_time: Some(timestamp_nanos()),
            from_subaccount: None,
        };

        let transfer_result = match icrc_ledger_canister_c2c_client::icrc1_transfer(
            ledger_id,
            &transfer_args,
        )
        .await
        {
            Ok(result) => result,
            Err(e) => {
                mutate_state(|s| {
                    process_event(
                        s,
                        EventType::QuarantinedReimbursement {
                            ogy_payment_index,
                            reason: e.to_string(),
                        },
                    )
                });
                continue;
            }
        };

        match transfer_result {
            icrc1_transfer::Response::Ok(index) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::ReimbursedCollection {
                        ogy_payment_index,
                        reimbursement_index: index.0.try_into().unwrap(),
                    },
                )
            }),
            icrc1_transfer::Response::Err(transfer_error) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::QuarantinedReimbursement {
                        ogy_payment_index,
                        reason: transfer_error.to_string(),
                    },
                )
            }),
        }
    }

    // Process mint refund queue
    for mint_request_id in mint_refunds {
        let (owner, ogy_charged) = match read_state(|s| {
            s.data.get_mint_request(mint_request_id).map(|r| (r.owner, r.ogy_charged))
        }) {
            Some(data) => data,
            None => continue,
        };

        let refund_amount = ogy_charged.saturating_sub(ogy_transfer_fee);

        let transfer_args = icrc_ledger_types::icrc1::transfer::TransferArg {
            to: Account {
                owner,
                subaccount: None,
            },
            amount: Nat::from(refund_amount),
            fee: Some(Nat::from(ogy_transfer_fee)),
            memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
                format!("Mint refund: {}", mint_request_id).into_bytes(),
            )),
            created_at_time: Some(timestamp_nanos()),
            from_subaccount: None,
        };

        let transfer_result = match icrc_ledger_canister_c2c_client::icrc1_transfer(
            ledger_id,
            &transfer_args,
        )
        .await
        {
            Ok(result) => result,
            Err(e) => {
                mutate_state(|s| {
                    process_event(
                        s,
                        EventType::MintRefundFailed {
                            mint_request_id,
                            reason: e.to_string(),
                        },
                    )
                });
                continue;
            }
        };

        match transfer_result {
            icrc1_transfer::Response::Ok(index) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::MintRefunded {
                        mint_request_id,
                        refund_tx_index: index.0.try_into().unwrap(),
                    },
                )
            }),
            icrc1_transfer::Response::Err(transfer_error) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::MintRefundFailed {
                        mint_request_id,
                        reason: transfer_error.to_string(),
                    },
                )
            }),
        }
    }
}
