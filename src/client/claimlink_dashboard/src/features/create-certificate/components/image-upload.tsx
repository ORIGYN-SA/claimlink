import { Upload, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Placeholder/Uploaded Image */}
      <div className="relative">
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Company product"
            className="w-[130px] h-[130px] rounded-[10px] object-cover"
          />
        ) : (
          <div className="w-[130px] h-[130px] rounded-[10px] bg-[#e1e1e1] flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-[#69737c]" />
          </div>
        )}

        {/* Upload indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#cde9ec] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-[#222526] rounded-full"></div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`flex-1 border-2 border-dashed rounded-[4px] p-4 transition-colors ${
          isDragOver
            ? "border-[#615bff] bg-[#cddfec26]"
            : "border-[#e1e1e1] bg-[rgba(205,223,236,0.15)]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Upload className="w-6 h-6 text-[#615bff]" />
          </div>

          <div className="space-y-1">
            <p className="text-[16px] font-medium text-[#615bff] leading-[24px]">
              Upload your products image or drag it here
            </p>
            <p className="text-[12px] font-semibold text-[#69737c]">
              JPEG, PNG, SVG, PDF
            </p>
          </div>

          <label
            htmlFor="image-upload"
            className="inline-block text-[16px] font-medium text-[#615bff] hover:underline cursor-pointer"
          >
            Browse
          </label>
        </div>
      </div>
    </div>
  );
}
