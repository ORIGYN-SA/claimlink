/**
 * Template Types
 *
 * Complete type definitions for the templates feature, including:
 * - Template structure (sections, items, languages)
 * - Form data and validation
 * - API inputs and filters
 * - UI component props
 */

// ============================================================================
// Item Types
// ============================================================================

export type TemplateItemType = 'title' | 'input' | 'badge' | 'image' | 'video';

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
 * Video item - video upload field
 */
export interface VideoItem extends BaseTemplateItem {
  type: 'video';
  acceptedFormats?: string[]; // e.g., ['video/mp4', 'video/webm', 'video/quicktime']
  maxFileSize?: number; // In bytes (default: 50MB)
  aspectRatio?: string; // e.g., '16:9', '4:3'
  maxDuration?: number; // Max duration in seconds
  autoplay?: boolean; // Whether to autoplay on preview
  loop?: boolean; // Whether to loop the video
  muted?: boolean; // Whether to mute by default
}

/**
 * Union type for all template items
 */
export type TemplateItem = TitleItem | InputItem | BadgeItem | ImageItem | VideoItem;

// ============================================================================
// Section Types
// ============================================================================

export type TemplateSectionName =
  | 'Certificate'   // Maps to Certificate tab - formal certification data
  | 'Information';  // Maps to Information tab - about, experience, gallery

/**
 * Template section containing multiple items
 */
export interface TemplateSection {
  id: string;
  name: TemplateSectionName;
  order: number; // Fixed order: Certificate(1), Information(2)
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

// ============================================================================
// API Types
// ============================================================================

export interface CreateTemplateInput {
  name: string;
  description: string;
  category: 'manual' | 'ai' | 'existing' | 'preset';
  metadata?: Record<string, any>;
}

export interface TemplateFilters {
  category?: string;
  search?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ============================================================================
// Template Types (Frontend)
// ============================================================================

/**
 * Frontend Template type
 *
 * This is the main template type used throughout the frontend.
 * When stored in the backend, the relevant fields are serialized to JSON.
 */
export interface Template {
  id: string; // String version of backend template_id for frontend use
  name: string;
  description: string;
  category: 'manual' | 'ai' | 'existing' | 'preset';
  certificateCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  // Template structure with sections and items
  structure?: TemplateStructure;
}

// ============================================================================
// Backend Template Types
// ============================================================================

/**
 * Backend template as returned from claimlink canister
 * Mirrors the Candid Template type
 */
export interface BackendTemplate {
  template_id: bigint;
  template_json: string;
}

/**
 * JSON structure stored in template_json
 * This is what gets serialized/deserialized when communicating with backend
 */
export interface TemplateJsonPayload {
  name: string;
  description: string;
  category: 'manual' | 'ai' | 'existing' | 'preset';
  structure: TemplateStructure;
  metadata?: Record<string, unknown>;
  thumbnail?: string;
}

/**
 * Transform a backend template to frontend Template type
 */
export function transformBackendTemplate(backend: BackendTemplate): Template {
  try {
    const payload: TemplateJsonPayload = JSON.parse(backend.template_json);
    return {
      id: backend.template_id.toString(),
      name: payload.name,
      description: payload.description,
      category: payload.category,
      structure: payload.structure,
      metadata: payload.metadata,
      thumbnail: payload.thumbnail,
    };
  } catch (error) {
    console.error('Failed to parse template JSON:', error);
    return {
      id: backend.template_id.toString(),
      name: 'Invalid Template',
      description: 'Failed to parse template data',
      category: 'manual',
    };
  }
}

/**
 * Serialize a frontend Template to JSON for backend storage
 */
export function serializeTemplateToJson(template: Template): string {
  const payload: TemplateJsonPayload = {
    name: template.name,
    description: template.description,
    category: template.category,
    structure: template.structure!,
    metadata: template.metadata as Record<string, unknown> | undefined,
    thumbnail: template.thumbnail,
  };
  return JSON.stringify(payload);
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
}
