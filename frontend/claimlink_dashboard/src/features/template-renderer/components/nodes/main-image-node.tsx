/**
 * Main Image Node Component
 *
 * Renders the primary/hero image from the token library.
 */

import type { MainImageNode as MainImageNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

interface MainImageNodeProps {
  node: MainImageNodeType;
}

export function MainImageNode({ node }: MainImageNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();

  // Get file reference from metadata
  const files = getFileArray(node.pointer);
  const file = files?.[0];

  if (!file?.path) {
    return null;
  }

  const imageUrl = resolveAssetUrl(file.path);

  return (
    <div className={cn('flex items-center justify-center flex-col', node.className)}>
      <CanisterImage
        src={imageUrl}
        alt=""
        loading="lazy"
        className="min-h-[335px] max-w-full object-contain"
      />
    </div>
  );
}
