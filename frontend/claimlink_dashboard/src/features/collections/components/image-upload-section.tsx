import { Upload, X } from 'lucide-react';

interface ImageUploadSectionProps {
  previewUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * DUMB COMPONENT - Pure presentation
 * Receives all data and handlers via props
 */
export function ImageUploadSection({
  previewUrl,
  onFileSelect,
  onRemove,
  onUploadClick,
  fileInputRef,
}: ImageUploadSectionProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className="flex gap-4">
      {/* Preview Card */}
      <div className="relative bg-[#e1e1e1] rounded-[10px] w-[130px] h-[130px] flex items-center justify-center overflow-hidden group">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Collection cover preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveClick}
              className="absolute top-2 right-2 bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
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
        className="flex-1 border-2 border-dashed border-[#e1e1e1] rounded-md p-6 bg-[#cddfec26] hover:bg-[#cde9ec40] hover:border-[#615bff] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
      >
        <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center mb-3">
          <Upload className="w-4 h-4 text-[#615bff]" />
        </div>
        <p className="text-[#615bff] font-medium mb-2">
          Upload your Collection cover
        </p>
        <p className="text-[#69737c] text-sm">
          JPEG, PNG, SVG, PDF
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml,application/pdf"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

