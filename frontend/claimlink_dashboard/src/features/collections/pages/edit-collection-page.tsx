import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useFetchCollectionInfo, useUpdateCollectionMetadata } from '../api/collections.queries';
import { EditCollectionFormSection } from '../components/form/edit-collection-form-section';
import { EditCollectionSidebar } from '../components/form/edit-collection-sidebar';

interface EditCollectionPageProps {
  collectionId: string;
}

/**
 * SMART COMPONENT - Manages all business logic and state for editing collections
 *
 * Fetches real collection data and uses useUpdateCollectionMetadata mutation
 * to persist changes to the ORIGYN NFT canister.
 */
export function EditCollectionPage({ collectionId }: EditCollectionPageProps) {
  // Fetch real collection data
  const { data: collection, isLoading, isError } = useFetchCollectionInfo({
    canisterId: collectionId,
  });

  // Form state
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when data loads
  useEffect(() => {
    if (collection) {
      setCollectionName(collection.title || '');
      setDescription(collection.description || '');
      setImagePreviewUrl(collection.imageUrl || null);
    }
  }, [collection]);

  // Update mutation
  const updateMutation = useUpdateCollectionMetadata({
    onSuccess: () => {
      toast.success('Collection updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update collection: ${error.message}`);
    },
  });

  // Validation constants
  const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!VALID_FILE_TYPES.includes(file.type)) {
      toast.error('Please upload a valid file type: JPEG, PNG, SVG, or PDF');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (file.type.startsWith('image/')) {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
    }

    setImageFile(file);
  };

  const handleImageRemove = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!collectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    updateMutation.mutate({
      collectionCanisterId: collectionId,
      name: collectionName,
      description,
      logoFile: imageFile || undefined,
    });
  };

  const handleDeleteCollection = () => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      console.log('Deleting collection:', collectionId);
      // TODO: Implement actual collection deletion logic
    }
  };

  // Storage information (placeholder until real API)
  const storageInfo = {
    total: '2.0 GB',
    used: '1.92 GB',
    percentage: 96,
    isAlmostFull: true,
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 items-start animate-pulse">
        <div className="flex-1">
          <div className="bg-white rounded-[25px] border border-[#efece3] p-6 space-y-6">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-11 bg-gray-200 rounded-full" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-[400px] flex-shrink-0">
          <div className="bg-white rounded-[25px] border border-[#e1e1e1] p-6 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-[#69737c]">Failed to load collection data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Main Form Section */}
      <EditCollectionFormSection
        collectionName={collectionName}
        onCollectionNameChange={setCollectionName}
        description={description}
        onDescriptionChange={setDescription}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
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
        description={collection?.description || "The Minting Studio is your interface to create, manage, and certify real-world assets fully on-chain using ORIGYN's decentralized infrastructure."}
        collectionName={collection?.title || 'Collection name'}
      />
    </div>
  );
}
