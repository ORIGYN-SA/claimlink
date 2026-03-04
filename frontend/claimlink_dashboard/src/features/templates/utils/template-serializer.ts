/**
 * Template Serializer Utility
 *
 * Handles serialization/deserialization of templates for storage in
 * ORIGYN NFT collection metadata.
 *
 * Supports both:
 * - TemplateStructure (legacy format) - stored under 'claimlink.template.structure'
 * - TemplateNode[] (tree format) - stored under 'claimlink.template.tree'
 *
 * The tree format is preferred and will be the only format going forward.
 */

import type { TemplateStructure } from '../types/template.types';
import type { TemplateNode, RootNode } from '@/features/template-renderer/types/origyn-template.types';
import { isRootNode } from '@/features/template-renderer/types/origyn-template.types';
import type { ICRC3Value } from '@/shared/canisters/origyn_nft/interfaces';

// ============================================================================
// Keys for metadata storage
// ============================================================================

/**
 * Key used to store legacy template structure in collection metadata
 * @deprecated Use TEMPLATE_TREE_KEY instead
 */
export const TEMPLATE_STRUCTURE_KEY = 'claimlink.template.structure';

/**
 * Key used to store template tree in collection metadata (preferred)
 */
export const TEMPLATE_TREE_KEY = 'claimlink.template.tree';

// ============================================================================
// Tree Format Serialization (Preferred)
// ============================================================================

/**
 * Serialize TemplateNode[] tree for storage in ORIGYN collection_metadata
 *
 * @param tree - The template tree to serialize
 * @returns Tuple of [key, value] for use with update_collection_metadata
 */
export function serializeTreeForOrigyn(
  tree: TemplateNode[]
): [string, { Text: string }] {
  const serialized = JSON.stringify(tree);
  return [TEMPLATE_TREE_KEY, { Text: serialized }];
}

/**
 * Deserialize TemplateNode[] tree from ORIGYN collection metadata
 *
 * @param metadata - Array of [key, value] pairs from icrc7_collection_metadata
 * @returns The deserialized TemplateNode[], or null if not found or invalid
 */
export function deserializeTreeFromOrigyn(
  metadata: Array<[string, ICRC3Value]>
): TemplateNode[] | null {
  const entry = metadata.find(([key]) => key === TEMPLATE_TREE_KEY);
  if (!entry) {
    return null;
  }

  const [, value] = entry;

  if (!('Text' in value)) {
    console.warn('Template tree value is not Text type:', value);
    return null;
  }

  try {
    const parsed = JSON.parse(value.Text) as TemplateNode[];

    // Basic validation - ensure it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid template tree: not an array');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse template tree JSON:', error);
    return null;
  }
}

/**
 * Check if collection metadata contains a template tree
 */
export function hasTemplateTree(
  metadata: Array<[string, ICRC3Value]>
): boolean {
  return metadata.some(([key]) => key === TEMPLATE_TREE_KEY);
}

// ============================================================================
// Legacy Format Serialization (Deprecated)
// ============================================================================

/**
 * Serialize TemplateStructure for storage in ORIGYN collection_metadata
 *
 * @deprecated Use serializeTreeForOrigyn instead
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
 * @deprecated Use deserializeTreeFromOrigyn instead
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
 * Check if collection metadata contains a legacy template structure
 *
 * @deprecated Use hasTemplateTree instead
 */
export function hasTemplateStructure(
  metadata: Array<[string, ICRC3Value]>
): boolean {
  return metadata.some(([key]) => key === TEMPLATE_STRUCTURE_KEY);
}

// ============================================================================
// Unified Deserialization (reads either format, prefers tree)
// ============================================================================

/**
 * Result type for unified template deserialization
 */
export type DeserializedTemplate =
  | { format: 'tree'; data: TemplateNode[] }
  | { format: 'structure'; data: TemplateStructure }
  | null;

/**
 * Deserialize template from ORIGYN collection metadata.
 * Tries tree format first, falls back to legacy structure format.
 *
 * @param metadata - Array of [key, value] pairs from icrc7_collection_metadata
 * @returns Object with format type and data, or null if not found
 */
export function deserializeTemplate(
  metadata: Array<[string, ICRC3Value]>
): DeserializedTemplate {
  // Try tree format first (preferred)
  const tree = deserializeTreeFromOrigyn(metadata);
  if (tree) {
    return { format: 'tree', data: tree };
  }

  // Fall back to legacy structure format
  const structure = deserializeTemplateFromOrigyn(metadata);
  if (structure) {
    return { format: 'structure', data: structure };
  }

  return null;
}

/**
 * Check if collection metadata contains any template format
 */
export function hasTemplate(
  metadata: Array<[string, ICRC3Value]>
): boolean {
  return hasTemplateTree(metadata) || hasTemplateStructure(metadata);
}

// ============================================================================
// Root Node Extraction
// ============================================================================

/**
 * Extract RootNode from a template tree.
 * Creates a wrapper if the tree doesn't have a proper root node.
 */
export function extractRootNode(tree: TemplateNode[]): RootNode {
  if (tree.length === 1 && isRootNode(tree[0])) {
    return tree[0];
  }

  // Create a wrapper root node
  return {
    type: 'elements',
    id: 'root',
    content: tree,
    languages: [{ key: 'en', name: 'English' }],
  };
}

/**
 * Extract template metadata from a RootNode
 */
export function extractTemplateMetadata(root: RootNode): {
  background?: RootNode['background'];
  languages?: RootNode['languages'];
  searchIndexField?: string;
} {
  return {
    background: root.background,
    languages: root.languages,
    searchIndexField: root.searchIndexField,
  };
}
