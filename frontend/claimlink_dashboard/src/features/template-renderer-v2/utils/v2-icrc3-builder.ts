/**
 * V2 ICRC3 Builder
 *
 * Builds simplified ICRC3 metadata for v2 tokens:
 * - Field values as flat key-value entries
 * - Single template document copy (no 4x duplication)
 * - Stamps version as '2.0.0'
 *
 * Reuses ICRC3Value construction patterns from the v1 icrc3-converter.
 */

import type { ICRC3Value } from '@canisters/origyn_nft';
import type { V2TemplateDocument } from '../types';
import { TEMPLATE_VERSION_KEY } from '@/features/template-renderer/version';

const V2_TEMPLATE_VERSION = '2.0.0';

/**
 * Check if a value is a LocalizedValue object
 */
function isLocalizedValue(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  if (value instanceof File || value instanceof Date) return false;
  const entries = Object.entries(value);
  if (entries.length === 0) return false;
  return entries.every(([key, val]) =>
    typeof key === 'string' && key.length > 0 && key.length <= 10 && typeof val === 'string'
  );
}

/**
 * Extract primary language value from a LocalizedValue
 */
function extractPrimaryValue(value: Record<string, string>): string {
  return value['en'] || value['EN'] || Object.values(value)[0] || '';
}

/**
 * Get the title/name from form data using semantic fields
 */
function extractTitle(
  formData: Record<string, unknown>,
  templateDocument: V2TemplateDocument
): string {
  const titleField = templateDocument.schema.fields.find((f) => f.semantic === 'title');
  if (titleField) {
    const val = formData[titleField.id];
    if (typeof val === 'string' && val.trim()) return val;
    if (isLocalizedValue(val)) return extractPrimaryValue(val);
  }
  return 'Certificate';
}

/**
 * Get the description from form data using semantic fields
 */
function extractDescription(
  formData: Record<string, unknown>,
  templateDocument: V2TemplateDocument
): string {
  const descField = templateDocument.schema.fields.find((f) => f.semantic === 'description');
  if (descField) {
    const val = formData[descField.id];
    if (typeof val === 'string' && val.trim()) return val;
    if (isLocalizedValue(val)) return extractPrimaryValue(val);
  }
  return '';
}

export interface V2ConvertToIcrc3Options {
  name?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Build ICRC3 metadata for a v2 token.
 *
 * Structure:
 * - Standard fields: name, description, minted_at, version
 * - Per-field entries: each form field as a top-level key
 * - Template document: serialized as JSON under 'claimlink.template.document'
 *
 * @param templateDocument - The v2 template document
 * @param formData - Form data (field ID → value)
 * @param options - Additional options
 * @returns ICRC3 metadata array for minting
 */
export function buildV2Icrc3Metadata(
  templateDocument: V2TemplateDocument,
  formData: Record<string, unknown>,
  options: V2ConvertToIcrc3Options = {}
): Array<[string, ICRC3Value]> {
  const metadata: Array<[string, ICRC3Value]> = [];

  // Standard metadata fields
  const name = options.name || extractTitle(formData, templateDocument);
  const description = options.description || extractDescription(formData, templateDocument);

  metadata.push(['name', { Text: name }]);
  metadata.push(['description', { Text: description }]);
  metadata.push(['minted_at', { Text: new Date().toISOString() }]);
  metadata.push([TEMPLATE_VERSION_KEY, { Text: V2_TEMPLATE_VERSION }]);

  if (options.imageUrl) {
    metadata.push(['image', { Text: options.imageUrl }]);
  }

  // Add form data as individual fields
  for (const [key, value] of Object.entries(formData)) {
    // Skip file fields
    if (value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File)) {
      continue;
    }
    if (value === undefined || value === null) continue;

    if (typeof value === 'string') {
      metadata.push([key, { Text: value }]);
      continue;
    }
    if (typeof value === 'number') {
      metadata.push([key, { Int: BigInt(value) }]);
      continue;
    }
    if (isLocalizedValue(value)) {
      metadata.push([key, { Text: extractPrimaryValue(value) }]);
      const localizedEntries = Object.entries(value).map(
        ([lang, text]) => [lang, { Text: String(text) }] as [string, ICRC3Value]
      );
      metadata.push([`${key}_localized`, { Map: localizedEntries }]);
      continue;
    }
  }

  // Store the template document as a single JSON entry
  metadata.push([
    'claimlink.template.document',
    { Text: JSON.stringify(templateDocument) },
  ]);

  return metadata;
}

/**
 * Parse a V2TemplateDocument from ICRC3 metadata
 */
export function parseV2TemplateFromIcrc3(
  metadata: Array<[string, ICRC3Value]>
): V2TemplateDocument | null {
  const entry = metadata.find(([key]) => key === 'claimlink.template.document');
  if (!entry) return null;

  const value = entry[1];
  if (!('Text' in value)) return null;

  try {
    const parsed = JSON.parse(value.Text) as V2TemplateDocument;
    if (parsed.version === '2.0.0') return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract flat token data from ICRC3 metadata for v2 rendering
 */
export function extractV2TokenData(
  metadata: Array<[string, ICRC3Value]>
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const [key, value] of metadata) {
    // Skip internal/structural keys
    if (key.startsWith('claimlink.template.')) continue;
    if (key === '__apps') continue;

    if ('Text' in value) {
      data[key] = value.Text;
    } else if ('Int' in value) {
      data[key] = Number(value.Int);
    } else if ('Nat' in value) {
      data[key] = Number(value.Nat);
    } else if ('Map' in value) {
      // Could be localized content or file references
      const map: Record<string, unknown> = {};
      for (const [k, v] of value.Map) {
        if ('Text' in v) map[k] = v.Text;
        else map[k] = v;
      }
      data[key] = { content: map, language: true };
    } else if ('Array' in value) {
      data[key] = value.Array.map((item) => {
        if ('Text' in item) return item.Text;
        if ('Map' in item) {
          const obj: Record<string, string> = {};
          for (const [k, v] of item.Map) {
            if ('Text' in v) obj[k] = v.Text;
          }
          return obj;
        }
        return item;
      });
    }
  }

  return data;
}
