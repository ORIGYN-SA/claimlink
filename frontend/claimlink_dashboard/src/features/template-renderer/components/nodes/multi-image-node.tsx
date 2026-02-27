/**
 * Multi Image Node Component
 *
 * Renders multiple images in a 2-column grid.
 */

import type { MultiImageNode as MultiImageNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

interface MultiImageNodeProps {
  node: MultiImageNodeType;
}

export function MultiImageNode({ node }: MultiImageNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();

  // Get file references from metadata
  const pointer = node.pointer || node.field;
  const files = pointer ? getFileArray(pointer) : [];

  if (!files?.length) {
    return null;
  }

  return (
    <div className={cn('max-w-[660px] mx-auto mb-6', node.className)}>
      <div className="grid grid-cols-2 gap-12">
        {files.map((file, index) => {
          const imageUrl = resolveAssetUrl(file.path);
          return (
            <div key={file.id || index} className="flex justify-center">
              <CanisterImage
                src={imageUrl}
                alt=""
                loading="lazy"
                className="rounded-xl max-w-full h-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
