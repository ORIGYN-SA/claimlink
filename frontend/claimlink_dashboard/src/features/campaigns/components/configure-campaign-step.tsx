import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { campaignService } from '../api/campaigns.service';
import type { Collection } from '@/features/collections/types/collection.types';
import type { CampaignFormData, CreateCampaignInput } from '../types/campaign.types';

interface ConfigureCampaignStepProps {
  selectedCollection: Collection | null;
  onBack?: () => void;
  onComplete?: () => void;
}

export function ConfigureCampaignStep({
  selectedCollection,
  onBack,
  onComplete
}: ConfigureCampaignStepProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    maxClaims: selectedCollection?.itemCount || 100,
    claimDuration: '7',
    startDate: '',
  });

  // Update maxClaims when selectedCollection changes
  React.useEffect(() => {
    if (selectedCollection) {
      setFormData(prev => ({
        ...prev,
        maxClaims: Math.min(prev.maxClaims, selectedCollection.itemCount)
      }));
    }
  }, [selectedCollection]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CampaignFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      onComplete?.();
    } catch (error) {
      console.error('Failed to create campaign:', error);
      // In a real app, you'd show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCollection) {
    return (
      <div className="bg-white border border-[var(--mouse)] rounded-[16px] p-[40px] text-center">
        <p className="text-[var(--slate)] mb-4">No collection selected</p>
        <Button onClick={onBack} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-6">
        {/* Collection Card */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-[22px] font-semibold text-[var(--charcoal)] mb-2">
              Collection
            </div>
          </div>
          <div className="bg-white border border-[var(--mouse)] rounded-[16px] p-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedCollection.imageUrl}
                alt={selectedCollection.title}
                className="w-[76px] h-[76px] rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--charcoal)] text-lg mb-1">
                  {selectedCollection.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[var(--jade-90)] text-[var(--jade)] text-xs">
                    {selectedCollection.itemCount} certificates
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Configuration Form */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px]">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold text-[var(--charcoal)] mb-2">
              Set up your Campaign
            </h2>
          </div>

          <div className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--charcoal)]">Campaign Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter campaign name"
                className="rounded-full"
              />
            </div>

            {/* Image Uploader */}
            <div className="flex gap-4">
              <div className="w-[130px] h-[130px] bg-[var(--mouse)] rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 bg-[var(--cobalt)] rounded opacity-50"></div>
              </div>
              <div className="flex-1 bg-[rgba(205,223,236,0.15)] border-2 border-dashed border-[var(--mouse)] rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-[var(--celeste)] rounded mb-2"></div>
                <p className="text-[var(--space-purple)] font-medium mb-1">Upload</p>
                <p className="text-[var(--slate)] text-sm">your Cover or drag it here</p>
                <p className="text-[var(--slate)] text-xs font-semibold">JPEG, PNG, SVG, PDF</p>
              </div>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--charcoal)]">Start date</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-[var(--mouse)] rounded-l-full rounded-r-none px-4 py-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[var(--cobalt)] rounded"></div>
                    <span className="text-[var(--charcoal)] text-sm">DD/MM/YYYY</span>
                  </div>
                  <div className="flex-1 bg-white border border-[var(--mouse)] border-l-0 rounded-r-full rounded-l-none px-4 py-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[var(--cobalt)] rounded"></div>
                    <span className="text-[var(--charcoal)] text-sm">HH:MM CEST</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--charcoal)]">End date</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-[var(--mouse)] rounded-l-full rounded-r-none px-4 py-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[var(--cobalt)] rounded"></div>
                    <span className="text-[var(--charcoal)] text-sm">DD/MM/YYYY</span>
                  </div>
                  <div className="flex-1 bg-white border border-[var(--mouse)] border-l-0 rounded-r-full rounded-l-none px-4 py-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[var(--cobalt)] rounded"></div>
                    <span className="text-[var(--charcoal)] text-sm">HH:MM CEST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Supply */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--charcoal)]">Total Supply</label>
              <Input
                type="number"
                value={formData.maxClaims}
                onChange={(e) => handleInputChange('maxClaims', Number(e.target.value))}
                min={1}
                max={selectedCollection.itemCount}
                className="rounded-full"
                placeholder="Enter total supply"
              />
              <p className="text-xs text-[var(--slate)]">
                Set how many NFTs are available for claiming. Once this number is reached, the campaign will automatically deactivate.
              </p>
            </div>

            {/* Claim Method Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--charcoal)]">Claim Method</label>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-2 border-[var(--jade)] bg-white cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[76px] h-[76px] bg-[var(--jade-90)] rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-[var(--jade)] rounded"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--charcoal)] text-lg mb-1">Multi-scan QR Code</h3>
                        <p className="text-sm text-[var(--slate)] mb-1">One QR code for multiple users.</p>
                        <p className="text-sm text-[var(--slate)]">Ideal for events and screens.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[var(--mouse)] bg-white cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[76px] h-[76px] bg-[var(--paper)] border border-[var(--mouse)] rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-[var(--slate)] rounded opacity-50"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--charcoal)] text-lg mb-1">Unique Claim Links</h3>
                        <p className="text-sm text-[var(--slate)] mb-1">One NFT per unique URL.</p>
                        <p className="text-sm text-[var(--slate)]">Ideal for 1:1 distribution.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--charcoal)]">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter campaign description"
                className="min-h-[90px] rounded-[16px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Whitelist Section */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[22px] font-semibold text-[var(--charcoal)] mb-2">
                Whitelist set up <span className="text-[var(--slate)] text-lg font-normal">(Optional)</span>
              </h3>
              <p className="text-sm text-[var(--slate)]">
                Limit access to your campaign by allowing only selected email addresses or Principal IDs to claim the NFT/certificate.
              </p>
            </div>
            <Button variant="outline" className="rounded-full">
              <div className="w-4 h-4 bg-[var(--jade)] rounded-full mr-2"></div>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input placeholder="Enter a wallet address or an email" className="rounded-full" />
              </div>
              <Button className="bg-[var(--charcoal)] hover:bg-[var(--cobalt)] rounded-full px-6">
                add to whitelist
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--charcoal)]">Recepient's address</label>
              <div className="bg-[var(--paper)] border border-[var(--mouse)] rounded-lg p-4">
                <div className="text-sm text-[var(--slate)] font-mono break-all">
                  0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
                  <br />
                  0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
                  <br />
                  0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829 etc
                </div>
              </div>
            </div>

            <div className="bg-[rgba(205,223,236,0.15)] border-2 border-dashed border-[var(--mouse)] rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-[var(--celeste)] rounded mx-auto mb-2"></div>
              <p className="text-[var(--space-purple)] font-medium mb-1">Upload</p>
              <p className="text-[var(--slate)]">your sheet or drag it here</p>
              <p className="text-[var(--slate)] text-xs font-semibold">CSV</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom URL Section */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[22px] font-semibold text-[var(--charcoal)] mb-2">
                Post campaign redirection <span className="text-[var(--slate)] text-lg font-normal">(Optional)</span>
              </h3>
              <p className="text-sm text-[var(--slate)]">
                Choose where users are sent after the campaign ends, so they don't land on an expired link page.
              </p>
            </div>
            <Button variant="outline" className="rounded-full">
              <div className="w-4 h-4 bg-[var(--jade)] rounded-full mr-2"></div>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-[var(--jade)] bg-white cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[54px] h-[54px] bg-[var(--jade-90)] rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-[var(--jade)] rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--charcoal)] text-lg mb-1">Custom URL</h4>
                      <p className="text-sm text-[var(--slate)]">Be redirected to a custom URL (e.g., your website)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[var(--mouse)] bg-white cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[54px] h-[54px] bg-[var(--paper)] border border-[var(--mouse)] rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-[var(--slate)] rounded opacity-50"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--charcoal)] text-lg mb-1">Default message</h4>
                      <p className="text-sm text-[var(--slate)]">"This campaign has ended."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--charcoal)]">Redirect link</label>
              <Input placeholder="https://yourwebsite.com" className="rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-full"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || isLoading}
          className="flex-1 bg-[var(--space-purple)] hover:bg-[var(--cobalt)] rounded-full"
        >
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
      </div>

      {/* Sidebar */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px] sticky top-0">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* General Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[var(--charcoal)]">
                General information
              </h3>
              <p className="text-sm text-[var(--slate)]">
                Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.
              </p>
            </div>

            {/* Separator */}
            <div className="h-px bg-[var(--mouse)]"></div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[var(--cobalt)] rounded"></div>
                <span className="text-sm font-medium text-[var(--charcoal)] uppercase tracking-wide">
                  Price
                </span>
              </div>

              <div className="bg-[rgba(205,223,236,0.15)] border border-[var(--mouse)] rounded-[16px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--slate)]">Certificate cost:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[var(--cobalt)] rounded"></div>
                  <span className="text-lg font-semibold text-[var(--charcoal)]">
                    8800 OGY <span className="text-sm text-[var(--slate)]">(2500$)</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--slate)]">
                When you mint a certificate, you will need to pay 17 OGY + 17 OGY as fees.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full bg-[var(--mouse)] text-[var(--charcoal)] hover:bg-[var(--mouse)]"
              >
                Save draft
              </Button>
              <Button
                className="flex-1 bg-[var(--charcoal)] hover:bg-[var(--cobalt)] rounded-full"
              >
                Mint for 8800 OGY
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
