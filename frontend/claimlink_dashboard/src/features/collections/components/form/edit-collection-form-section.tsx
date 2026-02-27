import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUploadSection } from '@/components/common';

interface EditCollectionFormSectionProps {
  collectionName: string;
  onCollectionNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  // Image upload props
  imagePreviewUrl: string | null;
  onImageFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onImageUploadClick: () => void;
  imageFileInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * SEMI-SMART COMPONENT - Manages form layout and passes data down
 * Acts as a bridge between EditCollectionPage and dumb components
 * Based on CollectionFormSection but adapted for editing
 */
export function EditCollectionFormSection({
  collectionName,
  onCollectionNameChange,
  description,
  onDescriptionChange,
  onSubmit,
  isSubmitting = false,
  imagePreviewUrl,
  onImageFileSelect,
  onImageRemove,
  onImageUploadClick,
  imageFileInputRef,
}: EditCollectionFormSectionProps) {
  return (
    <div className="flex-1">
      <Card className="border-[#efece3] bg-white rounded-[25px]">
        <CardHeader className="pb-6">
          <CardTitle className="text-[#222526] text-2xl font-medium">
            Collection information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <ImageUploadSection
            previewUrl={imagePreviewUrl}
            onFileSelect={onImageFileSelect}
            onRemove={onImageRemove}
            onUploadClick={onImageUploadClick}
            fileInputRef={imageFileInputRef}
            uploadText="Upload your Collection cover"
            acceptedFormats="JPEG, PNG, SVG, PDF"
          />

          {/* Collection Name Input */}
          <div className="space-y-2">
            <label className="text-[#69737c] font-medium text-sm">
              Collection name
            </label>
            <Input
              value={collectionName}
              onChange={(e) => onCollectionNameChange(e.target.value)}
              placeholder="Collection Name"
              className="rounded-full border-[#e1e1e1] h-11"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#69737c] font-medium text-sm">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe your collection"
              className="border-[#e1e1e1] min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Update Button */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#222526] hover:bg-[#222526]/90 rounded-full px-6 py-3 text-white font-medium"
        >
          {isSubmitting ? 'Updating...' : 'Update your collection'}
        </Button>
      </div>
    </div>
  );
}
