/**
 * V2 Gallery Node
 *
 * Image gallery/carousel bound to a field.
 * Single image = gallery with 1 item (no navigation).
 * Ported from v1 gallery-node with simplifications.
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, ImageIcon } from 'lucide-react';
import type { V2GalleryNode as V2GalleryNodeType } from '../../types';
import { useV2Context } from '../../context/v2-template-context';
import { CanisterImage } from '@/components/common/canister-image/canister-image';
import { cn } from '@/lib/utils';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

function isVideoPath(path: string): boolean {
  if (!path) return false;
  const lowerPath = path.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
}

interface MediaItem {
  id: string;
  path: string;
  isVideo: boolean;
}

interface V2GalleryNodeProps {
  node: V2GalleryNodeType;
}

export function V2GalleryNode({ node }: V2GalleryNodeProps) {
  const { getFileArray, resolveAssetUrl, showPlaceholders } = useV2Context();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const files = getFileArray(node.fieldId);

  const mediaItems: MediaItem[] = files.map((file) => ({
    id: file.id,
    path: file.path,
    isVideo: isVideoPath(file.path),
  }));

  if (!mediaItems.length) {
    if (showPlaceholders) {
      return (
        <div className={cn('w-full', node.className)}>
          <div className="relative max-w-[1024px] mx-auto">
            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-gray-400 text-center p-4">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <span className="text-sm">Gallery placeholder</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 max-w-[1024px] mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-16 h-16 rounded-md bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
              >
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = mediaItems[currentIndex];
  const mediaUrl = resolveAssetUrl(currentMedia.path);

  return (
    <div className={cn('w-full', node.className)}>
      {/* Main Gallery View */}
      <div className="relative max-w-[1024px] mx-auto">
        <div
          className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => !currentMedia.isVideo && setIsModalOpen(true)}
        >
          {currentMedia.isVideo ? (
            <video
              key={mediaUrl}
              controls
              className="w-full h-full object-contain"
              src={mediaUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <CanisterImage
              src={mediaUrl}
              alt={`Gallery item ${currentIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Next item"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {mediaItems.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                )}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-[1024px] mx-auto">
          {mediaItems.map((media, index) => {
            const thumbUrl = resolveAssetUrl(media.path);
            return (
              <button
                key={media.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                  index === currentIndex
                    ? 'border-gray-800'
                    : 'border-transparent hover:border-gray-300'
                )}
              >
                {media.isVideo ? (
                  <>
                    <video
                      src={thumbUrl}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <CanisterImage
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isModalOpen && !currentMedia.isVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>

          <CanisterImage
            src={mediaUrl}
            alt={`Gallery item ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 transition-colors"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 transition-colors"
                aria-label="Next item"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {mediaItems.length}
          </div>
        </div>
      )}
    </div>
  );
}
