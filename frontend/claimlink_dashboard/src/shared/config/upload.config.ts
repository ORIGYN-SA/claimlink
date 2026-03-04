/**
 * Upload Configuration
 *
 * Centralized configuration for file uploads across the application.
 * IMPORTANT: Chunk size is 1MB MAX for safety (IC message size limits).
 */

/**
 * MIME types for images
 */
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
] as const;

/**
 * MIME types for videos
 */
export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov files
] as const;

/**
 * MIME types for documents
 */
export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

/**
 * All supported media MIME types (images + videos)
 */
export const MEDIA_MIME_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];
export type VideoMimeType = (typeof VIDEO_MIME_TYPES)[number];
export type DocumentMimeType = (typeof DOCUMENT_MIME_TYPES)[number];
export type MediaMimeType = (typeof MEDIA_MIME_TYPES)[number];

/**
 * Upload configuration constants
 */
export const UPLOAD_CONFIG = {
  /**
   * Chunk size for uploads - 1MB is the safe maximum for IC canister calls.
   * DO NOT INCREASE - larger chunks risk hitting message size limits.
   */
  chunkSize: 1024 * 1024, // 1MB

  /**
   * Image upload settings
   */
  image: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    maxSizeMB: 5,
    mimeTypes: IMAGE_MIME_TYPES,
    extensions: ['.jpg', '.jpeg', '.png', '.svg'],
    acceptString: IMAGE_MIME_TYPES.join(','),
    formatLabel: 'JPEG, PNG, SVG',
  },

  /**
   * Video upload settings
   */
  video: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    maxSizeMB: 50,
    mimeTypes: VIDEO_MIME_TYPES,
    extensions: ['.mp4', '.webm', '.mov'],
    acceptString: VIDEO_MIME_TYPES.join(','),
    formatLabel: 'MP4, WebM, MOV',
  },

  /**
   * Document upload settings
   */
  document: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    maxSizeMB: 10,
    mimeTypes: DOCUMENT_MIME_TYPES,
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
    acceptString: DOCUMENT_MIME_TYPES.join(','),
    formatLabel: 'PDF, Word, Excel',
  },

  /**
   * Combined image + video settings
   */
  media: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB (video max)
    maxSizeMB: 50,
    mimeTypes: MEDIA_MIME_TYPES,
    acceptString: MEDIA_MIME_TYPES.join(','),
    formatLabel: 'JPEG, PNG, SVG, MP4, WebM, MOV',
  },
} as const;

/**
 * Check if a file is an image based on MIME type
 */
export function isImageFile(file: File): boolean {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
}

/**
 * Check if a file is a video based on MIME type
 */
export function isVideoFile(file: File): boolean {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(file.type);
}

/**
 * Check if a file is a document based on MIME type
 */
export function isDocumentFile(file: File): boolean {
  return (DOCUMENT_MIME_TYPES as readonly string[]).includes(file.type);
}

/**
 * Check if a MIME type is an image
 */
export function isImageMimeType(mimeType: string): mimeType is ImageMimeType {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Check if a MIME type is a video
 */
export function isVideoMimeType(mimeType: string): mimeType is VideoMimeType {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Get the maximum file size based on file type
 */
export function getMaxFileSize(file: File): number {
  if (isVideoFile(file)) {
    return UPLOAD_CONFIG.video.maxSizeBytes;
  }
  return UPLOAD_CONFIG.image.maxSizeBytes;
}

/**
 * Validate file size based on its type
 */
export function validateFileSize(file: File): { valid: boolean; message?: string } {
  const maxSize = getMaxFileSize(file);
  const maxSizeMB = maxSize / (1024 * 1024);

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: 'image' | 'video' | 'media' = 'media'
): { valid: boolean; message?: string } {
  let mimeTypes: readonly string[];
  let formatLabel: string;

  switch (allowedTypes) {
    case 'image':
      mimeTypes = UPLOAD_CONFIG.image.mimeTypes;
      formatLabel = UPLOAD_CONFIG.image.formatLabel;
      break;
    case 'video':
      mimeTypes = UPLOAD_CONFIG.video.mimeTypes;
      formatLabel = UPLOAD_CONFIG.video.formatLabel;
      break;
    case 'media':
    default:
      mimeTypes = UPLOAD_CONFIG.media.mimeTypes;
      formatLabel = UPLOAD_CONFIG.media.formatLabel;
      break;
  }

  if (!mimeTypes.includes(file.type)) {
    return {
      valid: false,
      message: `Please upload a valid file type: ${formatLabel}`,
    };
  }

  return { valid: true };
}

/**
 * Full file validation (type + size)
 */
export function validateFile(
  file: File,
  allowedTypes: 'image' | 'video' | 'media' = 'media'
): { valid: boolean; message?: string } {
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return validateFileSize(file);
}
