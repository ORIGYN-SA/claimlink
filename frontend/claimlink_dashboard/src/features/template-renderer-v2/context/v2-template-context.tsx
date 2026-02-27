/**
 * V2 Template Context
 *
 * Provides data access and URL resolution to all v2 template components.
 * Handles both preview mode (local form data) and on-chain mode (token data).
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type {
  V2TemplateRenderContext,
  V2RenderDataSource,
  V2TemplateDocument,
  V2FieldDefinition,
  LocalizedContent,
  FileReference,
} from '../types';
import {
  resolveTokenAssetUrl,
  resolveCollectionAssetUrl,
  createPreviewUrl,
  formatMetadataDate,
  parseDateContent,
  isDateContent,
  isLocalizedContent,
} from '@/features/template-renderer';
import type { MetadataFieldValue } from '@/features/template-renderer';

// ============================================================================
// Context
// ============================================================================

const V2TemplateContext = createContext<V2TemplateRenderContext | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface V2TemplateContextProviderProps {
  children: ReactNode;
  templateDocument: V2TemplateDocument;
  dataSource: V2RenderDataSource;
  canisterId: string;
  tokenId?: string;
  collectionId?: string;
  language?: string;
  activeViewId?: string;
}

// ============================================================================
// Provider Component
// ============================================================================

export function V2TemplateContextProvider({
  children,
  templateDocument,
  dataSource,
  canisterId,
  tokenId,
  collectionId,
  language = 'en',
  activeViewId,
}: V2TemplateContextProviderProps) {
  const resolvedActiveViewId = activeViewId || templateDocument.views[0]?.id || 'certificate';

  const contextValue = useMemo<V2TemplateRenderContext>(() => {
    // Build a field lookup map for O(1) access
    const fieldMap = new Map<string, V2FieldDefinition>();
    for (const field of templateDocument.schema.fields) {
      fieldMap.set(field.id, field);
    }

    /** Resolve asset URL based on data source */
    const resolveAssetUrl = (path: string, isCollectionAsset = false): string => {
      if (!path) return '';

      // Absolute URLs, data URIs, blob URLs pass through
      if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('blob:') ||
        path.startsWith('data:')
      ) {
        return path;
      }

      // Preview mode: check for local files
      if (dataSource.type === 'preview') {
        const file = dataSource.files.get(path);
        if (file) {
          if (file instanceof File) return createPreviewUrl(file);
          if (Array.isArray(file) && file.length > 0) return createPreviewUrl(file[0]);
        }
      }

      // On-chain mode: build canister URL
      if (isCollectionAsset) {
        return resolveCollectionAssetUrl(canisterId, path);
      }
      if (tokenId) {
        return resolveTokenAssetUrl(canisterId, tokenId, path);
      }
      return resolveCollectionAssetUrl(canisterId, path);
    };

    /** Get localized text with language fallback */
    const getLocalizedText = (content: LocalizedContent | undefined): string => {
      if (!content) return '';
      if (content[language]) return content[language];
      if (content['en']) return content['en'];
      const keys = Object.keys(content);
      return keys.length > 0 ? content[keys[0]] : '';
    };

    /** Get a field definition by ID */
    const getFieldDefinition = (fieldId: string): V2FieldDefinition | undefined => {
      return fieldMap.get(fieldId);
    };

    /** Get a field value from the data source */
    const getFieldValue = (fieldId: string): string | null => {
      if (!fieldId) return null;

      if (dataSource.type === 'preview') {
        const value = dataSource.formData[fieldId];
        if (value === undefined || value === null) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        // Handle LocalizedValue objects
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
          const obj = value as Record<string, string>;
          if (obj[language]) return obj[language];
          if (obj['en']) return obj['en'];
          const keys = Object.keys(obj);
          if (keys.length > 0) return obj[keys[0]];
        }
        return null;
      }

      // On-chain mode
      const tokenData = dataSource.tokenData;
      const fieldValue = tokenData[fieldId];
      if (!fieldValue) return null;

      if (typeof fieldValue === 'string') return fieldValue;

      if (typeof fieldValue === 'object' && 'content' in fieldValue) {
        const metaValue = fieldValue as MetadataFieldValue;
        const content = metaValue.content;
        if (isDateContent(content)) {
          return formatMetadataDate(content.date, undefined);
        }
        if (isLocalizedContent(content)) {
          if (content[language]) return content[language];
          if (content['en']) return content['en'];
          const keys = Object.keys(content);
          if (keys.length > 0) return content[keys[0]];
        }
        if (typeof content === 'string') return content;
      }

      return null;
    };

    /** Get an image URL for a field */
    const getImageUrl = (fieldId: string): string | null => {
      if (!fieldId) return null;

      if (dataSource.type === 'preview') {
        const file = dataSource.files.get(fieldId);
        if (file) {
          if (file instanceof File) return createPreviewUrl(file);
          if (Array.isArray(file) && file.length > 0) return createPreviewUrl(file[0]);
        }
        // Also check formData for data URIs or URLs
        const value = dataSource.formData[fieldId];
        if (typeof value === 'string' && value) return resolveAssetUrl(value);
        return null;
      }

      // On-chain mode
      const tokenData = dataSource.tokenData;
      const value = tokenData[fieldId];
      if (!value) return null;

      // Plain string (URL or data URI)
      if (typeof value === 'string') return resolveAssetUrl(value);

      // FileReference or array of FileReferences
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0] as FileReference;
        if (first?.path) return resolveAssetUrl(first.path);
      }
      if (typeof value === 'object' && 'path' in value) {
        return resolveAssetUrl((value as FileReference).path);
      }

      return null;
    };

    /** Get file array from the data source */
    const getFileArray = (fieldId: string): FileReference[] => {
      if (!fieldId) return [];

      if (dataSource.type === 'preview') {
        const files = dataSource.files.get(fieldId);
        if (!files) return [];
        if (files instanceof File) {
          return [{ id: files.name, path: createPreviewUrl(files) }];
        }
        if (Array.isArray(files)) {
          return files.map((file) => ({ id: file.name, path: createPreviewUrl(file) }));
        }
        return [];
      }

      // On-chain mode
      const value = dataSource.tokenData[fieldId];
      if (Array.isArray(value)) return value as FileReference[];
      if (typeof value === 'object' && value !== null && 'content' in value) {
        const content = (value as MetadataFieldValue).content;
        if (Array.isArray(content)) return content as unknown as FileReference[];
      }
      return [];
    };

    /** Get date value from the data source */
    const getDateValue = (fieldId: string): Date | null => {
      if (!fieldId) return null;

      if (dataSource.type === 'preview') {
        const value = dataSource.formData[fieldId];
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value === 'string' || typeof value === 'number') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        }
        return null;
      }

      const fieldValue = dataSource.tokenData[fieldId];
      if (!fieldValue) return null;
      if (typeof fieldValue === 'object' && 'content' in fieldValue) {
        return parseDateContent((fieldValue as MetadataFieldValue).content as { date?: number });
      }
      return null;
    };

    return {
      templateDocument,
      dataSource,
      canisterId,
      tokenId,
      collectionId,
      language,
      activeViewId: resolvedActiveViewId,
      showPlaceholders: dataSource.showPlaceholders ?? false,
      resolveAssetUrl,
      getFieldValue,
      getImageUrl,
      getFileArray,
      getDateValue,
      getLocalizedText,
      getFieldDefinition,
    };
  }, [templateDocument, dataSource, canisterId, tokenId, collectionId, language, resolvedActiveViewId]);

  return (
    <V2TemplateContext.Provider value={contextValue}>
      {children}
    </V2TemplateContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

/** Access the full v2 template context */
export function useV2Context(): V2TemplateRenderContext {
  const context = useContext(V2TemplateContext);
  if (!context) {
    throw new Error('useV2Context must be used within a V2TemplateContextProvider');
  }
  return context;
}

/** Get a specific field value */
export function useV2FieldValue(fieldId: string): string | null {
  const { getFieldValue } = useV2Context();
  return getFieldValue(fieldId);
}

/** Get an image URL for a field */
export function useV2ImageUrl(fieldId: string): string | null {
  const { getImageUrl } = useV2Context();
  return getImageUrl(fieldId);
}

/** Get the current language */
export function useV2Language(): string {
  const { language } = useV2Context();
  return language;
}

/** Get the template schema */
export function useV2Schema() {
  const { templateDocument } = useV2Context();
  return templateDocument.schema;
}

/** Get localized text */
export function useV2LocalizedText(content: LocalizedContent | undefined): string {
  const { getLocalizedText } = useV2Context();
  return getLocalizedText(content);
}

/** Get the active view definition */
export function useV2ActiveView() {
  const { templateDocument, activeViewId } = useV2Context();
  return templateDocument.views.find((v) => v.id === activeViewId);
}
