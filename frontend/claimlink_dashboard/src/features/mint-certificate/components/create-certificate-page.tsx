import { useState, useRef } from 'react';
import { CollectionSection } from "./collection-section";
import { ImageUploadSection } from '@/components/common';
import { CompanyForm } from "./company-form";
import { PricingSidebar } from "./pricing-sidebar";

export function CreateCertificatePage() {
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation constants
  const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!VALID_FILE_TYPES.includes(file.type)) {
      alert('Please upload a valid file type: JPEG, PNG, SVG, or PDF');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL for images (not PDF)
    if (file.type.startsWith('image/')) {
      // Clean up previous URL if exists
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }

    setImageFile(file);
    console.log('Certificate image selected:', file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);
  };

  const handleImageRemove = () => {
    // Clean up object URL to prevent memory leaks
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    setImagePreviewUrl(null);
    setImageFile(null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    console.log('Certificate image removed');
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Log imageFile for future form submission usage
  console.log('Current image file:', imageFile);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Form Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            {/* Collection Section */}
            <CollectionSection />

            {/* Certified Company Section */}
            <div className="bg-white box-border flex flex-col gap-8 items-center justify-center px-5 py-6 rounded-[25px] w-full border border-[#e1e1e1]">
              {/* Title */}
              <div className="w-full">
                <h2 className="font-sans font-semibold text-[#222526] text-[22px]">
                  Certified Company
                </h2>
              </div>

              {/* Image Upload Section */}
              <ImageUploadSection
                previewUrl={imagePreviewUrl}
                onFileSelect={handleImageFileSelect}
                onRemove={handleImageRemove}
                onUploadClick={handleImageUploadClick}
                fileInputRef={fileInputRef}
                uploadText="Upload your product's image or drag it here"
                acceptedFormats="JPEG, PNG, SVG, PDF"
              />

              {/* Company Form */}
              <CompanyForm />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <PricingSidebar />
        </div>
      </div>
    </div>
  );
}
