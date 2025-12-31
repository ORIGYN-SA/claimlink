use bity_ic_canister_time::timestamp_nanos;
use candid::Nat;
use icrc_ledger_types::icrc1::account::Account;

use crate::{
    state::read_state,
    task_manager::TaskError,
    types::collections::{CollectionRequest, OgyTransferIndex},
};

pub async fn reimburse_ogy(collection: &CollectionRequest) -> Result<OgyTransferIndex, TaskError> {
    let (ledger_id, ogy_transfer_fee) =
        read_state(|s| (s.data.ledger_canister_id, s.data.ogy_transfer_fee));

    let reimburse_amount = collection.ogy_charged.wrapping_sub(ogy_transfer_fee);

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
        amount: Nat::from(reimburse_amount),
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

    let response =
        icrc_ledger_canister_c2c_client::icrc2_transfer_from(ledger_id, &transfer_from_args)
            .await
            .map_err(|e| TaskError::CanisterCallError(e.to_string()))?;

    let ogy_payment_index: OgyTransferIndex = match response {
        icrc_ledger_canister::icrc2_transfer_from::Response::Ok(index) => {
            index.0.try_into().unwrap()
        }
        icrc_ledger_canister::icrc2_transfer_from::Response::Err(e) => {
            return Err(TaskError::ReimbursementError(e))
        }
    };

    Ok(ogy_payment_index)
}
