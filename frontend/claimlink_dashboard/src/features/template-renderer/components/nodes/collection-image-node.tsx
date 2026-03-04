/**
 * Collection Image Node Component
 *
 * Renders a static image from the collection library (shared across all tokens).
 * Used for logos, badges, signatures, etc.
 */

import type { CollectionImageNode as CollectionImageNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

interface CollectionImageNodeProps {
  node: CollectionImageNodeType;
}

export function CollectionImageNode({ node }: CollectionImageNodeProps) {
  const { resolveAssetUrl } = useTemplateContext();

  if (!node.libId) {
    return null;
  }

  const imageUrl = resolveAssetUrl(node.libId, true);

  return (
    <div className={cn('', node.className)}>
      <CanisterImage
        src={imageUrl}
        alt="Certification badge"
        title="Certification badge"
        loading="lazy"
        className="max-w-full h-auto"
      />
    </div>
  );
}
