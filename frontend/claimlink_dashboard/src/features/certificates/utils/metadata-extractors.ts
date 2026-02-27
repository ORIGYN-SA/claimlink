/**
 * Metadata Extractors
 *
 * Utility functions to extract values from parsed ORIGYN metadata.
 * These work with the ParsedOrigynMetadata format after it's been
 * transformed from raw ICRC3Value on-chain data.
 *
 * Use these for extracting:
 * - Text fields (company_name, description, etc.)
 * - Image fields (company_logo, stamp, signature, etc.)
 * - Any other metadata stored on-chain
 */

import type {
  MetadataFieldValue,
  FileReference
} from "@/features/template-renderer";
import {
  resolveTokenAssetUrl,
  resolveCollectionAssetUrl
} from "@/features/template-renderer";

/**
 * Extract a string value from a metadata field.
 * Handles plain strings and MetadataFieldValue objects with localization.
 *
 * @param value - The metadata field value (string, MetadataFieldValue, etc.)
 * @param language - Preferred language code (defaults to 'en')
 * @returns The extracted string value, or undefined if not found
 *
 * @example
 * // Plain string
 * extractTextFromMetadata("Hello") // => "Hello"
 *
 * // MetadataFieldValue with localized content
 * extractTextFromMetadata({ content: { en: "Hello", it: "Ciao" } }, "it") // => "Ciao"
 */
export function extractTextFromMetadata(
  value: unknown,
  language: string = 'en'
): string | undefined {
  if (!value) return undefined;

  // Plain string
  if (typeof value === 'string') return value;

  // MetadataFieldValue object
  if (typeof value === 'object' && value !== null && 'content' in value) {
    const metaValue = value as MetadataFieldValue;
    const content = metaValue.content;

    // String content
    if (typeof content === 'string') return content;

    // Localized content object
    if (typeof content === 'object' && content !== null && !('date' in content)) {
      const localized = content as Record<string, string>;
      // Try requested language first, then English, then first available
      if (localized[language]) return localized[language];
      if (localized['en']) return localized['en'];
      const keys = Object.keys(localized);
      if (keys.length > 0) return localized[keys[0]];
    }

    // Date content - format it
    if (typeof content === 'object' && content !== null && 'date' in content) {
      const date = new Date((content as { date: number }).date);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  return undefined;
}

/**
 * Extract an image URL from a metadata field.
 * Handles various storage formats for images on-chain:
 * - Plain string URLs or data URIs
 * - FileReference objects (with id and path)
 * - Arrays of FileReferences (returns first one)
 * - MetadataFieldValue wrappers containing any of the above
 *
 * Use this for any image field: company_logo, stamp, signature, watermark, etc.
 *
 * @param value - The metadata field value
 * @param canisterId - The canister ID for resolving relative paths
 * @param tokenId - The token ID for resolving relative paths
 * @param locationType - Whether asset is at 'token' or 'collection' level (defaults to 'token')
 * @returns The resolved image URL, or undefined if not found
 *
 * @example
 * // Plain URL
 * extractImageFromMetadata("https://example.com/logo.png", "abc", "1")
 * // => "https://example.com/logo.png"
 *
 * // Data URI
 * extractImageFromMetadata("data:image/png;base64,...", "abc", "1")
 * // => "data:image/png;base64,..."
 *
 * // FileReference
 * extractImageFromMetadata({ id: "logo", path: "/assets/logo.png" }, "abc", "1")
 * // => "https://<canister>.icp0.io/-/abc/1/-/assets/logo.png"
 *
 * // Array of FileReferences (returns first)
 * extractImageFromMetadata([{ id: "img1", path: "/a.png" }, { id: "img2", path: "/b.png" }], "abc", "1")
 * // => resolved URL for /a.png
 */
export function extractImageFromMetadata(
  value: unknown,
  canisterId: string,
  tokenId: string,
  locationType: 'token' | 'collection' = 'token'
): string | undefined {
  if (!value) return undefined;

  // Plain string (URL or data URI)
  if (typeof value === 'string') return value;

  // Array of FileReferences - take first one
  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (firstItem && typeof firstItem === 'object' && 'path' in firstItem) {
      const fileRef = firstItem as FileReference;
      return resolveFilePath(fileRef.path, canisterId, tokenId, locationType);
    }
  }

  // Single FileReference object
  if (typeof value === 'object' && value !== null && 'path' in value) {
    const fileRef = value as FileReference;
    return resolveFilePath(fileRef.path, canisterId, tokenId, locationType);
  }

  // MetadataFieldValue wrapper - extract content and recurse
  if (typeof value === 'object' && value !== null && 'content' in value) {
    const metaValue = value as MetadataFieldValue;
    return extractImageFromMetadata(metaValue.content, canisterId, tokenId, locationType);
  }

  return undefined;
}

/**
 * Resolve a file path to a full URL.
 * Handles paths that are already full URLs, data URIs, or relative paths.
 */
function resolveFilePath(
  path: string,
  canisterId: string,
  tokenId: string,
  locationType: 'token' | 'collection'
): string {
  // Already a full URL or data URI
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Resolve relative path based on location type
  if (locationType === 'collection') {
    return resolveCollectionAssetUrl(canisterId, path);
  }
  return resolveTokenAssetUrl(canisterId, tokenId, path);
}

/**
 * Extract multiple image URLs from a metadata field.
 * Useful for gallery fields that can have multiple images.
 *
 * @param value - The metadata field value (array of FileReferences or strings)
 * @param canisterId - The canister ID for resolving relative paths
 * @param tokenId - The token ID for resolving relative paths
 * @param locationType - Whether assets are at 'token' or 'collection' level
 * @returns Array of resolved image URLs
 */
export function extractImagesFromMetadata(
  value: unknown,
  canisterId: string,
  tokenId: string,
  locationType: 'token' | 'collection' = 'token'
): string[] {
  if (!value) return [];

  // Array of values
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && 'path' in item) {
          const fileRef = item as FileReference;
          return resolveFilePath(fileRef.path, canisterId, tokenId, locationType);
        }
        return null;
      })
      .filter((url): url is string => url !== null);
  }

  // Single value - wrap in array
  const singleUrl = extractImageFromMetadata(value, canisterId, tokenId, locationType);
  return singleUrl ? [singleUrl] : [];
}
