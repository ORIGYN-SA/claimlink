import type { TemplateStructure } from "@/features/templates/types/template.types";

// Template data type - unified for all use cases
export interface Template {
  id: string;
  name: string;
  description: string;
  category: "manual" | "ai" | "existing" | "preset";
  certificateCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  // Template structure with sections and items
  structure?: TemplateStructure;
}

// Helper functions for working with templates
export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: "manual" | "ai" | "existing" | "preset",
): Template[] => {
  return mockTemplates.filter((template) => template.category === category);
};

export const getFreeTemplates = (): Template[] => {
  return mockTemplates.filter((template) => !template.metadata?.premium);
};

export const getPremiumTemplates = (): Template[] => {
  return mockTemplates.filter((template) => template.metadata?.premium);
};

// ============================================================================
// Example Template 1: Made In Italy Certificate
// A comprehensive multi-language template for Italian product certification
// ============================================================================

export const madeInItalyTemplate: Template = {
  id: "made_in_italy_1",
  name: "Made In Italy Certificate",
  description: "Certificate template for Italian product certification with multi-language support",
  category: "preset",
  certificateCount: 24,
  createdAt: new Date("2024-01-10"),
  updatedAt: new Date("2024-12-01"),
  thumbnail: "/template.svg",
  metadata: {
    style: "professional",
    premium: false,
    version: "1.0.0",
  },
  structure: {
    sections: [
      {
        id: "section_certificate",
        name: "Certificate",
        order: 1,
        collapsible: false,
        description: "Essential certification information and formal data",
        items: [
          {
            id: "name",
            type: "input",
            label: "Company Name",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "Enter your company name",
            validation: {
              minLength: 2,
              maxLength: 200,
              errorMessage: "Company name must be between 2 and 200 characters",
            },
          },
          {
            id: "certificate_title",
            type: "title",
            label: "100% Made in Italy Certificate",
            order: 2,
            required: true,
            immutable: true,
            style: "h1",
            alignment: "center",
            defaultValue: "100% Made in Italy Certificate",
          },
          {
            id: "short_description",
            type: "input",
            label: "Short Description",
            order: 3,
            required: true,
            inputType: "textarea",
            placeholder: "Brief description of your product or company",
            multiline: true,
            rows: 3,
            validation: {
              maxLength: 500,
              errorMessage: "Description cannot exceed 500 characters",
            },
          },
          {
            id: "certified_by",
            type: "badge",
            label: "Certified By",
            order: 4,
            required: true,
            immutable: true,
            badgeStyle: "info",
            defaultValue: "ORIGYN Foundation",
            allowCustomValue: false,
            predefinedValues: ["ORIGYN Foundation"],
          },
          {
            id: "vat_number",
            type: "input",
            label: "VAT Number",
            order: 5,
            required: true,
            inputType: "text",
            placeholder: "IT12345678901",
            validation: {
              pattern: "^[A-Z]{2}[0-9]{11}$",
              errorMessage: "VAT number must be in format: IT followed by 11 digits",
            },
          },
          {
            id: "certification_date",
            type: "input",
            label: "Certification Date",
            order: 6,
            required: true,
            inputType: "text",
            placeholder: "DD/MM/YYYY",
          },
          {
            id: "certification_expiration",
            type: "input",
            label: "Valid Until",
            order: 7,
            required: true,
            inputType: "text",
            placeholder: "DD/MM/YYYY",
          },
          {
            id: "product_images",
            type: "image",
            label: "Product Images",
            order: 8,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 8,
          },
        ],
      },
      {
        id: "section_information",
        name: "Information",
        order: 2,
        collapsible: true,
        description: "About the company, experience, and craftsmanship",
        items: [
          {
            id: "about_company",
            type: "input",
            label: "About the Company",
            order: 1,
            required: false,
            inputType: "textarea",
            placeholder: "Tell us about your company history and values...",
            multiline: true,
            rows: 5,
            validation: {
              maxLength: 2000,
              errorMessage: "Description cannot exceed 2000 characters",
            },
          },
          {
            id: "founding_year",
            type: "input",
            label: "Founding Year",
            order: 2,
            required: false,
            inputType: "number",
            placeholder: "YYYY",
          },
          {
            id: "location",
            type: "input",
            label: "Location",
            order: 3,
            required: false,
            inputType: "text",
            placeholder: "City, Region, Italy",
          },
          {
            id: "website",
            type: "input",
            label: "Website",
            order: 4,
            required: false,
            inputType: "url",
            placeholder: "https://example.com",
          },
          {
            id: "craftsmanship",
            type: "input",
            label: "Craftsmanship Details",
            order: 5,
            required: false,
            inputType: "textarea",
            placeholder: "Describe the traditional Italian techniques used...",
            multiline: true,
            rows: 4,
          },
          {
            id: "materials",
            type: "input",
            label: "Materials Used",
            order: 6,
            required: false,
            inputType: "textarea",
            placeholder: "List the Italian materials and their origins...",
            multiline: true,
            rows: 3,
          },
          {
            id: "production_process",
            type: "input",
            label: "Production Process",
            order: 7,
            required: false,
            inputType: "textarea",
            placeholder: "Describe how the product is made...",
            multiline: true,
            rows: 4,
          },
          {
            id: "additional_certifications",
            type: "badge",
            label: "Additional Certifications",
            order: 8,
            required: false,
            badgeStyle: "success",
            allowCustomValue: true,
            predefinedValues: [
              "ISO 9001",
              "ISO 14001",
              "Made in Italy Certified",
              "European Quality Mark",
              "Organic Certified",
            ],
          },
          {
            id: "gallery_images",
            type: "image",
            label: "Experience Gallery",
            order: 9,
            required: false,
            acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 12,
            acceptVideo: true, // Allow videos in the gallery
          },
        ],
      },
    ],
    languages: [
      { id: "en", code: "en", name: "English", isDefault: true },
      { id: "it", code: "it", name: "Italian" },
    ],
    searchIndexField: "name",
    metadata: {
      version: "1.0.0",
      createdBy: "system",
      lastModified: new Date("2024-12-01"),
      certificateCount: 24,
    },
  },
};

// ============================================================================
// Example Template 2: Gold Certificate
// A simpler template for precious metal verification
// ============================================================================

export const goldCertificateTemplate: Template = {
  id: "gold_cert_1",
  name: "Gold Certificate",
  description: "Certificate template for gold and precious metal verification",
  category: "preset",
  certificateCount: 18,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-12-01"),
  thumbnail: "/template.svg",
  metadata: {
    style: "luxury",
    premium: true,
    price: 19.99,
    version: "1.0.0",
  },
  structure: {
    sections: [
      {
        id: "section_certificate",
        name: "Certificate",
        order: 1,
        collapsible: false,
        description: "Essential certification information and formal data",
        items: [
          {
            id: "dealer_name",
            type: "input",
            label: "Dealer/Refiner Name",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "Enter dealer or refinery name",
          },
          {
            id: "certificate_title",
            type: "title",
            label: "Gold Authenticity Certificate",
            order: 2,
            required: true,
            immutable: true,
            style: "h1",
            alignment: "center",
            defaultValue: "Gold Authenticity Certificate",
          },
          {
            id: "verified_by",
            type: "badge",
            label: "Verified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "success",
            defaultValue: "ORIGYN - Gold Standard",
            allowCustomValue: false,
          },
          {
            id: "name",
            type: "input",
            label: "Product Name",
            order: 4,
            required: true,
            inputType: "text",
            placeholder: "e.g., 1oz Gold Bar, Gold Coin, etc.",
          },
          {
            id: "weight",
            type: "input",
            label: "Weight (grams)",
            order: 5,
            required: true,
            inputType: "number",
            placeholder: "e.g., 31.1035 (1 troy oz)",
          },
          {
            id: "purity",
            type: "badge",
            label: "Purity (Karat)",
            order: 6,
            required: true,
            badgeStyle: "default",
            allowCustomValue: false,
            predefinedValues: ["24K (99.9%)", "22K (91.7%)", "18K (75%)", "14K (58.3%)", "10K (41.7%)"],
          },
          {
            id: "serial_number",
            type: "input",
            label: "Serial Number",
            order: 7,
            required: true,
            inputType: "text",
            placeholder: "Unique serial/bar number",
          },
          {
            id: "assay_date",
            type: "input",
            label: "Assay Date",
            order: 8,
            required: true,
            inputType: "text",
            placeholder: "DD/MM/YYYY",
          },
          {
            id: "product_images",
            type: "image",
            label: "Product Images",
            order: 9,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 6,
          },
        ],
      },
      {
        id: "section_information",
        name: "Information",
        order: 2,
        collapsible: true,
        description: "Product details, provenance, and additional information",
        items: [
          {
            id: "origin",
            type: "input",
            label: "Origin / Source",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "Country or mine of origin",
          },
          {
            id: "refiner",
            type: "input",
            label: "Refiner Information",
            order: 2,
            required: false,
            inputType: "textarea",
            placeholder: "Information about the refinery",
            multiline: true,
            rows: 3,
          },
          {
            id: "dimensions",
            type: "input",
            label: "Dimensions (mm)",
            order: 3,
            required: false,
            inputType: "text",
            placeholder: "e.g., 50 x 28 x 1.5",
          },
          {
            id: "fineness",
            type: "input",
            label: "Fineness",
            order: 4,
            required: false,
            inputType: "text",
            placeholder: "e.g., 999.9",
          },
          {
            id: "provenance",
            type: "input",
            label: "Provenance & History",
            order: 5,
            required: false,
            inputType: "textarea",
            placeholder: "Ownership history and any notable background...",
            multiline: true,
            rows: 4,
          },
          {
            id: "storage_notes",
            type: "input",
            label: "Storage Recommendations",
            order: 6,
            required: false,
            inputType: "textarea",
            placeholder: "Recommended storage conditions...",
            multiline: true,
            rows: 3,
          },
          {
            id: "certifications",
            type: "badge",
            label: "Additional Certifications",
            order: 7,
            required: false,
            badgeStyle: "info",
            allowCustomValue: true,
            predefinedValues: [
              "LBMA Good Delivery",
              "COMEX Approved",
              "Swiss Assay",
              "Conflict-Free Gold",
            ],
          },
          {
            id: "detail_images",
            type: "image",
            label: "Detail Images",
            order: 8,
            required: false,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 8,
          },
        ],
      },
    ],
    languages: [
      { id: "en", code: "en", name: "English", isDefault: true },
    ],
    searchIndexField: "serial_number",
    metadata: {
      version: "1.0.0",
      lastModified: new Date("2024-12-01"),
      certificateCount: 18,
    },
  },
};

// ============================================================================
// Template Collections
// ============================================================================

// All available templates
export const mockTemplates: Template[] = [
  madeInItalyTemplate,
  goldCertificateTemplate,
];

// Template options for the choose template page
export const templateOptions: Template[] = mockTemplates;

// Manual template option (for users who want to start from scratch)
export const manualTemplateOption: Template = {
  id: "from_scratch",
  name: "Make one from scratch",
  description: "Build your own template using the visual editor or JSON code",
  category: "manual",
  structure: {
    sections: [
      {
        id: "section_certificate",
        name: "Certificate",
        order: 1,
        collapsible: false,
        description: "Essential certification information",
        items: [
          {
            id: "name",
            type: "input",
            label: "Certificate Name",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "Enter certificate name",
          },
        ],
      },
      {
        id: "section_information",
        name: "Information",
        order: 2,
        collapsible: true,
        description: "Additional information and details",
        items: [],
      },
    ],
    languages: [
      { id: "en", code: "en", name: "English", isDefault: true },
    ],
    metadata: {
      version: "1.0.0",
      createdBy: "user",
    },
  },
};
