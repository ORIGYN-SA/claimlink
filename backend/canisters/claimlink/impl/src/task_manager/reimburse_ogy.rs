use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
use icrc_ledger_canister::icrc2_transfer_from;
use icrc_ledger_types::icrc1::account::Account;

use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    types::{collections::CollectionRequest, events::EventType},
};

pub async fn reimburse_failed_collections(collection: &CollectionRequest) {
    // timer guard
    let _ = TimerGuard::new(TaskType::Reimbursement);

    let (reimbursements, ledger_id, ogy_transfer_fee) = read_state(|s| {
        (
            s.data.get_reimbusements(),
            s.data.ledger_canister_id,
            s.data.ogy_transfer_fee,
        )
    });

    for ogy_payment_index in reimbursements {
        let reimbusement_amount = read_state(|s| {
            s.data
                .get_collection(ogy_payment_index)
                .expect("BUG: Collection should be available at this point")
                .ogy_charged
        })
        .wrapping_sub(ogy_transfer_fee);

        // Transfer OGY into claimlink as a temporary vault to refund user in case of a failure
        let transfer_from_args = icrc_ledger_types::icrc2::transfer_from::TransferFromArgs {
            spender_subaccount: None,
            from: Account {
                owner: collection.owner,
                subaccount: None,
            },
            to: Account {
                owner: ic_cdk::api::canister_self(),
                subaccount: None,
            },
            amount: Nat::from(reimbusement_amount),
            fee: Some(Nat::from(ogy_transfer_fee)),
            memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
                format!(
                    "Collection request reimbursement: {}",
                    collection.metadata.symbol
                )
                .into_bytes(),
            )),
            created_at_time: Some(timestamp_nanos()),
        };

        let transfer_result = match icrc_ledger_canister_c2c_client::icrc2_transfer_from(
            ledger_id,
            &transfer_from_args,
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
            icrc2_transfer_from::Response::Ok(index) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::ReimbursedCollection {
                        ogy_payment_index,
                        reimbursement_index: index.0.try_into().unwrap(),
                    },
                )
            }),
            icrc2_transfer_from::Response::Err(transfer_from_error) => mutate_state(|s| {
                process_event(
                    s,
                    EventType::QuarantinedReimbursement {
                        ogy_payment_index,
                        reason: transfer_from_error.to_string(),
                    },
                )
            }),
        }
    }
}
