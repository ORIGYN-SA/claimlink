/**
 * Image Node Component
 *
 * Renders a single image from the token library.
 */

import type { ImageNode as ImageNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface ImageNodeProps {
  node: ImageNodeType;
}

export function ImageNode({ node }: ImageNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();

  // Get file reference from metadata
  const files = getFileArray(node.field);
  const file = files?.[0];

  if (!file?.path) {
    return null;
  }

  const imageUrl = resolveAssetUrl(file.path);

  return (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      className={cn('max-w-full h-auto', node.className)}
    />
  );
}
