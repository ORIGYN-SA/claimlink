import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface ApprovalInfo {
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : bigint,
  'expires_at' : [] | [bigint],
  'spender' : Account,
}
export interface ApproveCollectionArg { 'approval_info' : ApprovalInfo }
export type ApproveCollectionError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'InvalidSpender' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export type ApproveCollectionResult = { 'Ok' : bigint } |
  { 'Err' : ApproveCollectionError };
export interface ApproveTokenArg {
  'token_id' : bigint,
  'approval_info' : ApprovalInfo,
}
export type ApproveTokenError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'InvalidSpender' : null } |
  { 'NonExistingTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export type ApproveTokenResult = { 'Ok' : bigint } |
  { 'Err' : ApproveTokenError };
export interface ArchivedBlocks {
  'args' : Array<GetBlocksRequest>,
  'callback' : [Principal, string],
}
export interface Args { 'file_path' : string }
export interface Args_1 {
  'file_hash' : string,
  'file_path' : string,
  'file_size' : bigint,
  'chunk_size' : [] | [bigint],
}
export interface Args_2 {
  'metadata' : Array<[string, ICRC3Value]>,
  'memo' : [] | [Uint8Array | number[]],
  'token_owner' : Account,
}
export interface Args_3 { 'authorized_principals' : Array<Principal> }
export interface Args_4 { 'minting_authorities' : Array<Principal> }
export interface Args_5 {
  'chunk_id' : bigint,
  'file_path' : string,
  'chunk_data' : Uint8Array | number[],
}
export interface Args_6 {
  'supply_cap' : [] | [bigint],
  'tx_window' : [] | [bigint],
  'default_take_value' : [] | [bigint],
  'max_canister_storage_threshold' : [] | [bigint],
  'logo' : [] | [string],
  'permitted_drift' : [] | [bigint],
  'name' : [] | [string],
  'description' : [] | [string],
  'max_take_value' : [] | [bigint],
  'max_update_batch_size' : [] | [bigint],
  'max_query_batch_size' : [] | [bigint],
  'max_memo_size' : [] | [bigint],
  'atomic_batch_transfers' : [] | [boolean],
  'collection_metadata' : [] | [Array<[string, CustomValue]>],
  'symbol' : [] | [string],
}
export interface Args_7 {
  'token_id' : bigint,
  'metadata' : Array<[string, CustomValue]>,
}
export type Args_8 = { 'Upgrade' : UpgradeArgs } |
  { 'Init' : InitArgs };
export interface BlockWithId { 'id' : bigint, 'block' : ICRC3Value }
export interface BuildVersion {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export type BurnNftError = { 'StorageCanisterError' : string } |
  { 'TokenDoesNotExist' : null } |
  { 'ConcurrentManagementCall' : null };
export type CancelUploadError = { 'UploadNotInitialized' : null };
export type CustomValue = { 'Int' : bigint } |
  { 'Map' : Array<[string, ICRC3Value]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<ICRC3Value> };
export interface Duration { 'secs' : bigint, 'nanos' : number }
export type FinalizeUploadError = { 'IncompleteUpload' : null } |
  { 'FileSizeMismatch' : null } |
  { 'FileHashMismatch' : null } |
  { 'UploadNotStarted' : null } |
  { 'UploadAlreadyFinalized' : null };
export interface FinalizeUploadResp { 'url' : string }
export type GetAllUploadsError = { 'StorageCanisterError' : string };
export interface GetBlocksRequest { 'start' : bigint, 'length' : bigint }
export interface GetBlocksResult {
  'log_length' : bigint,
  'blocks' : Array<BlockWithId>,
  'archived_blocks' : Array<ArchivedBlocks>,
}
export type GetUploadStatusError = { 'StorageCanisterError' : string } |
  { 'UploadNotFound' : null };
export interface ICRC3ArchiveInfo {
  'end' : bigint,
  'canister_id' : Principal,
  'start' : bigint,
}
export interface ICRC3DataCertificate {
  'certificate' : Uint8Array | number[],
  'hash_tree' : Uint8Array | number[],
}
export interface ICRC3Properties {
  'max_blocks_per_response' : bigint,
  'initial_cycles' : bigint,
  'tx_window' : Duration,
  'max_transactions_to_purge' : bigint,
  'max_memory_size_bytes' : bigint,
  'ttl_for_non_archived_transactions' : Duration,
  'max_transactions_in_window' : bigint,
  'max_unarchived_transactions' : bigint,
  'reserved_cycles' : bigint,
}
export type ICRC3Value = { 'Int' : bigint } |
  { 'Map' : Array<[string, ICRC3Value]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<ICRC3Value> };
export interface InitApprovalsArg {
  'max_approvals_per_token_or_collection' : [] | [bigint],
  'max_revoke_approvals' : [] | [bigint],
}
export interface InitArgs {
  'supply_cap' : [] | [bigint],
  'tx_window' : [] | [bigint],
  'test_mode' : boolean,
  'default_take_value' : [] | [bigint],
  'max_canister_storage_threshold' : [] | [bigint],
  'logo' : [] | [string],
  'permitted_drift' : [] | [bigint],
  'name' : string,
  'minting_authorities' : Array<Principal>,
  'description' : [] | [string],
  'authorized_principals' : Array<Principal>,
  'version' : BuildVersion,
  'max_take_value' : [] | [bigint],
  'max_update_batch_size' : [] | [bigint],
  'max_query_batch_size' : [] | [bigint],
  'commit_hash' : string,
  'max_memo_size' : [] | [bigint],
  'atomic_batch_transfers' : [] | [boolean],
  'collection_metadata' : Array<[string, CustomValue]>,
  'symbol' : string,
  'approval_init' : InitApprovalsArg,
}
export type InitUploadError = { 'NotEnoughStorage' : null } |
  { 'FileAlreadyExists' : null } |
  { 'InvalidChunkSize' : null };
export interface IsApprovedArg {
  'token_id' : bigint,
  'from_subaccount' : [] | [Uint8Array | number[]],
  'spender' : Account,
}
export type MintError = { 'TokenAlreadyExists' : null } |
  { 'StorageCanisterError' : string } |
  { 'ExceedMaxAllowedSupplyCap' : null } |
  { 'InvalidMemo' : null } |
  { 'ConcurrentManagementCall' : null };
export type RemoveAuthorizedPrincipalsError = {
    'StorageCanisterError' : string
  } |
  { 'ConcurrentManagementCall' : null };
export type RemoveMintingAuthoritiesError = {
    'StorageCanisterError' : string
  } |
  { 'ConcurrentManagementCall' : null };
export type Result = { 'Ok' : null } |
  { 'Err' : BurnNftError };
export type Result_1 = { 'Ok' : {} } |
  { 'Err' : CancelUploadError };
export type Result_10 = { 'Ok' : bigint } |
  { 'Err' : TransferError };
export type Result_11 = { 'Ok' : {} } |
  { 'Err' : InitUploadError };
export type Result_12 = { 'Ok' : bigint } |
  { 'Err' : MintError };
export type Result_13 = { 'Ok' : null } |
  { 'Err' : RemoveAuthorizedPrincipalsError };
export type Result_14 = { 'Ok' : null } |
  { 'Err' : RemoveMintingAuthoritiesError };
export type Result_15 = { 'Ok' : {} } |
  { 'Err' : StoreChunkError };
export type Result_16 = { 'Ok' : bigint } |
  { 'Err' : BurnNftError };
export type Result_2 = { 'Ok' : FinalizeUploadResp } |
  { 'Err' : FinalizeUploadError };
export type Result_3 = { 'Ok' : Array<[string, UploadState]> } |
  { 'Err' : GetAllUploadsError };
export type Result_4 = { 'Ok' : UploadState } |
  { 'Err' : GetUploadStatusError };
export type Result_5 = { 'Ok' : Array<[] | [ApproveCollectionResult]> } |
  { 'Err' : ApproveCollectionError };
export type Result_6 = { 'Ok' : Array<[] | [ApproveTokenResult]> } |
  { 'Err' : ApproveTokenError };
export type Result_7 = { 'Ok' : Array<[] | [RevokeCollectionApprovalResult]> } |
  { 'Err' : RevokeCollectionApprovalError };
export type Result_8 = { 'Ok' : Array<[] | [RevokeTokenApprovalResponse]> } |
  { 'Err' : RevokeTokenApprovalError };
export type Result_9 = { 'Ok' : Array<[] | [TransferFromResult]> } |
  { 'Err' : TransferFromError };
export interface RevokeCollectionApprovalArg {
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'spender' : [] | [Account],
}
export type RevokeCollectionApprovalError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'ApprovalDoesNotExist' : null } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export type RevokeCollectionApprovalResult = { 'Ok' : bigint } |
  { 'Err' : RevokeCollectionApprovalError };
export interface RevokeTokenApprovalArg {
  'token_id' : bigint,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'spender' : [] | [Account],
}
export type RevokeTokenApprovalError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'NonExistingTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'ApprovalDoesNotExist' : null } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export type RevokeTokenApprovalResponse = { 'Ok' : bigint } |
  { 'Err' : RevokeTokenApprovalError };
export type StoreChunkError = { 'InvalidFileHash' : null } |
  { 'InvalidFilePath' : null } |
  { 'InvalidFileSize' : null } |
  { 'InvalidChunkId' : null } |
  { 'UploadNotInitialized' : null } |
  { 'InvalidChunkData' : null } |
  { 'InvalidFileFormat' : null } |
  { 'UploadAlreadyFinalized' : null };
export interface SupportedBlockType { 'url' : string, 'block_type' : string }
export interface SupportedStandard { 'url' : string, 'name' : string }
export interface TransferArg {
  'to' : Account,
  'token_id' : bigint,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'NonExistingTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'InvalidRecipient' : null } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export interface TransferFromArg {
  'to' : Account,
  'spender_subaccount' : [] | [Uint8Array | number[]],
  'token_id' : bigint,
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'NonExistingTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'InvalidRecipient' : null } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null };
export type TransferFromResult = { 'Ok' : bigint } |
  { 'Err' : TransferFromError };
export interface UpgradeArgs {
  'version' : BuildVersion,
  'commit_hash' : string,
}
export type UploadState = { 'Init' : null } |
  { 'Finalized' : null } |
  { 'InProgress' : null };
export interface icrc21_consent_info {
  'metadata' : icrc21_consent_message_metadata,
  'consent_message' : icrc21_consent_message,
}
export interface icrc21_consent_message {
  'generic_display_message' : string,
  'fields_display_message' : icrc21_field_display_message,
}
export interface icrc21_consent_message_metadata {
  'utc_offset_minutes' : [] | [number],
  'language' : string,
}
export interface icrc21_consent_message_request {
  'arg' : Uint8Array | number[],
  'method' : string,
  'user_preferences' : icrc21_consent_message_spec,
}
export type icrc21_consent_message_response = { 'Ok' : icrc21_consent_info } |
  { 'Err' : icrc21_error };
export interface icrc21_consent_message_spec {
  'metadata' : icrc21_consent_message_metadata,
  'device_spec' : [] | [icrc21_device_spec],
}
export type icrc21_device_spec = { 'GenericDisplay' : null } |
  { 'FieldsDisplay' : null };
export type icrc21_error = { 'GenericError' : icrc21_error_info } |
  { 'InsufficientPayment' : icrc21_generic_error } |
  { 'UnsupportedCanisterCall' : icrc21_error_info } |
  { 'ConsentMessageUnavailable' : icrc21_error_info };
export interface icrc21_error_info { 'description' : string }
export interface icrc21_field_display_message {
  'fields' : Array<[string, string]>,
  'intent' : string,
}
export interface icrc21_generic_error {
  'description' : string,
  'error_code' : bigint,
}
export interface _SERVICE {
  'burn_nft' : ActorMethod<[bigint], Result>,
  'cancel_upload' : ActorMethod<[Args], Result_1>,
  'finalize_upload' : ActorMethod<[Args], Result_2>,
  'get_all_storage_subcanisters' : ActorMethod<[], Array<Principal>>,
  'get_all_uploads' : ActorMethod<[[] | [bigint], [] | [bigint]], Result_3>,
  'get_upload_status' : ActorMethod<[string], Result_4>,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc21_canister_call_consent_message' : ActorMethod<
    [icrc21_consent_message_request],
    icrc21_consent_message_response
  >,
  'icrc37_approve_collection' : ActorMethod<
    [Array<ApproveCollectionArg>],
    Result_5
  >,
  'icrc37_approve_tokens' : ActorMethod<[Array<ApproveTokenArg>], Result_6>,
  'icrc37_get_collection_approvals' : ActorMethod<
    [Account, [] | [ApproveCollectionArg], [] | [bigint]],
    Array<ApproveCollectionArg>
  >,
  'icrc37_get_token_approvals' : ActorMethod<
    [bigint, [] | [ApproveTokenArg], [] | [bigint]],
    Array<ApproveTokenArg>
  >,
  'icrc37_is_approved' : ActorMethod<[Array<IsApprovedArg>], Array<boolean>>,
  'icrc37_max_approvals_per_token_or_collection' : ActorMethod<
    [],
    [] | [bigint]
  >,
  'icrc37_max_revoke_approvals' : ActorMethod<[], [] | [bigint]>,
  'icrc37_revoke_collection_approvals' : ActorMethod<
    [Array<RevokeCollectionApprovalArg>],
    Result_7
  >,
  'icrc37_revoke_token_approvals' : ActorMethod<
    [Array<RevokeTokenApprovalArg>],
    Result_8
  >,
  'icrc37_transfer_from' : ActorMethod<[Array<TransferFromArg>], Result_9>,
  'icrc3_get_archives' : ActorMethod<[null], Array<ICRC3ArchiveInfo>>,
  'icrc3_get_blocks' : ActorMethod<[Array<GetBlocksRequest>], GetBlocksResult>,
  'icrc3_get_properties' : ActorMethod<[null], ICRC3Properties>,
  'icrc3_get_tip_certificate' : ActorMethod<[null], ICRC3DataCertificate>,
  'icrc3_supported_block_types' : ActorMethod<
    [null],
    Array<SupportedBlockType>
  >,
  'icrc7_atomic_batch_transfers' : ActorMethod<[], [] | [boolean]>,
  'icrc7_balance_of' : ActorMethod<[Array<Account>], Array<bigint>>,
  'icrc7_collection_metadata' : ActorMethod<[], Array<[string, ICRC3Value]>>,
  'icrc7_default_take_value' : ActorMethod<[], [] | [bigint]>,
  'icrc7_description' : ActorMethod<[], [] | [string]>,
  'icrc7_logo' : ActorMethod<[], [] | [string]>,
  'icrc7_max_memo_size' : ActorMethod<[], [] | [bigint]>,
  'icrc7_max_query_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc7_max_take_value' : ActorMethod<[], [] | [bigint]>,
  'icrc7_max_update_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc7_name' : ActorMethod<[], string>,
  'icrc7_owner_of' : ActorMethod<[Array<bigint>], Array<[] | [Account]>>,
  'icrc7_permitted_drift' : ActorMethod<[], [] | [bigint]>,
  'icrc7_supply_cap' : ActorMethod<[], [] | [bigint]>,
  'icrc7_symbol' : ActorMethod<[], string>,
  'icrc7_token_metadata' : ActorMethod<
    [Array<bigint>],
    Array<[] | [Array<[string, ICRC3Value]>]>
  >,
  'icrc7_tokens' : ActorMethod<[[] | [bigint], [] | [bigint]], Array<bigint>>,
  'icrc7_tokens_of' : ActorMethod<
    [Account, [] | [bigint], [] | [bigint]],
    Array<bigint>
  >,
  'icrc7_total_supply' : ActorMethod<[], bigint>,
  'icrc7_transfer' : ActorMethod<[Array<TransferArg>], Array<[] | [Result_10]>>,
  'icrc7_tx_window' : ActorMethod<[], [] | [bigint]>,
  'init_upload' : ActorMethod<[Args_1], Result_11>,
  'mint' : ActorMethod<[Args_2], Result_12>,
  'remove_authorized_principals' : ActorMethod<[Args_3], Result_13>,
  'remove_minting_authorities' : ActorMethod<[Args_4], Result_14>,
  'store_chunk' : ActorMethod<[Args_5], Result_15>,
  'update_authorized_principals' : ActorMethod<[Args_3], Result_14>,
  'update_collection_metadata' : ActorMethod<[Args_6], Result_14>,
  'update_minting_authorities' : ActorMethod<[Args_4], Result_14>,
  'update_nft_metadata' : ActorMethod<[Args_7], Result_16>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
