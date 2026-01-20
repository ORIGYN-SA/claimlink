/**
 * Template Validation Utilities
 *
 * Validates templates for display compatibility and provides warnings
 * when templates are missing fields needed for proper certificate display.
 */

import {
  RESERVED_FIELDS,
  ALL_IMAGE_FIELDS,
  isTitleFieldId,
  isImageFieldId,
  isDescriptionFieldId,
} from '@/shared/constants/reserved-fields';
import type { TemplateStructure } from '../types/template.types';

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
}

/**
 * Get all field IDs from a template structure
 */
function getAllFieldIds(structure: TemplateStructure): string[] {
  return structure.sections?.flatMap((s) => s.items.map((i) => i.id)) ?? [];
}

/**
 * Validate a template structure for display compatibility.
 * Returns warnings for missing semantic fields.
 */
export function validateTemplateForDisplay(
  structure: TemplateStructure | undefined
): TemplateValidationResult {
  const warnings: TemplateValidationWarning[] = [];

  if (!structure || !structure.sections) {
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
    };
  }

  const allFieldIds = getAllFieldIds(structure);

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

  return {
    warnings,
    hasTitleField,
    hasImageField,
    hasDescriptionField,
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
 */
export const SEMANTIC_FIELD_PRESETS = [
  {
    label: 'Certificate Name',
    description: 'The main title/name displayed on certificate cards',
    semantic: 'title' as const,
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
    label: 'Product Images',
    description: 'Images displayed on certificate cards and detail views',
    semantic: 'image' as const,
    item: {
      id: 'product_images',
      type: 'image' as const,
      label: 'Product Images',
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
] as const;

/**
 * Type for semantic field preset
 */
export type SemanticFieldPreset = (typeof SEMANTIC_FIELD_PRESETS)[number];
