use candid::{CandidType, Nat, Principal};
use minicbor::{Decode, Encode};
use serde::Deserialize;

use crate::cycles::CyclesManagement;

#[derive(Deserialize, CandidType, Encode, Decode, Clone, Debug, PartialEq, Eq)]
pub struct InitArg {
    #[n(0)]
    pub test_mode: bool,
    #[cbor(n(1), with = "crate::cbor::principal")]
    pub ledger_canister_id: Principal,
    #[n(2)]
    pub authorized_principals: Vec<AuthordiedPrincipal>,
    #[cbor(n(3), with = "crate::cbor::principal")]
    pub bank_principal_id: Principal,
    #[n(4)]
    pub cycles_management: CyclesManagement,
    #[cbor(n(5), with = "crate::cbor::nat")]
    // amount of OGY to charge per collection
    pub collection_request_fee: Nat,
    #[cbor(n(6), with = "crate::cbor::nat")]
    pub ogy_transfer_fee: Nat,
    #[cbor(n(7), with = "crate::cbor::nat")]
    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: Nat,
    #[cbor(n(8), with = "crate::cbor::nat")]
    pub max_template_per_owner: Nat,
}

#[derive(Deserialize, CandidType, Encode, Decode, Clone, Debug, PartialEq, Eq)]
pub struct UpgradeArg {
    #[n(0)]
    pub origyn_nft_wasm_hash: String,
    #[cbor(n(1), with = "crate::cbor::principal")]
    pub bank_principal_id: Principal,
    #[n(2)]
    pub cycles_management: CyclesManagement,
    #[cbor(n(3), with = "crate::cbor::nat")]
    // amount of OGY to charge per collection
    pub collection_request_fee: Nat,
    #[cbor(n(4), with = "crate::cbor::nat")]
    pub ogy_transfer_fee: Nat,
    #[cbor(n(5), with = "crate::cbor::nat")]
    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: Nat,
    #[cbor(n(6), with = "crate::cbor::nat")]
    pub max_template_per_owner: Nat,
}

#[derive(Deserialize, CandidType)]
pub enum ClaimlinkArgs {
    InitArg(InitArg),
    UpgradeArg(UpgradeArg),
}

#[derive(Deserialize, CandidType, Encode, Decode, PartialEq, Eq, Debug, Clone)]
pub struct AuthordiedPrincipal {
    #[n(0)]
    pub name: String,
    #[cbor(n(1), with = "crate::cbor::principal")]
    pub principal: Principal,
}
