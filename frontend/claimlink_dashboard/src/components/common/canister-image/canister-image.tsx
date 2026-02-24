/**
 * CanisterImage Component
 *
 * An <img> wrapper that handles the IC chunked asset fallback.
 * Chunked assets (>2MB) served via .raw.icp0.io can fail to load because
 * the raw endpoint doesn't reassemble chunks properly. The non-raw .icp0.io
 * URL goes through the IC service worker which handles this correctly.
 *
 * Behavior:
 * 1. Tries loading from the original URL (typically .raw.icp0.io)
 * 2. If it fails, automatically retries with .icp0.io (non-raw)
 * 3. If both fail, calls the optional onError callback
 */

import { useState, useEffect, useCallback } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { getNonRawUrl } from '@/features/template-renderer/utils/url-resolver';

interface CanisterImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export function CanisterImage({ src, onError, ...props }: CanisterImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasTriedFallback(false);
  }, [src]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasTriedFallback) {
        const fallbackUrl = getNonRawUrl(src);
        if (fallbackUrl) {
          setCurrentSrc(fallbackUrl);
          setHasTriedFallback(true);
          return;
        }
      }
      // Both attempts failed (or no fallback available), propagate error
      onError?.(e);
    },
    [src, hasTriedFallback, onError]
  );

  return <img src={currentSrc} onError={handleError} {...props} />;
}
