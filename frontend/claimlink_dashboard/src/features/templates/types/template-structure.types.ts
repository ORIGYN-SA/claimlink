/**
 * Template Structure Types
 * 
 * Defines the schema for dynamic certificate templates with sections and items.
 * Templates are used to generate certificate forms dynamically.
 */

// ============================================================================
// Item Types
// ============================================================================

export type TemplateItemType = 'title' | 'input' | 'badge' | 'image';

/**
 * Base interface for all template items
 */
export interface BaseTemplateItem {
  id: string;
  type: TemplateItemType;
  label: string;
  order: number; // For drag-and-drop ordering
  required?: boolean;
  immutable?: boolean; // If true, user cannot modify this field
  description?: string; // Helper text
  validation?: ItemValidation;
}

/**
 * Validation rules for template items
 */
export interface ItemValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern
  errorMessage?: string;
}

/**
 * Title item - displays as heading/title text
 */
export interface TitleItem extends BaseTemplateItem {
  type: 'title';
  defaultValue?: string;
  style?: 'h1' | 'h2' | 'h3' | 'h4'; // Heading size
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Input item - text/number/textarea input field
 */
export interface InputItem extends BaseTemplateItem {
  type: 'input';
  inputType: 'text' | 'number' | 'textarea' | 'email' | 'url';
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  rows?: number; // For textarea
}

/**
 * Badge item - displays as badge/tag (e.g., "Issued By: ORIGYN")
 */
export interface BadgeItem extends BaseTemplateItem {
  type: 'badge';
  badgeStyle?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: string; // Icon identifier
  defaultValue?: string;
  allowCustomValue?: boolean; // If false, only predefined values allowed
  predefinedValues?: string[]; // Dropdown options
}

/**
 * Image item - image upload field
 */
export interface ImageItem extends BaseTemplateItem {
  type: 'image';
  acceptedFormats?: string[]; // e.g., ['image/jpeg', 'image/png']
  maxFileSize?: number; // In bytes
  aspectRatio?: string; // e.g., '16:9', '1:1'
  multiple?: boolean; // Allow multiple images (gallery)
  maxImages?: number; // Max number of images for gallery
}

/**
 * Union type for all template items
 */
export type TemplateItem = TitleItem | InputItem | BadgeItem | ImageItem;

// ============================================================================
// Section Types
// ============================================================================

export type TemplateSectionName = 
  | 'Certificate Introduction' 
  | 'Certificate' 
  | 'About' 
  | 'Experience';

/**
 * Template section containing multiple items
 */
export interface TemplateSection {
  id: string;
  name: TemplateSectionName;
  order: number; // Fixed order: Introduction(1), Certificate(2), About(3), Experience(4)
  items: TemplateItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  description?: string; // Section description
}

// ============================================================================
// Language Support
// ============================================================================

export interface TemplateLanguage {
  id: string;
  code: string; // e.g., 'en', 'fr', 'it'
  name: string; // e.g., 'English', 'French'
  isDefault?: boolean;
}

/**
 * Multi-language translations for items
 * Key is the item ID, value is translations for that item
 */
export interface TemplateTranslations {
  [itemId: string]: {
    [languageCode: string]: {
      label?: string;
      placeholder?: string;
      defaultValue?: string;
      description?: string;
    };
  };
}

// ============================================================================
// Complete Template Structure
// ============================================================================

export interface TemplateStructure {
  sections: TemplateSection[];
  languages: TemplateLanguage[];
  translations?: TemplateTranslations;
  searchIndexField?: string; // Field ID to use as search index
  metadata?: {
    version?: string;
    createdBy?: string;
    lastModified?: Date;
    certificateCount?: number;
  };
}

// ============================================================================
// Form Data Types (for certificate creation)
// ============================================================================

/**
 * Form data structure when creating a certificate from a template
 * Key is the item ID, value is the user's input
 */
export interface CertificateFormData {
  [itemId: string]: string | string[] | File | File[];
}

/**
 * Validation result for form data
 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    [itemId: string]: string;
  };
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Item creation/edit form data
 */
export interface CreateItemInput {
  type: TemplateItemType;
  label: string;
  sectionId: string;
  required?: boolean;
  // Additional fields based on type
  [key: string]: any;
}

/**
 * Section summary for UI display
 */
export interface SectionSummary {
  id: string;
  name: TemplateSectionName;
  itemCount: number;
  requiredItemCount: number;
}

