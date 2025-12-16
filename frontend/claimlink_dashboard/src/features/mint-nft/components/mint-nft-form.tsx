import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { useMintNft, useUploadImage } from '@services/origyn_nft';

interface MintNFTFormProps {
  collectionCanisterId: string;
}

/**
 * MintNFTForm - TanStack Form Integration Example
 *
 * Demonstrates Phase 3 pattern:
 * - TanStack Form manages form fields (name, description)
 * - Local state for UI concerns (image preview, attributes array)
 * - Form validation with built-in validators
 * - Clean separation: form state vs UI state
 */
export function MintNFTForm({ collectionCanisterId }: MintNFTFormProps) {
  const navigate = useNavigate();

  // UI-only state (not part of form data)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<Array<{ key: string; value: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading, progress } = useUploadImage();
  const mintMutation = useMintNft({
    onSuccess: (tokenId) => {
      toast.success(`NFT minted successfully! Token ID: ${tokenId}`);
      navigate({ to: '/collections/$collectionId', params: { collectionId: collectionCanisterId } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // TanStack Form setup
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Step 1: Upload image if provided
        let imageUrl: string | undefined;
        if (imageFile) {
          toast.info('Uploading image...');
          imageUrl = await uploadImage(imageFile, collectionCanisterId);
          toast.success('Image uploaded!');
        }

        // Step 2: Mint NFT
        toast.info('Minting NFT...');
        const attributesObj = attributes.reduce((acc, { key, value }) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        await mintMutation.mutateAsync({
          collectionCanisterId,
          name: value.name,
          description: value.description,
          imageUrl,
          attributes: attributesObj,
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to mint NFT');
      }
    },
  });

  // Image upload handler (UI-only concern)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const isMinting = mintMutation.isPending || isUploading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Name field with TanStack Form */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim().length === 0) {
              return 'NFT name is required';
            }
            if (value.length < 3) {
              return 'NFT name must be at least 3 characters';
            }
            if (value.length > 100) {
              return 'NFT name must be less than 100 characters';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">NFT Name *</label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter NFT name"
              disabled={isMinting}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Description field with TanStack Form */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim().length === 0) {
              return 'Description is required';
            }
            if (value.length < 10) {
              return 'Description must be at least 10 characters';
            }
            if (value.length > 1000) {
              return 'Description must be less than 1000 characters';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Describe your NFT"
              disabled={isMinting}
              rows={4}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div>
        <label className="block text-sm font-medium mb-2">Image (Optional)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          disabled={isMinting}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isMinting}
        >
          {imageFile ? 'Change Image' : 'Upload Image'}
        </Button>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 max-w-xs rounded-lg border"
          />
        )}
        {isUploading && (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">
              Uploading: {Math.round(progress)}%
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Attributes (Optional)</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAttribute}
            disabled={isMinting}
          >
            Add Attribute
          </Button>
        </div>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={attr.key}
              onChange={(e) => updateAttribute(index, 'key', e.target.value)}
              placeholder="Trait type"
              disabled={isMinting}
            />
            <Input
              value={attr.value}
              onChange={(e) => updateAttribute(index, 'value', e.target.value)}
              placeholder="Value"
              disabled={isMinting}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeAttribute(index)}
              disabled={isMinting}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isMinting || isSubmitting}
          >
            {isMinting ? 'Minting...' : 'Mint NFT'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
