import type { CollectionInfo } from '@canisters/claimlink';
import type { Collection } from '../types/collection.types';

/**
 * Transform backend CollectionInfo to frontend Collection type
 */
export function transformCollectionInfo(
  backendCollection: CollectionInfo,
  itemCount: number = 0
): Collection {
  return {
    id: backendCollection.canister_id.toText(),
    title: backendCollection.name,
    description: backendCollection.description,
    imageUrl: '', // TODO: Fetch from NFT metadata or add to CollectionInfo
    itemCount,
    status: 'Active', // TODO: Add status to backend or compute based on activity
    createdDate: formatTimestamp(backendCollection.created_at),
    lastModified: formatTimestamp(backendCollection.created_at), // TODO: Add last_modified to backend
    creator: backendCollection.creator.toText(),
  };
}

/**
 * Format timestamp (nanoseconds) to ISO date string
 */
export function formatTimestamp(timestamp: bigint): string {
  // Backend provides milliseconds as nat64
  const milliseconds = Number(timestamp);
  return new Date(milliseconds).toISOString();
}

/**
 * Transform frontend pagination args to backend format
 */
export function transformPaginationArgs(
  offset?: number,
  limit?: number
): { offset: [] | [bigint]; limit: [] | [bigint] } {
  return {
    offset: offset !== undefined ? [BigInt(offset)] : [],
    limit: limit !== undefined ? [BigInt(limit)] : [],
  };
}

/**
 * Format CreateCollectionError for user display
 */
export function formatCreateCollectionError(error: any): string {
  if ('InsufficientCycles' in error) {
    return 'Insufficient cycles to create collection. Please try again later.';
  }
  if ('ExternalCanisterError' in error) {
    return `External canister error: ${error.ExternalCanisterError}`;
  }
  if ('CreateOrigynNftCanisterError' in error) {
    return 'Failed to create NFT canister. Please try again.';
  }
  if ('TransferFromError' in error) {
    return formatTransferFromError(error.TransferFromError);
  }
  if ('Generic' in error && 'Other' in error.Generic) {
    return error.Generic.Other;
  }
  return 'Unknown error occurred while creating collection.';
}

/**
 * Format TransferFromError for user display
 */
function formatTransferFromError(error: any): string {
  if ('InsufficientFunds' in error) {
    return `Insufficient funds. You need at least 15,000 OGY tokens. Your balance: ${error.InsufficientFunds.balance}`;
  }
  if ('InsufficientAllowance' in error) {
    return `Insufficient allowance. Please approve spending first. Current allowance: ${error.InsufficientAllowance.allowance}`;
  }
  if ('TemporarilyUnavailable' in error) {
    return 'Ledger temporarily unavailable. Please try again in a moment.';
  }
  if ('BadFee' in error) {
    return `Incorrect fee provided. Expected fee: ${error.BadFee.expected_fee}`;
  }
  if ('TooOld' in error) {
    return 'Transaction is too old. Please try again.';
  }
  if ('CreatedInFuture' in error) {
    return 'Transaction timestamp is in the future. Please check your system clock.';
  }
  if ('Duplicate' in error) {
    return `Duplicate transaction. Original: ${error.Duplicate.duplicate_of}`;
  }
  if ('GenericError' in error) {
    return `Transfer error: ${error.GenericError.message} (code: ${error.GenericError.error_code})`;
  }
  return 'Unknown transfer error occurred.';
}
