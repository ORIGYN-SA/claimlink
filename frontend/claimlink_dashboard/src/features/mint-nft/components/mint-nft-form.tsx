import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { useMintNft, useUploadImage } from '@services/origyn_nft';

interface MintNFTFormProps {
  collectionCanisterId: string;
}

export function MintNFTForm({ collectionCanisterId }: MintNFTFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

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
        name,
        description,
        imageUrl,
        attributes: attributesObj,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to mint NFT');
    }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">NFT Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter NFT name"
          disabled={isMinting}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your NFT"
          disabled={isMinting}
          required
        />
      </div>

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

      <Button type="submit" disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Mint NFT'}
      </Button>
    </form>
  );
}
