import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface AuthordiedPrincipal {
  'principal' : Principal,
  'name' : string,
}
export type BTreeMap = Array<
  [
    string,
    { 'Int' : bigint } |
      { 'Map' : BTreeMap } |
      { 'Nat' : bigint } |
      { 'Blob' : Uint8Array | number[] } |
      { 'Text' : string } |
      { 'Array' : Array<ICRC3Value> },
  ]
>;
export interface MemorySize {
  'stable' : bigint,
  'heap' : bigint,
}
export interface CanisterInfo {
  'test_mode' : boolean,
  'memory_used' : MemorySize,
  'now_nanos' : bigint,
  'cycles_balance_in_tc' : number,
}
export interface Metrics {
  'next_template_id' : bigint,
  'origyn_nft_wasm_hash' : string,
  'cycles_management' : CyclesManagement,
  'max_creation_retries' : bigint,
  'collection_request_fee' : bigint,
  'ogy_to_burn' : bigint,
  'ogy_transfer_fee' : bigint,
  'authorized_principals' : Array<AuthordiedPrincipal>,
  'total_ogy_burned' : bigint,
  'bank_principal_id' : Principal,
  'ledger_canister_id' : Principal,
  'canister_info' : CanisterInfo,
  'max_template_per_owner' : bigint,
}
export interface BuildVersion {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export type ClaimlinkArgs = { 'UpgradeArg' : UpgradeArgs } |
  { 'InitArg' : InitArg };
export interface CollectionInfo {
  'status' : CollectionStatus,
  'updated_at' : bigint,
  'owner' : Principal,
  'metadata' : CollectionMetadata,
  'canister_id' : [] | [Principal],
  'collection_id' : bigint,
  'created_at' : bigint,
  'temaplte_url' : [] | [string],
  'wasm_hash' : [] | [string],
  'ogy_charged' : bigint,
}
export interface CollectionMetadata {
  'name' : string,
  'description' : string,
  'template_id' : bigint,
  'symbol' : string,
}
export type CollectionSearchParam = { 'CanisterId' : Principal } |
  { 'CollectionId' : bigint };
export type CollectionStatus = { 'Queued' : null } |
  { 'Failed' : { 'attempsts' : bigint, 'reason' : string } } |
  { 'QuarantinedReimbursement' : { 'reason' : string } } |
  { 'Reimbursed' : { 'tx_index' : bigint } } |
  { 'Created' : null } |
  { 'ReimbursingQueued' : null } |
  { 'Installed' : null } |
  { 'TemplateUploaded' : null };
export interface CollectionsResult {
  'collections' : Array<CollectionInfo>,
  'total_count' : bigint,
}
export interface CreateCollectionArgs {
  'name' : string,
  'description' : string,
  'template_id' : bigint,
  'symbol' : string,
}
export type CreateCollectionError = { 'ExternalCanisterError' : string } |
  { 'Generic' : GenericError } |
  { 'CreateOrigynNftCanisterError' : null } |
  { 'TransferFromError' : TransferFromError } |
  { 'InvalidNftTemplateId' : null } |
  { 'ConcurrentRequest' : null };
export interface CreateTemplateArgs { 'template_json' : string }
export type CreateTemplateError = { 'JsonError' : string } |
  { 'LimitExceeded' : { 'max_templates' : bigint } };
export interface CyclesManagement {
  'cycles_top_up_increment' : bigint,
  'cycles_for_collection_creation' : bigint,
}
export type DeleteTemplateError = { 'UnauthorizedCall' : null } |
  { 'InvalidNftTemplateId' : null };
export interface EstimateMintCostArgs {
  'total_file_size_bytes' : bigint,
  'num_mints' : bigint,
  'collection_canister_id' : Principal,
}
export type EstimateMintCostError = { 'MintPricingNotConfigured' : null } |
  { 'OgyPriceNotAvailable' : null };
export type GenericError = { 'Other' : string };
export interface GetCollectionNftsArgs {
  'prev' : [] | [bigint],
  'take' : [] | [bigint],
  'canister_id' : Principal,
}
export interface GetCollectionsByOwnerArgs {
  'owner' : Principal,
  'pagination' : PaginationArgs,
}
export interface GetCollectionsForUserArgs {
  'pagination' : PaginationArgs,
  'user' : Principal,
}
export interface GetMintRequestsByOwnerArgs {
  'owner' : Principal,
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
}
export interface GetNftDetailsArgs {
  'canister_id' : Principal,
  'token_ids' : Array<bigint>,
}
export interface GetTemplateByIdArgs { 'template_id' : bigint }
export type GetTemplateByIdError = { 'TemplateNotFound' : null };
export interface GetTemplateIdsByOwnerArgs { 'owner' : Principal }
export interface GetTemplatesByOwnerArgs {
  'owner' : Principal,
  'pagination' : PaginationArgs,
}
export type GetTemplatesByOwnerError = { 'UnauthorizedCall' : null };
export type ICRC3Value = { 'Int' : bigint } |
  { 'Map' : BTreeMap } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<ICRC3Value> };
export type ICRC3Value_1 = { 'Int' : bigint } |
  { 'Map' : Array<[string, ICRC3Value]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<ICRC3Value> };
export interface InitArg {
  'base_url' : [] | [string],
  'cycles_management' : CyclesManagement,
  'test_mode' : boolean,
  'max_creation_retries' : bigint,
  'collection_request_fee' : bigint,
  'ogy_transfer_fee' : bigint,
  'authorized_principals' : Array<AuthordiedPrincipal>,
  'bank_principal_id' : Principal,
  'ledger_canister_id' : Principal,
  'mint_pricing' : [] | [MintPricingConfig],
  'commit_hash' : string,
  'icpswap_pool_canister_id' : [] | [Principal],
  'max_template_per_owner' : bigint,
}
export interface InitializeMintArgs {
  'total_file_size_bytes' : bigint,
  'num_mints' : bigint,
  'collection_canister_id' : Principal,
}
export type InitializeMintError = { 'CollectionNotReady' : null } |
  { 'CallerNotCollectionOwner' : null } |
  { 'CollectionNotFound' : null } |
  { 'InvalidNumMints' : null } |
  { 'Generic' : GenericError } |
  { 'TransferFromError' : TransferFromError } |
  { 'OgyPriceNotAvailable' : null };
export interface MintCostBreakdown {
  'storage_fee_usd_e8s' : bigint,
  'base_fee_usd_e8s' : bigint,
}
export interface MintCostEstimate {
  'breakdown' : MintCostBreakdown,
  'total_usd_e8s' : bigint,
  'ogy_usd_price_e8s' : bigint,
  'total_ogy_e8s' : bigint,
}
export interface MintItemArg {
  'metadata' : Array<[string, ICRC3Value_1]>,
  'memo' : [] | [Uint8Array | number[]],
  'token_owner' : Account,
}
export interface MintNftsArgs {
  'mint_items' : Array<MintItemArg>,
  'mint_request_id' : bigint,
}
export type MintNftsError = { 'MintError' : string } |
  { 'MintRequestNotFound' : null } |
  { 'MintLimitExceeded' : { 'requested' : bigint, 'already_minted' : bigint, 'allowed' : bigint } } |
  { 'TooManyItems' : { 'max' : bigint } } |
  { 'Unauthorized' : null } |
  { 'MintRequestNotActive' : null } |
  { 'NoItemsProvided' : null };
export interface MintPricingConfig {
  'storage_fee_per_mb_usd_e8s' : bigint,
  'base_mint_fee_usd_e8s' : bigint,
}
export interface MintRequestInfo {
  'id' : bigint,
  'status' : MintRequestStatus,
  'updated_at' : bigint,
  'minted_count' : bigint,
  'uploaded_files' : Array<UploadedFileInfo>,
  'owner' : Principal,
  'allocated_bytes' : bigint,
  'created_at' : bigint,
  'bytes_uploaded' : bigint,
  'num_mints' : bigint,
  'collection_canister_id' : Principal,
  'ogy_charged' : bigint,
}
export type MintRequestStatus = { 'Initialized' : null } |
  { 'Refunded' : { 'tx_index' : bigint } } |
  { 'RefundRequested' : null } |
  { 'RefundFailed' : { 'reason' : string } } |
  { 'Completed' : null };
export interface NftDetails {
  'token_id' : bigint,
  'owner' : [] | [Account],
  'metadata' : [] | [Array<[string, ICRC3Value_1]>],
}
export interface OgyPriceData {
  'updated_at' : bigint,
  'usd_per_ogy_e8s' : bigint,
}
export interface PaginationArgs {
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
}
export interface ProxyFinalizeUploadArgs {
  'file_path' : string,
  'mint_request_id' : bigint,
}
export interface ProxyLogoFinalizeUploadArgs {
  'file_path' : string,
  'collection_canister_id' : Principal,
}
export interface ProxyLogoInitUploadArgs {
  'file_hash' : string,
  'file_path' : string,
  'file_size' : bigint,
  'collection_canister_id' : Principal,
  'chunk_size' : [] | [bigint],
}
export interface ProxyLogoStoreChunkArgs {
  'chunk_id' : bigint,
  'file_path' : string,
  'collection_canister_id' : Principal,
  'chunk_data' : Uint8Array | number[],
}
export type ProxyLogoUploadError = { 'CollectionNotReady' : null } |
  { 'CollectionNotFound' : null } |
  { 'FileTooLarge' : { 'requested' : bigint, 'max_bytes' : bigint } } |
  { 'UploadError' : string } |
  { 'Unauthorized' : null };
export interface ProxyInitUploadArgs {
  'file_hash' : string,
  'file_path' : string,
  'file_size' : bigint,
  'chunk_size' : [] | [bigint],
  'mint_request_id' : bigint,
}
export interface ProxyStoreChunkArgs {
  'chunk_id' : bigint,
  'file_path' : string,
  'chunk_data' : Uint8Array | number[],
  'mint_request_id' : bigint,
}
export type ProxyUploadError = { 'ByteLimitExceeded' : { 'requested' : bigint, 'allocated' : bigint, 'used' : bigint } } |
  { 'MintRequestNotFound' : null } |
  { 'UploadError' : string } |
  { 'Unauthorized' : null } |
  { 'MintRequestNotActive' : null };
export type RefundError = { 'MintRequestNotFound' : null } |
  { 'NotInRefundableState' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyRefunded' : null } |
  { 'CreditsAlreadyUsed' : null };
export interface RequestMintRefundArgs {
  'mint_request_id' : bigint,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : CreateCollectionError };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : CreateTemplateError };
export type Result_10 = { 'Ok' : null } |
  { 'Err' : ProxyUploadError };
export type Result_11 = { 'Ok' : string } |
  { 'Err' : ProxyLogoUploadError };
export type Result_12 = { 'Ok' : null } |
  { 'Err' : ProxyLogoUploadError };
export type Result_13 = { 'Ok' : null } |
  { 'Err' : RefundError };
export type Result_14 = { 'Ok' : null } |
  { 'Err' : UpdateTemplateError };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : DeleteTemplateError };
export type Result_3 = { 'Ok' : MintCostEstimate } |
  { 'Err' : EstimateMintCostError };
export type Result_4 = { 'Ok' : Template } |
  { 'Err' : GetTemplateByIdError };
export type Result_5 = { 'Ok' : TemplatesResult } |
  { 'Err' : GetTemplatesByOwnerError };
export type Result_6 = { 'Ok' : bigint } |
  { 'Err' : InitializeMintError };
export type Result_7 = { 'Ok' : bigint } |
  { 'Err' : InitializeMintError };
export type Result_8 = { 'Ok' : Array<bigint> } |
  { 'Err' : MintNftsError };
export type Result_9 = { 'Ok' : string } |
  { 'Err' : ProxyUploadError };
export interface SupportedStandard {
  'url' : string,
  'name' : string,
}
export interface Template { 'template_json' : string, 'template_id' : bigint }
export interface TemplateIdsResult {
  'template_ids' : Array<bigint>,
  'total_count' : bigint,
}
export interface TemplatesResult {
  'templates' : Array<Template>,
  'total_count' : bigint,
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface UpdateTemplateArgs {
  'new_tempalte_json' : string,
  'template_id' : bigint,
}
export type UpdateTemplateError = { 'UnauthorizedCall' : null } |
  { 'InvalidNftTemplateId' : null } |
  { 'JsonError' : string } |
  { 'TemplateNotFound' : null };
export interface UpgradeArgs {
  'origyn_nft_wasm_hash' : [] | [string],
  'cycles_management' : [] | [CyclesManagement],
  'max_creation_retries' : [] | [bigint],
  'collection_request_fee' : [] | [bigint],
  'new_authorized_principals' : [] | [Array<AuthordiedPrincipal>],
  'ogy_transfer_fee' : [] | [bigint],
  'bank_principal_id' : [] | [Principal],
  'ledger_canister_id' : [] | [Principal],
  'mint_pricing' : [] | [MintPricingConfig],
  'commit_hash' : string,
  'build_version' : BuildVersion,
  'icpswap_pool_canister_id' : [] | [Principal],
  'max_template_per_owner' : [] | [bigint],
}
export interface UploadedFileInfo {
  'file_path' : string,
  'file_url' : string,
  'file_size' : bigint,
}
export interface _SERVICE {
  'create_collection' : ActorMethod<[CreateCollectionArgs], Result>,
  'create_template' : ActorMethod<[CreateTemplateArgs], Result_1>,
  'delete_template' : ActorMethod<[bigint], Result_2>,
  'estimate_mint_cost' : ActorMethod<[EstimateMintCostArgs], Result_3>,
  'get_collection_count' : ActorMethod<[], bigint>,
  'get_collection_info' : ActorMethod<
    [CollectionSearchParam],
    [] | [CollectionInfo]
  >,
  'get_collection_nfts' : ActorMethod<[GetCollectionNftsArgs], Array<bigint>>,
  'get_collections_by_owner' : ActorMethod<
    [GetCollectionsByOwnerArgs],
    CollectionsResult
  >,
  'get_collections_for_user' : ActorMethod<
    [GetCollectionsForUserArgs],
    CollectionsResult
  >,
  'get_metrics' : ActorMethod<[], Metrics>,
  'get_mint_request' : ActorMethod<[bigint], [] | [MintRequestInfo]>,
  'get_mint_requests_by_owner' : ActorMethod<
    [GetMintRequestsByOwnerArgs],
    Array<MintRequestInfo>
  >,
  'get_nft_details' : ActorMethod<[GetNftDetailsArgs], Array<NftDetails>>,
  'get_ogy_usd_price' : ActorMethod<[], [] | [OgyPriceData]>,
  'get_template_by_id' : ActorMethod<[GetTemplateByIdArgs], Result_4>,
  'get_template_ids_by_owner' : ActorMethod<[GetTemplateIdsByOwnerArgs], TemplateIdsResult>,
  'get_templates_by_owner' : ActorMethod<[GetTemplatesByOwnerArgs], Result_5>,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc21_canister_call_consent_message' : ActorMethod<
    [{ 'arg' : Uint8Array | number[], 'method' : string, 'user_preferences' : { 'metadata' : { 'utc_offset_minutes' : [] | [number], 'language' : string }, 'device_spec' : [] | [{ 'GenericDisplay' : null } | { 'FieldsDisplay' : null }] } }],
    { 'Ok' : { 'metadata' : { 'utc_offset_minutes' : [] | [number], 'language' : string }, 'consent_message' : { 'generic_display_message' : string, 'fields_display_message' : { 'fields' : Array<[string, string]>, 'intent' : string } } } } |
    { 'Err' : { 'GenericError' : { 'description' : string } } | { 'InsufficientPayment' : { 'description' : string, 'error_code' : bigint } } | { 'UnsupportedCanisterCall' : { 'description' : string } } | { 'ConsentMessageUnavailable' : { 'description' : string } } }
  >,
  'icrc28_trusted_origins' : ActorMethod<[], { 'trusted_origins' : Array<string> }>,
  'initialize_mint' : ActorMethod<[InitializeMintArgs], Result_7>,
  'list_all_collections' : ActorMethod<[PaginationArgs], CollectionsResult>,
  'mint_nfts' : ActorMethod<[MintNftsArgs], Result_8>,
  'proxy_finalize_upload' : ActorMethod<[ProxyFinalizeUploadArgs], Result_9>,
  'proxy_init_upload' : ActorMethod<[ProxyInitUploadArgs], Result_10>,
  'proxy_logo_finalize_upload' : ActorMethod<[ProxyLogoFinalizeUploadArgs], Result_11>,
  'proxy_logo_init_upload' : ActorMethod<[ProxyLogoInitUploadArgs], Result_12>,
  'proxy_logo_store_chunk' : ActorMethod<[ProxyLogoStoreChunkArgs], Result_12>,
  'proxy_store_chunk' : ActorMethod<[ProxyStoreChunkArgs], Result_10>,
  'request_mint_refund' : ActorMethod<[RequestMintRefundArgs], Result_13>,
  'update_template' : ActorMethod<[UpdateTemplateArgs], Result_14>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
