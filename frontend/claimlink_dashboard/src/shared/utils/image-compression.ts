/**
 * Image Compression Utility
 *
 * Compresses images to fit within size limits for template storage.
 * Templates must be < 2MB total, so backgrounds are limited to ~1.5MB
 * to leave room for template metadata, sections, and translations.
 */

/**
 * Maximum background data URI **string** size.
 *
 * IC ingress messages are limited to 2MB. The template_json string (which
 * embeds the data URI) plus Candid encoding, IC envelope, and NFID delegation
 * chain must all fit within this limit. 800KB data URI string leaves ~1.2MB
 * headroom for template metadata, Candid overhead, and authentication data.
 *
 * Note: base64 adds ~33% overhead, so 800KB string ≈ 600KB binary.
 * Previous limit of 1MB checked binary size, but the IC limit applies to the
 * encoded string — which caused failures at the boundary.
 */
export const MAX_BACKGROUND_SIZE_BYTES = 800 * 1024;

/** Minimum quality to attempt before giving up */
const MIN_QUALITY = 0.1;

/** Quality step for iterative compression */
const QUALITY_STEP = 0.1;

/** Maximum dimension for resizing (maintains aspect ratio) */
const MAX_DIMENSION = 1920;

export interface CompressionResult {
  dataUri: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  finalQuality?: number;
  finalDimensions?: { width: number; height: number };
}

/**
 * Loads an image from a File and returns an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculates new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const ratio = Math.min(maxDimension / width, maxDimension / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Compresses an image using Canvas API
 */
function compressToDataUri(
  img: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Gets the **string length** of a data URI.
 *
 * This is the size that matters for IC ingress messages, because
 * the data URI is embedded as a string in the template JSON which
 * is sent as Candid text. The old implementation returned the
 * decoded binary size, which is ~25% smaller than the actual
 * string payload — causing ingress messages to exceed the 2MB limit.
 */
function getDataUriSize(dataUri: string): number {
  return dataUri.length;
}

/**
 * Compresses an image file to fit within the specified size limit.
 *
 * Uses iterative compression:
 * 1. First tries reducing dimensions if larger than MAX_DIMENSION
 * 2. Then reduces JPEG quality until size is under limit
 * 3. Throws error if cannot compress enough
 *
 * @param file - The image file to compress
 * @param maxSizeBytes - Maximum size in bytes (default: 1.5MB)
 * @returns Promise with compression result including data URI
 * @throws Error if image cannot be compressed to fit within limit
 */
export async function compressImageToDataUri(
  file: File,
  maxSizeBytes: number = MAX_BACKGROUND_SIZE_BYTES
): Promise<CompressionResult> {
  const originalSize = file.size;

  // First, try reading as-is to check if compression is needed
  const originalDataUri = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const originalDataUriSize = getDataUriSize(originalDataUri);

  // If already under limit, return as-is
  if (originalDataUriSize <= maxSizeBytes) {
    return {
      dataUri: originalDataUri,
      originalSize,
      compressedSize: originalDataUriSize,
      wasCompressed: false,
    };
  }

  // Need to compress - load the image
  const img = await loadImage(file);

  // Calculate initial dimensions (may need to resize large images)
  let { width, height } = calculateDimensions(img.width, img.height, MAX_DIMENSION);

  // Try compression at decreasing quality levels
  let quality = 0.9;
  let dataUri: string;
  let dataUriSize: number;

  while (quality >= MIN_QUALITY) {
    dataUri = compressToDataUri(img, width, height, quality);
    dataUriSize = getDataUriSize(dataUri);

    if (dataUriSize <= maxSizeBytes) {
      // Clean up
      URL.revokeObjectURL(img.src);

      return {
        dataUri,
        originalSize,
        compressedSize: dataUriSize,
        wasCompressed: true,
        finalQuality: quality,
        finalDimensions: { width, height },
      };
    }

    quality -= QUALITY_STEP;
  }

  // If still too large, try reducing dimensions further
  while (width > 640 && height > 480) {
    width = Math.round(width * 0.75);
    height = Math.round(height * 0.75);

    // Try again with reduced dimensions at various quality levels
    quality = 0.7;
    while (quality >= MIN_QUALITY) {
      dataUri = compressToDataUri(img, width, height, quality);
      dataUriSize = getDataUriSize(dataUri);

      if (dataUriSize <= maxSizeBytes) {
        // Clean up
        URL.revokeObjectURL(img.src);

        return {
          dataUri,
          originalSize,
          compressedSize: dataUriSize,
          wasCompressed: true,
          finalQuality: quality,
          finalDimensions: { width, height },
        };
      }

      quality -= QUALITY_STEP;
    }
  }

  // Clean up
  URL.revokeObjectURL(img.src);

  // Could not compress enough
  throw new Error(
    `Image cannot be compressed to fit within ${(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB limit. ` +
    `Original size: ${(originalSize / (1024 * 1024)).toFixed(2)}MB. ` +
    `Please use a smaller image.`
  );
}

/**
 * Validates that a video file is within the size limit.
 * Videos cannot be compressed client-side, so we just validate size.
 *
 * @param file - The video file to validate
 * @param maxSizeBytes - Maximum size in bytes (default: 1.5MB)
 * @returns Promise with the data URI if valid
 * @throws Error if video exceeds size limit
 */
export async function validateVideoSize(
  file: File,
  maxSizeBytes: number = MAX_BACKGROUND_SIZE_BYTES
): Promise<string> {
  if (file.size > maxSizeBytes) {
    throw new Error(
      `Video exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB limit. ` +
      `Your video is ${(file.size / (1024 * 1024)).toFixed(2)}MB. ` +
      `Please use a smaller video file.`
    );
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read video file'));
    reader.readAsDataURL(file);
  });
}
