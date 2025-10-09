import { useState } from 'react';
import { type Template } from '@/shared/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PreviewDeployStepProps {
  selectedTemplate: Template | null;
  onBack?: () => void;
  onComplete?: () => void;
}

// Template Preview Section Component
function TemplatePreviewSection({ selectedTemplate }: { selectedTemplate: Template | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Image Preview */}
      <div className="space-y-4">
        <div className="aspect-square bg-[#f5f5f5] rounded-lg overflow-hidden">
          {selectedTemplate?.thumbnail ? (
            <img
              src={selectedTemplate.thumbnail}
              alt={selectedTemplate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#69737c]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#e1e1e1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm">Template Preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Information */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-medium text-[#222526]">{selectedTemplate?.name}</h3>
            {selectedTemplate?.metadata?.premium && (
              <Badge variant="secondary" className="bg-[#50be8f] text-white">
                Premium
              </Badge>
            )}
          </div>
          <p className="text-[#69737c] text-sm leading-relaxed">
            {selectedTemplate?.description}
          </p>
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#fcfafa] rounded-lg p-4">
            <p className="text-xs text-[#69737c] uppercase tracking-wide mb-1">Used in</p>
            <p className="text-lg font-semibold text-[#222526]">
              {selectedTemplate?.certificateCount || 0} certificates
            </p>
          </div>
          <div className="bg-[#fcfafa] rounded-lg p-4">
            <p className="text-xs text-[#69737c] uppercase tracking-wide mb-1">Category</p>
            <p className="text-lg font-semibold text-[#222526] capitalize">
              {selectedTemplate?.category}
            </p>
          </div>
        </div>

        {/* Company Info (if available) */}
        {selectedTemplate?.metadata?.company && (
          <div className="bg-[#fcfafa] rounded-lg p-4">
            <p className="text-xs text-[#69737c] uppercase tracking-wide mb-2">Company</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#222526]">
                {selectedTemplate.metadata.company}
              </span>
              {selectedTemplate.metadata.verified && (
                <Badge variant="outline" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Certificate Preview Component
function CertificatePreview() {
  const [activeTab, setActiveTab] = useState('certificate');

  const tabs = [
    { id: 'certificate', label: 'Certificate' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-[#f5f5f5] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#222526] shadow-sm'
                : 'text-[#69737c] hover:text-[#222526]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Certificate Preview Content */}
      <div className="bg-white border border-[#e1e1e1] rounded-lg p-6">
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#222526] mb-2">
                100% Made in Italy Certificate
              </h3>
              <p className="text-[#69737c]">Certificate Preview</p>
            </div>

            {/* Certificate mockup */}
            <div className="relative bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-lg p-8 border-2 border-dashed border-[#e1e1e1]">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-[#50be8f] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">C</span>
                </div>
                <div>
                  <p className="text-sm text-[#69737c] mb-2">Company Name</p>
                  <p className="text-lg font-semibold text-[#222526]">Sample Company</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#69737c]">VAT Number</p>
                    <p className="font-medium text-[#222526]">IT01450040702</p>
                  </div>
                  <div>
                    <p className="text-[#69737c]">Valid Until</p>
                    <p className="font-medium text-[#222526]">18/02/2024</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#e1e1e1]">
                  <p className="text-sm text-[#69737c] mb-2">Certified by</p>
                  <p className="font-medium text-[#222526]">Federitaly</p>
                </div>
                <div className="pt-4">
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="w-32 h-16 border-b border-[#222526] mb-2"></div>
                      <p className="text-sm font-medium text-[#222526]">Carlo Verdone</p>
                      <p className="text-xs text-[#69737c]">President Federitaly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="text-center py-8">
            <p className="text-[#69737c]">About section content will be displayed here</p>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="text-center py-8">
            <p className="text-[#69737c]">Experience section content will be displayed here</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-8">
            <p className="text-[#69737c]">History section content will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PreviewDeployStep({ selectedTemplate, onBack, onComplete }: PreviewDeployStepProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-[#222526]">
          Preview & deploy
        </h1>
        <p className="text-[#69737c]">
          Review your template: {selectedTemplate?.name || 'Untitled Template'}
        </p>
      </div>

      {/* Template Preview Section */}
      <TemplatePreviewSection selectedTemplate={selectedTemplate} />

      {/* Certificate Preview Section */}
      <CertificatePreview />

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8"
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          className="px-8 bg-[#222526] hover:bg-[#333333]"
        >
          Deploy
        </Button>
      </div>
    </div>
  );
}
