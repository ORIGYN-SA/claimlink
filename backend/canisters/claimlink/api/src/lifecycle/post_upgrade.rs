use crate::{cycles::CyclesManagement, init::AuthordiedPrincipal, pricing::MintPricingConfig};
use bity_ic_types::BuildVersion;
use candid::{CandidType, Nat, Principal};
use minicbor::{Decode, Encode};
use serde::Deserialize;

#[derive(Deserialize, CandidType, Encode, Decode, Clone, Debug, PartialEq, Eq)]
pub struct UpgradeArgs {
    #[cbor(n(0), with = "crate::cbor::build_version")]
    pub build_version: BuildVersion,
    #[n(1)]
    pub commit_hash: String,
    #[n(2)]
    pub origyn_nft_wasm_hash: Option<String>,
    #[cbor(n(3), with = "crate::cbor::principal::option")]
    pub bank_principal_id: Option<Principal>,
    #[n(4)]
    pub cycles_management: Option<CyclesManagement>,
    #[cbor(n(5), with = "crate::cbor::nat::option")]
    // amount of OGY to charge per collection
    pub collection_request_fee: Option<Nat>,
    #[cbor(n(6), with = "crate::cbor::nat::option")]
    pub ogy_transfer_fee: Option<Nat>,
    #[cbor(n(7), with = "crate::cbor::nat::option")]
    /// creatio retry attampts after a failed collection creation
    pub max_creation_retries: Option<Nat>,
    #[cbor(n(8), with = "crate::cbor::nat::option")]
    pub max_template_per_owner: Option<Nat>,
    #[n(9)]
    pub new_authorized_principals: Option<Vec<AuthordiedPrincipal>>,
    #[cbor(n(10), with = "crate::cbor::principal::option")]
    pub ledger_canister_id: Option<Principal>,
    #[n(11)]
    pub mint_pricing: Option<MintPricingConfig>,
    // kept here to keep the canister event state backward compatible but not used anymore
    #[cbor(n(12), with = "crate::cbor::principal::option")]
    pub icpswap_pool_canister_id: Option<Principal>,
    #[cbor(n(13), with = "crate::cbor::principal::option")]
    pub kongswap_canister_id: Option<Principal>,
}
