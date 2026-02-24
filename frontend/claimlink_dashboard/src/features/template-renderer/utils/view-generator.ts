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
} from "@/features/templates/types/template.types";

import type {
  TemplateNode,
  ColumnsNode,
  ElementsNode,
  TitleNode,
  ValueFieldNode,
  SeparatorNode,
  GalleryNode,
  ImageNode,
  VideoNode,
  AttachmentsNode,
  FormTemplateCategory,
  LocalizedContent,
  TemplateLanguageConfig,
} from "../types";

import { convertToFormTemplate } from "./template-converter";

// ============================================================================
// Helper Functions
// ============================================================================

function generateNodeId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function toLocalizedContent(
  text: string,
  languages: TemplateLanguageConfig[] = [{ key: "en", name: "English" }],
): LocalizedContent {
  const content: LocalizedContent = {};
  languages.forEach((lang) => {
    content[lang.key] = text;
  });
  if (!content["en"]) {
    content["en"] = text;
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
  languages: TemplateLanguageConfig[],
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Find Certificate section
  const certificateSection: TemplateSection | undefined = structure.sections.find(
    (s) => s.name === "Certificate",
  );

  if (certificateSection) {
    // Container for all fields with gap-10
    const fieldsContainer: ElementsNode = {
      id: generateNodeId(),
      type: "elements",
      className: "flex flex-col gap-10 items-center justify-center w-full",
      content: [],
    };

    // Add key fields from Certificate section (images, titles, and stamp handled elsewhere)
    const certFields: TemplateItem[] = certificateSection.items
      .filter(
        (item) =>
          item.type !== "image" &&
          item.type !== "title" &&
          item.id !== "stamp_upload",
      )
      .slice(0, 5); // Max 5 fields on certificate (fixed 950x1350 layout)

    certFields.forEach((item: TemplateItem) => {
        // Badge items render as just the value (no label above)
        if (item.type === "badge") {
          const badgeNode: ValueFieldNode = {
            id: generateNodeId(),
            type: "valueField",
            className: "badgeValue",
            fields: [item.id],
          };
          fieldsContainer.content!.push(badgeNode);
          return;
        }

        const fieldSize = item.size ?? 'md';
        const isLarge = fieldSize === 'lg';

        const fieldGroup: ElementsNode = {
          id: generateNodeId(),
          type: "elements",
          className: `flex flex-col ${isLarge ? "gap-4 py-2" : "gap-1"} items-center text-center w-full`,
          content: [
            // Title/Label
            {
              id: generateNodeId(),
              type: "title",
              title: toLocalizedContent(item.label, languages),
            } as TitleNode,
            // Value
            {
              id: generateNodeId(),
              type: "valueField",
              size: fieldSize,
              fields: [item.id],
            } as ValueFieldNode,
          ],
        };

        fieldsContainer.content!.push(fieldGroup);
      });

    nodes.push(fieldsContainer);
  }


  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: "elements",
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: "columns",
    columns: { columns: "1", smColumns: "1" },
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
  languages: TemplateLanguageConfig[],
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Find Certificate section
  const certificateSection: TemplateSection | undefined = structure.sections.find(
    (s) => s.name === "Certificate",
  );

  const primaryField: TemplateItem | undefined = certificateSection?.items.find(
    (i) =>
      i.label.toLowerCase().includes("name") ||
      i.label.toLowerCase().includes("company") ||
      i.label.toLowerCase().includes("title"),
  );

  if (primaryField) {
    nodes.push({
      id: generateNodeId(),
      type: "title",
      title: toLocalizedContent(primaryField.label, languages),
    } as TitleNode);

    nodes.push({
      id: generateNodeId(),
      type: "valueField",
      fields: [primaryField.id],
    } as ValueFieldNode);
  }

  nodes.push({
    id: generateNodeId(),
    type: "separator",
  } as SeparatorNode);

  // Certification valid until
  nodes.push({
    id: generateNodeId(),
    type: "title",
    title: toLocalizedContent("Certification valid until", languages),
  } as TitleNode);

  // Look for expiration field
  const allItems: TemplateItem[] = structure.sections.flatMap((s) => s.items);
  const expirationField: TemplateItem | undefined = allItems.find(
    (i) =>
      i.label.toLowerCase().includes("expiration") ||
      i.label.toLowerCase().includes("valid") ||
      i.label.toLowerCase().includes("expires"),
  );

  if (expirationField) {
    nodes.push({
      id: generateNodeId(),
      type: "valueField",
      fields: [expirationField.id],
    } as ValueFieldNode);
  }


  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: "elements",
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: "columns",
    columns: { columns: "1", smColumns: "1" },
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
  languages: TemplateLanguageConfig[],
): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  // Find Information section (order: 2)
  const informationSection: TemplateSection | undefined = structure.sections.find(
    (s) => s.name === "Information",
  );

  if (informationSection) {
    // Sort items by order
    const sortedItems = [...informationSection.items].sort((a, b) => a.order - b.order);

    // Process all items in the Information section
    sortedItems.forEach((item: TemplateItem) => {
      // Handle input fields (text, textarea, number, etc.)
      if (item.type === "input") {
        nodes.push({
          id: generateNodeId(),
          type: "title",
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        nodes.push({
          id: generateNodeId(),
          type: "valueField",
          className: (item as any).inputType === "textarea" ? "expirianceTextBlock" : undefined,
          fields: [item.id],
        } as ValueFieldNode);

        nodes.push({
          id: generateNodeId(),
          type: "separator",
        } as SeparatorNode);
      }
      // Handle badge fields (value only, no label)
      else if (item.type === "badge") {
        nodes.push({
          id: generateNodeId(),
          type: "valueField",
          className: "badgeValue",
          fields: [item.id],
        } as ValueFieldNode);

        nodes.push({
          id: generateNodeId(),
          type: "separator",
        } as SeparatorNode);
      }
      // Handle image galleries
      else if (item.type === "image") {
        const imageItem = item as ImageItem;
        nodes.push({
          id: generateNodeId(),
          type: "title",
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        if (imageItem.multiple) {
          // Gallery for multiple images
          nodes.push({
            id: generateNodeId(),
            type: "gallery",
            pointer: item.id,
            field: item.id,
          } as GalleryNode);
        } else {
          // Single image
          nodes.push({
            id: generateNodeId(),
            type: "image",
            field: item.id,
          } as ImageNode);
        }

        nodes.push({
          id: generateNodeId(),
          type: "separator",
        } as SeparatorNode);
      }
      // Handle document/attachment fields
      else if (item.type === "document") {
        nodes.push({
          id: generateNodeId(),
          type: "title",
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        // Use attachments node to render as downloadable file list
        nodes.push({
          id: generateNodeId(),
          type: "attachments",
          pointer: item.id,
        } as AttachmentsNode);

        nodes.push({
          id: generateNodeId(),
          type: "separator",
        } as SeparatorNode);
      }
      // Handle video fields
      else if (item.type === "video") {
        nodes.push({
          id: generateNodeId(),
          type: "title",
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        nodes.push({
          id: generateNodeId(),
          type: "video",
          field: item.id,
        } as VideoNode);

        nodes.push({
          id: generateNodeId(),
          type: "separator",
        } as SeparatorNode);
      }
    });
  }

  // Wrap in columns/elements
  const elementsNode: ElementsNode = {
    id: generateNodeId(),
    type: "elements",
    content: nodes,
  };

  const columnsNode: ColumnsNode = {
    id: generateNodeId(),
    type: "columns",
    columns: { columns: "1", smColumns: "1" },
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
  structure: TemplateStructure,
): GeneratedOrigynViews {
  // Convert languages to ORIGYN format
  const languages: TemplateLanguageConfig[] = structure.languages?.map(
    (lang) => ({
      key: lang.code,
      name: lang.name,
    }),
  ) || [{ key: "en", name: "English" }];

  // Find a suitable search field (usually company/product name)
  const allItems: TemplateItem[] = structure.sections.flatMap((s) => s.items);
  const searchField: string | undefined = allItems.find(
    (i) =>
      i.label.toLowerCase().includes("name") ||
      i.label.toLowerCase().includes("company") ||
      i.label.toLowerCase().includes("title"),
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
  structure: TemplateStructure,
): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map(
    (lang) => ({
      key: lang.code,
      name: lang.name,
    }),
  ) || [{ key: "en", name: "English" }];

  return generateCertificateTemplate(structure, languages);
}

/**
 * Generate only the user view template
 */
export function generateUserView(structure: TemplateStructure): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map(
    (lang) => ({
      key: lang.code,
      name: lang.name,
    }),
  ) || [{ key: "en", name: "English" }];

  return generateUserViewTemplate(structure, languages);
}

/**
 * Generate only the experience template
 */
export function generateExperienceView(
  structure: TemplateStructure,
): TemplateNode[] {
  const languages: TemplateLanguageConfig[] = structure.languages?.map(
    (lang) => ({
      key: lang.code,
      name: lang.name,
    }),
  ) || [{ key: "en", name: "English" }];

  return generateExperienceTemplate(structure, languages);
}
