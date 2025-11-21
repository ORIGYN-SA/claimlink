/**
 * Template Utilities
 * 
 * Helper functions for working with templates, sections, and items
 */

import type { Template } from '@/shared/data/templates';
import type {
  TemplateSection,
  TemplateItem,
  TemplateItemType,
  TitleItem,
  InputItem,
  BadgeItem,
  ImageItem,
  CertificateFormData,
  ValidationResult,
} from '@/features/templates/types/template-structure.types';

// ============================================================================
// Template Getters
// ============================================================================

/**
 * Get all sections from a template, sorted by order
 */
export function getTemplateSections(template: Template): TemplateSection[] {
  if (!template.structure?.sections) return [];
  return [...template.structure.sections].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific section by ID
 */
export function getSectionById(
  template: Template,
  sectionId: string
): TemplateSection | undefined {
  return template.structure?.sections.find((s) => s.id === sectionId);
}

/**
 * Get all items from a section, sorted by order
 */
export function getSectionItems(section: TemplateSection): TemplateItem[] {
  return [...section.items].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific item by ID from template
 */
export function getItemById(
  template: Template,
  itemId: string
): TemplateItem | undefined {
  const sections = getTemplateSections(template);
  for (const section of sections) {
    const item = section.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}

/**
 * Get all required items from template
 */
export function getRequiredItems(template: Template): TemplateItem[] {
  const sections = getTemplateSections(template);
  const allItems = sections.flatMap((s) => s.items);
  return allItems.filter((item) => item.required);
}

/**
 * Get item count per section
 */
export function getSectionItemCount(section: TemplateSection): number {
  return section.items.length;
}

/**
 * Get required item count per section
 */
export function getSectionRequiredItemCount(section: TemplateSection): number {
  return section.items.filter((item) => item.required).length;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isTitleItem(item: TemplateItem): item is TitleItem {
  return item.type === 'title';
}

export function isInputItem(item: TemplateItem): item is InputItem {
  return item.type === 'input';
}

export function isBadgeItem(item: TemplateItem): item is BadgeItem {
  return item.type === 'badge';
}

export function isImageItem(item: TemplateItem): item is ImageItem {
  return item.type === 'image';
}

// ============================================================================
// Icon/Visual Helpers
// ============================================================================

/**
 * Get icon identifier for item type
 */
export function getItemTypeIcon(type: TemplateItemType): string {
  const iconMap: Record<TemplateItemType, string> = {
    title: 'Tt',
    input: 'Mint',
    badge: 'CircleStack',
    image: 'Mint',
  };
  return iconMap[type] || 'Mint';
}

/**
 * Get display name for item type
 */
export function getItemTypeDisplayName(type: TemplateItemType): string {
  const displayNames: Record<TemplateItemType, string> = {
    title: 'Title',
    input: 'Input',
    badge: 'Badge',
    image: 'Image',
  };
  return displayNames[type] || type;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate a single field value
 */
export function validateField(
  item: TemplateItem,
  value: any
): { isValid: boolean; error?: string } {
  // Check required
  if (item.required && !value) {
    return {
      isValid: false,
      error: `${item.label} is required`,
    };
  }

  // Skip validation if value is empty and not required
  if (!value && !item.required) {
    return { isValid: true };
  }

  // Type-specific validation
  if (isInputItem(item) && item.validation) {
    const validation = item.validation;
    const strValue = String(value);

    // Min length
    if (validation.minLength && strValue.length < validation.minLength) {
      return {
        isValid: false,
        error: validation.errorMessage || `Minimum length is ${validation.minLength}`,
      };
    }

    // Max length
    if (validation.maxLength && strValue.length > validation.maxLength) {
      return {
        isValid: false,
        error: validation.errorMessage || `Maximum length is ${validation.maxLength}`,
      };
    }

    // Pattern
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(strValue)) {
        return {
          isValid: false,
          error: validation.errorMessage || `Invalid format`,
        };
      }
    }
  }

  // Image validation
  if (isImageItem(item) && value) {
    const files = Array.isArray(value) ? value : [value];

    if (item.multiple && item.maxImages && files.length > item.maxImages) {
      return {
        isValid: false,
        error: `Maximum ${item.maxImages} images allowed`,
      };
    }

    for (const file of files) {
      if (file instanceof File) {
        // Check file size
        if (item.maxFileSize && file.size > item.maxFileSize) {
          const maxMB = (item.maxFileSize / 1024 / 1024).toFixed(2);
          return {
            isValid: false,
            error: `File size must be less than ${maxMB}MB`,
          };
        }

        // Check file type
        if (item.acceptedFormats && !item.acceptedFormats.includes(file.type)) {
          return {
            isValid: false,
            error: `File type not accepted. Allowed: ${item.acceptedFormats.join(', ')}`,
          };
        }
      }
    }
  }

  return { isValid: true };
}

/**
 * Validate all fields in form data
 */
export function validateFormData(
  template: Template,
  formData: CertificateFormData
): ValidationResult {
  const errors: { [itemId: string]: string } = {};
  const sections = getTemplateSections(template);

  sections.forEach((section) => {
    section.items.forEach((item) => {
      const value = formData[item.id];
      const result = validateField(item, value);

      if (!result.isValid && result.error) {
        errors[item.id] = result.error;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Form Data Helpers
// ============================================================================

/**
 * Get initial/default form data for a template
 */
export function getInitialFormData(template: Template): CertificateFormData {
  const formData: CertificateFormData = {};
  const sections = getTemplateSections(template);

  sections.forEach((section) => {
    section.items.forEach((item) => {
      if (isTitleItem(item) && item.defaultValue) {
        formData[item.id] = item.defaultValue;
      } else if (isInputItem(item) && item.defaultValue) {
        formData[item.id] = item.defaultValue;
      } else if (isBadgeItem(item) && item.defaultValue) {
        formData[item.id] = item.defaultValue;
      } else if (isImageItem(item) && item.multiple) {
        formData[item.id] = [];
      } else {
        formData[item.id] = '';
      }
    });
  });

  return formData;
}

/**
 * Check if form data is complete (all required fields filled)
 */
export function isFormComplete(
  template: Template,
  formData: CertificateFormData
): boolean {
  const requiredItems = getRequiredItems(template);

  return requiredItems.every((item) => {
    const value = formData[item.id];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null && value !== '';
  });
}

// ============================================================================
// Section Helpers
// ============================================================================

/**
 * Calculate section completion percentage
 */
export function getSectionProgress(
  section: TemplateSection,
  formData: CertificateFormData
): number {
  if (section.items.length === 0) return 100;

  const completedCount = section.items.filter((item) => {
    const value = formData[item.id];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  }).length;

  return Math.round((completedCount / section.items.length) * 100);
}

/**
 * Get overall template completion percentage
 */
export function getTemplateProgress(
  template: Template,
  formData: CertificateFormData
): number {
  const sections = getTemplateSections(template);
  if (sections.length === 0) return 0;

  const totalProgress = sections.reduce(
    (sum, section) => sum + getSectionProgress(section, formData),
    0
  );

  return Math.round(totalProgress / sections.length);
}

// ============================================================================
// Search Index
// ============================================================================

/**
 * Get the search index field from template
 */
export function getSearchIndexField(template: Template): TemplateItem | undefined {
  const fieldId = template.structure?.searchIndexField;
  if (!fieldId) return undefined;
  return getItemById(template, fieldId);
}

// ============================================================================
// Language Helpers
// ============================================================================

/**
 * Get default language from template
 */
export function getDefaultLanguage(template: Template) {
  return template.structure?.languages.find((lang) => lang.isDefault);
}

/**
 * Get available languages from template
 */
export function getTemplateLanguages(template: Template) {
  return template.structure?.languages || [];
}

/**
 * Get translated value for an item
 */
export function getTranslatedValue(
  template: Template,
  itemId: string,
  languageCode: string,
  field: 'label' | 'placeholder' | 'defaultValue' | 'description'
): string | undefined {
  const translations = template.structure?.translations;
  if (!translations) return undefined;
  return translations[itemId]?.[languageCode]?.[field];
}

