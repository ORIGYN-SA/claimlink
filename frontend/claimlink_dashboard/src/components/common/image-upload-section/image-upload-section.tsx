import { Upload, Video, X } from 'lucide-react';
import { isVideoFile, UPLOAD_CONFIG } from '@/shared/config/upload.config';

interface ImageUploadSectionProps {
  previewUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadText?: string;
  acceptedFormats?: string;
  /**
   * Enable video file support in addition to images
   * When true, accepts video files (MP4, WebM, MOV) up to 50MB
   */
  acceptVideo?: boolean;
  /**
   * The selected file (used for video preview detection)
   */
  selectedFile?: File | null;
}

/**
 * DUMB COMPONENT - Pure presentation
 * Receives all data and handlers via props
 * Reusable across collections, certificates, and other features
 * Supports both image and video uploads with proper preview handling
 */
export function ImageUploadSection({
  previewUrl,
  onFileSelect,
  onRemove,
  onUploadClick,
  fileInputRef,
  uploadText = "Upload your image",
  acceptedFormats = "JPEG, PNG, SVG",
  acceptVideo = false,
  selectedFile,
}: ImageUploadSectionProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  // Determine accept attribute based on whether video is enabled
  const acceptAttribute = acceptVideo
    ? UPLOAD_CONFIG.media.acceptString
    : UPLOAD_CONFIG.image.acceptString;

  // Check if the selected file is a video
  const isVideo = selectedFile ? isVideoFile(selectedFile) : false;

  // Default format text based on acceptVideo
  const defaultFormats = acceptVideo
    ? UPLOAD_CONFIG.media.formatLabel
    : UPLOAD_CONFIG.image.formatLabel;

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Preview Card */}
      <div className="relative bg-[#e1e1e1] rounded-[10px] w-full h-[130px] sm:w-[130px] sm:h-[130px] flex items-center justify-center overflow-hidden group flex-shrink-0">
        {previewUrl ? (
          <>
            {isVideo ? (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={handleRemoveClick}
              className="absolute top-2 right-2 bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Upload className="w-6 h-6 text-[#69737c]" />
        )}
      </div>

      {/* Upload Area */}
      <div
        onClick={onUploadClick}
        className="flex-1 border-2 border-dashed border-[#e1e1e1] rounded-md p-4 sm:p-6 bg-[#cddfec26] hover:bg-[#cde9ec40] hover:border-[#615bff] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center">
            <Upload className="w-4 h-4 text-[#615bff]" />
          </div>
          {acceptVideo && (
            <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center">
              <Video className="w-4 h-4 text-[#615bff]" />
            </div>
          )}
        </div>
        <p className="text-[#615bff] font-medium mb-2">
          {uploadText}
        </p>
        <p className="text-[#69737c] text-sm">
          {acceptedFormats || defaultFormats}
        </p>
        {acceptVideo && (
          <p className="text-[#69737c] text-xs mt-1">
            Accepts images and videos (MP4, WebM, MOV)
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptAttribute}
          onChange={onFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
