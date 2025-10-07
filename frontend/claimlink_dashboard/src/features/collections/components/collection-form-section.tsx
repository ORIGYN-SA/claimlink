import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploadSection } from '@/components/common';

interface Template {
  id: string;
  name: string;
}

interface CollectionFormSectionProps {
  collectionName: string;
  onCollectionNameChange: (value: string) => void;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  templates: Template[];
  onSubmit: () => void;
  // Image upload props
  imagePreviewUrl: string | null;
  onImageFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onImageUploadClick: () => void;
  imageFileInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * SEMI-SMART COMPONENT - Manages form layout and passes data down
 * Acts as a bridge between NewCollectionPage and dumb components
 */
export function CollectionFormSection({
  collectionName,
  onCollectionNameChange,
  selectedTemplate,
  onTemplateChange,
  templates,
  onSubmit,
  imagePreviewUrl,
  onImageFileSelect,
  onImageRemove,
  onImageUploadClick,
  imageFileInputRef,
}: CollectionFormSectionProps) {
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
          />

          {/* Collection Name Input */}
          <div className="space-y-2">
            <label className="text-[#69737c] font-medium text-sm">
              Collection name
            </label>
            <Input
              value={collectionName}
              onChange={(e) => onCollectionNameChange(e.target.value)}
              placeholder="Enter collection name"
              className="rounded-full border-[#e1e1e1] h-11"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-[#69737c] font-medium text-sm">
              Select your template
            </label>
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger className="rounded-full border-[#e1e1e1] h-11 w-full">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={onSubmit}
              className="bg-[#222526] hover:bg-[#222526]/90 rounded-full px-6 py-3 text-white font-medium"
            >
              Create collection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

