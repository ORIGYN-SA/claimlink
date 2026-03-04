/**
 * ClaimLink Canister Interface
 *
 * IMPORTANT: This interface uses "NFT" terminology (get_nft_details, NftDetails, get_collection_nfts)
 * because all tokens are ORIGYN NFTs at the technical/IC level (ICRC-7 standard).
 *
 * In the ClaimLink frontend, these same tokens are referred to as "Certificates" in the UI
 * because they represent verified real-world assets (gold, diamonds, watches).
 *
 * Naming Convention:
 * - Backend/IC APIs: Use "NFT" (this file)
 * - Frontend UI: Use "Certificate" (components, pages, types)
 * - Transform layer: Bridges between NFT (technical) and Certificate (business)
 *
 * This is intentional - there's only ONE token type, just different terminology at different layers.
 */
import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export type BTreeMap = Array<
  [
    string,
    (
      | { Int: bigint }
      | { Map: BTreeMap }
      | { Nat: bigint }
      | { Blob: Uint8Array | number[] }
      | { Text: string }
      | { Array: Array<ICRC3Value> }
    ),
  ]
>;
export interface CollectionExistsArgs {
  canister_id: Principal;
}
export interface CollectionInfo {
  creator: Principal;
  name: string;
  canister_id: Principal;
  description: string;
  created_at: bigint;
  symbol: string;
}
export interface CollectionsResult {
  collections: Array<CollectionInfo>;
  total_count: bigint;
}
export interface CreateCollectionArgs {
  name: string;
  description: string;
  symbol: string;
  logo?: string;
}
export type CreateCollectionError =
  | { InsufficientCycles: null }
  | { ExternalCanisterError: string }
  | { Generic: GenericError }
  | { CreateOrigynNftCanisterError: null }
  | { TransferFromError: TransferFromError };
export interface CreateCollectionResult {
  origyn_nft_canister_id: Principal;
}
export type GenericError = { Other: string };
export interface GetCollectionNftsArgs {
  prev: [] | [bigint];
  take: [] | [bigint];
  canister_id: Principal;
}
export interface GetCollectionsByOwnerArgs {
  owner: Principal;
  pagination: PaginationArgs;
}
export interface GetNftDetailsArgs {
  canister_id: Principal;
  token_ids: Array<bigint>;
}
export type ICRC3Value =
  | { Int: bigint }
  | { Map: BTreeMap }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Text: string }
  | { Array: Array<ICRC3Value> };
export type ICRC3Value_1 =
  | { Int: bigint }
  | { Map: Array<[string, ICRC3Value]> }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Text: string }
  | { Array: Array<ICRC3Value> };
export interface InitArgs {
  origyn_nft_commit_hash: string;
  test_mode: boolean;
  authorized_principals: Array<Principal>;
  bank_principal_id: Principal;
  ledger_canister_id: Principal;
}
export interface NftDetails {
  token_id: bigint;
  owner: [] | [Account];
  metadata: [] | [Array<[string, ICRC3Value_1]>];
}
export interface PaginationArgs {
  offset: [] | [bigint];
  limit: [] | [bigint];
}
export type Result =
  | { Ok: CreateCollectionResult }
  | { Err: CreateCollectionError };
export type TransferFromError =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { InsufficientAllowance: { allowance: bigint } }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { InsufficientFunds: { balance: bigint } };
export interface _SERVICE {
  collection_exists: ActorMethod<[CollectionExistsArgs], boolean>;
  create_collection: ActorMethod<[CreateCollectionArgs], Result>;
  get_collection_count: ActorMethod<[null], bigint>;
  get_collection_info: ActorMethod<
    [CollectionExistsArgs],
    [] | [CollectionInfo]
  >;
  get_collection_nfts: ActorMethod<[GetCollectionNftsArgs], Array<bigint>>;
  get_collections_by_owner: ActorMethod<
    [GetCollectionsByOwnerArgs],
    CollectionsResult
  >;
  get_nft_details: ActorMethod<[GetNftDetailsArgs], Array<NftDetails>>;
  list_all_collections: ActorMethod<[PaginationArgs], CollectionsResult>;
  list_my_collections: ActorMethod<[PaginationArgs], CollectionsResult>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
