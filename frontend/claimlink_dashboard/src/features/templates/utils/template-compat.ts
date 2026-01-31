/**
 * Template Compatibility Layer
 *
 * Provides utilities for working with templates regardless of which format
 * they're in (legacy TemplateStructure or new TemplateNode[] tree).
 *
 * During the migration period, components should use these utilities to
 * access template data. After migration is complete, this file can be
 * simplified or removed.
 */

import type {
  Template,
  TemplateStructure,
  TemplateSection,
  TemplateItem,
  TemplateLanguage,
  TitleItem,
  InputItem,
  BadgeItem,
  ImageItem,
} from '../types/template.types';
import type {
  TemplateNode,
  RootNode,
  SectionNode,
  FieldNode,
  TitleNode,
  ImageNode,
  GalleryNode,
  VideoNode,
  ValueFieldNode,
  TemplateLanguageConfig,
} from '@/features/template-renderer/types/origyn-template.types';
import { isRootNode } from '@/features/template-renderer/types/origyn-template.types';
import {
  generateNodeId,
  getSectionNodes,
  toLocalizedContent,
  createRootNode,
} from './template-tree-utils';

// ============================================================================
// Format Detection
// ============================================================================

/**
 * Template format type
 */
export type TemplateFormat = 'tree' | 'structure' | 'empty';

/**
 * Determine which format a template is using
 */
export function getTemplateFormat(template: Template): TemplateFormat {
  if (template.tree && template.tree.length > 0) {
    return 'tree';
  }
  if (template.structure && template.structure.sections) {
    return 'structure';
  }
  return 'empty';
}

/**
 * Check if template uses tree format
 */
export function hasTreeFormat(template: Template): boolean {
  return getTemplateFormat(template) === 'tree';
}

/**
 * Check if template uses legacy structure format
 */
export function hasStructureFormat(template: Template): boolean {
  return getTemplateFormat(template) === 'structure';
}

// ============================================================================
// Format Conversion: Structure → Tree
// ============================================================================

/**
 * Convert a TemplateStructure to TemplateNode[] tree format
 */
export function convertStructureToTree(structure: TemplateStructure): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map((lang) => ({
    key: lang.code,
    name: lang.name,
  })) || [{ key: 'en', name: 'English' }];

  // Create root node
  const root: RootNode = {
    type: 'elements',
    id: 'root',
    content: [],
    languages,
    searchIndexField: structure.searchIndexField,
    background: structure.background,
  };

  // Convert sections
  for (const section of structure.sections || []) {
    const sectionNode = convertSectionToNode(section, languages);
    root.content.push(sectionNode);
  }

  return [root];
}

/**
 * Convert a TemplateSection to a SectionNode
 */
function convertSectionToNode(
  section: TemplateSection,
  languages: TemplateLanguageConfig[]
): SectionNode {
  const sectionNode: SectionNode = {
    type: 'section',
    id: section.id,
    title: toLocalizedContent(section.name, languages),
    content: [],
    className: section.collapsible ? 'collapsible' : undefined,
  };

  // Sort items by order and convert each
  const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

  for (const item of sortedItems) {
    const nodes = convertItemToNodes(item, languages);
    sectionNode.content!.push(...nodes);
  }

  return sectionNode;
}

/**
 * Convert a TemplateItem to TemplateNode(s)
 */
function convertItemToNodes(
  item: TemplateItem,
  languages: TemplateLanguageConfig[]
): TemplateNode[] {
  switch (item.type) {
    case 'title': {
      const titleItem = item as TitleItem;
      return [{
        type: 'title',
        id: generateNodeId(),
        title: toLocalizedContent(titleItem.defaultValue || titleItem.label, languages),
        className: titleItem.style === 'h1' ? 'mainTitle' : undefined,
      } as TitleNode];
    }

    case 'input': {
      const inputItem = item as InputItem;
      if (inputItem.inputType === 'textarea' || inputItem.multiline) {
        // Textarea becomes title + valueField
        return [
          {
            type: 'title',
            id: generateNodeId(),
            title: toLocalizedContent(inputItem.label, languages),
          } as TitleNode,
          {
            type: 'valueField',
            id: generateNodeId(),
            fields: [item.id],
            className: 'expirianceTextBlock',
          } as ValueFieldNode,
        ];
      }
      // Regular input becomes field node
      return [{
        type: 'field',
        id: generateNodeId(),
        title: toLocalizedContent(inputItem.label, languages),
        fields: [item.id],
      } as FieldNode];
    }

    case 'badge': {
      // Badge displays just the value without a label (e.g., "100% Made in Italy")
      return [{
        type: 'valueField',
        id: generateNodeId(),
        fields: [item.id],
        className: 'badgeValue',
      } as ValueFieldNode];
    }

    case 'image': {
      const imageItem = item as ImageItem;
      if (imageItem.multiple) {
        return [{
          type: 'gallery',
          id: generateNodeId(),
          pointer: item.id,
          field: item.id,
        } as GalleryNode];
      }
      return [{
        type: 'image',
        id: generateNodeId(),
        field: item.id,
      } as ImageNode];
    }

    case 'video': {
      return [{
        type: 'video',
        id: generateNodeId(),
        field: item.id,
      } as VideoNode];
    }

    case 'readonly': {
      return [{
        type: 'field',
        id: generateNodeId(),
        title: toLocalizedContent(item.label, languages),
        fields: [item.id],
      } as FieldNode];
    }

    default:
      console.warn(`Unknown item type: ${(item as any).type}`);
      return [];
  }
}

// ============================================================================
// Unified Access (works with either format)
// ============================================================================

/**
 * Represents a section in unified format (for UI consumption)
 */
export interface UnifiedSection {
  id: string;
  name: string;
  order: number;
  items: UnifiedItem[];
  collapsible?: boolean;
  description?: string;
}

/**
 * Represents an item in unified format (for UI consumption)
 */
export interface UnifiedItem {
  id: string;
  nodeId?: string; // ID of the tree node (for tree format)
  type: 'title' | 'input' | 'badge' | 'image' | 'video' | 'readonly';
  label: string;
  order: number;
  required?: boolean;
  immutable?: boolean;
  description?: string;
  // Type-specific properties
  inputType?: 'text' | 'number' | 'textarea' | 'email' | 'url' | 'date';
  placeholder?: string;
  multiple?: boolean;
  maxImages?: number;
  acceptVideo?: boolean;
  badgeStyle?: string;
  defaultValue?: string;
}

/**
 * Get sections from a template in unified format
 * Works with either tree or structure format
 */
export function getUnifiedSections(template: Template): UnifiedSection[] {
  const format = getTemplateFormat(template);

  if (format === 'tree') {
    return getUnifiedSectionsFromTree(template.tree!);
  }

  if (format === 'structure') {
    return getUnifiedSectionsFromStructure(template.structure!);
  }

  return [];
}

/**
 * Get sections from tree format
 */
function getUnifiedSectionsFromTree(tree: TemplateNode[]): UnifiedSection[] {
  const sections: UnifiedSection[] = [];
  const sectionNodes = getSectionNodes(tree);

  sectionNodes.forEach((section, index) => {
    const items = getUnifiedItemsFromSectionNode(section);
    sections.push({
      id: section.id || `section_${index}`,
      name: section.title?.en || `Section ${index + 1}`,
      order: index + 1,
      items,
      collapsible: section.className?.includes('collapsible'),
    });
  });

  return sections;
}

/**
 * Get items from a section node
 */
function getUnifiedItemsFromSectionNode(section: SectionNode): UnifiedItem[] {
  const items: UnifiedItem[] = [];
  const content = section.content || [];

  content.forEach((node, index) => {
    const item = nodeToUnifiedItem(node, index);
    if (item) {
      items.push(item);
    }
  });

  return items;
}

/**
 * Convert a tree node to unified item format
 */
function nodeToUnifiedItem(node: TemplateNode, order: number): UnifiedItem | null {
  switch (node.type) {
    case 'title': {
      const titleNode = node as TitleNode;
      return {
        id: titleNode.id || generateNodeId(),
        nodeId: node.id,
        type: 'title',
        label: titleNode.title?.en || '',
        order,
        defaultValue: titleNode.title?.en,
      };
    }

    case 'field': {
      const fieldNode = node as FieldNode;
      const fieldId = fieldNode.fields?.[0] || fieldNode.id || generateNodeId();
      return {
        id: fieldId,
        nodeId: node.id,
        type: 'input',
        label: fieldNode.title?.en || fieldId,
        order,
        inputType: 'text',
      };
    }

    case 'valueField': {
      const valueFieldNode = node as ValueFieldNode;
      const fieldId = valueFieldNode.fields?.[0] || valueFieldNode.id || generateNodeId();
      return {
        id: fieldId,
        nodeId: node.id,
        type: 'input',
        label: fieldId,
        order,
        inputType: 'textarea',
      };
    }

    case 'image': {
      const imageNode = node as ImageNode;
      return {
        id: imageNode.field || imageNode.id || generateNodeId(),
        nodeId: node.id,
        type: 'image',
        label: imageNode.id || imageNode.field || 'Image',
        order,
        multiple: false,
      };
    }

    case 'gallery': {
      const galleryNode = node as GalleryNode;
      return {
        id: galleryNode.pointer || galleryNode.field || galleryNode.id || generateNodeId(),
        nodeId: node.id,
        type: 'image',
        label: galleryNode.id || galleryNode.pointer || 'Gallery',
        order,
        multiple: true,
        maxImages: 12,
      };
    }

    case 'video': {
      const videoNode = node as VideoNode;
      return {
        id: videoNode.field || videoNode.id || generateNodeId(),
        nodeId: node.id,
        type: 'video',
        label: videoNode.id || videoNode.field || 'Video',
        order,
      };
    }

    default:
      return null;
  }
}

/**
 * Get sections from structure format
 */
function getUnifiedSectionsFromStructure(structure: TemplateStructure): UnifiedSection[] {
  return (structure.sections || [])
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      name: section.name,
      order: section.order,
      items: section.items.map((item, index) => ({
        id: item.id,
        type: item.type as UnifiedItem['type'],
        label: item.label,
        order: item.order || index,
        required: item.required,
        immutable: item.immutable,
        description: item.description,
        inputType: (item as InputItem).inputType,
        placeholder: (item as InputItem).placeholder,
        multiple: (item as ImageItem).multiple,
        maxImages: (item as ImageItem).maxImages,
        acceptVideo: (item as ImageItem).acceptVideo,
        badgeStyle: (item as BadgeItem).badgeStyle,
        defaultValue: (item as TitleItem).defaultValue,
      })),
      collapsible: section.collapsible,
      description: section.description,
    }));
}

/**
 * Get languages from a template (works with either format)
 */
export function getUnifiedLanguages(template: Template): TemplateLanguage[] {
  const format = getTemplateFormat(template);

  if (format === 'tree') {
    const root = template.tree?.[0];
    if (root && isRootNode(root)) {
      return (root.languages || []).map((lang, index) => ({
        id: `lang_${index}`,
        code: lang.key,
        name: lang.name,
        isDefault: index === 0,
      }));
    }
  }

  return template.structure?.languages || [];
}

/**
 * Get search index field from a template (works with either format)
 */
export function getUnifiedSearchIndexField(template: Template): string | undefined {
  const format = getTemplateFormat(template);

  if (format === 'tree') {
    const root = template.tree?.[0];
    if (root && isRootNode(root)) {
      return root.searchIndexField;
    }
  }

  return template.structure?.searchIndexField;
}

// ============================================================================
// Template Updates (works with either format)
// ============================================================================

/**
 * Update template to tree format if it's in structure format
 * Returns a new template object with tree format
 */
export function ensureTreeFormat(template: Template): Template {
  if (hasTreeFormat(template)) {
    return template;
  }

  if (hasStructureFormat(template)) {
    return {
      ...template,
      tree: convertStructureToTree(template.structure!),
    };
  }

  // Empty template - create default tree
  return {
    ...template,
    tree: [createRootNode()],
  };
}

/**
 * Create a copy of template with tree format only (removes structure)
 */
export function migrateToTreeFormat(template: Template): Template {
  const updated = ensureTreeFormat(template);
  const { structure, ...rest } = updated;
  return rest;
}
