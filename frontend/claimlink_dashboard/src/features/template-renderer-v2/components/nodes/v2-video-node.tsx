/**
 * V2 Video Node
 *
 * Video player bound to a field.
 * Simplified from v1 — no isCanister flag, just fieldId.
 */

import { PlayCircle } from 'lucide-react';
import type { V2VideoNode as V2VideoNodeType } from '../../types';
import { useV2Context } from '../../context/v2-template-context';
import { cn } from '@/lib/utils';

interface V2VideoNodeProps {
  node: V2VideoNodeType;
}

export function V2VideoNode({ node }: V2VideoNodeProps) {
  const { getFileArray, resolveAssetUrl, showPlaceholders } = useV2Context();

  const files = getFileArray(node.fieldId);
  const file = files?.[0];
  const videoUrl = file?.path ? resolveAssetUrl(file.path) : null;

  if (!videoUrl) {
    if (showPlaceholders) {
      return (
        <div
          className={cn(
            'mx-auto max-w-[960px] bg-gray-800 flex items-center justify-center',
            'min-h-[200px] rounded-lg',
            node.className
          )}
        >
          <div className="text-gray-400 text-center p-4">
            <PlayCircle className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm">Video placeholder</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn('mx-auto max-w-[960px]', node.className)}>
      <video controls className="mx-auto max-w-full" src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
