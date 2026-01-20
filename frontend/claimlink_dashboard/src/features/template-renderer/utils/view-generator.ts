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
  TextNode,
  ValueFieldNode,
  SeparatorNode,
  CollectionImageNode,
  GalleryNode,
  ImageNode,
  VideoNode,
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

  // Find Certificate section (order: 1) - needed early to get title
  const certificateSection: TemplateSection | undefined = structure.sections.find(
    (s) => s.name === "Certificate",
  );

  // Collection logo (with bottom margin to match static layout)
  nodes.push({
    id: generateNodeId(),
    type: "collectionImage",
    className: "certificateLogoImg h-12 object-contain mb-[100px]",
    libId: "certificatelogo.png",
  } as CollectionImageNode);

  // Certificate title (extract from template structure or use default)
  const titleItem: TemplateItem | undefined = certificateSection?.items.find((i) => i.type === "title");
  const certificateTitle =
    (titleItem as any)?.defaultValue || titleItem?.label || "Certificate";

  nodes.push({
    id: generateNodeId(),
    type: "title",
    className: "mainTitle",
    title: toLocalizedContent(certificateTitle, languages),
  } as TitleNode);

  if (certificateSection) {
    // Container for all fields with gap-10
    const fieldsContainer: ElementsNode = {
      id: generateNodeId(),
      type: "elements",
      className: "flex flex-col gap-10 items-center justify-center w-full",
      content: [],
    };

    // Add key fields from Certificate section
    const certFields: TemplateItem[] = certificateSection.items
      .filter(
        (item) =>
          item.type !== "image" &&
          item.type !== "title" &&
          item.type !== "badge",
      )
      .slice(0, 8); // Show up to 8 fields

    certFields.forEach((item: TemplateItem) => {
        // First field gets larger spacing (gap-4, py-2) to emphasize it as the main asset/name
        const isFirstField: boolean =
          certificateSection.items.indexOf(item) === 0 || item.order === 1;
        const isNameField: boolean = item.id.includes("name");
        const isMainField: boolean = isFirstField || isNameField;

        const fieldGroup: ElementsNode = {
          id: generateNodeId(),
          type: "elements",
          className: `flex flex-col ${isMainField ? "gap-4" : "gap-1"} items-center text-center w-full ${isMainField ? "py-2" : ""}`,
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
              className: isMainField ? "companyName" : undefined,
              fields: [item.id],
            } as ValueFieldNode,
          ],
        };

        fieldsContainer.content!.push(fieldGroup);
      });

    nodes.push(fieldsContainer);
  }

  // Signature Section with gap-2, py-4, mt-6
  const signatureSection: ElementsNode = {
    id: generateNodeId(),
    type: "elements",
    className: "flex flex-col gap-2 items-center w-full py-4 mt-6",
    content: [
      // Signature image
      {
        id: generateNodeId(),
        type: "collectionImage",
        className: "signatureImage h-[100px] w-[178px] object-contain",
        libId: "signature.png",
      } as CollectionImageNode,
      // Certified by field group (gap-1)
      {
        id: generateNodeId(),
        type: "elements",
        className: "flex flex-col gap-1 items-center text-center w-full",
        content: [
          {
            id: generateNodeId(),
            type: "title",
            title: toLocalizedContent("Certified by", languages),
          } as TitleNode,
          {
            id: generateNodeId(),
            type: "text",
            className: "text-[24px] font-medium leading-8 text-[#222526]",
            text: toLocalizedContent("ORIGYN", languages),
          } as TextNode,
        ],
      } as ElementsNode,
    ],
  };

  nodes.push(signatureSection);

  // ORIGYN Logo Bottom with gap-4, mt-10, mb-6
  const origynLogoSection: ElementsNode = {
    id: generateNodeId(),
    type: "elements",
    className: "flex flex-col gap-4 items-center mt-10 mb-6",
    content: [
      {
        id: generateNodeId(),
        type: "collectionImage",
        className: "h-[90px] w-[92px] object-contain",
        libId: "origynlogo.png",
      } as CollectionImageNode,
    ],
  };

  nodes.push(origynLogoSection);

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

  // Certifications badge
  nodes.push({
    id: generateNodeId(),
    type: "title",
    title: toLocalizedContent("Certifications", languages),
  } as TitleNode);

  nodes.push({
    id: generateNodeId(),
    type: "collectionImage",
    libId: "certimage.png",
  } as CollectionImageNode);

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

  // Collection logo at top
  nodes.push({
    id: generateNodeId(),
    type: "collectionImage",
    className: "collectionlogo",
    libId: "collectionlogo.png",
  } as CollectionImageNode);

  nodes.push({
    id: generateNodeId(),
    type: "separator",
  } as SeparatorNode);

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
      // Handle badge fields
      else if (item.type === "badge") {
        nodes.push({
          id: generateNodeId(),
          type: "title",
          title: toLocalizedContent(item.label, languages),
        } as TitleNode);

        nodes.push({
          id: generateNodeId(),
          type: "valueField",
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
