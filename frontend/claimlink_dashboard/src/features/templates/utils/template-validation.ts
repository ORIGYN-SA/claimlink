/**
 * Template Validation Utilities
 *
 * Validates templates for display compatibility and provides warnings
 * when templates are missing fields needed for proper certificate display.
 *
 * Supports both:
 * - TemplateStructure (legacy format during transition)
 * - TemplateNode[] (new tree format)
 */

import {
  RESERVED_FIELDS,
  ALL_IMAGE_FIELDS,
  isTitleFieldId,
  isImageFieldId,
  isDescriptionFieldId,
  isCompanyLogoFieldId,
  isCompanyNameFieldId,
} from '@/shared/constants/reserved-fields';
import type { TemplateStructure } from '../types/template.types';
import type { TemplateNode } from '@/features/template-renderer/types/origyn-template.types';
import { getAllFieldIds as getTreeFieldIds } from './template-tree-utils';

/**
 * Warning severity levels
 */
export type WarningSeverity = 'warning' | 'info';

/**
 * Warning types for template validation
 */
export type TemplateWarningType =
  | 'missing_title'
  | 'missing_image'
  | 'missing_description'
  | 'missing_company_logo'
  | 'missing_company_name'
  | 'non_standard_id';

/**
 * A validation warning for template display compatibility
 */
export interface TemplateValidationWarning {
  type: TemplateWarningType;
  message: string;
  severity: WarningSeverity;
  /** The field ID that caused this warning, if applicable */
  fieldId?: string;
  /** Suggested field IDs to fix the warning */
  suggestedIds?: readonly string[];
}

/**
 * Validation result containing all warnings
 */
export interface TemplateValidationResult {
  warnings: TemplateValidationWarning[];
  hasTitleField: boolean;
  hasImageField: boolean;
  hasDescriptionField: boolean;
  hasCompanyLogoField: boolean;
  hasCompanyNameField: boolean;
}

/**
 * Get all field IDs from a template structure (legacy format)
 */
function getAllFieldIdsFromStructure(structure: TemplateStructure): string[] {
  return structure.sections?.flatMap((s) => s.items.map((i) => i.id)) ?? [];
}

/**
 * Get all field IDs from a template (supports both formats)
 */
export function getAllFieldIds(
  template: TemplateStructure | TemplateNode[] | undefined
): string[] {
  if (!template) return [];

  // Check if it's the tree format (array of TemplateNode)
  if (Array.isArray(template)) {
    return getTreeFieldIds(template);
  }

  // Legacy TemplateStructure format
  return getAllFieldIdsFromStructure(template);
}

/**
 * Validate a template for display compatibility.
 * Supports both TemplateStructure (legacy) and TemplateNode[] (tree) formats.
 * Returns warnings for missing semantic fields.
 */
export function validateTemplateForDisplay(
  template: TemplateStructure | TemplateNode[] | undefined
): TemplateValidationResult {
  const warnings: TemplateValidationWarning[] = [];

  // Handle undefined or empty template
  if (!template) {
    return {
      warnings: [
        {
          type: 'missing_title',
          message: 'Template has no structure defined.',
          severity: 'warning',
        },
      ],
      hasTitleField: false,
      hasImageField: false,
      hasDescriptionField: false,
      hasCompanyLogoField: false,
      hasCompanyNameField: false,
    };
  }

  // Handle legacy TemplateStructure format
  if (!Array.isArray(template) && !template.sections) {
    return {
      warnings: [
        {
          type: 'missing_title',
          message: 'Template has no structure defined.',
          severity: 'warning',
        },
      ],
      hasTitleField: false,
      hasImageField: false,
      hasDescriptionField: false,
      hasCompanyLogoField: false,
      hasCompanyNameField: false,
    };
  }

  // Handle empty tree format
  if (Array.isArray(template) && template.length === 0) {
    return {
      warnings: [
        {
          type: 'missing_title',
          message: 'Template has no content defined.',
          severity: 'warning',
        },
      ],
      hasTitleField: false,
      hasImageField: false,
      hasDescriptionField: false,
      hasCompanyLogoField: false,
      hasCompanyNameField: false,
    };
  }

  const allFieldIds = getAllFieldIds(template);

  // Check for title field
  const hasTitleField = RESERVED_FIELDS.TITLE.some((id) =>
    allFieldIds.includes(id)
  );
  if (!hasTitleField) {
    warnings.push({
      type: 'missing_title',
      message:
        'No title field found. Certificate cards will display "Certificate #ID" instead of a name.',
      severity: 'warning',
      suggestedIds: RESERVED_FIELDS.TITLE,
    });
  }

  // Check for image field
  const hasImageField = ALL_IMAGE_FIELDS.some((id) => allFieldIds.includes(id));
  if (!hasImageField) {
    warnings.push({
      type: 'missing_image',
      message:
        'No image field found. Certificate cards will show no thumbnail image.',
      severity: 'warning',
      suggestedIds: ALL_IMAGE_FIELDS,
    });
  }

  // Check for description field
  const hasDescriptionField = RESERVED_FIELDS.DESCRIPTION.some((id) =>
    allFieldIds.includes(id)
  );
  if (!hasDescriptionField) {
    warnings.push({
      type: 'missing_description',
      message:
        'No description field found. Certificate metadata will have an empty description.',
      severity: 'info',
      suggestedIds: RESERVED_FIELDS.DESCRIPTION,
    });
  }

  // Check for company logo field
  const hasCompanyLogoField = RESERVED_FIELDS.COMPANY_LOGO.some((id) =>
    allFieldIds.includes(id)
  );
  if (!hasCompanyLogoField) {
    warnings.push({
      type: 'missing_company_logo',
      message:
        'No company logo field found. Certificate header will not display a logo.',
      severity: 'warning',
      suggestedIds: RESERVED_FIELDS.COMPANY_LOGO,
    });
  }

  // Check for company name field (used for "Issued By" display)
  const hasCompanyNameField = RESERVED_FIELDS.COMPANY_NAME.some((id) =>
    allFieldIds.includes(id)
  );
  if (!hasCompanyNameField) {
    warnings.push({
      type: 'missing_company_name',
      message:
        'No company name field found. "Issued By" will fall back to certificate name or collection name.',
      severity: 'warning',
      suggestedIds: RESERVED_FIELDS.COMPANY_NAME,
    });
  }

  return {
    warnings,
    hasTitleField,
    hasImageField,
    hasDescriptionField,
    hasCompanyLogoField,
    hasCompanyNameField,
  };
}

/**
 * Check if a custom field ID is non-standard (not in reserved list).
 * Returns a warning if the ID is non-standard.
 */
export function checkFieldIdStandard(
  fieldId: string
): TemplateValidationWarning | null {
  if (!fieldId) return null;

  const isTitle = isTitleFieldId(fieldId);
  const isImage = isImageFieldId(fieldId);
  const isDescription = isDescriptionFieldId(fieldId);

  if (!isTitle && !isImage && !isDescription) {
    return {
      type: 'non_standard_id',
      message: `"${fieldId}" is a custom ID. This field won't be auto-detected for certificate display.`,
      severity: 'info',
      fieldId,
    };
  }

  return null;
}

/**
 * Get a human-readable description of what a field ID is used for
 */
export function getFieldIdPurposeDescription(fieldId: string): string | null {
  if (isTitleFieldId(fieldId)) {
    return 'Used as certificate title in card displays';
  }
  if (isImageFieldId(fieldId)) {
    return 'Used as certificate thumbnail in card displays';
  }
  if (isDescriptionFieldId(fieldId)) {
    return 'Used as certificate description in metadata';
  }
  return null;
}

/**
 * Semantic field presets for quick-add functionality in the template editor.
 * Each preset creates a field with the recommended ID for its semantic purpose.
 *
 * Contains both legacy `item` format (TemplateItem) and new `node` format (TemplateNode).
 */
export const SEMANTIC_FIELD_PRESETS = [
  {
    label: 'Company Logo',
    description: 'Logo displayed in certificate header (inverted to white)',
    semantic: 'company_logo' as const,
    fieldId: 'company_logo',
    fieldType: 'image' as const,
    // Legacy format (TemplateItem)
    item: {
      id: 'company_logo',
      type: 'image' as const,
      label: 'Company Logo',
      required: true,
      multiple: false,
      maxImages: 1,
      acceptedFormats: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
      order: 0,
    },
  },
  {
    label: 'Certificate Name',
    description: 'The main title/name displayed on certificate cards',
    semantic: 'title' as const,
    fieldId: 'name',
    fieldType: 'input' as const,
    // Legacy format (TemplateItem)
    item: {
      id: 'name',
      type: 'input' as const,
      label: 'Certificate Name',
      inputType: 'text' as const,
      required: true,
      placeholder: 'Enter certificate name',
      order: 0,
    },
  },
  {
    label: 'Certificate Image',
    description: 'Images displayed on certificate cards and detail views',
    semantic: 'image' as const,
    fieldId: 'product_images',
    fieldType: 'gallery' as const,
    // Legacy format (TemplateItem)
    item: {
      id: 'product_images',
      type: 'image' as const,
      label: 'Certificate Image',
      required: true,
      multiple: true,
      maxImages: 8,
      order: 0,
    },
  },
  {
    label: 'Description',
    description: 'Short description for certificate metadata',
    semantic: 'description' as const,
    fieldId: 'short_description',
    fieldType: 'textarea' as const,
    // Legacy format (TemplateItem)
    item: {
      id: 'short_description',
      type: 'input' as const,
      label: 'Description',
      inputType: 'textarea' as const,
      required: false,
      placeholder: 'Enter a brief description',
      rows: 3,
      order: 0,
    },
  },
  {
    label: 'Issued By',
    description: 'Company/issuer name displayed in "Issued By" section',
    semantic: 'company_name' as const,
    fieldId: 'certified_by',
    fieldType: 'input' as const,
    // Legacy format (TemplateItem)
    item: {
      id: 'certified_by',
      type: 'input' as const,
      label: 'Issued By',
      inputType: 'text' as const,
      required: true,
      placeholder: 'Enter company or issuer name',
      order: 0,
    },
  },
] as const;

/**
 * Type for semantic field preset
 */
export type SemanticFieldPreset = (typeof SEMANTIC_FIELD_PRESETS)[number];

/**
 * Get the semantic preset for a field ID if it matches a known semantic field
 */
export function getSemanticPresetForFieldId(fieldId: string): SemanticFieldPreset | null {
  if (isTitleFieldId(fieldId)) {
    return SEMANTIC_FIELD_PRESETS.find((p) => p.semantic === 'title') || null;
  }
  if (isImageFieldId(fieldId)) {
    return SEMANTIC_FIELD_PRESETS.find((p) => p.semantic === 'image') || null;
  }
  if (isDescriptionFieldId(fieldId)) {
    return SEMANTIC_FIELD_PRESETS.find((p) => p.semantic === 'description') || null;
  }
  if (isCompanyLogoFieldId(fieldId)) {
    return SEMANTIC_FIELD_PRESETS.find((p) => p.semantic === 'company_logo') || null;
  }
  if (isCompanyNameFieldId(fieldId)) {
    return SEMANTIC_FIELD_PRESETS.find((p) => p.semantic === 'company_name') || null;
  }
  return null;
}
