/**
 * Template Renderer Atom
 *
 * Migrated from Context to Jotai atom
 * Provides data access and URL resolution to all template components.
 * Handles both preview mode (local form data) and on-chain mode (canister data).
 */

import { atom } from 'jotai';
import type {
  RenderDataSource,
  FileReference,
  MetadataFieldValue,
  TemplateVariant,
} from '../types';
import {
  resolveTokenAssetUrl,
  resolveCollectionAssetUrl,
  createPreviewUrl,
} from '../utils/url-resolver';
import { formatMetadataDate, parseDateContent } from '../utils/date-formatter';
import { isDateContent, isLocalizedContent } from '../types';

// ============================================================================
// State Interface
// ============================================================================

export interface TemplateRendererState {
  dataSource: RenderDataSource;
  canisterId: string;
  tokenId?: string;
  collectionId?: string;
  language: string;
  variant: TemplateVariant;
}

// ============================================================================
// Initial State
// ============================================================================

export const getInitialTemplateRendererState = (): TemplateRendererState => ({
  dataSource: {
    type: 'preview',
    formData: {},
    files: new Map(),
  },
  canisterId: '',
  tokenId: undefined,
  collectionId: undefined,
  language: 'en',
  variant: 'default',
});

// ============================================================================
// Main Atom
// ============================================================================

/**
 * Main template renderer state atom
 */
export const templateRendererAtom = atom<TemplateRendererState>(
  getInitialTemplateRendererState()
);

// ============================================================================
// Derived Atoms for Utility Functions
// ============================================================================

/**
 * Atom that provides the resolveAssetUrl function
 * This is a derived read-only atom that returns a function
 */
export const resolveAssetUrlAtom = atom((get) => {
  const state = get(templateRendererAtom);

  return (path: string, isCollectionAsset = false): string => {
    if (!path) return '';

    // Preview mode: check for local files
    if (state.dataSource.type === 'preview') {
      const fileMap = state.dataSource.files;
      const file = fileMap.get(path);
      if (file) {
        // Single file
        if (file instanceof File) {
          return createPreviewUrl(file);
        }
        // Array of files - return first
        if (Array.isArray(file) && file.length > 0) {
          return createPreviewUrl(file[0]);
        }
      }
    }

    // On-chain mode: build canister URL
    if (isCollectionAsset) {
      return resolveCollectionAssetUrl(state.canisterId, path);
    }

    if (state.tokenId) {
      return resolveTokenAssetUrl(state.canisterId, state.tokenId, path);
    }

    // Fallback to collection asset if no tokenId
    return resolveCollectionAssetUrl(state.canisterId, path);
  };
});

/**
 * Atom that provides the getFieldValue function
 */
export const getFieldValueAtom = atom((get) => {
  const state = get(templateRendererAtom);

  return (fieldName: string): string | null => {
    if (!fieldName) return null;

    // Preview mode: get from form data
    if (state.dataSource.type === 'preview') {
      const value = state.dataSource.formData[fieldName];
      if (value === undefined || value === null) return null;
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return String(value);
      return null;
    }

    // On-chain mode: get from metadata
    const metadata = state.dataSource.metadata.metadata;
    const fieldValue = metadata[fieldName];

    if (!fieldValue) return null;

    // Handle string value directly
    if (typeof fieldValue === 'string') return fieldValue;

    // Handle MetadataFieldValue
    if (typeof fieldValue === 'object' && 'content' in fieldValue) {
      const metaValue = fieldValue as MetadataFieldValue;
      const content = metaValue.content;

      // Handle date content
      if (isDateContent(content)) {
        return formatMetadataDate(content.date, undefined);
      }

      // Handle localized content
      if (isLocalizedContent(content)) {
        // Try requested language first
        if (content[state.language]) return content[state.language];
        // Fallback to English
        if (content['en']) return content['en'];
        // Fallback to first available
        const keys = Object.keys(content);
        if (keys.length > 0) return content[keys[0]];
      }

      // Handle string content
      if (typeof content === 'string') return content;
    }

    return null;
  };
});

/**
 * Atom that provides the getFileArray function
 */
export const getFileArrayAtom = atom((get) => {
  const state = get(templateRendererAtom);

  return (pointer: string): FileReference[] => {
    if (!pointer) return [];

    // Preview mode: convert Files to FileReferences
    if (state.dataSource.type === 'preview') {
      const files = state.dataSource.files.get(pointer);
      if (!files) return [];

      // Single file
      if (files instanceof File) {
        return [{ id: files.name, path: createPreviewUrl(files) }];
      }

      // Array of files
      if (Array.isArray(files)) {
        return files.map((file) => ({
          id: file.name,
          path: createPreviewUrl(file),
        }));
      }

      return [];
    }

    // On-chain mode: get from metadata
    const metadata = state.dataSource.metadata.metadata;
    const value = metadata[pointer];

    // Check if it's already a FileReference array
    if (Array.isArray(value)) {
      return value as FileReference[];
    }

    // Check if it's an object with nested array
    if (
      typeof value === 'object' &&
      value !== null &&
      'content' in value
    ) {
      const content = (value as MetadataFieldValue).content;
      if (Array.isArray(content)) {
        return content as unknown as FileReference[];
      }
    }

    return [];
  };
});

/**
 * Atom that provides the getDateValue function
 */
export const getDateValueAtom = atom((get) => {
  const state = get(templateRendererAtom);

  return (fieldName: string): Date | null => {
    if (!fieldName) return null;

    // Preview mode
    if (state.dataSource.type === 'preview') {
      const value = state.dataSource.formData[fieldName];
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      }
      return null;
    }

    // On-chain mode
    const metadata = state.dataSource.metadata.metadata;
    const fieldValue = metadata[fieldName];

    if (!fieldValue) return null;

    // Handle MetadataFieldValue with date content
    if (typeof fieldValue === 'object' && 'content' in fieldValue) {
      const metaValue = fieldValue as MetadataFieldValue;
      return parseDateContent(metaValue.content as { date?: number });
    }

    return null;
  };
});

// ============================================================================
// Convenience Atoms for Common Properties
// ============================================================================

/**
 * Language atom - read the current language or update it
 */
export const templateLanguageAtom = atom(
  (get) => get(templateRendererAtom).language,
  (get, set, newLanguage: string) => {
    set(templateRendererAtom, {
      ...get(templateRendererAtom),
      language: newLanguage,
    });
  }
);

/**
 * Variant atom - read the current variant or update it
 */
export const templateVariantAtom = atom(
  (get) => get(templateRendererAtom).variant,
  (get, set, newVariant: TemplateVariant) => {
    set(templateRendererAtom, {
      ...get(templateRendererAtom),
      variant: newVariant,
    });
  }
);

/**
 * Data source atom - read or update the data source
 */
export const templateDataSourceAtom = atom(
  (get) => get(templateRendererAtom).dataSource,
  (get, set, newDataSource: RenderDataSource) => {
    set(templateRendererAtom, {
      ...get(templateRendererAtom),
      dataSource: newDataSource,
    });
  }
);

// ============================================================================
// Helper Function Atoms
// ============================================================================

/**
 * Atom that provides localized text extraction
 */
export const getLocalizedTextAtom = atom((get) => {
  const state = get(templateRendererAtom);

  return (content: Record<string, string> | undefined): string => {
    if (!content) return '';

    // Try requested language
    if (content[state.language]) return content[state.language];
    // Fallback to English
    if (content['en']) return content['en'];
    // Fallback to first available
    const keys = Object.keys(content);
    return keys.length > 0 ? content[keys[0]] : '';
  };
});
