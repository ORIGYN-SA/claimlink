import type { CollectionInfo, CollectionStatus as BackendCollectionStatus } from '@canisters/claimlink';
import type { Collection } from '../types/collection.types';

/**
 * Map backend CollectionStatus to frontend status
 */
function mapCollectionStatus(
  backendStatus: BackendCollectionStatus
): 'Active' | 'Inactive' | 'Draft' {
  // Installed or TemplateUploaded = Active (fully operational)
  if ('Installed' in backendStatus || 'TemplateUploaded' in backendStatus) {
    return 'Active';
  }

  // Queued, Created = Draft (in progress)
  if ('Queued' in backendStatus || 'Created' in backendStatus) {
    return 'Draft';
  }

  // Failed, ReimbursingQueued, QuarantinedReimbursement, Reimbursed = Inactive
  return 'Inactive';
}

/**
 * Transform backend CollectionInfo to frontend Collection type
 */
export function transformCollectionInfo(
  backendCollection: CollectionInfo,
  itemCount: number = 0
): Collection {
  // Get canister ID if available (might be empty for queued collections)
  const canisterPrincipal = backendCollection.canister_id[0];
  const canisterId = canisterPrincipal
    ? canisterPrincipal.toText()
    : backendCollection.collection_id.toString();

  return {
    id: canisterId,
    title: backendCollection.metadata.name,
    description: backendCollection.metadata.description,
    imageUrl: '', // TODO: Fetch from NFT metadata or add to CollectionInfo
    itemCount,
    status: mapCollectionStatus(backendCollection.status),
    createdDate: formatTimestamp(backendCollection.created_at),
    lastModified: formatTimestamp(backendCollection.updated_at),
    creator: backendCollection.owner.toText(),
  };
}

/**
 * Format timestamp to ISO date string
 *
 * Handles both nanoseconds (IC standard) and milliseconds formats.
 * Returns current date if timestamp is invalid or zero.
 */
export function formatTimestamp(timestamp: bigint): string {
  // Handle zero/invalid timestamps
  if (!timestamp || timestamp === 0n) {
    return new Date().toISOString();
  }

  const numValue = Number(timestamp);

  // If the value is very large (> year 3000 in ms), it's likely nanoseconds
  // Year 3000 in milliseconds is roughly 32503680000000
  if (numValue > 32503680000000) {
    // Convert nanoseconds to milliseconds
    const milliseconds = numValue / 1_000_000;
    return new Date(milliseconds).toISOString();
  }

  // Otherwise treat as milliseconds
  return new Date(numValue).toISOString();
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
  if ('InvalidNftTemplateId' in error) {
    return 'Invalid template ID. Please select a valid template.';
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
