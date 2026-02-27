/**
 * V1→V2 Template Converter
 *
 * Converts a TemplateStructure (v1 sections/items format)
 * into a V2TemplateDocument (schema + layout + views).
 */

import type {
  TemplateStructure,
  TemplateItem,
  InputItem,
  ImageItem,
  DocumentItem,
  TitleItem,
} from '@/features/templates/types/template.types';
import type {
  V2TemplateDocument,
  V2FieldDefinition,
  V2FieldType,
  V2FieldSemantic,
  V2ViewDefinition,
  V2LayoutNode,
  V2CertificateFrameConfig,
  V2InformationFrameConfig,
  LocalizedContent,
} from '../types';
import type { TemplateLanguageConfig } from '@/features/template-renderer/types';
import { RESERVED_FIELDS } from '@/shared/constants/reserved-fields';

/**
 * Map a v1 TemplateItem to a v2 field type
 */
function mapItemTypeToFieldType(item: TemplateItem): V2FieldType {
  switch (item.type) {
    case 'input': {
      const inputItem = item as InputItem;
      switch (inputItem.inputType) {
        case 'textarea': return 'textarea';
        case 'number': return 'number';
        case 'date': return 'date';
        default: return 'text';
      }
    }
    case 'image': {
      const imageItem = item as ImageItem;
      return imageItem.multiple ? 'images' : 'image';
    }
    case 'video': return 'video';
    case 'document': return 'document';
    case 'badge': return 'badge';
    case 'readonly': return 'readonly';
    case 'title': return 'text'; // Title items become readonly text fields
    default: return 'text';
  }
}

/**
 * Detect semantic role from a field ID using RESERVED_FIELDS constants
 */
function detectSemantic(fieldId: string): V2FieldSemantic | undefined {
  if ((RESERVED_FIELDS.TITLE as readonly string[]).includes(fieldId)) return 'title';
  if ((RESERVED_FIELDS.DESCRIPTION as readonly string[]).includes(fieldId)) return 'description';
  if (fieldId === 'company_logo') return 'companyLogo';
  if (fieldId === 'company_name') return 'companyName';
  if (fieldId === 'stamp_upload') return 'stamp';
  if (fieldId === 'certification_date') return 'certificationDate';
  // Gallery detection: image fields with multiple=true or named 'gallery'
  if (fieldId.includes('gallery')) return 'gallery';
  return undefined;
}

/**
 * Convert a v1 TemplateItem to a V2FieldDefinition
 */
function convertItemToField(item: TemplateItem): V2FieldDefinition {
  const label: LocalizedContent = { en: item.label };
  const field: V2FieldDefinition = {
    id: item.id,
    type: mapItemTypeToFieldType(item),
    label,
    required: item.required,
    size: item.size,
    immutable: item.immutable,
  };

  // Add validation if present
  if (item.validation) {
    field.validation = {
      minLength: item.validation.minLength,
      maxLength: item.validation.maxLength,
      pattern: item.validation.pattern,
    };
  }

  // Add maxFiles for multi-file items
  if (item.type === 'image' && (item as ImageItem).multiple && (item as ImageItem).maxImages) {
    field.maxFiles = (item as ImageItem).maxImages;
  }
  if (item.type === 'document' && (item as DocumentItem).multiple && (item as DocumentItem).maxFiles) {
    field.maxFiles = (item as DocumentItem).maxFiles;
  }

  // Add placeholder for input items
  if (item.type === 'input' && (item as InputItem).placeholder) {
    field.placeholder = { en: (item as InputItem).placeholder! };
  }

  // Detect semantic role
  const semantic = detectSemantic(item.id);
  if (semantic) field.semantic = semantic;

  return field;
}

/**
 * Generate layout nodes for a certificate view from a section's items
 */
function generateCertificateLayout(items: TemplateItem[]): V2LayoutNode[] {
  const nodes: V2LayoutNode[] = [];
  let nodeIndex = 0;

  for (const item of items) {
    const id = `cert-${nodeIndex++}`;

    // Title items become text nodes
    if (item.type === 'title') {
      const titleItem = item as TitleItem;
      const textStyle = titleItem.style === 'h1' || titleItem.style === 'h2' ? 'heading' as const : 'subheading' as const;
      nodes.push({
        type: 'text',
        id,
        content: { en: titleItem.defaultValue || item.label },
        textStyle,
      });
      continue;
    }

    // Image items that are logos/stamps are handled by frame config, skip in layout
    if (item.id === 'company_logo' || item.id === 'stamp_upload') continue;

    // Gallery images
    if (item.type === 'image' && (item as ImageItem).multiple) {
      nodes.push({ type: 'gallery', id, fieldId: item.id });
      continue;
    }

    // Video
    if (item.type === 'video') {
      nodes.push({ type: 'video', id, fieldId: item.id });
      continue;
    }

    // Document/attachments
    if (item.type === 'document') {
      nodes.push({ type: 'attachments', id, fieldId: item.id });
      continue;
    }

    // Single image
    if (item.type === 'image') {
      nodes.push({ type: 'gallery', id, fieldId: item.id });
      continue;
    }

    // Default: field node
    nodes.push({
      type: 'field',
      id,
      fieldId: item.id,
      showLabel: item.type !== 'readonly',
      size: item.size,
    });
  }

  return nodes;
}

/**
 * Generate layout nodes for an information view from a section's items
 */
function generateInformationLayout(items: TemplateItem[]): V2LayoutNode[] {
  const nodes: V2LayoutNode[] = [];
  let nodeIndex = 0;

  // Group items into a section
  const fieldNodes: V2LayoutNode[] = [];
  const mediaNodes: V2LayoutNode[] = [];

  for (const item of items) {
    const id = `info-${nodeIndex++}`;

    // Skip items handled by frame config
    if (item.id === 'company_logo' || item.id === 'stamp_upload' ||
        item.id === 'company_name' || item.id === 'certification_date') continue;

    // Title items
    if (item.type === 'title') {
      const titleItem = item as TitleItem;
      fieldNodes.push({
        type: 'text',
        id,
        content: { en: titleItem.defaultValue || item.label },
        textStyle: 'heading',
      });
      continue;
    }

    // Gallery images
    if (item.type === 'image' && (item as ImageItem).multiple) {
      // Gallery is handled by frame config galleryField
      continue;
    }

    // Video
    if (item.type === 'video') {
      mediaNodes.push({ type: 'video', id, fieldId: item.id });
      continue;
    }

    // Attachments
    if (item.type === 'document') {
      mediaNodes.push({ type: 'attachments', id, fieldId: item.id });
      continue;
    }

    // Single image
    if (item.type === 'image') {
      mediaNodes.push({ type: 'gallery', id, fieldId: item.id });
      continue;
    }

    // Default: field node
    fieldNodes.push({
      type: 'field',
      id,
      fieldId: item.id,
      showLabel: true,
    });
  }

  // Wrap field nodes in a section
  if (fieldNodes.length > 0) {
    nodes.push({
      type: 'section',
      id: `info-section-${nodeIndex++}`,
      title: { en: 'Details' },
      children: fieldNodes,
    });
  }

  // Add media nodes after sections
  nodes.push(...mediaNodes);

  return nodes;
}

/**
 * Convert a TemplateStructure to a V2TemplateDocument
 */
export function convertTemplateStructureToV2(
  structure: TemplateStructure
): V2TemplateDocument {
  // Collect all fields from all sections
  const fields: V2FieldDefinition[] = [];
  const seenFieldIds = new Set<string>();

  for (const section of structure.sections) {
    for (const item of section.items) {
      if (!seenFieldIds.has(item.id)) {
        fields.push(convertItemToField(item));
        seenFieldIds.add(item.id);
      }
    }
  }

  // Build views from sections
  const views: V2ViewDefinition[] = [];

  const certificateSection = structure.sections.find((s) => s.name === 'Certificate');
  const informationSection = structure.sections.find((s) => s.name === 'Information');

  // Certificate view
  if (certificateSection) {
    const frameConfig: V2CertificateFrameConfig = {
      background: structure.background
        ? { type: structure.background.type, dataUri: structure.background.dataUri, mediaType: structure.background.mediaType }
        : { type: 'standard' },
      showOrigynBranding: true,
      showTokenId: true,
    };

    // Detect logo and stamp fields
    const logoField = fields.find((f) => f.semantic === 'companyLogo');
    if (logoField) frameConfig.companyLogoField = logoField.id;
    const stampField = fields.find((f) => f.semantic === 'stamp');
    if (stampField) frameConfig.stampField = stampField.id;

    views.push({
      id: 'certificate',
      label: { en: 'Certificate' },
      frameType: 'certificate',
      frame: frameConfig,
      content: generateCertificateLayout(certificateSection.items),
    });
  }

  // Information view
  if (informationSection) {
    const frameConfig: V2InformationFrameConfig = {};

    // Detect title fields
    const companyNameField = fields.find((f) => f.semantic === 'companyName');
    if (companyNameField) frameConfig.companyNameField = companyNameField.id;
    const dateField = fields.find((f) => f.semantic === 'certificationDate');
    if (dateField) frameConfig.dateField = dateField.id;
    const galleryField = fields.find((f) => f.semantic === 'gallery');
    if (galleryField) frameConfig.galleryField = galleryField.id;

    // Check for section display name
    if (informationSection.displayName) {
      // Find or create a field for section title
      const sectionTitleField = fields.find((f) => f.semantic === 'sectionTitle');
      if (sectionTitleField) frameConfig.sectionTitleField = sectionTitleField.id;
    }

    // Look for a title/certificate_title field
    const titleField = fields.find((f) => f.semantic === 'title');
    if (titleField) frameConfig.certificateTitleField = titleField.id;

    views.push({
      id: 'information',
      label: { en: 'Information' },
      frameType: 'information',
      frame: frameConfig,
      content: generateInformationLayout(informationSection.items),
    });
  }

  // Convert languages
  const languages: TemplateLanguageConfig[] = structure.languages.map((lang) => ({
    key: lang.code,
    name: lang.name,
  }));

  // Ensure at least English
  if (languages.length === 0) {
    languages.push({ key: 'en', name: 'English' });
  }

  return {
    version: '2.0.0',
    schema: { fields },
    views,
    languages,
    searchIndexField: structure.searchIndexField,
  };
}
