use candid::Principal;
use claimlink_api::{impl_storable_minicbor, init::InitArg};
use minicbor::{Decode, Encode};
use types::TimestampNanos;

use crate::types::{
    collections::{CollectionMetadata, OgyTransferIndex},
    wasm::WasmHash,
};

/// The event describing the  canister state transition.
#[derive(Clone, Debug, Encode, Decode, PartialEq, Eq)]
pub enum EventType {
    #[n(0)]
    Init(#[n(0)] InitArg),
    #[n(1)]
    Upgrade(),
    #[n(2)]
    CreateCollectionRequest {
        #[n(0)]
        metadata: CollectionMetadata,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(2)]
        created_at: TimestampNanos,
    },
    #[n(3)]
    CreatedCansiter {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        canister_id: Principal,
    },
    #[n(3)]
    InstalledWasm {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        wasm_hash: WasmHash,
    },
}

#[derive(Encode, Decode, Debug, PartialEq, Eq)]
pub struct Event {
    /// The canister time at which the canister generated this event.
    #[n(0)]
    pub timestamp: u64,
    /// The event type.
    #[n(1)]
    pub payload: EventType,
}

impl_storable_minicbor!(Event);
