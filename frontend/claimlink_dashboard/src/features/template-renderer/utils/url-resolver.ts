/**
 * URL Resolution Utilities
 *
 * Handles URL generation for IC canister assets.
 * Supports both local development (localhost:4943) and production (icp0.io).
 *
 * URL Patterns:
 * - Token-specific assets: {canisterUrl}/-/{tokenId}/-/{path}
 * - Collection-level assets: {canisterUrl}/collection/-/{libId}
 */

import { IC_HOST, APP_MODE } from '@/shared/constants';

/**
 * Check if running on local IC replica
 */
export function isLocalReplica(): boolean {
  return (
    APP_MODE === 'development' ||
    IC_HOST?.includes('localhost') ||
    IC_HOST?.includes('127.0.0.1')
  );
}

/**
 * Build the base URL for a canister
 *
 * Local: http://{canisterId}.localhost:4943
 * Production: https://{canisterId}.raw.icp0.io
 */
export function buildCanisterUrl(canisterId: string): string {
  if (!canisterId) {
    console.warn('buildCanisterUrl: canisterId is empty');
    return '';
  }

  if (isLocalReplica()) {
    // Local development with dfx
    // Use localhost:4943 with canister ID subdomain
    return `http://${canisterId}.localhost:4943`;
  }

  // Production: use icp0.io (non-raw) for reliable asset loading.
  // The .raw subdomain fails for chunked assets (>2MB) with ERR_HTTP2_PROTOCOL_ERROR.
  return `https://${canisterId}.icp0.io`;
}

/**
 * Resolve a token-specific asset URL
 *
 * Pattern: {canisterUrl}/-/{tokenId}/-/{path}
 *
 * @param canisterId - The canister ID hosting the NFT
 * @param tokenId - The token/NFT ID
 * @param path - The file path (e.g., "1.jpg", "video.mp4") or full URL
 * @returns Full URL to the asset
 */
export function resolveTokenAssetUrl(
  canisterId: string,
  tokenId: string,
  path: string
): string {
  if (!canisterId || !tokenId || !path) {
    console.warn('resolveTokenAssetUrl: missing required parameter', {
      canisterId,
      tokenId,
      path,
    });
    return '';
  }

  // If path is already an absolute URL, return it directly
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = buildCanisterUrl(canisterId);
  return `${baseUrl}/-/${tokenId}/-/${path}`;
}

/**
 * Resolve a collection-level asset URL
 *
 * Pattern: {canisterUrl}/collection/-/{libId}
 *
 * Used for assets that are shared across all tokens in a collection,
 * like logos, badges, and signature images.
 *
 * @param canisterId - The canister ID hosting the collection
 * @param libId - The library asset ID (e.g., "certificatelogo.png") or full URL
 * @returns Full URL to the asset
 */
export function resolveCollectionAssetUrl(
  canisterId: string,
  libId: string
): string {
  if (!canisterId || !libId) {
    console.warn('resolveCollectionAssetUrl: missing required parameter', {
      canisterId,
      libId,
    });
    return '';
  }

  // If libId is already an absolute URL, return it directly
  if (libId.startsWith('http://') || libId.startsWith('https://')) {
    return libId;
  }

  const baseUrl = buildCanisterUrl(canisterId);
  return `${baseUrl}/collection/-/${libId}`;
}

/**
 * Create a preview URL for a local File object
 *
 * Uses URL.createObjectURL for blob URLs.
 * Remember to revoke when component unmounts to prevent memory leaks.
 *
 * @param file - The File object to create a preview URL for
 * @returns Blob URL string
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 *
 * Should be called when the preview is no longer needed.
 *
 * @param url - The blob URL to revoke
 */
export function revokePreviewUrl(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Resolve an asset URL based on the render mode
 *
 * For preview mode: creates blob URLs from File objects
 * For on-chain mode: builds canister URLs
 *
 * @param options - Resolution options
 * @returns Resolved URL string
 */
export function resolveAssetUrl(options: {
  canisterId: string;
  tokenId?: string;
  path: string;
  isCollectionAsset?: boolean;
  previewFile?: File;
}): string {
  const { canisterId, tokenId, path, isCollectionAsset, previewFile } = options;

  // If preview file provided, use blob URL
  if (previewFile) {
    return createPreviewUrl(previewFile);
  }

  // Collection-level asset (shared across all tokens)
  if (isCollectionAsset) {
    return resolveCollectionAssetUrl(canisterId, path);
  }

  // Token-specific asset
  if (tokenId) {
    return resolveTokenAssetUrl(canisterId, tokenId, path);
  }

  // Fallback: treat as collection asset
  return resolveCollectionAssetUrl(canisterId, path);
}

/**
 * Extract file path from a FileReference or string
 */
export function getFilePath(
  fileRef: { path: string } | string | undefined
): string | undefined {
  if (!fileRef) return undefined;
  if (typeof fileRef === 'string') return fileRef;
  return fileRef.path;
}

/**
 * Check if a URL is a blob URL (preview mode)
 */
export function isBlobUrl(url: string): boolean {
  return url?.startsWith('blob:') || false;
}

/**
 * Check if a URL is a canister URL
 */
export function isCanisterUrl(url: string): boolean {
  return (
    url?.includes('.icp0.io') ||
    url?.includes('.ic0.app') ||
    url?.includes('.localhost:4943') ||
    false
  );
}

/**
 * Convert a .raw.icp0.io URL to a non-raw .icp0.io URL.
 *
 * The .raw subdomain bypasses the IC service worker, which can cause issues
 * with chunked assets (>2MB) that need reassembly by the boundary node.
 * The non-raw .icp0.io URL goes through the service worker which handles
 * chunk reassembly correctly.
 *
 * Returns the original URL unchanged if it's not a .raw.icp0.io URL.
 */
export function getNonRawUrl(url: string): string | null {
  if (!url?.includes('.raw.icp0.io')) return null;
  return url.replace('.raw.icp0.io', '.icp0.io');
}
