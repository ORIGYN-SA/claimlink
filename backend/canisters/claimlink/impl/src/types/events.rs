use crate::types::{
    collections::{CollectionMetadata, OgyChargedAmount, OgyTransferIndex},
    templates::NftTemplateId,
    wasm::WasmHash,
};
use candid::Principal;
use claimlink_api::{
    impl_storable_minicbor,
    init::InitArg,
    mint::MintRequestId,
    post_upgrade::UpgradeArgs,
};
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
    RecordedWasm(#[n(2)] WasmHash),
    #[n(3)]
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
    #[n(4)]
    CreatedCanister {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        canister_id: Principal,
    },
    #[n(5)]
    InstalledWasm {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        wasm_hash: WasmHash,
    },
    #[n(6)]
    UploadedTemplate {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        template_url: String,
    },
    #[n(7)]
    FailedInstallation {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        reason: String,
    },
    #[n(8)]
    ReimbursementRequest {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
    },
    #[n(9)]
    QuarantinedReimbursement {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[n(1)]
        reason: String,
    },
    #[n(10)]
    ReimbursedCollection {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        reimbursement_index: OgyTransferIndex,
    },
    #[n(11)]
    BurnedOGY {
        #[cbor(n(0), with = "claimlink_api::cbor::u128")]
        ogy_burn_index: OgyTransferIndex,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        burn_amount: u128,
    },
    #[n(12)]
    CreatedTemplate {
        #[n(0)]
        template_id: NftTemplateId,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        owner: Principal,
    },
    #[n(13)]
    DeletedTemplate {
        #[n(0)]
        template_id: NftTemplateId,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        owner: Principal,
    },
    #[n(14)]
    InitializeMintRequest {
        #[n(0)]
        mint_request_id: MintRequestId,
        #[cbor(n(1), with = "claimlink_api::cbor::principal")]
        owner: Principal,
        #[cbor(n(2), with = "claimlink_api::cbor::principal")]
        collection_canister_id: Principal,
        #[cbor(n(3), with = "claimlink_api::cbor::u128")]
        ogy_payment_index: OgyTransferIndex,
        #[cbor(n(4), with = "claimlink_api::cbor::u128")]
        ogy_charged: u128,
        #[n(5)]
        num_mints: u64,
        #[n(6)]
        allocated_bytes: u64,
        #[n(7)]
        created_at: TimestampNanos,
    },
    #[n(15)]
    FileUploaded {
        #[n(0)]
        mint_request_id: MintRequestId,
        #[n(1)]
        file_path: String,
        #[n(2)]
        file_url: String,
        #[n(3)]
        file_size: u64,
    },
    #[n(16)]
    NftsMinted {
        #[n(0)]
        mint_request_id: MintRequestId,
        #[n(1)]
        count: u64,
        #[n(2)]
        token_ids: Vec<u64>,
    },
    #[n(17)]
    MintRequestCompleted {
        #[n(0)]
        mint_request_id: MintRequestId,
    },
    #[n(18)]
    UpdatedOgyPrice {
        #[n(0)]
        usd_per_ogy_e8s: u64,
    },
    #[n(19)]
    MintRefundRequested {
        #[n(0)]
        mint_request_id: MintRequestId,
    },
    #[n(20)]
    MintRefunded {
        #[n(0)]
        mint_request_id: MintRequestId,
        #[cbor(n(1), with = "claimlink_api::cbor::u128")]
        refund_tx_index: u128,
    },
    #[n(21)]
    MintRefundFailed {
        #[n(0)]
        mint_request_id: MintRequestId,
        #[n(1)]
        reason: String,
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
