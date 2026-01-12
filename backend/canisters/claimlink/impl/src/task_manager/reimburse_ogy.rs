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

    let (reimbursements, ledger_id, ogy_transfer_fee) = read_state(|s| {
        (
            s.data.get_reimbusements(),
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

        let reimbusement_amount = collection.ogy_charged.wrapping_sub(ogy_transfer_fee);

        // Transfer OGY from claimlink canister to the collection owner as a refund
        let transfer_args = icrc_ledger_types::icrc1::transfer::TransferArg {
            to: Account {
                owner: collection.owner,
                subaccount: None,
            },
            amount: Nat::from(reimbusement_amount),
            fee: Some(Nat::from(ogy_transfer_fee)),
            memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
                format!("Collection reimbursement: {}", collection.metadata.symbol).into_bytes(),
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
}
