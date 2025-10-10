import { useState } from 'react'

interface Campaign {
  id: string
  name: string
  imageUrl: string
  claimedCount: number
  totalCount: number
  status: 'Active' | 'Ready' | 'Finished' | 'Draft'
  description?: string
  companyName?: string
  isVerified?: boolean
  tokenId?: string
}

interface CertificateDisplayProps {
  campaign: Campaign
}

export function CertificateDisplay({ campaign }: CertificateDisplayProps) {
  const [activeTab, setActiveTab] = useState<'certificate' | 'about' | 'experience' | 'history'>('certificate')

  const tabs = [
    { id: 'certificate', label: 'Certificate', active: activeTab === 'certificate' },
    { id: 'about', label: 'About', active: activeTab === 'about' },
    { id: 'experience', label: 'Experience', active: activeTab === 'experience' },
    { id: 'history', label: 'History', active: activeTab === 'history' },
  ]

  return (
    <div className="bg-[#222526] rounded-lg overflow-hidden">
      {/* Navigation Tabs */}
      <div className="bg-[#2e3233] border-b border-[#434849] p-1">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                tab.active
                  ? 'bg-[#fcfafa] text-[#061937]'
                  : 'text-[#e1e1e1] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-8">
        {/* Certificate Background */}
        <div className="relative bg-white rounded-lg p-8 min-h-[600px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
          </div>

          {/* Certificate Header */}
          <div className="relative z-10 flex justify-between items-start mb-8">
            {/* Company Logo */}
            <div className="w-[100px] h-[50px] bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">LOGO</span>
            </div>

            {/* Token ID */}
            <div className="text-right">
              <div className="text-[12px] text-gray-500 uppercase tracking-wider">token id</div>
              <div className="text-[16px] font-semibold text-gray-800">{campaign.tokenId || 'x491nd74n9'}</div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-light text-gray-800 tracking-[8px] uppercase">
              100% made in italy certificate
            </h1>
          </div>

          {/* Certificate Content */}
          <div className="space-y-8">
            {/* Company Name */}
            <div className="text-center">
              <div className="text-[14px] text-gray-500 uppercase tracking-[2px] mb-2">company name</div>
              <div className="text-[64px] font-light text-gray-800 leading-none">
                Cusco
              </div>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-[14px] text-gray-500 uppercase tracking-[2px] mb-2">VAT number</div>
                <div className="text-[20px] font-medium text-gray-800">IT01450040702</div>
              </div>
              <div className="text-center">
                <div className="text-[14px] text-gray-500 uppercase tracking-[2px] mb-2">Certification valid until</div>
                <div className="text-[20px] font-medium text-gray-800">18/02/2024</div>
              </div>
              <div className="text-center col-span-2">
                <div className="text-[14px] text-gray-500 uppercase tracking-[2px] mb-2">certified by</div>
                <div className="text-[20px] font-medium text-gray-800">Federitaly</div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex items-center justify-between max-w-2xl mx-auto pt-8 border-t border-gray-300">
              {/* Signature */}
              <div className="flex flex-col items-center">
                <div className="w-[200px] h-[60px] bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-400 italic">Signature</span>
                </div>
                <div className="text-center">
                  <div className="text-[18px] font-medium text-gray-800">CARLO VERDONE</div>
                  <div className="text-[12px] text-gray-500 uppercase tracking-[2px]">President Federitaly</div>
                </div>
              </div>

              {/* Official Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-[100px] h-[100px] bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center">STAMP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
