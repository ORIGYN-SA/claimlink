/**
 * View Generator Utility
 *
 * Auto-generates all 4 ORIGYN template views from a single ClaimLink TemplateStructure.
 *
 * Views:
 * - template: Full experience page with all content
 * - userViewTemplate: Simplified summary view
 * - certificateTemplate: Formal certificate layout
 * - formTemplate: Form definition for minting
 */

import type {
  TemplateStructure,
  TemplateSection,
  TemplateItem,
  ImageItem,
} from '@/features/templates/types/template-structure.types';

import type {
  TemplateNode,
  ColumnsNode,
  ElementsNode,
  TitleNode,
  TextNode,
  ValueFieldNode,
  FieldNode,
  SeparatorNode,
  CollectionImageNode,
  GalleryNode,
  FormTemplateCategory,
  LocalizedContent,
  TemplateLanguageConfig,
} from '../types';

import {
  convertToOrigynTemplate,
  convertToFormTemplate,
} from './template-converter';

// ============================================================================
// Helper Functions
// ============================================================================

function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

function toLocalizedContent(
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

// ============================================================================
// Certificate Template Generator
// ============================================================================

/**
 * Generate the formal certificate template
 *
 * Layout:
 * - Certificate title at top
 * - Collection logo/badge
 * - Key fields (Company Name, VAT, Certification dates)
 * - Signature section
 * - ORIGYN branding
 */
function generateCertificateTemplate(
  structure: TemplateStructure,
  languages: TemplateLanguageConfig[]
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Certificate title
  nodes.push({
    id: generateNodeId(),
    type: 'text',
    className: 'certificateTitleText',
    text: toLocalizedContent('Made In Italy Certificate', languages),
  } as TextNode);

  // Collection logo
  nodes.push({
    id: generateNodeId(),
    type: 'collectionImage',
    className: 'certificateLogoImg',
    libId: 'certificatelogo.png',
  } as CollectionImageNode);

  // Find Certificate section (order: 1)
  const certificateSection = structure.sections.find((s) => s.name === 'Certificate');

  if (certificateSection) {
    // Add key fields from Certificate section
    certificateSection.items
      .filter((item) => item.type !== 'image' && item.type !== 'title')
      .slice(0, 8) // Show up to 8 fields
      .forEach((item) => {
        // Title
        nodes.push({
          id: generateNodeId(),
          type: 'title',
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        // Value
        nodes.push({
          id: generateNodeId(),
          type: 'valueField',
          className: item.id.includes('name') ? 'companyName' : undefined,
          fields: [item.id],
        } as ValueFieldNode);
      });
  }

  // Certified by section
  nodes.push({
    id: generateNodeId(),
    type: 'title',
    title: toLocalizedContent('Certified by', languages),
  } as TitleNode);

  nodes.push({
    id: generateNodeId(),
    type: 'text',
    className: 'h5text',
    text: toLocalizedContent('ORIGYN', languages),
  } as TextNode);

  // Signature
  nodes.push({
    id: generateNodeId(),
    type: 'collectionImage',
    className: 'signatureImage',
    libId: 'signature.png',
  } as CollectionImageNode);

  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: 'elements',
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: 'columns',
    columns: { columns: '1', smColumns: '1' },
    content: [elementsNode],
  };

  return [columnsNode];
}

// ============================================================================
// User View Template Generator
// ============================================================================

/**
 * Generate the simplified user view template
 *
 * Layout:
 * - Company/Asset name
 * - Certification status
 * - Expiration date
 * - Certification badge
 */
function generateUserViewTemplate(
  structure: TemplateStructure,
  languages: TemplateLanguageConfig[]
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Find Certificate section
  const certificateSection = structure.sections.find((s) => s.name === 'Certificate');

  const primaryField = certificateSection?.items.find(
    (i) => i.label.toLowerCase().includes('name') ||
           i.label.toLowerCase().includes('company') ||
           i.label.toLowerCase().includes('title')
  );

  if (primaryField) {
    nodes.push({
      id: generateNodeId(),
      type: 'title',
      title: toLocalizedContent(primaryField.label, languages),
    } as TitleNode);

    nodes.push({
      id: generateNodeId(),
      type: 'valueField',
      fields: [primaryField.id],
    } as ValueFieldNode);
  }

  nodes.push({
    id: generateNodeId(),
    type: 'separator',
  } as SeparatorNode);

  // Certification valid until
  nodes.push({
    id: generateNodeId(),
    type: 'title',
    title: toLocalizedContent('Certification valid until', languages),
  } as TitleNode);

  // Look for expiration field
  const allItems = structure.sections.flatMap((s) => s.items);
  const expirationField = allItems.find(
    (i) => i.label.toLowerCase().includes('expiration') ||
           i.label.toLowerCase().includes('valid') ||
           i.label.toLowerCase().includes('expires')
  );

  if (expirationField) {
    nodes.push({
      id: generateNodeId(),
      type: 'valueField',
      fields: [expirationField.id],
    } as ValueFieldNode);
  }

  // Certifications badge
  nodes.push({
    id: generateNodeId(),
    type: 'title',
    title: toLocalizedContent('Certifications', languages),
  } as TitleNode);

  nodes.push({
    id: generateNodeId(),
    type: 'collectionImage',
    libId: 'certimage.png',
  } as CollectionImageNode);

  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: 'elements',
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: 'columns',
    columns: { columns: '1', smColumns: '1' },
    content: [elementsNode],
  };

  return [columnsNode];
}

// ============================================================================
// Experience Template Generator
// ============================================================================

/**
 * Generate the full experience page template (Information tab)
 *
 * Layout:
 * - Collection logo
 * - Information section content (text fields, galleries, etc.)
 * - About, experience, and additional details
 *
 * Maps to: Information tab
 */
function generateExperienceTemplate(
  structure: TemplateStructure,
  languages: TemplateLanguageConfig[]
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Collection logo at top
  nodes.push({
    id: generateNodeId(),
    type: 'collectionImage',
    className: 'collectionlogo',
    libId: 'collectionlogo.png',
  } as CollectionImageNode);

  nodes.push({
    id: generateNodeId(),
    type: 'separator',
  } as SeparatorNode);

  // Find Information section (order: 2)
  const informationSection = structure.sections.find((s) => s.name === 'Information');

  if (informationSection) {
    // Find text/about content (textarea fields)
    const textItems = informationSection.items.filter(
      (i) => i.type === 'input' && (i as any).inputType === 'textarea'
    );

    // Find image galleries
    const galleryItems = informationSection.items.filter(
      (i) => i.type === 'image' && (i as ImageItem).multiple
    );

    // Add text sections with title
    textItems.forEach((item) => {
      nodes.push({
        id: generateNodeId(),
        type: 'title',
        title: toLocalizedContent(item.label, languages),
      } as TitleNode);

      nodes.push({
        id: generateNodeId(),
        type: 'valueField',
        className: 'expirianceTextBlock',
        fields: [item.id],
      } as ValueFieldNode);

      nodes.push({
        id: generateNodeId(),
        type: 'separator',
      } as SeparatorNode);
    });

    // Add galleries
    galleryItems.forEach((item) => {
      nodes.push({
        id: generateNodeId(),
        type: 'title',
        title: toLocalizedContent(item.label, languages),
      } as TitleNode);

      nodes.push({
        id: generateNodeId(),
        type: 'gallery',
        pointer: item.id,
        field: item.id,
      } as GalleryNode);

      nodes.push({
        id: generateNodeId(),
        type: 'separator',
      } as SeparatorNode);
    });
  }

  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: 'elements',
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: 'columns',
    columns: { columns: '1', smColumns: '1' },
    content: [elementsNode],
  };

  return [columnsNode];
}

// ============================================================================
// Main Generator Function
// ============================================================================

/**
 * Generated ORIGYN views container
 */
export interface GeneratedOrigynViews {
  /** Full experience page template */
  template: TemplateNode[];
  /** Simplified user view template */
  userViewTemplate: TemplateNode[];
  /** Formal certificate template */
  certificateTemplate: TemplateNode[];
  /** Form definition for minting */
  formTemplate: FormTemplateCategory[];
  /** Supported languages */
  languages: TemplateLanguageConfig[];
  /** Field to use for search indexing */
  searchField?: string;
}

/**
 * Generate all 4 ORIGYN template views from a ClaimLink TemplateStructure
 *
 * @param structure - The ClaimLink template structure
 * @returns All 4 ORIGYN views plus metadata
 */
export function generateOrigynViews(
  structure: TemplateStructure
): GeneratedOrigynViews {
  // Convert languages to ORIGYN format
  const languages: TemplateLanguageConfig[] = structure.languages?.map((lang) => ({
    key: lang.code,
    name: lang.name,
  })) || [{ key: 'en', name: 'English' }];

  // Find a suitable search field (usually company/product name)
  const allItems = structure.sections.flatMap((s) => s.items);
  const searchField = allItems.find(
    (i) => i.label.toLowerCase().includes('name') ||
           i.label.toLowerCase().includes('company') ||
           i.label.toLowerCase().includes('title')
  )?.id;

  return {
    template: generateExperienceTemplate(structure, languages),
    userViewTemplate: generateUserViewTemplate(structure, languages),
    certificateTemplate: generateCertificateTemplate(structure, languages),
    formTemplate: convertToFormTemplate(structure),
    languages,
    searchField,
  };
}

/**
 * Generate only the certificate template view
 */
export function generateCertificateView(
  structure: TemplateStructure
): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map((lang) => ({
    key: lang.code,
    name: lang.name,
  })) || [{ key: 'en', name: 'English' }];

  return generateCertificateTemplate(structure, languages);
}

/**
 * Generate only the user view template
 */
export function generateUserView(
  structure: TemplateStructure
): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map((lang) => ({
    key: lang.code,
    name: lang.name,
  })) || [{ key: 'en', name: 'English' }];

  return generateUserViewTemplate(structure, languages);
}

/**
 * Generate only the experience template
 */
export function generateExperienceView(
  structure: TemplateStructure
): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map((lang) => ({
    key: lang.code,
    name: lang.name,
  })) || [{ key: 'en', name: 'English' }];

  return generateExperienceTemplate(structure, languages);
}
