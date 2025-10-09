import type { TemplateStructure } from '@/features/templates/types/template-structure.types';

// Template data type - unified for all use cases
export interface Template {
  id: string
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing' | 'preset'
  certificateCount?: number
  createdAt?: Date
  updatedAt?: Date
  thumbnail?: string
  metadata?: Record<string, any>
  // Template structure with sections and items
  structure?: TemplateStructure
}

// Mock templates data - shared across the application
export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Classic Certificate Template",
    description: "Traditional certificate design with elegant typography",
    category: "existing",
    certificateCount: 12,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    thumbnail: "/template.svg",
    metadata: { style: "classic", premium: false }
  },
  {
    id: "2",
    name: "Modern Minimalist Template",
    description: "Clean and modern certificate design",
    category: "existing",
    certificateCount: 8,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    thumbnail: "/template.svg",
    metadata: { style: "modern", premium: false }
  },
  {
    id: "3",
    name: "Artistic Frame Template",
    description: "Certificate with artistic decorative elements",
    category: "existing",
    certificateCount: 15,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-25'),
    thumbnail: "/template.svg",
    metadata: { style: "artistic", premium: true, price: 9.99 }
  },
  {
    id: "4",
    name: "Corporate Professional Template",
    description: "Professional certificate for corporate use",
    category: "existing",
    certificateCount: 22,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-28'),
    thumbnail: "/template.svg",
    metadata: { style: "corporate", premium: false }
  },
  {
    id: "5",
    name: "Vintage Style Template",
    description: "Classic vintage certificate design",
    category: "existing",
    certificateCount: 6,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-22'),
    thumbnail: "/template.svg",
    metadata: { style: "vintage", premium: true, price: 14.99 }
  },
  {
    id: "6",
    name: "Digital Tech Template",
    description: "Modern tech-inspired certificate design",
    category: "existing",
    certificateCount: 9,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-26'),
    thumbnail: "/template.svg",
    metadata: { style: "tech", premium: false }
  },
  {
    id: "7",
    name: "Award Certificate Template",
    description: "Special award certificate design",
    category: "existing",
    certificateCount: 18,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-27'),
    thumbnail: "/template.svg",
    metadata: { style: "award", premium: true, price: 19.99 }
  },
  {
    id: "8",
    name: "Educational Standard Template",
    description: "Standard educational certificate",
    category: "existing",
    certificateCount: 11,
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-29'),
    thumbnail: "/template.svg",
    metadata: { style: "education", premium: false }
  },
];

// Helper functions for working with templates
export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: 'manual' | 'ai' | 'existing'): Template[] => {
  return mockTemplates.filter((template) => template.category === category);
};

export const getFreeTemplates = (): Template[] => {
  return mockTemplates.filter((template) => !template.metadata?.premium);
};

export const getPremiumTemplates = (): Template[] => {
  return mockTemplates.filter((template) => template.metadata?.premium);
};

// ============================================================================
// Industry-Specific Template Definitions
// ============================================================================

/**
 * Art Certificate Template
 */
export const artCertificateTemplate: Template = {
  id: "art_cert_1",
  name: "Art Certificate",
  description: "Certificate template for artwork authentication and provenance",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-art.svg",
  metadata: { 
    style: "artistic", 
    premium: false,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_gallery_name",
            type: "title",
            label: "Gallery/Artist Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_artwork_title",
            type: "input",
            label: "Artwork Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Enter artwork title"
          },
          {
            id: "item_description",
            type: "input",
            label: "Description",
            order: 3,
            required: true,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "Brief description of the artwork"
          },
          {
            id: "item_certified_by",
            type: "badge",
            label: "Certified By",
            order: 4,
            required: true,
            immutable: true,
            badgeStyle: "info",
            defaultValue: "ORIGYN - Art Authentication",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_artist_name",
            type: "input",
            label: "Artist Name",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "Full name of the artist"
          },
          {
            id: "item_creation_year",
            type: "input",
            label: "Year of Creation",
            order: 2,
            required: true,
            inputType: "number",
            placeholder: "YYYY"
          },
          {
            id: "item_medium",
            type: "input",
            label: "Medium",
            order: 3,
            required: true,
            inputType: "text",
            placeholder: "e.g., Oil on canvas, Digital art, Sculpture"
          },
          {
            id: "item_dimensions",
            type: "input",
            label: "Dimensions",
            order: 4,
            required: false,
            inputType: "text",
            placeholder: "e.g., 100 x 150 cm"
          },
          {
            id: "item_artwork_images",
            type: "image",
            label: "Artwork Images",
            order: 5,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 8
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_provenance",
            type: "input",
            label: "Provenance",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "History of ownership and exhibition"
          },
          {
            id: "item_condition",
            type: "badge",
            label: "Condition",
            order: 2,
            required: false,
            badgeStyle: "default",
            allowCustomValue: true,
            predefinedValues: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_artist_bio",
            type: "input",
            label: "Artist Biography",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Brief biography of the artist"
          },
          {
            id: "item_exhibitions",
            type: "input",
            label: "Notable Exhibitions",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "List of notable exhibitions"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_artwork_title"
  }
};

/**
 * Diamond Certificate Template
 */
export const diamondCertificateTemplate: Template = {
  id: "diamond_cert_1",
  name: "Diamond Certificate",
  description: "Certificate template for diamond grading and authentication",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-diamond.svg",
  metadata: { 
    style: "luxury", 
    premium: true,
    price: 24.99,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_jeweler_name",
            type: "title",
            label: "Jeweler/Dealer Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., Diamond Grading Certificate"
          },
          {
            id: "item_verified_badge",
            type: "badge",
            label: "Verified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "success",
            defaultValue: "ORIGYN - Diamond Certification",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_carat_weight",
            type: "input",
            label: "Carat Weight",
            order: 1,
            required: true,
            inputType: "number",
            placeholder: "e.g., 1.50"
          },
          {
            id: "item_cut_grade",
            type: "badge",
            label: "Cut Grade",
            order: 2,
            required: true,
            allowCustomValue: false,
            predefinedValues: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
          },
          {
            id: "item_color_grade",
            type: "badge",
            label: "Color Grade",
            order: 3,
            required: true,
            allowCustomValue: false,
            predefinedValues: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]
          },
          {
            id: "item_clarity_grade",
            type: "badge",
            label: "Clarity Grade",
            order: 4,
            required: true,
            allowCustomValue: false,
            predefinedValues: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"]
          },
          {
            id: "item_report_number",
            type: "input",
            label: "Report Number",
            order: 5,
            required: true,
            inputType: "text",
            placeholder: "Unique grading report number"
          },
          {
            id: "item_diamond_images",
            type: "image",
            label: "Diamond Images",
            order: 6,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 6
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_shape",
            type: "badge",
            label: "Shape",
            order: 1,
            required: false,
            allowCustomValue: false,
            predefinedValues: ["Round", "Princess", "Cushion", "Emerald", "Oval", "Pear", "Marquise", "Radiant", "Asscher", "Heart"]
          },
          {
            id: "item_measurements",
            type: "input",
            label: "Measurements (mm)",
            order: 2,
            required: false,
            inputType: "text",
            placeholder: "e.g., 6.50 x 6.45 x 4.05"
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_additional_notes",
            type: "input",
            label: "Additional Notes",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Any additional information about the diamond"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_report_number"
  }
};

/**
 * Watches Certificate Template
 */
export const watchesCertificateTemplate: Template = {
  id: "watches_cert_1",
  name: "Watches Certificate",
  description: "Certificate template for luxury watch authentication",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-watches.svg",
  metadata: { 
    style: "luxury", 
    premium: true,
    price: 19.99,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_dealer_name",
            type: "title",
            label: "Authorized Dealer Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., Luxury Watch Certificate of Authenticity"
          },
          {
            id: "item_certified_badge",
            type: "badge",
            label: "Certified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "info",
            defaultValue: "ORIGYN - Watch Authentication",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_brand",
            type: "input",
            label: "Brand",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "e.g., Rolex, Patek Philippe, Omega"
          },
          {
            id: "item_model",
            type: "input",
            label: "Model",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Model name and reference number"
          },
          {
            id: "item_serial_number",
            type: "input",
            label: "Serial Number",
            order: 3,
            required: true,
            inputType: "text",
            placeholder: "Unique serial number"
          },
          {
            id: "item_manufacture_year",
            type: "input",
            label: "Year of Manufacture",
            order: 4,
            required: false,
            inputType: "number",
            placeholder: "YYYY"
          },
          {
            id: "item_watch_images",
            type: "image",
            label: "Watch Images",
            order: 5,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 8
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_movement",
            type: "input",
            label: "Movement Type",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "e.g., Automatic, Manual, Quartz"
          },
          {
            id: "item_case_material",
            type: "input",
            label: "Case Material",
            order: 2,
            required: false,
            inputType: "text",
            placeholder: "e.g., Stainless Steel, Gold, Platinum"
          },
          {
            id: "item_condition",
            type: "badge",
            label: "Condition",
            order: 3,
            required: false,
            allowCustomValue: false,
            predefinedValues: ["New", "Excellent", "Very Good", "Good", "Fair"]
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_complications",
            type: "input",
            label: "Complications",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "List any complications (e.g., chronograph, date, moon phase)"
          },
          {
            id: "item_service_history",
            type: "input",
            label: "Service History",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "Service and maintenance history"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_serial_number"
  }
};

/**
 * Cars Certificate Template
 */
export const carsCertificateTemplate: Template = {
  id: "cars_cert_1",
  name: "Cars Certificate",
  description: "Certificate template for classic and luxury car authentication",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-cars.svg",
  metadata: { 
    style: "automotive", 
    premium: true,
    price: 29.99,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_dealer_name",
            type: "title",
            label: "Dealer/Collector Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., Classic Car Certificate of Authenticity"
          },
          {
            id: "item_certified_badge",
            type: "badge",
            label: "Certified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "success",
            defaultValue: "ORIGYN - Automotive Certification",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_make",
            type: "input",
            label: "Make",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "e.g., Ferrari, Porsche, Mercedes-Benz"
          },
          {
            id: "item_model",
            type: "input",
            label: "Model",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Model name"
          },
          {
            id: "item_year",
            type: "input",
            label: "Year",
            order: 3,
            required: true,
            inputType: "number",
            placeholder: "YYYY"
          },
          {
            id: "item_vin",
            type: "input",
            label: "VIN (Vehicle Identification Number)",
            order: 4,
            required: true,
            inputType: "text",
            placeholder: "17-character VIN"
          },
          {
            id: "item_mileage",
            type: "input",
            label: "Mileage",
            order: 5,
            required: false,
            inputType: "number",
            placeholder: "Current mileage"
          },
          {
            id: "item_car_images",
            type: "image",
            label: "Vehicle Images",
            order: 6,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 15
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_color",
            type: "input",
            label: "Exterior Color",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "Original/current exterior color"
          },
          {
            id: "item_interior",
            type: "input",
            label: "Interior",
            order: 2,
            required: false,
            inputType: "text",
            placeholder: "Interior color and material"
          },
          {
            id: "item_transmission",
            type: "badge",
            label: "Transmission",
            order: 3,
            required: false,
            allowCustomValue: true,
            predefinedValues: ["Manual", "Automatic", "Semi-Automatic"]
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_provenance",
            type: "input",
            label: "Ownership History",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Previous owners and history"
          },
          {
            id: "item_restoration",
            type: "input",
            label: "Restoration Details",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Any restoration or modification work"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_vin"
  }
};

/**
 * Spirit Certificate Template
 */
export const spiritCertificateTemplate: Template = {
  id: "spirit_cert_1",
  name: "Spirit Certificate",
  description: "Certificate template for rare spirits and wine authentication",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-spirit.svg",
  metadata: { 
    style: "luxury", 
    premium: false,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_distillery_name",
            type: "title",
            label: "Distillery/Producer Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., Rare Spirit Certificate of Authenticity"
          },
          {
            id: "item_certified_badge",
            type: "badge",
            label: "Certified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "info",
            defaultValue: "ORIGYN - Spirit Authentication",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_spirit_name",
            type: "input",
            label: "Spirit Name",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "e.g., Macallan 25 Year Single Malt"
          },
          {
            id: "item_type",
            type: "badge",
            label: "Type",
            order: 2,
            required: true,
            allowCustomValue: true,
            predefinedValues: ["Whisky", "Wine", "Cognac", "Rum", "Vodka", "Gin", "Tequila", "Brandy"]
          },
          {
            id: "item_vintage_year",
            type: "input",
            label: "Vintage/Distillation Year",
            order: 3,
            required: false,
            inputType: "number",
            placeholder: "YYYY"
          },
          {
            id: "item_bottle_number",
            type: "input",
            label: "Bottle Number",
            order: 4,
            required: false,
            inputType: "text",
            placeholder: "e.g., 456/1000 for limited editions"
          },
          {
            id: "item_spirit_images",
            type: "image",
            label: "Bottle Images",
            order: 5,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 6
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_region",
            type: "input",
            label: "Region",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "e.g., Speyside, Bordeaux, Kentucky"
          },
          {
            id: "item_abv",
            type: "input",
            label: "ABV (Alcohol by Volume)",
            order: 2,
            required: false,
            inputType: "text",
            placeholder: "e.g., 43%"
          },
          {
            id: "item_bottle_size",
            type: "input",
            label: "Bottle Size",
            order: 3,
            required: false,
            inputType: "text",
            placeholder: "e.g., 750ml, 1L"
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_tasting_notes",
            type: "input",
            label: "Tasting Notes",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Flavor profile and tasting notes"
          },
          {
            id: "item_storage_notes",
            type: "input",
            label: "Storage & Provenance",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "Storage conditions and ownership history"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_bottle_number"
  }
};

/**
 * Luxury Good Certificate Template
 */
export const luxuryGoodCertificateTemplate: Template = {
  id: "luxury_cert_1",
  name: "Luxury Good Certificate",
  description: "Certificate template for luxury goods and fashion items",
  category: "preset",
  certificateCount: 0,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-01'),
    thumbnail: "/template-luxury.svg",
  metadata: { 
    style: "luxury", 
    premium: true,
    price: 19.99,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_brand_name",
            type: "title",
            label: "Brand/Retailer Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., Luxury Item Certificate of Authenticity"
          },
          {
            id: "item_certified_badge",
            type: "badge",
            label: "Certified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "success",
            defaultValue: "ORIGYN - Luxury Authentication",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_brand",
            type: "input",
            label: "Brand",
            order: 1,
            required: true,
            inputType: "text",
            placeholder: "e.g., Louis Vuitton, Hermès, Chanel"
          },
          {
            id: "item_item_name",
            type: "input",
            label: "Item Name/Model",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Product name or model number"
          },
          {
            id: "item_category",
            type: "badge",
            label: "Category",
            order: 3,
            required: true,
            allowCustomValue: true,
            predefinedValues: ["Handbag", "Wallet", "Shoes", "Clothing", "Accessory", "Jewelry"]
          },
          {
            id: "item_serial_number",
            type: "input",
            label: "Serial Number/SKU",
            order: 4,
            required: false,
            inputType: "text",
            placeholder: "Unique identifier or serial number"
          },
          {
            id: "item_luxury_images",
            type: "image",
            label: "Product Images",
            order: 5,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760,
            multiple: true,
            maxImages: 10
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_material",
            type: "input",
            label: "Material",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "e.g., Leather, Canvas, Silk"
          },
          {
            id: "item_color",
            type: "input",
            label: "Color",
            order: 2,
            required: false,
            inputType: "text",
            placeholder: "Product color"
          },
          {
            id: "item_condition",
            type: "badge",
            label: "Condition",
            order: 3,
            required: false,
            allowCustomValue: false,
            predefinedValues: ["Brand New", "Excellent", "Very Good", "Good", "Fair"]
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_purchase_info",
            type: "input",
            label: "Purchase Information",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "Original purchase location and date"
          },
          {
            id: "item_additional_details",
            type: "input",
            label: "Additional Details",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3,
            placeholder: "Any additional information about the item"
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_serial_number"
  }
};

// ============================================================================
// Complete Template Structure Examples
// ============================================================================

/**
 * Example template with full structure for "Made In Italy" certificate
 */
export const madeInItalyTemplate: Template = {
  id: "made_in_italy_1",
  name: "Made In Italy Certificate",
  description: "Complete certificate template for Italian product certification",
  category: "preset",
  certificateCount: 24,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-02-28'),
  thumbnail: "/template-madein.svg",
  metadata: { 
    style: "professional", 
    premium: false,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        collapsible: false,
        items: [
          {
            id: "item_company_name_title",
            type: "title",
            label: "Company Name",
            order: 1,
            required: true,
            style: "h2",
            alignment: "left"
          },
          {
            id: "item_certificate_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Enter certificate title",
            validation: {
              minLength: 3,
              maxLength: 100,
              errorMessage: "Title must be between 3 and 100 characters"
            }
          },
          {
            id: "item_short_description",
            type: "input",
            label: "Short Description",
            order: 3,
            required: true,
            inputType: "textarea",
            placeholder: "Brief description of the certificate",
            multiline: true,
            rows: 3,
            validation: {
              maxLength: 500,
              errorMessage: "Description cannot exceed 500 characters"
            }
          },
          {
            id: "item_issued_by",
            type: "badge",
            label: "Issued By",
            order: 4,
            required: true,
            immutable: true,
            badgeStyle: "info",
            icon: "CircleStack",
            defaultValue: "ORIGYN Foundation",
            allowCustomValue: false,
            predefinedValues: ["ORIGYN Foundation"]
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        collapsible: false,
        items: [
          {
            id: "item_certificate_heading",
            type: "title",
            label: "100% Made in Italy Certificate",
            order: 1,
            required: true,
            immutable: true,
            style: "h1",
            alignment: "center",
            defaultValue: "100% Made in Italy Certificate"
          },
          {
            id: "item_company_name_input",
            type: "input",
            label: "Company Name",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "Enter company name",
            validation: {
              minLength: 2,
              maxLength: 200,
              errorMessage: "Company name must be between 2 and 200 characters"
            }
          },
          {
            id: "item_vat_number",
            type: "input",
            label: "VAT Number",
            order: 3,
            required: true,
            inputType: "text",
            placeholder: "IT12345678901",
            validation: {
              pattern: "^[A-Z]{2}[0-9]{11}$",
              errorMessage: "VAT number must be in format: IT followed by 11 digits"
            }
          },
          {
            id: "item_image_gallery",
            type: "image",
            label: "Product Image Gallery",
            order: 4,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
            maxFileSize: 5242880, // 5MB
            aspectRatio: "16:9",
            multiple: true,
            maxImages: 5
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        collapsible: true,
        items: [
          {
            id: "item_about_heading",
            type: "title",
            label: "About the Company",
            order: 1,
            style: "h3",
            alignment: "left"
          },
          {
            id: "item_company_description",
            type: "input",
            label: "Company Description",
            order: 2,
            required: false,
            inputType: "textarea",
            placeholder: "Tell us about your company...",
            multiline: true,
            rows: 5,
            validation: {
              maxLength: 1000,
              errorMessage: "Description cannot exceed 1000 characters"
            }
          },
          {
            id: "item_founding_year",
            type: "input",
            label: "Founding Year",
            order: 3,
            required: false,
            inputType: "number",
            placeholder: "YYYY",
            validation: {
              pattern: "^[0-9]{4}$",
              errorMessage: "Please enter a valid 4-digit year"
            }
          },
          {
            id: "item_website",
            type: "input",
            label: "Website URL",
            order: 4,
            required: false,
            inputType: "url",
            placeholder: "https://example.com"
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        collapsible: true,
        items: [
          {
            id: "item_experience_heading",
            type: "title",
            label: "Product Experience",
            order: 1,
            style: "h3",
            alignment: "left"
          },
          {
            id: "item_craftsmanship",
            type: "input",
            label: "Craftsmanship Details",
            order: 2,
            required: false,
            inputType: "textarea",
            placeholder: "Describe the craftsmanship and traditional techniques...",
            multiline: true,
            rows: 4
          },
          {
            id: "item_materials",
            type: "input",
            label: "Materials Used",
            order: 3,
            required: false,
            inputType: "textarea",
            placeholder: "List the Italian materials and their origins...",
            multiline: true,
            rows: 3
          },
          {
            id: "item_certifications",
            type: "badge",
            label: "Additional Certifications",
            order: 4,
            required: false,
            badgeStyle: "success",
            allowCustomValue: true,
            predefinedValues: [
              "ISO 9001",
              "ISO 14001",
              "Made in Italy Certified",
              "European Quality Mark"
            ]
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true },
      { id: "it", code: "IT", name: "Italian" },
      { id: "fr", code: "FR", name: "French" }
    ],
    searchIndexField: "item_vat_number",
    metadata: {
      version: "1.0.0",
      createdBy: "system",
      lastModified: new Date('2024-02-28'),
      certificateCount: 24
    }
  }
};

/**
 * Example Gold Certificate Template
 */
export const goldCertificateTemplate: Template = {
  id: "gold_cert_1",
  name: "Gold Certificate",
  description: "Certificate template for gold product verification",
  category: "preset",
  certificateCount: 18,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-02-25'),
  thumbnail: "/template-gold.svg",
  metadata: { 
    style: "luxury", 
    premium: true,
    price: 19.99,
    version: "1.0.0"
  },
  structure: {
    sections: [
      {
        id: "section_intro",
        name: "Certificate Introduction",
        order: 1,
        items: [
          {
            id: "item_dealer_name",
            type: "title",
            label: "Gold Dealer Name",
            order: 1,
            required: true,
            style: "h2"
          },
          {
            id: "item_cert_title",
            type: "input",
            label: "Certificate Title",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., 24K Gold Bar Certificate"
          },
          {
            id: "item_issued_badge",
            type: "badge",
            label: "Verified By",
            order: 3,
            required: true,
            immutable: true,
            badgeStyle: "success",
            defaultValue: "ORIGYN - Gold Standard",
            allowCustomValue: false
          }
        ]
      },
      {
        id: "section_certificate",
        name: "Certificate",
        order: 2,
        items: [
          {
            id: "item_gold_weight",
            type: "input",
            label: "Gold Weight (grams)",
            order: 1,
            required: true,
            inputType: "number",
            placeholder: "e.g., 31.1035 (1 troy oz)"
          },
          {
            id: "item_purity",
            type: "input",
            label: "Purity (Karat)",
            order: 2,
            required: true,
            inputType: "text",
            placeholder: "e.g., 24K, 22K, 18K",
            validation: {
              pattern: "^(9|10|14|18|22|24)K$",
              errorMessage: "Common purities: 9K, 10K, 14K, 18K, 22K, 24K"
            }
          },
          {
            id: "item_serial_number",
            type: "input",
            label: "Serial Number",
            order: 3,
            required: true,
            inputType: "text",
            placeholder: "Unique identifier"
          },
          {
            id: "item_gold_images",
            type: "image",
            label: "Product Images",
            order: 4,
            required: true,
            acceptedFormats: ["image/jpeg", "image/png"],
            maxFileSize: 10485760, // 10MB
            multiple: true,
            maxImages: 10
          }
        ]
      },
      {
        id: "section_about",
        name: "About",
        order: 3,
        items: [
          {
            id: "item_origin",
            type: "input",
            label: "Origin/Mine Location",
            order: 1,
            required: false,
            inputType: "text",
            placeholder: "Country or mine of origin"
          },
          {
            id: "item_refiner",
            type: "input",
            label: "Refiner Information",
            order: 2,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 3
          }
        ]
      },
      {
        id: "section_experience",
        name: "Experience",
        order: 4,
        items: [
          {
            id: "item_history",
            type: "input",
            label: "Product History",
            order: 1,
            required: false,
            inputType: "textarea",
            multiline: true,
            rows: 4,
            placeholder: "Provenance and historical significance..."
          }
        ]
      }
    ],
    languages: [
      { id: "en", code: "EN", name: "English", isDefault: true }
    ],
    searchIndexField: "item_serial_number",
    metadata: {
      version: "1.0.0",
      lastModified: new Date('2024-02-25'),
      certificateCount: 18
    }
  }
};

// ============================================================================
// Template Collections
// ============================================================================

// Template options for the choose template page
export const templateOptions: Template[] = [
  artCertificateTemplate,
  diamondCertificateTemplate,
  goldCertificateTemplate,
  watchesCertificateTemplate,
  carsCertificateTemplate,
  spiritCertificateTemplate,
  luxuryGoodCertificateTemplate,
  madeInItalyTemplate
];

// Manual template option
export const manualTemplateOption: Template = {
  id: "code_it",
  name: "Code it",
  description: "Create manually your template with your developers",
  category: "manual"
};
