import { useState, useRef } from 'react';
import { mockTemplates } from '@/shared/data/templates';
import { CollectionFormSection } from './collection-form-section';
import { PricingSidebar } from './pricing-sidebar';

/**
 * SMART COMPONENT - Manages all business logic and state
 */
export function NewCollectionPage() {
  // Form state
  const [collectionName, setCollectionName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
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
    console.log('Image selected:', file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);
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
    
    console.log('Image removed');
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    console.log('Creating collection:', {
      name: collectionName,
      template: selectedTemplate,
      image: imageFile ? {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
      } : null,
    });
    // TODO: Implement actual collection creation logic
    // This would typically upload the image and create the collection
  };

  // Pricing information
  const pricingInfo = {
    deploymentCost: {
      amount: '1325 OGY',
      usd: '$15',
    },
    certificateCost: {
      amount: '17 OGY + 17 OGY / 100mb',
      usd: '$0.2 + 0.2 / 100mb',
    },
  };

  // Storage information
  const storageInfo = {
    amount: '2 GB',
    description: 'Storage description commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.',
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Main Form Section */}
      <CollectionFormSection
        collectionName={collectionName}
        onCollectionNameChange={setCollectionName}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        templates={mockTemplates}
        onSubmit={handleSubmit}
        imagePreviewUrl={imagePreviewUrl}
        onImageFileSelect={handleImageFileSelect}
        onImageRemove={handleImageRemove}
        onImageUploadClick={handleImageUploadClick}
        imageFileInputRef={fileInputRef}
      />

      {/* Sidebar Information */}
      <PricingSidebar
        pricing={pricingInfo}
        storage={storageInfo}
        description="Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices."
      />
    </div>
  );
}
