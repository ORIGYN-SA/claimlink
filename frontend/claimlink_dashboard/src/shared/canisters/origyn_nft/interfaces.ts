import type { ActorMethod } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";

// ICRC3Value type for NFT metadata
export type ICRC3Value =
  | { Int: bigint }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Text: string }
  | { Array: Array<ICRC3Value> }
  | { Map: Array<[string, ICRC3Value]> };

// Account type for ICRC7
export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}

// Single mint request
export interface MintRequest {
  metadata: Array<[string, ICRC3Value]>;
  token_owner: Account;
  memo: [] | [Uint8Array | number[]];
}

// Mint args structure (Args_2 in IDL) - wraps requests for batch minting
export interface MintArgs {
  mint_requests: MintRequest[];
}

export type MintError =
  | { ConcurrentManagementCall: null }
  | { ExceedMaxAllowedSupplyCap: null }
  | { TokenAlreadyExists: null }
  | { InvalidMemo: null }
  | { StorageCanisterError: string };

export type MintResult = { Ok: bigint } | { Err: MintError };

// Upload types
export interface InitUploadArgs {
  file_path: string;
  file_hash: string;
  file_size: bigint;
  chunk_size: [] | [bigint];
}

export interface StoreChunkArgs {
  file_path: string;
  chunk_id: bigint;
  chunk_data: number[];
}

export interface FinalizeUploadArgs {
  file_path: string;
}

export type UploadError =
  | { FileNotFound: null }
  | { ChunkMissing: bigint }
  | { HashMismatch: null }
  | { InvalidChunkSize: null }
  | { StorageError: string };

export type InitUploadResult = { Ok: null } | { Err: UploadError };
export type StoreChunkResult = { Ok: null } | { Err: UploadError };
export type FinalizeUploadResult =
  | { Ok: { url: string } }
  | { Err: UploadError };

// ICRC3 types for transaction blocks
export interface GetBlocksRequest {
  start: bigint;
  length: bigint;
}

export interface BlockWithId {
  id: bigint;
  block: ICRC3Value;
}

export interface ArchivedBlocks {
  args: Array<GetBlocksRequest>;
  callback: [Principal, string];
}

export interface GetBlocksResult {
  log_length: bigint;
  blocks: Array<BlockWithId>;
  archived_blocks: Array<ArchivedBlocks>;
}

// Update collection metadata args
export interface UpdateCollectionMetadataArgs {
  supply_cap: [] | [bigint];
  tx_window: [] | [bigint];
  default_take_value: [] | [bigint];
  max_take_value: [] | [bigint];
  max_update_batch_size: [] | [bigint];
  max_query_batch_size: [] | [bigint];
  max_memo_size: [] | [bigint];
  atomic_batch_transfers: [] | [boolean];
  permitted_drift: [] | [bigint];
  name: [] | [string];
  description: [] | [string];
  logo: [] | [string];
  max_canister_storage_threshold: [] | [bigint];
  collection_metadata: [] | [Array<[string, ICRC3Value]>];
  symbol: [] | [string];
}

// Update NFT metadata args
export interface UpdateNftMetadataArgs {
  token_id: bigint;
  metadata: Array<[string, ICRC3Value]>;
}

// Error types for update methods
export type UpdateCollectionMetadataError =
  | { StorageCanisterError: string }
  | { ConcurrentManagementCall: null };

export type UpdateNftMetadataError =
  | { StorageCanisterError: string }
  | { TokenDoesNotExist: null }
  | { ConcurrentManagementCall: null };

export type UpdateCollectionMetadataResult = { Ok: null } | { Err: UpdateCollectionMetadataError };
export type UpdateNftMetadataResult = { Ok: bigint } | { Err: UpdateNftMetadataError };

// ICRC7 standard methods
export interface _SERVICE {
  // Minting
  mint: ActorMethod<[MintArgs], MintResult>;

  // Upload management
  init_upload: ActorMethod<[InitUploadArgs], InitUploadResult>;
  store_chunk: ActorMethod<[StoreChunkArgs], StoreChunkResult>;
  finalize_upload: ActorMethod<[FinalizeUploadArgs], FinalizeUploadResult>;

  // ICRC3 queries (transaction blocks)
  icrc3_get_blocks: ActorMethod<[Array<GetBlocksRequest>], GetBlocksResult>;

  // ICRC7 queries
  icrc7_tokens_of: ActorMethod<
    [Account, [] | [bigint], [] | [bigint]],
    Array<bigint>
  >;
  icrc7_token_metadata: ActorMethod<
    [Array<bigint>],
    Array<[] | [Array<[string, ICRC3Value]>]>
  >;
  icrc7_collection_metadata: ActorMethod<[], Array<[string, ICRC3Value]>>;
  icrc7_owner_of: ActorMethod<[Array<bigint>], Array<[] | [Account]>>;
  icrc7_balance_of: ActorMethod<[Array<Account>], Array<bigint>>;
  icrc7_total_supply: ActorMethod<[], bigint>;
  icrc7_symbol: ActorMethod<[], string>;
  icrc7_name: ActorMethod<[], string>;
  icrc7_description: ActorMethod<[], [] | [string]>;
  icrc7_logo: ActorMethod<[], [] | [string]>;

  // Update methods
  update_collection_metadata: ActorMethod<[UpdateCollectionMetadataArgs], UpdateCollectionMetadataResult>;
  update_nft_metadata: ActorMethod<[UpdateNftMetadataArgs], UpdateNftMetadataResult>;
}
