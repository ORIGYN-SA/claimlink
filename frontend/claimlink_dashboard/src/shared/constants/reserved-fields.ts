/**
 * Reserved Field IDs
 *
 * These field IDs have special meaning in the system and are used by
 * transformers to extract certificate data for display (title, image, description).
 *
 * When users create templates, they should use these IDs for fields that
 * serve these semantic purposes. Otherwise, certificates may not display
 * correctly (e.g., showing "Certificate #123" instead of the actual name).
 */

/**
 * Reserved field IDs organized by semantic purpose
 */
export const RESERVED_FIELDS = {
  /**
   * Fields used for certificate title display.
   * Priority order: first match wins.
   * @see getCertificateTitle in certificates/api/transformers.ts
   */
  TITLE: [
    'item_artwork_title',
    'item_name',
    'name',
    'title',
    'certificate_title',
    'product_name',
    'company_name',
  ] as const,

  /**
   * Fields used for certificate image display.
   * First checks string fields, then FileReference array fields.
   * @see getCertificateImageUrl in certificates/api/transformers.ts
   */
  IMAGE_STRING: ['image', 'item_image', 'thumbnail'] as const,

  IMAGE_FILE_REFERENCE: [
    'product_images',
    'gallery_images',
    'detail_images',
    'files-media',
    'main_image',
    'primary_image',
    'certificate_image',
  ] as const,

  /**
   * Fields used for certificate description in ICRC3 metadata.
   * @see convertToIcrc3Metadata in template-renderer/utils/icrc3-converter.ts
   */
  DESCRIPTION: ['short_description', 'description', 'about'] as const,

  /**
   * Fields that can auto-detect as search index.
   * Matched by label containing these keywords.
   * @see view-generator.ts
   */
  SEARCH_INDEX_KEYWORDS: ['name', 'company', 'title', 'serial'] as const,
} as const;

/**
 * All image fields combined (string + FileReference)
 */
export const ALL_IMAGE_FIELDS = [
  ...RESERVED_FIELDS.IMAGE_STRING,
  ...RESERVED_FIELDS.IMAGE_FILE_REFERENCE,
] as const;

/**
 * Semantic field types for the UI
 */
export type SemanticFieldType = 'title' | 'image' | 'description' | 'custom';

/**
 * Recommended default field IDs for each semantic type.
 * Used when adding semantic field presets in the template editor.
 */
export const RECOMMENDED_FIELD_IDS: Record<
  Exclude<SemanticFieldType, 'custom'>,
  string
> = {
  title: 'name',
  image: 'product_images',
  description: 'short_description',
};

/**
 * Check if a field ID is reserved for certificate title display
 */
export function isTitleFieldId(fieldId: string): boolean {
  return (RESERVED_FIELDS.TITLE as readonly string[]).includes(fieldId);
}

/**
 * Check if a field ID is reserved for certificate image display
 */
export function isImageFieldId(fieldId: string): boolean {
  return (ALL_IMAGE_FIELDS as readonly string[]).includes(fieldId);
}

/**
 * Check if a field ID is reserved for certificate description
 */
export function isDescriptionFieldId(fieldId: string): boolean {
  return (RESERVED_FIELDS.DESCRIPTION as readonly string[]).includes(fieldId);
}

/**
 * Check if a field ID is reserved for any semantic purpose
 */
export function isReservedFieldId(fieldId: string): boolean {
  return (
    isTitleFieldId(fieldId) ||
    isImageFieldId(fieldId) ||
    isDescriptionFieldId(fieldId)
  );
}

/**
 * Get all reserved field IDs as a flat array
 */
export function getAllReservedFieldIds(): string[] {
  return [
    ...RESERVED_FIELDS.TITLE,
    ...ALL_IMAGE_FIELDS,
    ...RESERVED_FIELDS.DESCRIPTION,
  ];
}

/**
 * Get the semantic purpose of a field ID, if any
 */
export function getFieldSemanticPurpose(
  fieldId: string
): SemanticFieldType | null {
  if (isTitleFieldId(fieldId)) return 'title';
  if (isImageFieldId(fieldId)) return 'image';
  if (isDescriptionFieldId(fieldId)) return 'description';
  return null;
}
