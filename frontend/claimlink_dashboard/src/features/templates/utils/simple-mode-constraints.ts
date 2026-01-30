/**
 * Simple Mode Constraints
 *
 * Simple mode provides a constrained editing experience with:
 * - Two fixed sections: Certificate and Information
 * - Limited node types (field, image, gallery, video, title)
 * - No nested layouts (columns within columns, etc.)
 *
 * This allows users to build templates without understanding the full
 * ORIGYN tree structure, while still producing valid templates.
 */

import type {
  TemplateNode,
  TemplateNodeType,
  RootNode,
  SectionNode,
  FieldNode,
  TitleNode,
  ImageNode,
  GalleryNode,
  VideoNode,
  LocalizedContent,
  TemplateLanguageConfig,
} from '@/features/template-renderer/types/origyn-template.types';
import {
  isRootNode,
  isSectionNode,
} from '@/features/template-renderer/types/origyn-template.types';
import {
  generateNodeId,
  getSectionNodes,
  getNodeChildren,
  createSectionNode,
  toLocalizedContent,
} from './template-tree-utils';

// ============================================================================
// Simple Mode Constants
// ============================================================================

/**
 * Section names allowed in simple mode
 */
export const SIMPLE_MODE_SECTIONS = ['certificate', 'information'] as const;
export type SimpleModeSection = typeof SIMPLE_MODE_SECTIONS[number];

/**
 * Node types allowed in simple mode (within sections)
 */
export const SIMPLE_MODE_NODE_TYPES: TemplateNodeType[] = [
  'field',
  'image',
  'gallery',
  'video',
  'title',
  'separator',
  'valueField',
];

/**
 * UI field types available in simple mode editor
 */
export type SimpleFieldType =
  | 'input'      // Maps to 'field' node
  | 'textarea'   // Maps to 'valueField' node
  | 'date'       // Maps to 'field' node with date handling
  | 'badge'      // Maps to 'field' node (display-only)
  | 'image'      // Maps to 'image' node
  | 'gallery'    // Maps to 'gallery' node
  | 'video'      // Maps to 'video' node
  | 'title'      // Maps to 'title' node
  | 'readonly';  // Maps to 'field' node (immutable)

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if a template tree is valid for simple mode editing
 */
export function isValidSimpleModeTemplate(nodes: TemplateNode[]): boolean {
  if (nodes.length === 0) return true; // Empty is valid

  const root = nodes[0];

  // Must have a root node or be an array that can become a root
  if (!isRootNode(root) && root.type !== 'elements') {
    // Check if it's a columns wrapper (acceptable)
    if (root.type !== 'columns') {
      return false;
    }
  }

  // Get all sections
  const sections = getSectionNodes(nodes);

  // Check all section names are valid
  for (const section of sections) {
    const sectionName = section.title?.en?.toLowerCase() || section.id?.toLowerCase();
    if (sectionName && !SIMPLE_MODE_SECTIONS.includes(sectionName as SimpleModeSection)) {
      // Allow sections with other names, just warn in UI
    }
  }

  // Check all nodes within sections are simple mode types
  for (const section of sections) {
    const content = section.content || [];
    if (!validateSimpleModeNodes(content)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if all nodes in an array are valid for simple mode
 */
function validateSimpleModeNodes(nodes: TemplateNode[]): boolean {
  for (const node of nodes) {
    // Elements containers are OK (for grouping)
    if (node.type === 'elements') {
      const children = getNodeChildren(node);
      if (!validateSimpleModeNodes(children)) {
        return false;
      }
      continue;
    }

    // Check if type is allowed
    if (!SIMPLE_MODE_NODE_TYPES.includes(node.type)) {
      return false;
    }
  }
  return true;
}

/**
 * Get validation warnings for a template in simple mode
 */
export interface SimpleModeWarning {
  type: 'unsupported_node' | 'unknown_section' | 'nested_layout';
  message: string;
  nodeId?: string;
}

export function getSimpleModeWarnings(nodes: TemplateNode[]): SimpleModeWarning[] {
  const warnings: SimpleModeWarning[] = [];

  function checkNodes(nodeList: TemplateNode[], depth: number = 0) {
    for (const node of nodeList) {
      // Warn about unsupported node types
      if (!SIMPLE_MODE_NODE_TYPES.includes(node.type) &&
          node.type !== 'elements' &&
          node.type !== 'columns' &&
          node.type !== 'section') {
        warnings.push({
          type: 'unsupported_node',
          message: `Node type "${node.type}" is not supported in simple mode`,
          nodeId: node.id,
        });
      }

      // Warn about nested layouts (columns within columns)
      if (node.type === 'columns' && depth > 1) {
        warnings.push({
          type: 'nested_layout',
          message: 'Nested column layouts are not supported in simple mode',
          nodeId: node.id,
        });
      }

      const children = getNodeChildren(node);
      if (children.length > 0) {
        checkNodes(children, depth + 1);
      }
    }
  }

  // Check sections
  const sections = getSectionNodes(nodes);
  for (const section of sections) {
    const sectionName = section.title?.en?.toLowerCase() || section.id?.toLowerCase();
    if (sectionName && !SIMPLE_MODE_SECTIONS.includes(sectionName as SimpleModeSection)) {
      warnings.push({
        type: 'unknown_section',
        message: `Section "${section.title?.en || section.id}" is not a standard simple mode section`,
        nodeId: section.id,
      });
    }
  }

  checkNodes(nodes);
  return warnings;
}

// ============================================================================
// Simple Mode Node Creation
// ============================================================================

/**
 * Create a field node for simple mode
 */
export function createSimpleFieldNode(
  fieldId: string,
  label: string,
  languages: TemplateLanguageConfig[] = [{ key: 'en', name: 'English' }]
): FieldNode {
  return {
    type: 'field',
    id: generateNodeId(),
    title: toLocalizedContent(label, languages),
    fields: [fieldId],
  };
}

/**
 * Create a title node for simple mode
 */
export function createSimpleTitleNode(
  text: string,
  languages: TemplateLanguageConfig[] = [{ key: 'en', name: 'English' }],
  className?: string
): TitleNode {
  return {
    type: 'title',
    id: generateNodeId(),
    title: toLocalizedContent(text, languages),
    className,
  };
}

/**
 * Create an image node for simple mode
 */
export function createSimpleImageNode(fieldId: string): ImageNode {
  return {
    type: 'image',
    id: generateNodeId(),
    field: fieldId,
  };
}

/**
 * Create a gallery node for simple mode
 */
export function createSimpleGalleryNode(pointerId: string): GalleryNode {
  return {
    type: 'gallery',
    id: generateNodeId(),
    pointer: pointerId,
    field: pointerId,
  };
}

/**
 * Create a video node for simple mode
 */
export function createSimpleVideoNode(fieldId: string): VideoNode {
  return {
    type: 'video',
    id: generateNodeId(),
    field: fieldId,
  };
}

// ============================================================================
// Simple Mode Template Creation
// ============================================================================

/**
 * Create a new empty simple mode template
 */
export function createSimpleModeTemplate(
  options: {
    languages?: TemplateLanguageConfig[];
  } = {}
): RootNode {
  const languages = options.languages || [{ key: 'en', name: 'English' }];

  return {
    type: 'elements',
    id: 'root',
    content: [
      createSectionNode('Certificate', {
        id: 'certificate',
        title: toLocalizedContent('Certificate', languages),
      }),
      createSectionNode('Information', {
        id: 'information',
        title: toLocalizedContent('Information', languages),
      }),
    ],
    languages,
  };
}

/**
 * Add a field to a section in simple mode
 *
 * @param nodes - Template tree
 * @param sectionId - Target section ID ('certificate' or 'information')
 * @param fieldType - Type of field to add
 * @param fieldId - ID for the metadata field
 * @param label - Display label for the field
 * @param languages - Language configuration
 * @returns Updated template tree
 */
export function addFieldToSection(
  nodes: TemplateNode[],
  sectionId: string,
  fieldType: SimpleFieldType,
  fieldId: string,
  label: string,
  languages: TemplateLanguageConfig[] = [{ key: 'en', name: 'English' }]
): TemplateNode[] {
  // Create the appropriate node type
  let newNode: TemplateNode;

  switch (fieldType) {
    case 'input':
    case 'date':
    case 'badge':
    case 'readonly':
      newNode = createSimpleFieldNode(fieldId, label, languages);
      break;
    case 'textarea':
      newNode = {
        type: 'valueField',
        id: generateNodeId(),
        fields: [fieldId],
        className: 'expirianceTextBlock',
      };
      break;
    case 'image':
      newNode = createSimpleImageNode(fieldId);
      break;
    case 'gallery':
      newNode = createSimpleGalleryNode(fieldId);
      break;
    case 'video':
      newNode = createSimpleVideoNode(fieldId);
      break;
    case 'title':
      newNode = createSimpleTitleNode(label, languages);
      break;
    default:
      newNode = createSimpleFieldNode(fieldId, label, languages);
  }

  // Find and update the section
  return updateSection(nodes, sectionId, (section) => ({
    ...section,
    content: [...(section.content || []), newNode],
  }));
}

/**
 * Remove a field from a section
 */
export function removeFieldFromSection(
  nodes: TemplateNode[],
  sectionId: string,
  nodeId: string
): TemplateNode[] {
  return updateSection(nodes, sectionId, (section) => ({
    ...section,
    content: (section.content || []).filter((n) => n.id !== nodeId),
  }));
}

/**
 * Reorder fields within a section
 */
export function reorderFieldsInSection(
  nodes: TemplateNode[],
  sectionId: string,
  activeId: string,
  overId: string
): TemplateNode[] {
  return updateSection(nodes, sectionId, (section) => {
    const content = [...(section.content || [])];
    const oldIndex = content.findIndex((n) => n.id === activeId);
    const newIndex = content.findIndex((n) => n.id === overId);

    if (oldIndex === -1 || newIndex === -1) return section;

    const [removed] = content.splice(oldIndex, 1);
    content.splice(newIndex, 0, removed);

    return { ...section, content };
  });
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Update a section by ID with a transformation function
 */
function updateSection(
  nodes: TemplateNode[],
  sectionId: string,
  transform: (section: SectionNode) => SectionNode
): TemplateNode[] {
  return nodes.map((node) => {
    if (isSectionNode(node) && node.id === sectionId) {
      return transform(node);
    }

    if ('content' in node && Array.isArray(node.content)) {
      const updatedContent = updateSection(node.content, sectionId, transform);
      if (updatedContent !== node.content) {
        return { ...node, content: updatedContent } as TemplateNode;
      }
    }

    return node;
  });
}

/**
 * Get section content for simple mode editing
 */
export function getSectionContent(
  nodes: TemplateNode[],
  sectionId: string
): TemplateNode[] {
  const sections = getSectionNodes(nodes);
  const section = sections.find((s) => s.id === sectionId);
  return section?.content || [];
}
