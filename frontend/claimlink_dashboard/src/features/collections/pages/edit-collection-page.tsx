import { useState, useRef } from 'react';
import { mockTemplates } from '@/shared/data/templates';
import { getCollectionById } from '@/shared/data/collections';
import { EditCollectionFormSection } from '../components/form/edit-collection-form-section';
import { EditCollectionSidebar } from '../components/form/edit-collection-sidebar';

interface EditCollectionPageProps {
  collectionId: string;
}

/**
 * SMART COMPONENT - Manages all business logic and state for editing collections
 */
export function EditCollectionPage({ collectionId }: EditCollectionPageProps) {
  // Get existing collection data
  const existingCollection = getCollectionById(collectionId);
  
  // Form state - initialize with existing data
  const [collectionName, setCollectionName] = useState(existingCollection?.title || '');
  const [selectedTemplate, setSelectedTemplate] = useState('template-1'); // Default to first template
  
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(existingCollection?.imageUrl || null);
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
    console.log('Updating collection:', {
      id: collectionId,
      name: collectionName,
      template: selectedTemplate,
      image: imageFile ? {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
      } : null,
    });
    // TODO: Implement actual collection update logic
    // This would typically upload the image and update the collection
  };

  const handleDeleteCollection = () => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      console.log('Deleting collection:', collectionId);
      // TODO: Implement actual collection deletion logic
    }
  };

  // Storage information (matching Figma design)
  const storageInfo = {
    total: '2.0 GB',
    used: '1.92 GB',
    percentage: 96, // 1.92 / 2.0 * 100
    isAlmostFull: true,
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Main Form Section */}
      <EditCollectionFormSection
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
      <EditCollectionSidebar
        storage={storageInfo}
        onDeleteCollection={handleDeleteCollection}
        description="The Minting Studio is your interface to create, manage, and certify real-world assets fully on-chain using ORIGYN's decentralized infrastructure."
        collectionName={existingCollection?.title || 'Collection name'}
      />
    </div>
  );
}
