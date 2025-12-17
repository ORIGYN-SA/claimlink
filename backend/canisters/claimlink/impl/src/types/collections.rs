use candid::Principal;
use minicbor::{Decode, Encode};
use types::TimestampNanos;

use super::canister::Canister;

#[derive(Debug, Encode, Decode, Clone)]
pub struct Collection {
    #[cbor(n(0), with = "crate::cbor::principal")]
    pub creator: Principal,
    #[n(1)]
    pub name: String,
    #[n(2)]
    pub symbol: Option<String>,
    #[n(3)]
    pub description: Option<String>,
    #[n(4)]
    pub logo: Option<String>,
    #[n(5)]
    pub nft_template: Option<Vec<u8>>,
    #[n(6)]
    pub canister: Option<Canister>,
    #[n(7)]
    pub ogy_transfer_index: u64,
    #[n(8)]
    pub created_at: TimestampNanos,
}
