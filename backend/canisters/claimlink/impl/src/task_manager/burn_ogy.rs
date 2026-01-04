use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
};
use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
use icrc_ledger_types::icrc1::account::Account;
use tracing::{error, info};

pub async fn burn_ogy() {
    // timer guard
    let _ = TimerGuard::new(TaskType::BurnOGY);

    let (bank_principal, ledger_id, ogy_to_burn, origyn_transfer_fee) = read_state(|s| {
        (
            s.data.bank_principal_id,
            s.data.ledger_canister_id,
            s.data.ogy_to_burn,
            s.data.ogy_transfer_fee,
        )
    });

    if ogy_to_burn == 0 || ogy_to_burn < origyn_transfer_fee {
        return;
    }

    // Transfer OGY from claimlink canister to the bank principal to be burned
    info!("Processing to burn {ogy_to_burn} OGY");

    let transfer_args = icrc_ledger_types::icrc1::transfer::TransferArg {
        to: Account {
            owner: bank_principal,
            subaccount: None,
        },
        amount: Nat::from(ogy_to_burn),
        fee: None,
        memo: Some(icrc_ledger_types::icrc1::transfer::Memo::from(
            format!("Burn OGY").into_bytes(),
        )),
        created_at_time: Some(timestamp_nanos()),
        from_subaccount: None,
    };

    let transfer_result =
        match icrc_ledger_canister_c2c_client::icrc1_transfer(ledger_id, &transfer_args).await {
            Ok(result) => result,
            Err(e) => {
                error!("Failed to burn {} OGY: {e}", ogy_to_burn);
                return;
            }
        };

    match transfer_result {
        Ok(burn_index) => mutate_state(|s| {
            info!("Burned {ogy_to_burn} OGY with index {burn_index}");
            process_event(
                s,
                EventType::BurnedOGY {
                    ogy_burn_index: burn_index.0.try_into().unwrap(),
                    burn_amount: ogy_to_burn,
                },
            )
        }),
        Err(e) => {
            error!("Failed to burn {} OGY: {e}", ogy_to_burn);
            return;
        }
    }
}
