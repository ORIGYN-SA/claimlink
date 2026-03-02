use crate::{cycles::CyclesManagement, pricing::MintPricingConfig};
use candid::{CandidType, Nat, Principal};
use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, CandidType, Encode, Decode, Clone, Debug, PartialEq, Eq)]
pub struct InitArg {
    #[n(0)]
    pub test_mode: bool,
    #[n(1)]
    pub commit_hash: String,
    #[cbor(n(2), with = "crate::cbor::principal")]
    pub ledger_canister_id: Principal,
    #[n(3)]
    pub authorized_principals: Vec<AuthordiedPrincipal>,
    #[cbor(n(4), with = "crate::cbor::principal")]
    pub bank_principal_id: Principal,
    #[n(5)]
    pub cycles_management: CyclesManagement,
    #[cbor(n(6), with = "crate::cbor::nat")]
    // amount of OGY to charge per collection
    pub collection_request_fee: Nat,
    #[cbor(n(7), with = "crate::cbor::nat")]
    pub ogy_transfer_fee: Nat,
    #[cbor(n(8), with = "crate::cbor::nat")]
    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: Nat,
    #[cbor(n(9), with = "crate::cbor::nat")]
    pub max_template_per_owner: Nat,
    #[n(10)]
    pub base_url: Option<String>,
    #[n(11)]
    pub mint_pricing: Option<MintPricingConfig>,
    /// kept here to keep the canister event state backward compatible but not used anymore
    #[cbor(n(12), with = "crate::cbor::principal::option")]
    pub icpswap_pool_canister_id: Option<Principal>,
    #[cbor(n(13), with = "crate::cbor::principal::option")]
    pub kongswap_canister_id: Option<Principal>,
}

#[derive(Deserialize, CandidType, Encode, Decode, PartialEq, Eq, Debug, Clone, Serialize)]
pub struct AuthordiedPrincipal {
    #[n(0)]
    pub name: String,
    #[cbor(n(1), with = "crate::cbor::principal")]
    pub principal: Principal,
}
