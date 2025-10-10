
import { Button } from '@/components/ui/button'

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

interface CampaignStatsProps {
  campaign: Campaign
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Statistics Card */}
      <div className="bg-white border border-[#e1e1e1] rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21M8 21H16M8 21L6 21M16 21L18 21"
                  stroke="#69737c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#69737c]">Statistics</span>
          </div>
          <div className="w-3 h-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="m12 6 0 6 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[13px] text-[#84818a]">Total NFTs</span>
            <span className="text-[14px] font-semibold text-[#2e2c34]">100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-[#84818a]">Claimed</span>
            <span className="text-[14px] font-semibold text-[#2e2c34]">52</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-[#84818a]">NFT left</span>
            <span className="text-[14px] font-semibold text-[#2e2c34]">48</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-[#84818a]">Scanned</span>
            <span className="text-[14px] font-semibold text-[#2e2c34]">209</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 h-14 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">Download report</span>
              <div className="w-4 h-4 bg-[#222526] rounded flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="flex-1 h-14 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">See claimers</span>
              <div className="w-4 h-4 bg-[#222526] rounded flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Duration Card */}
      <div className="bg-white border border-[#e1e1e1] rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#69737c" strokeWidth="2" />
                <polyline points="12,6 12,12 16,14" stroke="#69737c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#69737c]">Duration</span>
          </div>
          <div className="w-3 h-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="m12 6 0 6 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[13px] text-[#84818a]">Status</span>
            <span className="text-[14px] font-semibold text-[#2e2c34]">Active</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-[13px] text-[#84818a]">Start date</span>
            <div className="text-right">
              <div className="text-[14px] font-semibold text-[#222526]">11.04.2024</div>
              <div className="text-[13px] text-[#84818a]">18:00</div>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-[13px] text-[#84818a]">End date</span>
            <div className="text-right">
              <div className="text-[14px] font-semibold text-[#222526]">31.04.2024</div>
              <div className="text-[13px] text-[#84818a]">23:59</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 h-14 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">Pause</span>
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                </svg>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="flex-1 h-14 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">Close</span>
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Share Link Card */}
      <div className="bg-white border border-[#e1e1e1] rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13Z" stroke="#69737c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 13H14M12 11V15" stroke="#69737c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#69737c]">Share your campaign</span>
          </div>
          <div className="w-3 h-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="m12 6 0 6 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-full px-4 py-3 flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-[#615bff]">https://claim.link/6DJ8KK</span>
          <Button variant="ghost" size="sm" className="w-4 h-4 p-0">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 8C16 8.53043 15.7893 9.03914 15.4142 9.41421C15.0391 9.78929 14.5304 10 14 10H10C9.46957 10 8.96086 9.78929 8.58579 9.41421C8.21071 9.03914 8 8.53043 8 8C8 7.46957 8.21071 6.96086 8.58579 6.58579C8.96086 6.21071 9.46957 6 10 6H14C14.5304 6 15.0391 6.21071 15.4142 6.58579C15.7893 6.96086 16 7.46957 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8V12C16 12.5304 15.7893 13.0391 15.4142 13.4142C15.0391 13.7893 14.5304 14 14 14H10C9.46957 14 8.96086 13.7893 8.58579 13.4142C8.21071 13.0391 8 12.5304 8 12V8C8 7.46957 8.21071 6.96086 8.58579 6.58579C8.96086 6.21071 9.46957 6 10 6H14C14.5304 6 15.0391 6.21071 15.4142 6.58579C15.7893 6.96086 16 7.46957 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>

        <Button className="w-full h-14 rounded-xl bg-[#222526]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="white" strokeWidth="2" />
                <path d="M9 9L15 15M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold">Download QR</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
