/**
 * Gallery Node Component
 *
 * Renders an image gallery/carousel with navigation controls.
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryNode as GalleryNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface GalleryNodeProps {
  node: GalleryNodeType;
}

export function GalleryNode({ node }: GalleryNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get images from metadata or static libs
  const pointer = node.pointer || node.field;
  const files = pointer ? getFileArray(pointer) : [];

  // Handle static library images
  const staticLibs = node.isStatic ? node.libs || [] : [];

  // Build image list
  const images = node.isStatic
    ? staticLibs.map((libId) => ({
        id: libId,
        path: libId,
        isStatic: true,
      }))
    : files.map((file) => ({
        id: file.id,
        path: file.path,
        isStatic: false,
      }));

  if (!images.length) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];
  const imageUrl = resolveAssetUrl(currentImage.path, currentImage.isStatic);

  return (
    <div className={cn('w-full', node.className)}>
      {/* Main Gallery View */}
      <div className="relative max-w-[1024px] mx-auto">
        {/* Main Image */}
        <div
          className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={imageUrl}
            alt={`Gallery image ${currentIndex + 1}`}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-[1024px] mx-auto">
          {images.map((image, index) => {
            const thumbUrl = resolveAssetUrl(image.path, image.isStatic);
            return (
              <button
                key={image.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                  index === currentIndex
                    ? 'border-gray-800'
                    : 'border-transparent hover:border-gray-300'
                )}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isModalOpen && (
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

          <img
            src={imageUrl}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
