/**
 * Image Node Component
 *
 * Renders a single image from the token library.
 */

import { ImageIcon } from 'lucide-react';
import type { ImageNode as ImageNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

interface ImageNodeProps {
  node: ImageNodeType;
}

export function ImageNode({ node }: ImageNodeProps) {
  const { getFileArray, resolveAssetUrl, showPlaceholders } = useTemplateContext();

  // Get file reference from metadata
  const files = getFileArray(node.field);
  const file = files?.[0];

  if (!file?.path) {
    // Show placeholder if enabled
    if (showPlaceholders) {
      return (
        <div
          className={cn(
            'max-w-full h-auto bg-gray-200 flex items-center justify-center',
            'min-h-[120px] rounded-lg border-2 border-dashed border-gray-300',
            node.className
          )}
        >
          <div className="text-gray-400 text-center p-4">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Image placeholder</span>
          </div>
        </div>
      );
    }
    return null;
  }

  const imageUrl = resolveAssetUrl(file.path);

  return (
    <CanisterImage
      src={imageUrl}
      alt=""
      loading="lazy"
      className={cn('max-w-full h-auto', node.className)}
    />
  );
}
