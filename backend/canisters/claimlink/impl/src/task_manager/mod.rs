use std::fmt::Debug;
use std::vec;

use candid::{CandidType, Encode, Principal};
use ic_cdk::call::Error as CallError;
use ic_cdk::management_canister::{
    create_canister_with_extra_cycles, install_code, CanisterInstallMode, CanisterSettings,
    CreateCanisterArgs, InstallCodeArgs,
};

use icrc_ledger_types::icrc2::transfer_from::TransferFromError;
use tracing::{error, info};

use crate::types::wasm::WasmHash;

pub mod create_canister;
pub mod install_canister;
pub mod reimburse_ogy;

#[derive(Clone, Debug)]
pub enum TaskError {
    CanisterCreationError(CallError),
    InstallCodeError(CallError),
    CanisterStatusError(CallError),
    WasmHashNotFound(WasmHash),
    InterCanisterCallError(CallError),
    CanisterCallError(String),
    InsufficientCyclesToTopUp { required: u128, available: u128 },
    ReimbursementError(TransferFromError),
}
