/**
 * Template Tree Utilities
 *
 * These utilities provide immutable operations on TemplateNode[] trees.
 * All operations return new arrays/objects rather than mutating in place.
 *
 * The template tree structure uses RootNode as the top-level container,
 * with nested nodes for layout (columns, elements, section) and content
 * (field, image, gallery, video, etc.).
 *
 * @example
 * // Add a field to a section
 * const newTree = addNode(tree, 'certificate-section', newFieldNode);
 *
 * // Find all field nodes
 * const fields = findNodesByType(tree, 'field');
 */

import type {
  TemplateNode,
  TemplateNodeType,
  RootNode,
  SectionNode,
  LocalizedContent,
  TemplateBackground,
  TemplateLanguageConfig,
} from '@/features/template-renderer/types/origyn-template.types';
import {
  isRootNode,
  isFieldNode,
} from '@/features/template-renderer/types/origyn-template.types';

// ============================================================================
// Types
// ============================================================================

/**
 * Form field extracted from a template node for form generation
 */
export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'image' | 'gallery' | 'video' | 'badge';
  label: string;
  required?: boolean;
  immutable?: boolean;
  description?: string;
  /** For image fields */
  multiple?: boolean;
  maxImages?: number;
  /** For gallery fields with video support */
  acceptVideo?: boolean;
  /** Section this field belongs to */
  sectionId?: string;
  sectionName?: string;
}

/**
 * Result of node search operations
 */
export interface NodeSearchResult {
  node: TemplateNode;
  path: string[]; // Array of node IDs from root to this node
  parentId: string | null;
}

// ============================================================================
// Node ID Generation
// ============================================================================

/**
 * Generate a unique ID for template nodes
 */
export function generateNodeId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// ============================================================================
// Tree Traversal & Search
// ============================================================================

/**
 * Find a node by ID in the tree
 *
 * @param nodes - Array of nodes to search
 * @param id - ID to find
 * @returns The node if found, null otherwise
 */
export function findNodeById(
  nodes: TemplateNode[],
  id: string
): TemplateNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    // Search in child nodes
    const children = getNodeChildren(node);
    if (children.length > 0) {
      const found = findNodeById(children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find a node by ID with its path from root
 */
export function findNodeWithPath(
  nodes: TemplateNode[],
  id: string,
  currentPath: string[] = [],
  parentId: string | null = null
): NodeSearchResult | null {
  for (const node of nodes) {
    const nodePath = node.id ? [...currentPath, node.id] : currentPath;

    if (node.id === id) {
      return { node, path: nodePath, parentId };
    }

    const children = getNodeChildren(node);
    if (children.length > 0) {
      const found = findNodeWithPath(children, id, nodePath, node.id || null);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find all nodes of a specific type
 *
 * @param nodes - Array of nodes to search
 * @param type - Node type to find
 * @returns Array of matching nodes
 */
export function findNodesByType<T extends TemplateNode>(
  nodes: TemplateNode[],
  type: TemplateNodeType
): T[] {
  const results: T[] = [];

  function traverse(nodeList: TemplateNode[]) {
    for (const node of nodeList) {
      if (node.type === type) {
        results.push(node as T);
      }

      const children = getNodeChildren(node);
      if (children.length > 0) {
        traverse(children);
      }
    }
  }

  traverse(nodes);
  return results;
}

/**
 * Find the parent node of a given node ID
 */
export function findParentNode(
  nodes: TemplateNode[],
  childId: string
): TemplateNode | null {
  for (const node of nodes) {
    const children = getNodeChildren(node);

    // Check if any child has the target ID
    if (children.some((child) => child.id === childId)) {
      return node;
    }

    // Recursively search in children
    if (children.length > 0) {
      const found = findParentNode(children, childId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get all section nodes from a template tree
 */
export function getSectionNodes(nodes: TemplateNode[]): SectionNode[] {
  return findNodesByType<SectionNode>(nodes, 'section');
}

/**
 * Get all field IDs from a template tree (for validation)
 */
export function getAllFieldIds(nodes: TemplateNode[]): string[] {
  const ids: string[] = [];

  function traverse(nodeList: TemplateNode[]) {
    for (const node of nodeList) {
      // Field nodes have an ID
      if (isFieldNode(node) && node.id) {
        ids.push(node.id);
      }

      // Also check 'fields' array on nodes that reference metadata
      if ('fields' in node && Array.isArray(node.fields)) {
        ids.push(...node.fields);
      }

      // Check 'field' property on image/video nodes
      if ('field' in node && typeof node.field === 'string') {
        ids.push(node.field);
      }

      // Check 'pointer' property on gallery nodes
      if ('pointer' in node && typeof node.pointer === 'string') {
        ids.push(node.pointer);
      }

      const children = getNodeChildren(node);
      if (children.length > 0) {
        traverse(children);
      }
    }
  }

  traverse(nodes);

  // Return unique IDs
  return [...new Set(ids)];
}

// ============================================================================
// Tree Modification (Immutable)
// ============================================================================

/**
 * Add a node as a child of the specified parent
 *
 * @param nodes - Root node array
 * @param parentId - ID of the parent node
 * @param newNode - Node to add
 * @param index - Optional index to insert at (defaults to end)
 * @returns New tree with the node added
 */
export function addNode(
  nodes: TemplateNode[],
  parentId: string,
  newNode: TemplateNode,
  index?: number
): TemplateNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      const children = getNodeChildren(node);
      const newChildren =
        index !== undefined
          ? [...children.slice(0, index), newNode, ...children.slice(index)]
          : [...children, newNode];

      return setNodeChildren(node, newChildren);
    }

    const children = getNodeChildren(node);
    if (children.length > 0) {
      const newChildren = addNode(children, parentId, newNode, index);
      if (newChildren !== children) {
        return setNodeChildren(node, newChildren);
      }
    }

    return node;
  });
}

/**
 * Remove a node by ID
 *
 * @param nodes - Root node array
 * @param nodeId - ID of the node to remove
 * @returns New tree with the node removed
 */
export function removeNode(
  nodes: TemplateNode[],
  nodeId: string
): TemplateNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => {
      const children = getNodeChildren(node);
      if (children.length > 0) {
        const newChildren = removeNode(children, nodeId);
        if (newChildren !== children) {
          return setNodeChildren(node, newChildren);
        }
      }
      return node;
    });
}

/**
 * Update a node by ID with partial updates
 *
 * @param nodes - Root node array
 * @param nodeId - ID of the node to update
 * @param updates - Partial node properties to merge
 * @returns New tree with the node updated
 */
export function updateNode<T extends TemplateNode>(
  nodes: TemplateNode[],
  nodeId: string,
  updates: Partial<T>
): TemplateNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updates } as TemplateNode;
    }

    const children = getNodeChildren(node);
    if (children.length > 0) {
      const newChildren = updateNode(children, nodeId, updates);
      if (newChildren !== children) {
        return setNodeChildren(node, newChildren);
      }
    }

    return node;
  });
}

/**
 * Move a node to a new parent at a specific index
 *
 * @param nodes - Root node array
 * @param nodeId - ID of the node to move
 * @param newParentId - ID of the new parent
 * @param newIndex - Index within the new parent's children
 * @returns New tree with the node moved
 */
export function moveNode(
  nodes: TemplateNode[],
  nodeId: string,
  newParentId: string,
  newIndex: number
): TemplateNode[] {
  // Find and extract the node
  const nodeToMove = findNodeById(nodes, nodeId);
  if (!nodeToMove) return nodes;

  // Remove from current location
  let result = removeNode(nodes, nodeId);

  // Add to new location
  result = addNode(result, newParentId, nodeToMove, newIndex);

  return result;
}

/**
 * Reorder children within a parent node
 *
 * @param nodes - Root node array
 * @param parentId - ID of the parent whose children to reorder
 * @param activeId - ID of the node being moved
 * @param overId - ID of the node to place before/after
 * @returns New tree with children reordered
 */
export function reorderChildren(
  nodes: TemplateNode[],
  parentId: string,
  activeId: string,
  overId: string
): TemplateNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      const children = [...getNodeChildren(node)];
      const oldIndex = children.findIndex((n) => n.id === activeId);
      const newIndex = children.findIndex((n) => n.id === overId);

      if (oldIndex === -1 || newIndex === -1) return node;

      // Move item from oldIndex to newIndex
      const [removed] = children.splice(oldIndex, 1);
      children.splice(newIndex, 0, removed);

      return setNodeChildren(node, children);
    }

    const children = getNodeChildren(node);
    if (children.length > 0) {
      const newChildren = reorderChildren(children, parentId, activeId, overId);
      if (newChildren !== children) {
        return setNodeChildren(node, newChildren);
      }
    }

    return node;
  });
}

// ============================================================================
// Node Children Helpers
// ============================================================================

/**
 * Get children of a node (handles different node types)
 */
export function getNodeChildren(node: TemplateNode): TemplateNode[] {
  if ('content' in node && Array.isArray(node.content)) {
    return node.content;
  }
  return [];
}

/**
 * Set children on a node (returns a new node)
 */
export function setNodeChildren(
  node: TemplateNode,
  children: TemplateNode[]
): TemplateNode {
  if ('content' in node) {
    return { ...node, content: children } as TemplateNode;
  }
  return node;
}

// ============================================================================
// Root Node Helpers
// ============================================================================

/**
 * Create a new empty root node
 */
export function createRootNode(
  options: {
    background?: TemplateBackground;
    languages?: TemplateLanguageConfig[];
    searchIndexField?: string;
  } = {}
): RootNode {
  return {
    type: 'elements',
    id: 'root',
    content: [],
    languages: options.languages || [{ key: 'en', name: 'English' }],
    background: options.background,
    searchIndexField: options.searchIndexField,
  };
}

/**
 * Get the root node from a template tree
 * If the first node is a RootNode, return it.
 * Otherwise, create a wrapper RootNode.
 */
export function getRootNode(nodes: TemplateNode[]): RootNode {
  if (nodes.length === 1 && isRootNode(nodes[0])) {
    return nodes[0];
  }

  // Wrap in a root node
  return {
    type: 'elements',
    id: 'root',
    content: nodes,
    languages: [{ key: 'en', name: 'English' }],
  };
}

/**
 * Update root node properties
 */
export function updateRootNode(
  nodes: TemplateNode[],
  updates: Partial<Pick<RootNode, 'background' | 'languages' | 'searchIndexField'>>
): TemplateNode[] {
  if (nodes.length === 1 && isRootNode(nodes[0])) {
    return [{ ...nodes[0], ...updates }];
  }

  // If no root node exists, create one
  const root = getRootNode(nodes);
  return [{ ...root, ...updates }];
}

// ============================================================================
// Section Helpers
// ============================================================================

/**
 * Create a new section node
 */
export function createSectionNode(
  name: string,
  options: {
    id?: string;
    title?: LocalizedContent;
    content?: TemplateNode[];
    className?: string;
  } = {}
): SectionNode {
  return {
    type: 'section',
    id: options.id || generateNodeId(),
    title: options.title || { en: name },
    content: options.content || [],
    className: options.className,
  };
}

/**
 * Get or create sections for simple mode
 * Simple mode expects 'Certificate' and 'Information' sections
 */
export function ensureSimpleModeSections(nodes: TemplateNode[]): TemplateNode[] {
  const root = getRootNode(nodes);
  const sections = getSectionNodes([root]);

  const hasCertificate = sections.some(
    (s) => s.id === 'certificate' || s.title.en?.toLowerCase() === 'certificate'
  );
  const hasInformation = sections.some(
    (s) => s.id === 'information' || s.title.en?.toLowerCase() === 'information'
  );

  let content = [...root.content];

  if (!hasCertificate) {
    content.push(
      createSectionNode('Certificate', { id: 'certificate' })
    );
  }

  if (!hasInformation) {
    content.push(
      createSectionNode('Information', { id: 'information' })
    );
  }

  return [{ ...root, content }];
}

// ============================================================================
// Field Extraction (for form generation)
// ============================================================================

/**
 * Extract form fields from a template tree.
 * Used to generate dynamic forms for certificate creation.
 */
export function extractFormFields(nodes: TemplateNode[]): FormField[] {
  const fields: FormField[] = [];
  const sections = getSectionNodes(nodes);

  for (const section of sections) {
    const sectionId = section.id || '';
    const sectionName = section.title?.en || '';

    // Traverse section content to extract fields
    traverseForFields(section.content || [], sectionId, sectionName, fields);
  }

  // Also check top-level nodes (not in sections)
  const root = nodes[0];
  if (root && 'content' in root) {
    const topLevelNodes = (root.content || []).filter(
      (n) => n.type !== 'section'
    );
    traverseForFields(topLevelNodes, '', '', fields);
  }

  return fields;
}

/**
 * Helper to traverse nodes and extract field information
 */
function traverseForFields(
  nodes: TemplateNode[],
  sectionId: string,
  sectionName: string,
  fields: FormField[]
): void {
  for (const node of nodes) {
    // Handle field nodes
    if (node.type === 'field' && isFieldNode(node)) {
      const fieldId = node.fields?.[0] || node.id || generateNodeId();
      fields.push({
        id: fieldId,
        type: 'text',
        label: node.title?.en || fieldId,
        sectionId,
        sectionName,
      });
    }

    // Handle image nodes
    if (node.type === 'image' && 'field' in node) {
      fields.push({
        id: node.field as string,
        type: 'image',
        label: node.id || node.field as string,
        sectionId,
        sectionName,
      });
    }

    // Handle gallery nodes
    if (node.type === 'gallery' && 'pointer' in node) {
      fields.push({
        id: node.pointer as string,
        type: 'gallery',
        label: node.id || node.pointer as string,
        multiple: true,
        sectionId,
        sectionName,
      });
    }

    // Handle video nodes
    if (node.type === 'video' && 'field' in node) {
      fields.push({
        id: node.field as string,
        type: 'video',
        label: node.id || node.field as string,
        sectionId,
        sectionName,
      });
    }

    // Handle valueField nodes (these reference metadata fields)
    if (node.type === 'valueField' && 'fields' in node) {
      for (const fieldRef of node.fields || []) {
        // Only add if not already added
        if (!fields.some((f) => f.id === fieldRef)) {
          fields.push({
            id: fieldRef,
            type: 'text',
            label: fieldRef,
            sectionId,
            sectionName,
          });
        }
      }
    }

    // Recurse into child nodes
    const children = getNodeChildren(node);
    if (children.length > 0) {
      traverseForFields(children, sectionId, sectionName, fields);
    }
  }
}

// ============================================================================
// Localized Content Helpers
// ============================================================================

/**
 * Create localized content from a string
 */
export function toLocalizedContent(
  text: string,
  languages: TemplateLanguageConfig[] = [{ key: 'en', name: 'English' }]
): LocalizedContent {
  const content: LocalizedContent = {};
  languages.forEach((lang) => {
    content[lang.key] = text;
  });
  if (!content['en']) {
    content['en'] = text;
  }
  return content;
}

/**
 * Get text from localized content for a specific language
 */
export function getLocalizedText(
  content: LocalizedContent | undefined,
  language: string = 'en'
): string {
  if (!content) return '';
  return content[language] || content['en'] || Object.values(content)[0] || '';
}
