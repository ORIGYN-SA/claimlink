import type { ICRC3Value } from '@canisters/origyn_nft';

/**
 * Certificate Transformers
 *
 * Functions to transform ICRC3 metadata values to frontend certificate types
 */

/**
 * Extract text value from ICRC3Value metadata
 */
export function extractTextValue(
  metadata: Array<[string, ICRC3Value]>,
  key: string
): string | null {
  const item = metadata.find(([k]) => k === key);
  if (!item) return null;

  const value = item[1];

  // Handle ICRC3Value variants
  if ('Text' in value) {
    return value.Text;
  }
  if ('Nat' in value) {
    return value.Nat.toString();
  }
  if ('Int' in value) {
    return value.Int.toString();
  }

  return null;
}

/**
 * Extract nat value from ICRC3Value metadata
 */
export function extractNatValue(
  metadata: Array<[string, ICRC3Value]>,
  key: string
): bigint | null {
  const item = metadata.find(([k]) => k === key);
  if (!item) return null;

  const value = item[1];

  if ('Nat' in value) {
    return value.Nat;
  }

  return null;
}

/**
 * Extract int value from ICRC3Value metadata
 */
export function extractIntValue(
  metadata: Array<[string, ICRC3Value]>,
  key: string
): bigint | null {
  const item = metadata.find(([k]) => k === key);
  if (!item) return null;

  const value = item[1];

  if ('Int' in value) {
    return value.Int;
  }

  return null;
}

/**
 * Extract any metadata value as string
 */
export function extractMetadataValue(
  metadata: Array<[string, ICRC3Value]>,
  key: string
): string {
  const item = metadata.find(([k]) => k === key);
  if (!item) return '';

  const value = item[1];

  if ('Text' in value) return value.Text;
  if ('Nat' in value) return value.Nat.toString();
  if ('Int' in value) return value.Int.toString();
  if ('Blob' in value) return '[Blob]';
  if ('Array' in value) return '[Array]';
  if ('Map' in value) return '[Map]';

  return '';
}

/**
 * Get certificate title from metadata
 * Tries multiple field names in priority order
 */
export function getCertificateTitle(
  metadata: Array<[string, ICRC3Value]>,
  tokenId: bigint
): string {
  const title =
    extractTextValue(metadata, 'item_artwork_title') ||
    extractTextValue(metadata, 'item_name') ||
    extractTextValue(metadata, 'name') ||
    extractTextValue(metadata, 'title');

  return title || `Certificate #${tokenId}`;
}

/**
 * Get certificate image URL from metadata
 * Tries multiple field names in priority order
 */
export function getCertificateImageUrl(
  metadata: Array<[string, ICRC3Value]>
): string {
  return (
    extractTextValue(metadata, 'image') ||
    extractTextValue(metadata, 'item_image') ||
    extractTextValue(metadata, 'thumbnail') ||
    ''
  );
}

/**
 * Extract certificate attributes from metadata
 */
export function extractCertificateAttributes(
  metadata: Array<[string, ICRC3Value]>
): Record<string, string | number> {
  const attributes: Record<string, string | number> = {};

  // Common certificate attribute keys
  const attributeKeys = [
    'rarity',
    'edition',
    'series',
    'attributes',
    'certification_date',
    'expiry_date',
    'issuer',
    'verified',
  ];

  for (const key of attributeKeys) {
    const value = extractMetadataValue(metadata, key);
    if (value) {
      attributes[key] = value;
    }
  }

  return attributes;
}
