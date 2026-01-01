/**
 * Template Serializer Utility
 *
 * Handles serialization/deserialization of TemplateStructure
 * for storage in ORIGYN NFT collection metadata.
 */

import type { TemplateStructure } from '../types/template.types';
import type { ICRC3Value } from '@/shared/canisters/origyn_nft/interfaces';

/**
 * Key used to store template structure in collection metadata
 */
export const TEMPLATE_STRUCTURE_KEY = 'claimlink.template.structure';

/**
 * Serialize TemplateStructure for storage in ORIGYN collection_metadata
 *
 * @param template - The template structure to serialize
 * @returns Tuple of [key, value] for use with update_collection_metadata
 */
export function serializeTemplateForOrigyn(
  template: TemplateStructure
): [string, { Text: string }] {
  const serialized = JSON.stringify(template);
  return [TEMPLATE_STRUCTURE_KEY, { Text: serialized }];
}

/**
 * Deserialize TemplateStructure from ORIGYN collection metadata
 *
 * @param metadata - Array of [key, value] pairs from icrc7_collection_metadata
 * @returns The deserialized TemplateStructure, or null if not found or invalid
 */
export function deserializeTemplateFromOrigyn(
  metadata: Array<[string, ICRC3Value]>
): TemplateStructure | null {
  // Find the template structure entry
  const entry = metadata.find(([key]) => key === TEMPLATE_STRUCTURE_KEY);
  if (!entry) {
    return null;
  }

  const [, value] = entry;

  // Check if value is Text type
  if (!('Text' in value)) {
    console.warn('Template structure value is not Text type:', value);
    return null;
  }

  try {
    const parsed = JSON.parse(value.Text) as TemplateStructure;

    // Basic validation - ensure it has required fields
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      console.warn('Invalid template structure: missing or invalid sections');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse template structure JSON:', error);
    return null;
  }
}

/**
 * Check if collection metadata contains a template structure
 *
 * @param metadata - Array of [key, value] pairs from icrc7_collection_metadata
 * @returns true if template structure exists
 */
export function hasTemplateStructure(
  metadata: Array<[string, ICRC3Value]>
): boolean {
  return metadata.some(([key]) => key === TEMPLATE_STRUCTURE_KEY);
}
