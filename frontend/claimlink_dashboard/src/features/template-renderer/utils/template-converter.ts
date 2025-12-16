/**
 * Template Converter Utility
 *
 * Converts ClaimLink's internal template structure (TemplateStructure)
 * to ORIGYN's template format (TemplateNode[]).
 *
 * ClaimLink uses a section-based structure with items (title, input, badge, image).
 * ORIGYN uses a tree-based structure with nodes (columns, elements, valueField, etc.).
 */

import type {
  TemplateStructure,
  TemplateSection,
  TemplateItem,
  TitleItem,
  InputItem,
  BadgeItem,
  ImageItem,
  TemplateLanguage,
} from '@/features/templates/types/template.types';

import type {
  TemplateNode,
  ColumnsNode,
  ElementsNode,
  TitleNode,
  ValueFieldNode,
  FieldNode,
  SeparatorNode,
  GalleryNode,
  ImageNode as OrigynImageNode,
  LocalizedContent,
  FormTemplateCategory,
  FormFieldDefinition,
} from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique ID for template nodes
 */
function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Convert a label string to LocalizedContent
 * Uses all languages from the template structure
 */
function toLocalizedContent(
  label: string,
  languages: TemplateLanguage[] = [{ id: '1', code: 'en', name: 'English', isDefault: true }]
): LocalizedContent {
  const content: LocalizedContent = {};

  // Set the label for all configured languages
  // In a real implementation, this would use translations from the template
  languages.forEach((lang) => {
    content[lang.code] = label;
  });

  // Ensure 'en' always exists
  if (!content['en']) {
    content['en'] = label;
  }

  return content;
}

// ============================================================================
// Item Converters
// ============================================================================

/**
 * Convert a TitleItem to ORIGYN TitleNode
 */
function convertTitleItem(
  item: TitleItem,
  languages: TemplateLanguage[]
): TitleNode {
  return {
    id: generateNodeId(),
    type: 'title',
    title: toLocalizedContent(item.label, languages),
    className: item.style === 'h1' ? 'mainTitle' : undefined,
  };
}

/**
 * Convert an InputItem to ORIGYN node(s)
 * - text/number/email/url → FieldNode (label + value)
 * - textarea → ValueFieldNode (just value, for long text)
 */
function convertInputItem(
  item: InputItem,
  languages: TemplateLanguage[]
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Add title if it's a regular input (not textarea)
  if (item.inputType !== 'textarea') {
    nodes.push({
      id: generateNodeId(),
      type: 'field',
      title: toLocalizedContent(item.label, languages),
      fields: [item.id],
    } as FieldNode);
  } else {
    // For textarea, add a title node followed by valueField
    nodes.push({
      id: generateNodeId(),
      type: 'title',
      title: toLocalizedContent(item.label, languages),
    } as TitleNode);

    nodes.push({
      id: generateNodeId(),
      type: 'valueField',
      fields: [item.id],
      className: 'expirianceTextBlock',
    } as ValueFieldNode);
  }

  return nodes;
}

/**
 * Convert a BadgeItem to ORIGYN FieldNode
 */
function convertBadgeItem(
  item: BadgeItem,
  languages: TemplateLanguage[]
): FieldNode {
  return {
    id: generateNodeId(),
    type: 'field',
    title: toLocalizedContent(item.label, languages),
    fields: [item.id],
  };
}

/**
 * Convert an ImageItem to ORIGYN image node(s)
 * - single image → ImageNode
 * - multiple images (gallery) → GalleryNode
 */
function convertImageItem(item: ImageItem): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  if (item.multiple) {
    // Gallery for multiple images
    nodes.push({
      id: generateNodeId(),
      type: 'gallery',
      pointer: item.id,
      field: item.id,
    } as GalleryNode);
  } else {
    // Single image
    nodes.push({
      id: generateNodeId(),
      type: 'image',
      field: item.id,
    } as OrigynImageNode);
  }

  return nodes;
}

/**
 * Convert a single TemplateItem to ORIGYN node(s)
 */
function convertItem(
  item: TemplateItem,
  languages: TemplateLanguage[]
): TemplateNode[] {
  switch (item.type) {
    case 'title':
      return [convertTitleItem(item as TitleItem, languages)];
    case 'input':
      return convertInputItem(item as InputItem, languages);
    case 'badge':
      return [convertBadgeItem(item as BadgeItem, languages)];
    case 'image':
      return convertImageItem(item as ImageItem);
    default:
      console.warn(`convertItem: Unknown item type`, item);
      return [];
  }
}

// ============================================================================
// Section Converters
// ============================================================================

/**
 * Convert a TemplateSection to ORIGYN nodes
 * Wraps items in elements container with separators between groups
 */
function convertSection(
  section: TemplateSection,
  languages: TemplateLanguage[]
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Sort items by order
  const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

  // Convert each item
  sortedItems.forEach((item, index) => {
    const itemNodes = convertItem(item, languages);
    nodes.push(...itemNodes);

    // Add separator between items (except after last)
    if (index < sortedItems.length - 1) {
      nodes.push({
        id: generateNodeId(),
        type: 'separator',
      } as SeparatorNode);
    }
  });

  return nodes;
}

// ============================================================================
// Main Conversion Functions
// ============================================================================

/**
 * Convert ClaimLink TemplateStructure to ORIGYN TemplateNode[]
 *
 * Creates a columns/elements wrapper containing all sections
 */
export function convertToOrigynTemplate(
  structure: TemplateStructure
): TemplateNode[] {
  const languages = structure.languages || [
    { id: '1', code: 'en', name: 'English', isDefault: true },
  ];

  // Sort sections by order
  const sortedSections = [...structure.sections].sort(
    (a, b) => a.order - b.order
  );

  // Convert all sections to nodes
  const allNodes: TemplateNode[] = [];

  sortedSections.forEach((section, index) => {
    const sectionNodes = convertSection(section, languages);
    allNodes.push(...sectionNodes);

    // Add separator between sections (except after last)
    if (index < sortedSections.length - 1) {
      allNodes.push({
        id: generateNodeId(),
        type: 'separator',
      } as SeparatorNode);
    }
  });

  // Wrap in columns/elements structure
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: 'elements',
    content: allNodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: 'columns',
    columns: { columns: '1', smColumns: '1' },
    content: [elementsNode],
  };

  return [columnsNode];
}

/**
 * Convert ClaimLink TemplateStructure to ORIGYN formTemplate format
 *
 * Groups items by section into FormTemplateCategory
 */
export function convertToFormTemplate(
  structure: TemplateStructure
): FormTemplateCategory[] {
  const languages = structure.languages || [
    { id: '1', code: 'en', name: 'English', isDefault: true },
  ];

  return structure.sections.map((section) => {
    const fields: FormFieldDefinition[] = section.items.map((item) => {
      let inputType: 'text' | 'date' | 'images' | 'files' = 'text';

      if (item.type === 'image') {
        inputType = 'images';
      } else if (item.type === 'input') {
        const inputItem = item as InputItem;
        if (inputItem.inputType === 'number') {
          inputType = 'text'; // ORIGYN uses text for numbers
        }
      }

      return {
        name: item.id,
        label: toLocalizedContent(item.label, languages),
        inputType,
        type: item.type === 'image' ? 'files' : 'text',
        pointer: item.type === 'image' ? item.id : undefined,
        immutable: item.immutable ? 'true' : 'false',
      };
    });

    return {
      name: section.name,
      title: toLocalizedContent(section.name, languages),
      subTitle: toLocalizedContent(section.description || section.name, languages),
      type: 'category' as const,
      fields,
    };
  });
}

/**
 * Convert metadata field value to ORIGYN format
 */
export function convertFieldValueToOrigyn(
  value: string | number | Date | undefined,
  isLanguageField: boolean = true
): { language?: string; content: LocalizedContent | { date: number } | string } {
  if (value === undefined || value === null) {
    return {
      language: isLanguageField ? 'true' : undefined,
      content: isLanguageField ? { en: '' } : '',
    };
  }

  // Handle Date
  if (value instanceof Date) {
    return {
      language: 'true',
      content: { date: value.getTime() },
    };
  }

  // Handle string/number
  if (isLanguageField) {
    return {
      language: 'true',
      content: { en: String(value) },
    };
  }

  return {
    content: String(value),
  };
}

/**
 * Convert form data to ORIGYN metadata format
 */
export function convertFormDataToOrigynMetadata(
  formData: Record<string, unknown>,
  structure: TemplateStructure
): Record<string, { language?: string; content: LocalizedContent | { date: number } | string }> {
  const metadata: Record<string, { language?: string; content: LocalizedContent | { date: number } | string }> = {};

  // Process each field in the form data
  for (const [fieldId, value] of Object.entries(formData)) {
    // Find the field definition to determine type
    let isLanguageField = true;

    for (const section of structure.sections) {
      const item = section.items.find((i) => i.id === fieldId);
      if (item && item.type === 'input') {
        // Field type checking could be extended here if needed
      }
    }

    // Skip file fields - they're handled separately
    if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {
      continue;
    }

    metadata[fieldId] = convertFieldValueToOrigyn(
      value as string | number | Date | undefined,
      isLanguageField
    );
  }

  return metadata;
}
