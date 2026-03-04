/**
 * V2 Schema Utilities
 *
 * Helper functions for working with the V2 field schema.
 */

import type {
  V2FieldDefinition,
  V2FieldType,
  V2FieldSemantic,
  V2TemplateDocument,
  LocalizedContent,
} from '../types';

/** Find a field definition by ID */
export function findField(
  document: V2TemplateDocument,
  fieldId: string
): V2FieldDefinition | undefined {
  return document.schema.fields.find((f) => f.id === fieldId);
}

/** Get all fields of a given type */
export function getFieldsByType(
  document: V2TemplateDocument,
  type: V2FieldType
): V2FieldDefinition[] {
  return document.schema.fields.filter((f) => f.type === type);
}

/** Get the first field with a given semantic role */
export function getFieldBySemantic(
  document: V2TemplateDocument,
  semantic: V2FieldSemantic
): V2FieldDefinition | undefined {
  return document.schema.fields.find((f) => f.semantic === semantic);
}

/** Get field label in the requested language with fallback */
export function getFieldLabel(
  field: V2FieldDefinition,
  language: string = 'en'
): string {
  return getLocalizedText(field.label, language);
}

/** Extract text from a LocalizedContent object with language fallback */
export function getLocalizedText(
  content: LocalizedContent | undefined,
  language: string = 'en'
): string {
  if (!content) return '';
  if (content[language]) return content[language];
  if (content['en']) return content['en'];
  const keys = Object.keys(content);
  return keys.length > 0 ? content[keys[0]] : '';
}

/** Get all required fields */
export function getRequiredFields(
  document: V2TemplateDocument
): V2FieldDefinition[] {
  return document.schema.fields.filter((f) => f.required);
}

/** Get all field IDs referenced in a view */
export function getViewFieldIds(
  document: V2TemplateDocument,
  viewId: string
): string[] {
  const view = document.views.find((v) => v.id === viewId);
  if (!view) return [];

  const fieldIds: string[] = [];
  function collectFieldIds(nodes: Array<{ type: string; fieldId?: string; children?: unknown[] }>) {
    for (const node of nodes) {
      if ('fieldId' in node && node.fieldId) {
        fieldIds.push(node.fieldId);
      }
      if ('children' in node && Array.isArray(node.children)) {
        collectFieldIds(node.children as Array<{ type: string; fieldId?: string; children?: unknown[] }>);
      }
    }
  }
  collectFieldIds(view.content as Array<{ type: string; fieldId?: string; children?: unknown[] }>);
  return fieldIds;
}
