/**
 * ICRC3 Metadata Converter
 *
 * Converts buildOrigynApps output to ICRC3Value metadata format for minting.
 * Uses centralized RESERVED_FIELDS constants for field name lookups.
 */

import type { ICRC3Value } from '@canisters/origyn_nft';
import type { OrigynAppEntry, FileReference, LocalizedContent } from '../types';
import type { CertificateFormData } from '@/features/templates/types/template.types';
import { RESERVED_FIELDS } from '@/shared/constants/reserved-fields';

/**
 * Convert a JavaScript value to ICRC3Value
 */
function toIcrc3Value(value: unknown): ICRC3Value {
  if (value === null || value === undefined) {
    return { Text: '' };
  }

  if (typeof value === 'string') {
    return { Text: value };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { Int: BigInt(value) } : { Text: value.toString() };
  }

  if (typeof value === 'bigint') {
    return { Int: value };
  }

  if (typeof value === 'boolean') {
    return { Text: value.toString() };
  }

  if (Array.isArray(value)) {
    return { Array: value.map(toIcrc3Value) };
  }

  if (typeof value === 'object') {
    // Handle FileReference
    if ('id' in value && 'path' in value) {
      const fileRef = value as FileReference;
      return {
        Map: [
          ['id', { Text: fileRef.id }],
          ['path', { Text: fileRef.path }],
        ],
      };
    }

    // Handle LocalizedContent
    if (Object.keys(value).every((k) => typeof k === 'string' && typeof (value as Record<string, unknown>)[k] === 'string')) {
      const entries = Object.entries(value as LocalizedContent).map(
        ([key, val]) => [key, { Text: val }] as [string, ICRC3Value]
      );
      return { Map: entries };
    }

    // Handle generic object
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, val]) => [key, toIcrc3Value(val)] as [string, ICRC3Value]
    );
    return { Map: entries };
  }

  return { Text: String(value) };
}

/**
 * Convert OrigynAppEntry to ICRC3Value Map
 */
function appEntryToIcrc3(app: OrigynAppEntry): ICRC3Value {
  const entries: Array<[string, ICRC3Value]> = [
    ['app_id', { Text: app.app_id }],
    ['read', { Text: app.read }],
    ['data', toIcrc3Value(app.data)],
  ];

  if (app.write) {
    entries.push(['write', toIcrc3Value(app.write)]);
  }

  if (app.permissions) {
    entries.push(['permissions', toIcrc3Value(app.permissions)]);
  }

  return { Map: entries };
}

/**
 * Convert OrigynAppEntry[] to ICRC3Value Array
 */
function appsToIcrc3(apps: OrigynAppEntry[]): ICRC3Value {
  return { Array: apps.map(appEntryToIcrc3) };
}

/**
 * Options for converting to ICRC3 metadata
 */
export interface ConvertToIcrc3Options {
  /** Name/title of the NFT */
  name?: string;
  /** Description of the NFT */
  description?: string;
  /** Image URL (if already uploaded) */
  imageUrl?: string;
}

/**
 * Check if a value is a LocalizedValue object (has language code keys with string values)
 */
function isLocalizedValue(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if (value instanceof File) {
    return false;
  }
  // Check that all values are strings and keys look like language codes
  const entries = Object.entries(value);
  if (entries.length === 0) return false;
  return entries.every(([key, val]) =>
    typeof key === 'string' && key.length <= 5 && typeof val === 'string'
  );
}

/**
 * Extract the primary (default) language value from a LocalizedValue
 */
function extractPrimaryLanguageValue(value: Record<string, string>): string {
  // Prefer 'en' (English) as default, then lowercase 'en', then first available
  return value['en'] || value['EN'] || Object.values(value)[0] || '';
}

/**
 * Helper to extract first non-empty string value from form data using a list of field IDs
 * Handles both plain strings and LocalizedValue objects
 */
function extractFirstValue(
  formData: CertificateFormData,
  fieldIds: readonly string[],
  fallback: string
): string {
  for (const fieldId of fieldIds) {
    const value = formData[fieldId];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    // Handle LocalizedValue objects - extract the primary language
    if (isLocalizedValue(value)) {
      const primaryValue = extractPrimaryLanguageValue(value);
      if (primaryValue.trim()) {
        return primaryValue;
      }
    }
  }
  return fallback;
}

/**
 * Convert buildOrigynApps output to ICRC3 metadata array for minting
 *
 * @param apps - The __apps array from buildOrigynApps
 * @param formData - Original form data (for extracting name/description)
 * @param options - Additional options
 * @returns ICRC3 metadata array ready for minting
 */
export function convertToIcrc3Metadata(
  apps: OrigynAppEntry[],
  formData: CertificateFormData,
  options: ConvertToIcrc3Options = {}
): Array<[string, ICRC3Value]> {
  const metadata: Array<[string, ICRC3Value]> = [];

  // Extract name from form data or options using RESERVED_FIELDS.TITLE
  const name =
    options.name ||
    extractFirstValue(formData, RESERVED_FIELDS.TITLE, 'Certificate');

  // Extract description from form data or options using RESERVED_FIELDS.DESCRIPTION
  const description =
    options.description ||
    extractFirstValue(formData, RESERVED_FIELDS.DESCRIPTION, '');

  // Add standard metadata fields
  metadata.push(['name', { Text: name }]);
  metadata.push(['description', { Text: description }]);
  metadata.push(['minted_at', { Text: new Date().toISOString() }]);

  // Add image if provided
  if (options.imageUrl) {
    metadata.push(['image', { Text: options.imageUrl }]);
  }

  // Add form data as individual fields (for backward compatibility and querying)
  Object.entries(formData).forEach(([key, value]) => {
    // Skip complex objects (files, etc.)
    if (typeof value === 'string') {
      metadata.push([key, { Text: value }]);
    } else if (typeof value === 'number') {
      metadata.push([key, { Int: BigInt(value) }]);
    } else if (isLocalizedValue(value)) {
      // Handle LocalizedValue - store primary value as string and full translations as Map
      const primaryValue = extractPrimaryLanguageValue(value);
      metadata.push([key, { Text: primaryValue }]);
      // Also store the full localized content with a suffix for multi-language support
      const localizedEntries = Object.entries(value).map(
        ([lang, text]) => [lang, { Text: text }] as [string, ICRC3Value]
      );
      metadata.push([`${key}_localized`, { Map: localizedEntries }]);
    }
  });

  // Add the complete __apps structure
  metadata.push(['__apps', appsToIcrc3(apps)]);

  return metadata;
}

/**
 * Helper to extract a simple value from ICRC3Value
 */
export function extractIcrc3Value(value: ICRC3Value): string | number | undefined {
  if ('Text' in value) return value.Text;
  if ('Int' in value) return Number(value.Int);
  if ('Nat' in value) return Number(value.Nat);
  return undefined;
}

/**
 * Helper to find a field in ICRC3 metadata array
 */
export function findIcrc3Field(
  metadata: Array<[string, ICRC3Value]>,
  key: string
): ICRC3Value | undefined {
  const entry = metadata.find(([k]) => k === key);
  return entry?.[1];
}
