import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { mockTemplates, getTemplateById } from '@/shared/data/templates';
import { CollectionFormSection } from '../components/form/collection-form-section';
import { PricingSidebar, PricingSidebarContent } from '../components/form/pricing-sidebar';
import { useAuth } from '@/features/auth';
import { useMultiTokenBalance, SUPPORTED_TOKENS } from '@/shared';
import { OGY_LEDGER_CANISTER_ID } from '@/shared/constants';
import useApprove from '@services/ledger/hooks/useApprove';
import useFetchTransferFee from '@/services/ledger/hooks/useFetchTransferFee';
import { useCreateCollection, useSetCollectionTemplate, CollectionsService } from '@/features/collections';

/**
 * SMART COMPONENT - Manages all business logic and state
 */
const COLLECTION_CREATION_COST_OGY = 15000; // 15,000 OGY tokens required

export function NewCollectionPage() {
  const navigate = useNavigate();
  const { authenticatedAgent, principalId, isConnected } = useAuth();

  // Form state
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('Create collection');

  // Mobile pricing sheet state
  const [showPricingSheet, setShowPricingSheet] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get OGY token info
  const ogyToken = SUPPORTED_TOKENS.find((token) => token.id === 'ogy');
  const claimlinkCanisterId = import.meta.env.VITE_CLAIMLINK_CANISTER_ID || '';

  // Fetch OGY balance
  const { balances } = useMultiTokenBalance(
    [ogyToken!],
    authenticatedAgent,
    principalId || '',
    {
      enabled: !!principalId && !!authenticatedAgent && !!ogyToken,
      refetchInterval: 30000,
    }
  );

  const ogyBalance = balances.find(({ token }) => token.id === 'ogy')?.balance;

  // Fetch transfer fee from OGY ledger
  const { data: transferFeeData } = useFetchTransferFee(
    OGY_LEDGER_CANISTER_ID,
    authenticatedAgent,
    {
      ledger: OGY_LEDGER_CANISTER_ID,
      enabled: !!authenticatedAgent,
    }
  );

  // Approval, creation, and template hooks
  const approveMutation = useApprove(ogyToken?.canister_id || '', authenticatedAgent);
  const createCollectionMutation = useCreateCollection({
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });
  const setCollectionTemplateMutation = useSetCollectionTemplate();

  // Validation constants
  const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      toast.error('Image must be less than 2MB');
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

  const handleSubmit = async () => {
    if (!isConnected || !authenticatedAgent || !principalId) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!collectionName || !collectionSymbol || !collectionDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedTemplate) {
      toast.error('Please select a template for the collection');
      return;
    }

    // Verify the selected template exists and has a structure
    const template = getTemplateById(selectedTemplate);
    if (!template?.structure) {
      toast.error('Selected template is invalid. Please choose another.');
      return;
    }

    if (!ogyToken || !claimlinkCanisterId) {
      toast.error('Configuration error. Please contact support.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Check balance
      const balance = ogyBalance?.data?.balance || 0;
      const requiredBalance = COLLECTION_CREATION_COST_OGY;

      if (balance < requiredBalance) {
        toast.error(
          `Insufficient OGY tokens. You need ${requiredBalance.toLocaleString()} OGY but have ${balance.toLocaleString()} OGY`
        );
        setIsSubmitting(false);
        return;
      }

      // Step 2: Approve spending
      setSubmitButtonText('Approving OGY spending...');
      toast.info('Requesting approval to spend OGY tokens...');

      // Fallback to 200,000 e8s (0.002 OGY) if fee not loaded yet
      const DEFAULT_FEE_E8S = 200_000n;
      const transferFee = transferFeeData || DEFAULT_FEE_E8S;

      // Calculate approval amount: base cost + transfer fee (backend requires allowance >= amount + fee)
      const approvalAmount = BigInt(COLLECTION_CREATION_COST_OGY) * BigInt(10 ** 8) + transferFee;
      await approveMutation.mutateAsync({
        amount: approvalAmount,
        spender: {
          owner: claimlinkCanisterId,
        },
      });

      toast.success('Approval granted! Creating collection...');

      // Step 3: Create collection WITHOUT logo
      setSubmitButtonText('Creating collection...');
      const canisterId = await createCollectionMutation.mutateAsync({
        name: collectionName,
        symbol: collectionSymbol,
        description: collectionDescription,
        // Don't pass logo - will be uploaded separately
      });

      // Step 4: Upload and set logo if provided
      if (imageFile) {
        try {
          setSubmitButtonText('Uploading logo...');
          toast.info('Uploading collection logo...');

          // Upload directly to the newly created collection canister
          const logoUrl = await CollectionsService.uploadLogoToCollection(
            authenticatedAgent!,
            canisterId,
            imageFile,
            (progress) => {
              setSubmitButtonText(`Uploading logo... ${Math.round(progress)}%`);
            }
          );

          // Update collection metadata with logo URL
          setSubmitButtonText('Updating collection...');
          await CollectionsService.updateCollectionMetadata(
            authenticatedAgent!,
            canisterId,
            { logo: logoUrl }
          );

          toast.success('Logo uploaded successfully!');
        } catch (error) {
          console.error('Logo upload failed:', error);
          toast.warning('Collection created, but logo upload failed. You can add it later.');
          // Continue - collection exists, just without logo
        }
      }

      // Step 5: Store template structure in collection metadata
      try {
        setSubmitButtonText('Storing template...');
        await setCollectionTemplateMutation.mutateAsync({
          collectionId: canisterId,
          template: template.structure,
        });
        toast.success('Template stored successfully!');
      } catch (error) {
        console.error('Template storage failed:', error);
        toast.warning('Collection created, but template storage failed. Certificate editing may be limited.');
        // Continue - collection exists, just without template for editing
      }

      toast.success('Collection created successfully!');
      navigate({ to: `/collections/${canisterId}` });

      // Reset form after successful creation
      setIsSubmitting(false);
      setSubmitButtonText('Create collection');
    } catch (error: any) {
      console.error('Collection creation failed:', error);

      // Handle specific error cases
      if (error.message?.includes('approve')) {
        toast.error('Failed to approve spending. Please try again.');
      } else if (error.message?.includes('InsufficientAllowance')) {
        toast.error('Approval was not sufficient. Please try again.');
      } else {
        toast.error(error.message || 'Failed to create collection. Please try again.');
      }

      setIsSubmitting(false);
      setSubmitButtonText('Create collection');
    }
  };

  // Pricing information
  const pricingInfo = {
    deploymentCost: {
      amount: `${COLLECTION_CREATION_COST_OGY.toLocaleString()} OGY`,
      usd: 'Variable',
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

  const sidebarDescription = "Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative">
      {/* Main Form Section */}
      <CollectionFormSection
        collectionName={collectionName}
        onCollectionNameChange={setCollectionName}
        collectionSymbol={collectionSymbol}
        onCollectionSymbolChange={setCollectionSymbol}
        collectionDescription={collectionDescription}
        onCollectionDescriptionChange={setCollectionDescription}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        templates={mockTemplates}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText={submitButtonText}
        imagePreviewUrl={imagePreviewUrl}
        onImageFileSelect={handleImageFileSelect}
        onImageRemove={handleImageRemove}
        onImageUploadClick={handleImageUploadClick}
        imageFileInputRef={fileInputRef}
      />

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <PricingSidebar
          pricing={pricingInfo}
          storage={storageInfo}
          description={sidebarDescription}
        />
      </div>

      {/* Mobile: Floating button to open pricing sheet */}
      <button
        onClick={() => setShowPricingSheet(true)}
        className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-[#e1e1e1] rounded-l-xl p-2 shadow-md"
        aria-label="Show pricing information"
      >
        <ChevronLeft className="w-5 h-5 text-[#222526]" />
      </button>

      {/* Mobile: Pricing Sheet */}
      <Sheet open={showPricingSheet} onOpenChange={setShowPricingSheet}>
        <SheetContent side="right" className="w-[85vw] max-w-[400px] p-0 overflow-y-auto">
          <SheetHeader className="p-4 border-b border-[#e1e1e1]">
            <SheetTitle>Collection information</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <PricingSidebarContent
              pricing={pricingInfo}
              storage={storageInfo}
              description={sidebarDescription}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
