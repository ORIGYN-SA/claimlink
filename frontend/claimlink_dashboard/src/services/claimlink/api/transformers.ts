import type { CollectionInfo, NftDetails } from '../interfaces';
import type { Collection } from '@/features/collections/types/collection.types';
import type { NFT } from '@/features/nfts/types/nft.types';

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
 * Transform backend NftDetails to frontend NFT type
 */
export function transformNftDetails(
  backendNft: NftDetails,
  collectionName: string
): NFT {
  const metadata = backendNft.metadata[0];
  const metadataMap = metadata ? new Map(metadata) : new Map();

  // Extract common metadata fields
  const title = extractTextMetadata(metadataMap, 'name') || `NFT #${backendNft.token_id}`;
  const imageUrl = extractTextMetadata(metadataMap, 'image') || extractTextMetadata(metadataMap, 'thumbnail') || '';

  const owner = backendNft.owner[0];

  return {
    // BaseToken fields
    id: backendNft.token_id.toString(),
    title,
    collectionName,
    imageUrl,
    status: 'Minted',
    date: new Date().toISOString(), // TODO: Extract from metadata if available
    thumbnail: imageUrl,
    // NFT-specific fields
    creator: owner ? owner.owner.toText() : '',
    tokenId: backendNft.token_id.toString(),
    canisterId: '', // Will be set by caller
    attributes: extractAttributes(metadataMap),
  };
}

/**
 * Extract attributes from metadata map
 */
function extractAttributes(metadata: Map<string, any>): Record<string, string | number> {
  const attributes: Record<string, string | number> = {};

  // Look for common attribute keys
  const attributeKeys = ['rarity', 'edition', 'series', 'attributes'];

  for (const key of attributeKeys) {
    const value = metadata.get(key);
    if (value) {
      if ('Text' in value) {
        attributes[key] = value.Text;
      } else if ('Nat' in value) {
        attributes[key] = Number(value.Nat);
      }
    }
  }

  return attributes;
}

/**
 * Format timestamp (nanoseconds) to ISO date string
 */
function formatTimestamp(timestamp: bigint): string {
  // Backend provides milliseconds as nat64
  const milliseconds = Number(timestamp);
  return new Date(milliseconds).toISOString();
}

/**
 * Extract text value from ICRC3Value metadata
 */
function extractTextMetadata(
  metadata: Map<string, any>,
  key: string
): string | null {
  const value = metadata.get(key);
  if (!value) return null;

  // Handle ICRC3Value variants
  if ('Text' in value) {
    return value.Text;
  }
  return null;
}

/**
 * Extract nat value from ICRC3Value metadata
 * @internal Currently unused but kept for future metadata extraction needs
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractNatMetadata(
  metadata: Map<string, any>,
  key: string
): bigint | null {
  const value = metadata.get(key);
  if (!value) return null;

  if ('Nat' in value) {
    return value.Nat;
  }
  return null;
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
