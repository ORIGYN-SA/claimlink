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
 *
 * Language codes are typically 2-5 characters (e.g., 'en', 'EN', 'en-US')
 * The value should be an object with string keys and string values only.
 */
function isLocalizedValue(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if (value instanceof File || value instanceof Date) {
    return false;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return false;

  // Check that ALL entries have:
  // - string keys with length <= 10 (allowing for codes like 'en-US', 'zh-Hans')
  // - string values (the translated text)
  return entries.every(([key, val]) =>
    typeof key === 'string' &&
    key.length > 0 &&
    key.length <= 10 &&
    typeof val === 'string'
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
 * Always returns a string (never an object)
 */
function extractFirstValue(
  formData: CertificateFormData,
  fieldIds: readonly string[],
  fallback: string
): string {
  for (const fieldId of fieldIds) {
    const value = formData[fieldId];

    // Handle plain strings
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

    // Handle objects that look like LocalizedValue but might not pass strict check
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Try to extract 'en' or 'EN' value
      const objValue = value as Record<string, unknown>;
      if ('en' in objValue && typeof objValue['en'] === 'string' && objValue['en'].trim()) {
        return objValue['en'];
      }
      if ('EN' in objValue && typeof objValue['EN'] === 'string' && objValue['EN'].trim()) {
        return objValue['EN'];
      }
      // Try first string value
      const firstString = Object.values(objValue).find(v => typeof v === 'string' && (v as string).trim());
      if (typeof firstString === 'string') {
        return firstString;
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
/**
 * Safely extract a string value, handling LocalizedValue objects
 */
function ensureString(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (isLocalizedValue(value)) {
    return extractPrimaryLanguageValue(value);
  }
  if (typeof value === 'object' && value !== null && 'en' in value) {
    const enValue = (value as Record<string, unknown>)['en'];
    if (typeof enValue === 'string') return enValue;
  }
  if (typeof value === 'object' && value !== null) {
    // Last resort - try to get first string value
    const firstString = Object.values(value).find(v => typeof v === 'string');
    if (typeof firstString === 'string') return firstString;
  }
  return fallback;
}

export function convertToIcrc3Metadata(
  apps: OrigynAppEntry[],
  formData: CertificateFormData,
  options: ConvertToIcrc3Options = {}
): Array<[string, ICRC3Value]> {
  const metadata: Array<[string, ICRC3Value]> = [];

  // Extract name from form data or options using RESERVED_FIELDS.TITLE
  // Use ensureString to handle cases where the value might be a LocalizedValue object
  const rawName = options.name || extractFirstValue(formData, RESERVED_FIELDS.TITLE, 'Certificate');
  const name = ensureString(rawName, 'Certificate');

  // Extract description from form data or options using RESERVED_FIELDS.DESCRIPTION
  const rawDescription = options.description || extractFirstValue(formData, RESERVED_FIELDS.DESCRIPTION, '');
  const description = ensureString(rawDescription, '');

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
    // Skip file fields
    if (value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File)) {
      return;
    }

    // Handle strings
    if (typeof value === 'string') {
      metadata.push([key, { Text: value }]);
      return;
    }

    // Handle numbers
    if (typeof value === 'number') {
      metadata.push([key, { Int: BigInt(value) }]);
      return;
    }

    // Handle LocalizedValue objects (multi-language text)
    if (isLocalizedValue(value)) {
      // Store primary value as string for simple querying
      const primaryValue = extractPrimaryLanguageValue(value);
      metadata.push([key, { Text: primaryValue }]);
      // Also store the full localized content with a suffix for multi-language support
      const localizedEntries = Object.entries(value).map(
        ([lang, text]) => [lang, { Text: String(text) }] as [string, ICRC3Value]
      );
      metadata.push([`${key}_localized`, { Map: localizedEntries }]);
      return;
    }

    // Handle any other object as a fallback - convert to JSON string
    // This prevents passing objects where strings are expected
    if (typeof value === 'object' && value !== null) {
      // Try to extract a sensible string value
      if ('en' in value && typeof (value as Record<string, unknown>)['en'] === 'string') {
        // Looks like a LocalizedValue that didn't pass the strict check
        const primaryValue = (value as Record<string, string>)['en'] ||
          (value as Record<string, string>)['EN'] ||
          Object.values(value as Record<string, string>).find(v => typeof v === 'string') ||
          '';
        metadata.push([key, { Text: primaryValue }]);
        // Store localized version too
        const stringEntries = Object.entries(value as Record<string, unknown>)
          .filter(([, v]) => typeof v === 'string')
          .map(([lang, text]) => [lang, { Text: String(text) }] as [string, ICRC3Value]);
        if (stringEntries.length > 0) {
          metadata.push([`${key}_localized`, { Map: stringEntries }]);
        }
        return;
      }
      // For other objects, skip them (they shouldn't be in metadata directly)
      return;
    }

    // Handle undefined/null - skip
    if (value === undefined || value === null) {
      return;
    }

    // Fallback: convert to string
    metadata.push([key, { Text: String(value) }]);
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
