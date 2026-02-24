/**
 * CanisterImage Component
 *
 * An <img> wrapper that uses non-raw IC URLs for reliable image loading.
 *
 * Chunked assets (>2MB) served via .raw.icp0.io fail with
 * ERR_HTTP2_PROTOCOL_ERROR because the raw endpoint doesn't reassemble
 * chunks properly. The non-raw .icp0.io URL goes through the IC boundary
 * node which handles chunk reassembly correctly.
 *
 * Since the HTTP/2 error returns status 200 (headers succeed, body fails),
 * the browser doesn't reliably fire the <img> onError event, so we
 * proactively use non-raw URLs instead of relying on fallback.
 */

import type { ImgHTMLAttributes } from 'react';
import { getNonRawUrl } from '@/features/template-renderer/utils/url-resolver';

interface CanisterImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export function CanisterImage({ src, ...props }: CanisterImageProps) {
  // Proactively use non-raw URL for reliable chunked asset loading
  const resolvedSrc = getNonRawUrl(src) ?? src;

  return <img src={resolvedSrc} {...props} />;
}
