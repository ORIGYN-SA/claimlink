import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ImageUploadSection } from '@/components/common/image-upload-section';
import { CsvUploadSection } from '@/components/common/csv-upload-section';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Collection } from '@/features/collections/types/collection.types';
import type { CampaignFormData } from '../types/campaign.types';
import icon from "@/assets/icon.svg";

interface ConfigureCampaignStepProps {
  // Data
  selectedCollection: Collection | null;
  formData: CampaignFormData;
  isLoading: boolean;
  coverImagePreview: string | null;
  coverImageInputRef: React.RefObject<HTMLInputElement | null>;
  whitelistCsvFileName: string | null;
  whitelistCsvInputRef: React.RefObject<HTMLInputElement | null>;
  whitelistAddresses: string[];
  whitelistInput: string;
  redirectUrl: string;
  
  // Handlers
  onFormChange: (field: keyof CampaignFormData, value: string | number) => void;
  onCoverImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverImageRemove: () => void;
  onCoverImageUploadClick: () => void;
  onWhitelistCsvSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onWhitelistCsvRemove: () => void;
  onWhitelistCsvUploadClick: () => void;
  onWhitelistInputChange: (value: string) => void;
  onAddToWhitelist: () => void;
  onRedirectUrlChange: (value: string) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

/**
 * DUMB COMPONENT - Pure presentation
 * Receives all data and handlers via props
 * No state management, no side effects, no API calls
 */
export function ConfigureCampaignStep({
  selectedCollection,
  formData,
  isLoading,
  coverImagePreview,
  coverImageInputRef,
  whitelistCsvFileName,
  whitelistCsvInputRef,
  whitelistAddresses,
  whitelistInput,
  redirectUrl,
  onFormChange,
  onCoverImageSelect,
  onCoverImageRemove,
  onCoverImageUploadClick,
  onWhitelistCsvSelect,
  onWhitelistCsvRemove,
  onWhitelistCsvUploadClick,
  onWhitelistInputChange,
  onAddToWhitelist,
  onRedirectUrlChange,
  onBack,
  onSubmit,
}: ConfigureCampaignStepProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [redirectEnabled, setRedirectEnabled] = useState(false);
  const [claimMethod, setClaimMethod] = useState<'multi-scan' | 'unique-links'>('multi-scan');
  const [redirectMethod, setRedirectMethod] = useState<'custom' | 'default'>('custom');

  if (!selectedCollection) {
    return (
      <div className="bg-white border border-[var(--mouse)] rounded-[16px] p-[40px] text-center">
        <p className="text-[var(--slate)] mb-4">No collection selected</p>
        <Button onClick={onBack} variant="outline">Go Back</Button>
      </div>
    );
  }

  const isFormValid = formData.name.trim().length > 0;

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
                  onChange={(e) => onFormChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                  className="rounded-full"
                />
              </div>

              {/* Image Uploader */}
              <ImageUploadSection
                previewUrl={coverImagePreview}
                onFileSelect={onCoverImageSelect}
                onRemove={onCoverImageRemove}
                onUploadClick={onCoverImageUploadClick}
                fileInputRef={coverImageInputRef}
                uploadText="Upload your Cover or drag it here"
                acceptedFormats="JPEG, PNG, SVG, PDF"
              />

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--charcoal)]">Start date</label>
                  <div className="bg-white border border-[var(--mouse)] rounded-full px-4 py-3 h-12 flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 flex-1 text-left">
                          <CalendarIcon className="h-4 w-4 text-[var(--slate)]" />
                          <span className={cn(
                            "text-sm",
                            startDate ? "text-[var(--charcoal)]" : "text-muted-foreground"
                          )}>
                            {startDate ? format(startDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="h-6 w-px bg-[var(--mouse)]"></div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--slate)]" />
                      <span className="text-[var(--charcoal)] text-sm">HH:MM CEST</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--charcoal)]">End date</label>
                  <div className="bg-white border border-[var(--mouse)] rounded-full px-4 py-3 h-12 flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 flex-1 text-left">
                          <CalendarIcon className="h-4 w-4 text-[var(--slate)]" />
                          <span className={cn(
                            "text-sm",
                            endDate ? "text-[var(--charcoal)]" : "text-muted-foreground"
                          )}>
                            {endDate ? format(endDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="h-6 w-px bg-[var(--mouse)]"></div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--slate)]" />
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
                  onChange={(e) => onFormChange('maxClaims', Number(e.target.value))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={cn(
                      "bg-white cursor-pointer transition-all",
                      claimMethod === 'multi-scan' 
                        ? "border-2 border-[var(--jade)]" 
                        : "border border-[var(--mouse)] hover:border-[var(--jade)]"
                    )}
                    onClick={() => setClaimMethod('multi-scan')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-[76px] h-[76px] rounded-lg flex items-center justify-center flex-shrink-0",
                          claimMethod === 'multi-scan' 
                            ? "bg-[var(--jade-90)]" 
                            : "bg-[var(--paper)] border border-[var(--mouse)]"
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded",
                            claimMethod === 'multi-scan' 
                              ? "bg-[var(--jade)]" 
                              : "bg-[var(--slate)] opacity-50"
                          )}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--charcoal)] text-base md:text-lg mb-1">Multi-scan QR Code</h3>
                          <p className="text-xs md:text-sm text-[var(--slate)] mb-1">One QR code for multiple users.</p>
                          <p className="text-xs md:text-sm text-[var(--slate)]">Ideal for events and screens.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={cn(
                      "bg-white cursor-pointer transition-all",
                      claimMethod === 'unique-links' 
                        ? "border-2 border-[var(--jade)]" 
                        : "border border-[var(--mouse)] hover:border-[var(--jade)]"
                    )}
                    onClick={() => setClaimMethod('unique-links')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-[76px] h-[76px] rounded-lg flex items-center justify-center flex-shrink-0",
                          claimMethod === 'unique-links' 
                            ? "bg-[var(--jade-90)]" 
                            : "bg-[var(--paper)] border border-[var(--mouse)]"
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded",
                            claimMethod === 'unique-links' 
                              ? "bg-[var(--jade)]" 
                              : "bg-[var(--slate)] opacity-50"
                          )}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--charcoal)] text-base md:text-lg mb-1">Unique Claim Links</h3>
                          <p className="text-xs md:text-sm text-[var(--slate)] mb-1">One NFT per unique URL.</p>
                          <p className="text-xs md:text-sm text-[var(--slate)]">Ideal for 1:1 distribution.</p>
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
                  onChange={(e) => onFormChange('description', e.target.value)}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-[22px] font-semibold text-[var(--charcoal)] mb-2">
                  Whitelist set up <span className="text-[var(--slate)] text-base sm:text-lg font-normal">(Optional)</span>
                </h3>
                <p className="text-sm text-[var(--slate)]">
                  Limit access to your campaign by allowing only selected email addresses or Principal IDs to claim the NFT/certificate.
                </p>
              </div>
              <Switch
                checked={whitelistEnabled}
                onCheckedChange={setWhitelistEnabled}
                className="data-[state=checked]:bg-[var(--jade)]"
              />
            </div>

            {whitelistEnabled && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      value={whitelistInput}
                      onChange={(e) => onWhitelistInputChange(e.target.value)}
                      placeholder="Enter a wallet address or an email"
                      className="rounded-full"
                    />
                  </div>
                  <Button
                    onClick={onAddToWhitelist}
                    disabled={!whitelistInput.trim()}
                    className="bg-[var(--charcoal)] hover:bg-[var(--cobalt)] rounded-full px-6 whitespace-nowrap"
                  >
                    add to whitelist
                  </Button>
                </div>

              {/* Show addresses if manually added */}
              {whitelistAddresses.length > 0 && !whitelistCsvFileName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--charcoal)]">Recipients addresses</label>
                  <div className="bg-[var(--paper)] border border-[var(--mouse)] rounded-lg p-4">
                    <div className="text-sm text-[var(--slate)] font-mono break-all">
                      {whitelistAddresses.map((address, index) => (
                        <div key={index}>
                          {address}
                          {index < whitelistAddresses.length - 1 && <br />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

                {/* CSV Uploader */}
                <CsvUploadSection
                  fileName={whitelistCsvFileName}
                  onFileSelect={onWhitelistCsvSelect}
                  onRemove={onWhitelistCsvRemove}
                  onUploadClick={onWhitelistCsvUploadClick}
                  fileInputRef={whitelistCsvInputRef}
                  uploadText="Upload your sheet"
                  acceptedFormats="CSV"
                  displayedAddresses={whitelistCsvFileName ? whitelistAddresses : []}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom URL Section */}
        <Card className="bg-white border border-[var(--mouse)] rounded-[25px]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-[22px] font-semibold text-[var(--charcoal)] mb-2">
                  Post campaign redirection <span className="text-[var(--slate)] text-base sm:text-lg font-normal">(Optional)</span>
                </h3>
                <p className="text-sm text-[var(--slate)]">
                  Choose where users are sent after the campaign ends, so they don't land on an expired link page.
                </p>
              </div>
              <Switch
                checked={redirectEnabled}
                onCheckedChange={setRedirectEnabled}
                className="data-[state=checked]:bg-[var(--jade)]"
              />
            </div>

            {redirectEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={cn(
                      "bg-white cursor-pointer transition-all",
                      redirectMethod === 'custom' 
                        ? "border-2 border-[var(--jade)]" 
                        : "border border-[var(--mouse)] hover:border-[var(--jade)]"
                    )}
                    onClick={() => setRedirectMethod('custom')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-[54px] h-[54px] rounded-lg flex items-center justify-center flex-shrink-0",
                          redirectMethod === 'custom' 
                            ? "bg-[var(--jade-90)]" 
                            : "bg-[var(--paper)] border border-[var(--mouse)]"
                        )}>
                          <div className={cn(
                            "w-6 h-6 rounded",
                            redirectMethod === 'custom' 
                              ? "bg-[var(--jade)]" 
                              : "bg-[var(--slate)] opacity-50"
                          )}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[var(--charcoal)] text-base md:text-lg mb-1">Custom URL</h4>
                          <p className="text-xs md:text-sm text-[var(--slate)]">Be redirected to a custom URL (e.g., your website)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={cn(
                      "bg-white cursor-pointer transition-all",
                      redirectMethod === 'default' 
                        ? "border-2 border-[var(--jade)]" 
                        : "border border-[var(--mouse)] hover:border-[var(--jade)]"
                    )}
                    onClick={() => setRedirectMethod('default')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-[54px] h-[54px] rounded-lg flex items-center justify-center flex-shrink-0",
                          redirectMethod === 'default' 
                            ? "bg-[var(--jade-90)]" 
                            : "bg-[var(--paper)] border border-[var(--mouse)]"
                        )}>
                          <div className={cn(
                            "w-6 h-6 rounded",
                            redirectMethod === 'default' 
                              ? "bg-[var(--jade)]" 
                              : "bg-[var(--slate)] opacity-50"
                          )}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[var(--charcoal)] text-base md:text-lg mb-1">Default message</h4>
                          <p className="text-xs md:text-sm text-[var(--slate)]">"This campaign has ended."</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--charcoal)]">Redirect link</label>
                  <Input
                    value={redirectUrl}
                    onChange={(e) => onRedirectUrlChange(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="rounded-full"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 rounded-full"
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid || isLoading}
            className="flex-1 bg-[var(--space-purple)] hover:bg-[var(--cobalt)] rounded-full"
          >
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <Card className="bg-white border border-[var(--mouse)] rounded-[25px] lg:sticky lg:top-6 h-fit">
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
                  <img src={icon} className="w-5 h-5" alt="logo" />
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
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full bg-[var(--mouse)] text-[var(--charcoal)] hover:bg-[var(--mouse)]"
              >
                Save draft
              </Button>
              <Button
                className="flex-1 bg-[var(--charcoal)] hover:bg-[var(--cobalt)] rounded-full whitespace-nowrap"
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
