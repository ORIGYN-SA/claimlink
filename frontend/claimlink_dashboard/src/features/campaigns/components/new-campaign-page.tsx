import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SelectCollectionStep } from '@/features/campaigns';
import { ConfigureCampaignStep } from '@/features/campaigns';
import { campaignService } from '../api/campaigns.service';
import type { Collection } from '@/features/collections/types/collection.types';
import type { CampaignFormData, CreateCampaignInput } from '../types/campaign.types';

type Step = 'select' | 'configure';

/**
 * SMART COMPONENT - Manages state and business logic
 * Handles all data fetching, state management, and side effects
 * Delegates presentation to dumb components
 */
export function NewCampaignPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Form state
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    maxClaims: 100,
    claimDuration: '7',
    startDate: '',
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Cover image state
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  // Whitelist CSV state
  const [whitelistCsvFileName, setWhitelistCsvFileName] = useState<string | null>(null);
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);
  const whitelistCsvInputRef = useRef<HTMLInputElement | null>(null);

  // Whitelist manual input state
  const [whitelistInput, setWhitelistInput] = useState('');

  // Redirect URL state
  const [redirectUrl, setRedirectUrl] = useState('');

  // Update maxClaims when selectedCollection changes
  useEffect(() => {
    if (selectedCollection) {
      setFormData(prev => ({
        ...prev,
        maxClaims: Math.min(prev.maxClaims, selectedCollection.itemCount)
      }));
    }
  }, [selectedCollection]);

  // Collection selection handler
  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentStep('configure');
  };

  // Tab navigation handler
  const handleTabChange = (value: string) => {
    if (value === 'select') {
      setCurrentStep('select');
    } else if (value === 'configure' && currentStep === 'configure') {
      setCurrentStep('configure');
    }
  };

  // Form field change handler
  const handleFormChange = (field: keyof CampaignFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cover image handlers
  const handleCoverImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageRemove = () => {
    setCoverImagePreview(null);
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  const handleCoverImageUploadClick = () => {
    coverImageInputRef.current?.click();
  };

  // Whitelist CSV handlers
  const handleWhitelistCsvSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setWhitelistCsvFileName(file.name);
      
      // Parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple CSV parsing - split by lines and filter empty lines
        const addresses = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        setWhitelistAddresses(addresses);
      };
      reader.readAsText(file);
    }
  };

  const handleWhitelistCsvRemove = () => {
    setWhitelistCsvFileName(null);
    setWhitelistAddresses([]);
    if (whitelistCsvInputRef.current) {
      whitelistCsvInputRef.current.value = '';
    }
  };

  const handleWhitelistCsvUploadClick = () => {
    whitelistCsvInputRef.current?.click();
  };

  // Manual whitelist handlers
  const handleWhitelistInputChange = (value: string) => {
    setWhitelistInput(value);
  };

  const handleAddToWhitelist = () => {
    if (whitelistInput.trim()) {
      setWhitelistAddresses(prev => [...prev, whitelistInput.trim()]);
      setWhitelistInput('');
    }
  };

  // Redirect URL handler
  const handleRedirectUrlChange = (value: string) => {
    setRedirectUrl(value);
  };

  // Form submission handler
  const handleSubmit = async () => {
    if (!formData.name.trim() || !selectedCollection) return;

    setIsLoading(true);

    try {
      // Convert form data to API input
      const campaignInput: CreateCampaignInput = {
        name: formData.name,
        description: formData.description,
        collectionId: selectedCollection.id,
        maxClaims: formData.maxClaims,
        claimDuration: formData.claimDuration === 'unlimited' ? 0 : parseInt(formData.claimDuration),
        startDate: formData.startDate || undefined,
      };

      await campaignService.createCampaign(campaignInput);
      
      // Navigate to campaigns list on success
      navigate({ to: '/campaigns' });
    } catch (error) {
      console.error('Failed to create campaign:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigureAccessible = currentStep === 'configure';

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <TabsList className="w-full max-w-2xl mx-auto bg-transparent h-auto p-0 gap-1">
            <TabsTrigger
              value="select"
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2"
            >
              Select collection
            </TabsTrigger>
            <TabsTrigger
              value="configure"
              disabled={!isConfigureAccessible}
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
            >
              Set your campaign
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <TabsContent value="select" className="mt-0 w-full flex justify-center">
            <SelectCollectionStep onNext={handleCollectionSelect} />
          </TabsContent>

          <TabsContent value="configure" className="mt-0 w-full flex justify-center">
            <ConfigureCampaignStep
              selectedCollection={selectedCollection}
              formData={formData}
              isLoading={isLoading}
              coverImagePreview={coverImagePreview}
              coverImageInputRef={coverImageInputRef}
              whitelistCsvFileName={whitelistCsvFileName}
              whitelistCsvInputRef={whitelistCsvInputRef}
              whitelistAddresses={whitelistAddresses}
              whitelistInput={whitelistInput}
              redirectUrl={redirectUrl}
              onFormChange={handleFormChange}
              onCoverImageSelect={handleCoverImageSelect}
              onCoverImageRemove={handleCoverImageRemove}
              onCoverImageUploadClick={handleCoverImageUploadClick}
              onWhitelistCsvSelect={handleWhitelistCsvSelect}
              onWhitelistCsvRemove={handleWhitelistCsvRemove}
              onWhitelistCsvUploadClick={handleWhitelistCsvUploadClick}
              onWhitelistInputChange={handleWhitelistInputChange}
              onAddToWhitelist={handleAddToWhitelist}
              onRedirectUrlChange={handleRedirectUrlChange}
              onBack={() => setCurrentStep('select')}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
