/**
 * Video Node Component
 *
 * Renders a video player with controls.
 * Supports both token-specific and collection-level videos.
 */

import type { VideoNode as VideoNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface VideoNodeProps {
  node: VideoNodeType;
}

export function VideoNode({ node }: VideoNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();

  let videoUrl: string | null = null;

  // Handle canister-level video (static library)
  if (node.isCanister && node.libId) {
    videoUrl = resolveAssetUrl(node.libId, true);
  } else {
    // Handle token-specific video
    const files = getFileArray(node.field);
    const file = files?.[0];

    if (file?.path) {
      videoUrl = resolveAssetUrl(file.path);
    }
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div
      className={cn('mx-auto max-w-[960px]', node.className)}
    >
      <video
        controls
        className="mx-auto max-w-full"
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
