/**
 * V2 Asset Node
 *
 * Static collection-level image (logo, watermark, badge).
 */

import type { V2AssetNode as V2AssetNodeType } from '../../types';
import { useV2Context } from '../../context/v2-template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

interface V2AssetNodeProps {
  node: V2AssetNodeType;
}

export function V2AssetNode({ node }: V2AssetNodeProps) {
  const { resolveAssetUrl } = useV2Context();

  if (!node.libId) return null;

  const imageUrl = resolveAssetUrl(node.libId, true);

  return (
    <div className={cn('', node.className)}>
      <CanisterImage
        src={imageUrl}
        alt="Collection asset"
        loading="lazy"
        className="max-w-full h-auto"
      />
    </div>
  );
}
