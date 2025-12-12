/**
 * Metadata Builder Utility
 *
 * Builds the complete ORIGYN __apps structure for minting certificates.
 * Combines template, metadata, and file references into the standard format.
 */

import type {
  TemplateStructure,
  CertificateFormData,
} from '@/features/templates/types/template-structure.types';

import type {
  OrigynAppEntry,
  FileReference,
  LocalizedContent,
  TemplateLanguageConfig,
} from '../types';

import { generateOrigynViews } from './view-generator';
import { convertFormDataToOrigynMetadata } from './template-converter';

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for building ORIGYN apps
 */
export interface BuildOrigynAppsConfig {
  /** ClaimLink template structure */
  template: TemplateStructure;
  /** Form data from certificate creation */
  formData: CertificateFormData;
  /** File references for uploaded files */
  files: Map<string, FileReference[]>;
  /** Principal ID of the user with write access */
  writerPrincipal?: string;
}

/**
 * Complete ORIGYN NFT metadata structure
 */
export interface OrigynNftMetadata {
  /** Unique token ID */
  id: string;
  /** Apps array with metadata and templates */
  __apps: OrigynAppEntry[];
  /** Library items for files */
  library: LibraryItemDef[];
  /** Additional system metadata */
  __system?: {
    status: string;
    'com.origyn.physical'?: string;
    'com.origyn.royalties.primary'?: unknown[];
    'com.origyn.royalties.secondary'?: unknown[];
    'com.origyn.node'?: string;
    'com.origyn.originator'?: string;
  };
  /** Preview asset ID */
  preview_asset?: string;
  /** Owner principal */
  owner?: string;
}

/**
 * Library item definition for ORIGYN
 */
export interface LibraryItemDef {
  library_id: string;
  title: string;
  filename: string;
  location_type: 'canister' | 'collection';
  location: string;
  content_type: string;
  content_hash: string;
  created_at: string;
  size: number;
  sort: string;
  read: 'public' | 'private';
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Convert File to FileReference
 */
function fileToReference(file: File, index: number): FileReference {
  // Generate a unique ID
  const id = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return {
    id,
    path: file.name,
  };
}

/**
 * Convert form data files to library items
 */
function buildLibraryItems(
  files: Map<string, FileReference[]>,
  tokenId: string,
  canisterId: string
): LibraryItemDef[] {
  const library: LibraryItemDef[] = [];

  files.forEach((fileRefs, pointer) => {
    fileRefs.forEach((ref) => {
      library.push({
        library_id: ref.path,
        title: tokenId,
        filename: ref.path,
        location_type: 'canister',
        location: `https://${canisterId}.raw.icp0.io/-/${tokenId}/-/${ref.path}`,
        content_type: getMimeType(ref.path),
        content_hash: '1', // Placeholder - should be actual hash
        created_at: new Date().toISOString(),
        size: 0, // Will be set during upload
        sort: '1',
        read: 'public',
      });
    });
  });

  return library;
}

// ============================================================================
// Main Builder Functions
// ============================================================================

/**
 * Build the public.metadata app entry
 *
 * Contains all certificate field values in ORIGYN format
 */
export function buildMetadataApp(
  formData: CertificateFormData,
  template: TemplateStructure,
  files: Map<string, FileReference[]>,
  writerPrincipal?: string
): OrigynAppEntry {
  // Convert form data to ORIGYN metadata format
  const metadata = convertFormDataToOrigynMetadata(
    formData as Record<string, unknown>,
    template
  );

  // Add file references to metadata
  files.forEach((fileRefs, pointer) => {
    (metadata as Record<string, unknown>)[pointer] = fileRefs;
  });

  return {
    app_id: 'public.metadata',
    read: 'public',
    write: writerPrincipal
      ? { type: 'allow', list: [writerPrincipal] }
      : undefined,
    permissions: writerPrincipal
      ? { type: 'allow', list: [writerPrincipal] }
      : undefined,
    data: metadata,
  };
}

/**
 * Build the public.metadata.template app entry
 *
 * Contains all 4 template views and language configuration
 */
export function buildTemplateApp(
  template: TemplateStructure,
  writerPrincipal?: string
): OrigynAppEntry {
  // Generate all ORIGYN views
  const views = generateOrigynViews(template);

  return {
    app_id: 'public.metadata.template',
    read: 'public',
    write: writerPrincipal
      ? { type: 'allow', list: [writerPrincipal] }
      : undefined,
    permissions: writerPrincipal
      ? { type: 'allow', list: [writerPrincipal] }
      : undefined,
    data: {
      template: views.template,
      userViewTemplate: views.userViewTemplate,
      certificateTemplate: views.certificateTemplate,
      formTemplate: views.formTemplate,
      languages: views.languages,
      searchField: views.searchField,
    },
  };
}

/**
 * Build the complete __apps array for ORIGYN NFT
 */
export function buildOrigynApps(config: BuildOrigynAppsConfig): OrigynAppEntry[] {
  const { template, formData, files, writerPrincipal } = config;

  return [
    buildMetadataApp(formData, template, files, writerPrincipal),
    buildTemplateApp(template, writerPrincipal),
  ];
}

/**
 * Build complete ORIGYN NFT metadata structure
 *
 * Ready for minting via the ORIGYN NFT canister
 */
export function buildOrigynNftMetadata(
  config: BuildOrigynAppsConfig & {
    tokenId: string;
    canisterId: string;
    ownerPrincipal?: string;
  }
): OrigynNftMetadata {
  const {
    template,
    formData,
    files,
    writerPrincipal,
    tokenId,
    canisterId,
    ownerPrincipal,
  } = config;

  // Build apps
  const __apps = buildOrigynApps({ template, formData, files, writerPrincipal });

  // Build library
  const library = buildLibraryItems(files, tokenId, canisterId);

  // Find preview asset (first image)
  let preview_asset: string | undefined;
  files.forEach((fileRefs) => {
    if (!preview_asset && fileRefs.length > 0) {
      const firstFile = fileRefs[0];
      if (getMimeType(firstFile.path).startsWith('image/')) {
        preview_asset = firstFile.path;
      }
    }
  });

  return {
    id: tokenId,
    __apps,
    library,
    __system: {
      status: 'staged', // Will be 'minted' after minting
      'com.origyn.physical': 'true',
      'com.origyn.royalties.primary': [],
      'com.origyn.royalties.secondary': [],
    },
    preview_asset,
    owner: ownerPrincipal,
  };
}

/**
 * Serialize ORIGYN metadata to JSON string
 *
 * Useful for debugging or manual verification
 */
export function serializeOrigynMetadata(metadata: OrigynNftMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

/**
 * Validate ORIGYN metadata structure
 *
 * Checks for required fields and valid structure
 */
export function validateOrigynMetadata(
  metadata: OrigynNftMetadata
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!metadata.id) {
    errors.push('Missing token ID');
  }

  if (!metadata.__apps || !Array.isArray(metadata.__apps)) {
    errors.push('Missing or invalid __apps array');
  } else {
    const hasMetadata = metadata.__apps.some(
      (app) => app.app_id === 'public.metadata'
    );
    const hasTemplate = metadata.__apps.some(
      (app) => app.app_id === 'public.metadata.template'
    );

    if (!hasMetadata) {
      errors.push('Missing public.metadata app entry');
    }
    if (!hasTemplate) {
      errors.push('Missing public.metadata.template app entry');
    }
  }

  if (!metadata.library || !Array.isArray(metadata.library)) {
    errors.push('Missing or invalid library array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
