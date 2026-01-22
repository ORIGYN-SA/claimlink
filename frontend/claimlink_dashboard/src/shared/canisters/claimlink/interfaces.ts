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
  { 'InvalidNftTemplateId' : null };
export interface CreateTemplateArgs { 'template_json' : string }
export type CreateTemplateError = { 'JsonError' : string } |
  { 'LimitExceeded' : { 'max_templates' : bigint } };
export interface CyclesManagement {
  'cycles_top_up_increment' : bigint,
  'cycles_for_collection_creation' : bigint,
}
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
export interface GetNftDetailsArgs {
  'canister_id' : Principal,
  'token_ids' : Array<bigint>,
}
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
  'cycles_management' : CyclesManagement,
  'test_mode' : boolean,
  'max_creation_retries' : bigint,
  'collection_request_fee' : bigint,
  'ogy_transfer_fee' : bigint,
  'authorized_principals' : Array<AuthordiedPrincipal>,
  'bank_principal_id' : Principal,
  'ledger_canister_id' : Principal,
  'commit_hash' : string,
  'max_template_per_owner' : bigint,
}
export interface NftDetails {
  'token_id' : bigint,
  'owner' : [] | [Account],
  'metadata' : [] | [Array<[string, ICRC3Value_1]>],
}
export interface PaginationArgs {
  'offset' : [] | [bigint],
  'limit' : [] | [bigint],
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : CreateCollectionError };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : CreateTemplateError };
export type Result_2 = { 'Ok' : TemplatesResult } |
  { 'Err' : GetTemplatesByOwnerError };
export interface Template { 'template_json' : string, 'template_id' : bigint }
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
export interface UpgradeArgs {
  'origyn_nft_wasm_hash' : [] | [string],
  'cycles_management' : [] | [CyclesManagement],
  'max_creation_retries' : [] | [bigint],
  'collection_request_fee' : [] | [bigint],
  'ogy_transfer_fee' : [] | [bigint],
  'bank_principal_id' : [] | [Principal],
  'commit_hash' : string,
  'build_version' : BuildVersion,
  'max_template_per_owner' : [] | [bigint],
}
export interface _SERVICE {
  'create_collection' : ActorMethod<[CreateCollectionArgs], Result>,
  'create_template' : ActorMethod<[CreateTemplateArgs], Result_1>,
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
  'get_nft_details' : ActorMethod<[GetNftDetailsArgs], Array<NftDetails>>,
  'get_templates_by_owner' : ActorMethod<[GetTemplatesByOwnerArgs], Result_2>,
  'list_all_collections' : ActorMethod<[PaginationArgs], CollectionsResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
