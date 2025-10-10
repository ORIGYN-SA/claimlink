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

interface CampaignContentProps {
  campaign: Campaign
}

export function CampaignContent({ campaign }: CampaignContentProps) {
  return (
    <div className="space-y-6">
      {/* Campaign Image */}
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={campaign.name}
          className="w-full h-[443px] object-cover rounded-lg"
        />
      </div>

      {/* Campaign Description */}
      <div className="space-y-4">
        {/* Header with company name and verified badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[23px] font-normal text-[#222526] leading-6">
              {campaign.companyName || 'UEFA'}
            </h2>
            {campaign.isVerified && (
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="#061937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Certificate badge */}
          <div className="flex items-center gap-2 bg-[#ffedf9] px-3 py-2 rounded-lg">
            <div className="w-3 h-3">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  fill="#993376"
                />
              </svg>
            </div>
            <span className="text-[14px] font-medium text-[#993376]">ORIGYN</span>
          </div>
        </div>

        {/* Campaign Title */}
        <h1 className="text-[32px] font-normal text-[#222526] leading-10">
          {campaign.name}
        </h1>

        {/* Campaign Description */}
        <p className="text-[16px] font-normal text-[#69737c] leading-6">
          {campaign.description}
        </p>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-4 bg-[#f0f0f0] rounded-full">
              <div
                className="h-full bg-[#615bff] rounded-full transition-all duration-300"
                style={{ width: `${(campaign.claimedCount / campaign.totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Progress text */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#69737c]">
              {campaign.claimedCount} / {campaign.totalCount} claimed NFTs
            </span>
          </div>
        </div>

        {/* Stamp/Verification Section */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            {/* Issued by stamp placeholder */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="text-[12px] text-[#69737c]">
                <div>issued by</div>
                <div className="font-medium">Federitaly</div>
              </div>
            </div>
          </div>

          {/* Action button placeholder */}
          <button className="bg-[#615bff] text-white px-6 py-3 rounded-xl text-[14px] font-medium">
            Claim Certificate
          </button>
        </div>
      </div>
    </div>
  )
}
