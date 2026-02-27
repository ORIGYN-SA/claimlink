import type { NftDetails, ICRC3Value_1 } from '@services/claimlink/interfaces';
import type { Certificate } from '@/features/certificates/types/certificate.types';
import type { TokenStatus } from '@/components/common/token-card/token.types';
import {
  extractTextValue,
  extractNatValue,
  getCertificateTitle,
  getCertificateImageUrl,
} from '@/features/certificates/api/transformers';

/**
 * Dashboard Transformers
 *
 * Functions to transform IC canister data to dashboard-specific types
 */

export interface EnrichedCertificate extends Certificate {
  mintedAt?: bigint; // Nanoseconds timestamp
  ownerPrincipal?: string;
}

/**
 * Determine certificate status from owner and metadata
 *
 * Status logic:
 * - No owner → "Waiting"
 * - Owner matches current principal → "Minted" (in wallet)
 * - Owner is different principal → "Transferred"
 * - Metadata has "burned" status → "Burned"
 */
export function determineCertificateStatus(
  nftDetails: NftDetails,
  currentPrincipalId: string
): TokenStatus {
  // Check metadata for explicit status
  const metadata = nftDetails.metadata[0] || [];
  const statusField = extractTextValue(metadata, 'status');

  if (statusField === 'burned' || statusField === 'Burned') {
    return 'Burned';
  }

  if (statusField === 'waiting' || statusField === 'pending' || statusField === 'Waiting') {
    return 'Waiting';
  }

  // Check ownership
  const owner = nftDetails.owner[0];
  if (!owner) {
    return 'Waiting'; // No owner yet
  }

  const ownerPrincipal = owner.owner.toText();

  if (ownerPrincipal === currentPrincipalId) {
    return 'Minted'; // In user's wallet = "Minted" status
  } else {
    return 'Transferred'; // Owned by someone else
  }
}

/**
 * Extract minted timestamp from metadata
 * Returns null if not found
 *
 * Tries multiple possible timestamp field names
 */
export function extractMintedTimestamp(
  metadata: Array<[string, ICRC3Value_1]>
): bigint | null {
  // Try multiple possible timestamp field names
  const timestampValue =
    extractNatValue(metadata, 'minted_at') ||
    extractNatValue(metadata, 'created_at') ||
    extractNatValue(metadata, 'timestamp') ||
    extractNatValue(metadata, 'mint_time');

  return timestampValue;
}

/**
 * Format timestamp (nanoseconds) to readable date string
 * Returns "Unknown" if timestamp is null
 */
export function formatMintedDate(timestamp: bigint | null): string {
  if (!timestamp) {
    return 'Unknown';
  }

  try {
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(timestamp / 1000000n);
    const date = new Date(milliseconds);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('[Dashboard] Failed to format date:', error);
    return 'Unknown';
  }
}

/**
 * Transform NftDetails to Certificate type
 * Includes status determination and date formatting
 */
export function transformNftDetailsToCertificate(
  nftDetails: NftDetails,
  collectionName: string,
  collectionId: string,
  currentPrincipalId: string
): EnrichedCertificate {
  const metadata = nftDetails.metadata[0] || [];
  const tokenId = nftDetails.token_id;

  const title = getCertificateTitle(metadata, tokenId);
  const imageUrl = getCertificateImageUrl(metadata);
  const status = determineCertificateStatus(nftDetails, currentPrincipalId);

  // Extract and format date
  const timestamp = extractMintedTimestamp(metadata);
  const date = formatMintedDate(timestamp);

  // Extract owner principal
  const owner = nftDetails.owner[0];
  const ownerPrincipal = owner ? owner.owner.toText() : undefined;

  return {
    id: tokenId.toString(),
    title,
    collectionName,
    imageUrl,
    status,
    date,
    canisterId: collectionId,
    tokenId: tokenId.toString(),
    mintedAt: timestamp || undefined,
    ownerPrincipal,
  };
}

/**
 * Sort certificates by minted timestamp (newest first)
 */
export function sortCertificatesByMintedDate(
  certificates: EnrichedCertificate[]
): EnrichedCertificate[] {
  return [...certificates].sort((a, b) => {
    // Extract timestamps (default to 0 if not available)
    const timestampA = a.mintedAt || 0n;
    const timestampB = b.mintedAt || 0n;

    // Sort descending (newest first)
    if (timestampA > timestampB) return -1;
    if (timestampA < timestampB) return 1;
    return 0;
  });
}
