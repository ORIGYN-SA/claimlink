/**
 * Template Render Context
 *
 * Provides data access and URL resolution to all template components.
 * Handles both preview mode (local form data) and on-chain mode (canister data).
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type {
  TemplateRenderContext,
  RenderDataSource,
  FileReference,
  MetadataFieldValue,
  LocalizedContent,
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
// Context
// ============================================================================

const TemplateContext = createContext<TemplateRenderContext | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface TemplateContextProviderProps {
  children: ReactNode;
  dataSource: RenderDataSource;
  canisterId: string;
  tokenId?: string;
  collectionId?: string;
  language?: string;
  variant?: TemplateVariant;
}

// ============================================================================
// Provider Component
// ============================================================================

export function TemplateContextProvider({
  children,
  dataSource,
  canisterId,
  tokenId,
  collectionId,
  language = 'en',
  variant = 'default',
}: TemplateContextProviderProps) {
  const contextValue = useMemo<TemplateRenderContext>(() => {
    /**
     * Resolve an asset URL based on the data source
     */
    const resolveAssetUrl = (
      path: string,
      isCollectionAsset = false
    ): string => {
      if (!path) return '';

      // If path is already an absolute URL, data URI, or blob URL, return directly
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
      }

      // Preview mode: check for local files
      if (dataSource.type === 'preview') {
        const fileMap = dataSource.files;
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

      // On-chain mode: build canister URL for relative paths
      if (isCollectionAsset) {
        return resolveCollectionAssetUrl(canisterId, path);
      }

      if (tokenId) {
        return resolveTokenAssetUrl(canisterId, tokenId, path);
      }

      // Fallback to collection asset if no tokenId
      return resolveCollectionAssetUrl(canisterId, path);
    };

    /**
     * Get a field value from the data source
     * Handles language fallback: requested -> 'en' -> first available
     */
    const getFieldValue = (fieldName: string): string | null => {
      if (!fieldName) return null;

      // Preview mode: get from form data
      if (dataSource.type === 'preview') {
        const value = dataSource.formData[fieldName];
        if (value === undefined || value === null) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        // Handle LocalizedValue objects (multi-language mode)
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
          const obj = value as Record<string, string>;
          // Try requested language, then 'en', then first available
          if (obj[language]) return obj[language];
          if (obj['en']) return obj['en'];
          const keys = Object.keys(obj);
          if (keys.length > 0) return obj[keys[0]];
        }
        return null;
      }

      // On-chain mode: get from metadata
      const metadata = dataSource.metadata.metadata;
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
          if (content[language]) return content[language];
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

    /**
     * Get a file array from the data source
     */
    const getFileArray = (pointer: string): FileReference[] => {
      if (!pointer) return [];

      // Preview mode: convert Files to FileReferences
      if (dataSource.type === 'preview') {
        const files = dataSource.files.get(pointer);
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
      const metadata = dataSource.metadata.metadata;
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

    /**
     * Get a date value from the data source
     */
    const getDateValue = (fieldName: string): Date | null => {
      if (!fieldName) return null;

      // Preview mode
      if (dataSource.type === 'preview') {
        const value = dataSource.formData[fieldName];
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value === 'string' || typeof value === 'number') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        }
        return null;
      }

      // On-chain mode
      const metadata = dataSource.metadata.metadata;
      const fieldValue = metadata[fieldName];

      if (!fieldValue) return null;

      // Handle MetadataFieldValue with date content
      if (typeof fieldValue === 'object' && 'content' in fieldValue) {
        const metaValue = fieldValue as MetadataFieldValue;
        return parseDateContent(metaValue.content as { date?: number });
      }

      return null;
    };

    return {
      dataSource,
      canisterId,
      tokenId,
      collectionId,
      language,
      variant,
      showPlaceholders: dataSource.showPlaceholders ?? false,
      resolveAssetUrl,
      getFieldValue,
      getFileArray,
      getDateValue,
    };
  }, [dataSource, canisterId, tokenId, collectionId, language, variant]);

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access the template render context
 * Must be used within a TemplateContextProvider
 */
export function useTemplateContext(): TemplateRenderContext {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error(
      'useTemplateContext must be used within a TemplateContextProvider'
    );
  }
  return context;
}

/**
 * Hook to get a specific field value
 */
export function useFieldValue(fieldName: string): string | null {
  const { getFieldValue } = useTemplateContext();
  return getFieldValue(fieldName);
}

/**
 * Hook to get a file array
 */
export function useFileArray(pointer: string): FileReference[] {
  const { getFileArray } = useTemplateContext();
  return getFileArray(pointer);
}

/**
 * Hook to resolve an asset URL
 */
export function useAssetUrl(
  path: string,
  isCollectionAsset = false
): string {
  const { resolveAssetUrl } = useTemplateContext();
  return resolveAssetUrl(path, isCollectionAsset);
}

/**
 * Hook to get the current language
 */
export function useTemplateLanguage(): string {
  const { language } = useTemplateContext();
  return language;
}

/**
 * Hook to get localized text from a LocalizedContent object
 */
export function useLocalizedText(content: LocalizedContent | undefined): string {
  const { language } = useTemplateContext();

  if (!content) return '';

  // Try requested language
  if (content[language]) return content[language];
  // Fallback to English
  if (content['en']) return content['en'];
  // Fallback to first available
  const keys = Object.keys(content);
  return keys.length > 0 ? content[keys[0]] : '';
}

/**
 * Hook to get the current template variant
 */
export function useTemplateVariant(): TemplateVariant {
  const { variant } = useTemplateContext();
  return variant;
}
