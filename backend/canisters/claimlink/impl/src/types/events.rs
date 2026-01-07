use crate::types::{
    collections::{CollectionMetadata, OgyChargedAmount, OgyTransferIndex},
    templates::NftTemplateId,
    wasm::WasmHash,
};
use candid::Principal;
use claimlink_api::{impl_storable_minicbor, init::InitArg, post_upgrade::UpgradeArgs};
use minicbor::{Decode, Encode};
use types::TimestampNanos;

/// The event describing the  canister state transition.
#[derive(Clone, Debug, Encode, Decode, PartialEq, Eq)]
pub enum EventType {
    #[n(0)]
    Init(#[n(0)] InitArg),
    #[n(1)]
    Upgrade(#[n(1)] UpgradeArgs),
    #[n(2)]
    CreateCollectionRequest {
        #[n(0)]
        metadata: CollectionMetadata,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(2), with = "claimlink_api::cbor::u128")]
        ogy_charged: OgyChargedAmount,
        #[n(3)]
        created_at: TimestampNanos,
        #[cbor(n(4), with = "claimlink_api::cbor::principal")]
        owner: Principal,
    },
    #[n(3)]
    CreatedCanister {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        canister_id: Principal,
    },
    #[n(4)]
    InstalledWasm {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        wasm_hash: WasmHash,
    },
    #[n(5)]
    UploadedTemplate {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
    },
    #[n(6)]
    FailedInstallation {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        reason: String,
    },
    #[n(7)]
    ReimbursementRequest {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
    },
    #[n(8)]
    QuarantinedReimbursement {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        reason: String,
    },
    #[n(9)]
    ReimbursedCollection {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        reimbursement_index: OgyTransferIndex,
    },
    #[n(10)]
    BurnedOGY {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_burn_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        burn_amount: u128,
    },
    #[n(11)]
    CreatedTemplate {
        #[n(0)]
        template_id: NftTemplateId,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        owner: Principal,
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
