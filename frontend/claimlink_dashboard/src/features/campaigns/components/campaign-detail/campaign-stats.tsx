import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNavigate } from '@tanstack/react-router'
import { Calendar as CalendarIcon, Clock, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Campaign {
  id: string
  name: string
  imageUrl: string
  claimedCount: number
  totalCount: number
  status: 'Active' | 'Ready' | 'Finished' | 'Draft' | 'Closed'
  description?: string
  companyName?: string
  isVerified?: boolean
  tokenId?: string
}

interface CampaignStatsProps {
  campaign: Campaign
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const navigate = useNavigate()
  const [isEditDateOpen, setIsEditDateOpen] = useState(false)
  const [isCloseCampaignOpen, setIsCloseCampaignOpen] = useState(false)
  const [isReclaimNFTsOpen, setIsReclaimNFTsOpen] = useState(false)
  const [isBurnNFTsOpen, setIsBurnNFTsOpen] = useState(false)
  const [endDate, setEndDate] = useState<Date>(new Date(2024, 3, 31)) // Default: 31.04.2024

  const isClosed = campaign.status === 'Closed'

  const handleSeeClaimers = () => {
    navigate({ to: '/campaigns/$campaigns/claimers', params: { campaigns: campaign.id } })
  }

  const handleSaveEndDate = () => {
    // TODO: Save the end date to backend
    setIsEditDateOpen(false)
  }

  const handleCloseCampaign = () => {
    // TODO: Close the campaign on backend
    console.log('Closing campaign:', campaign.id)
    setIsCloseCampaignOpen(false)
  }

  const handleReclaimNFTs = () => {
    // TODO: Reclaim NFTs on backend
    console.log('Reclaiming NFTs from campaign:', campaign.id)
    setIsReclaimNFTsOpen(false)
  }

  const handleBurnNFTs = () => {
    // TODO: Burn NFTs on backend
    console.log('Burning NFTs from campaign:', campaign.id)
    setIsBurnNFTsOpen(false)
  }

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
          <Button variant="outline" className="flex-1 h-14 rounded-xl shadow-sm" onClick={handleSeeClaimers}>
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
            <span className="text-[14px] font-semibold text-[#2e2c34]">{campaign.status}</span>
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
            <div className="text-right flex items-start gap-2">
              <div>
                <div className="text-[14px] font-semibold text-[#222526]">{format(endDate, 'dd.MM.yyyy')}</div>
                <div className="text-[13px] text-[#84818a]">23:59</div>
              </div>
              {!isClosed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-[#e1e1e1] rounded"
                  onClick={() => setIsEditDateOpen(true)}
                >
                  <Pencil className="h-3 w-3 text-[#69737c]" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {!isClosed ? (
            <>
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
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl shadow-sm"
                onClick={() => setIsCloseCampaignOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">Close</span>
                  <div className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl shadow-sm"
                onClick={() => setIsReclaimNFTsOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">Reclaim NFTs</span>
                  <div className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3 12C3 12 5.5 7 12 7S21 12 21 12 18.5 17 12 17 3 12 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 5V2M12 22V19M5 5L3 3M21 21L19 19M5 19L3 21M21 3L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl shadow-sm"
                onClick={() => setIsBurnNFTsOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">Burn NFTs</span>
                  <div className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M8.5 14.5C8.5 14.5 9.5 13.5 11 13.5C12.5 13.5 13.5 14.5 13.5 14.5M15 9H15.01M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8.23 3.5C7.85 3.9 7.5 4.34 7.19 4.82C5.48 7.26 4.89 10.26 5.56 13.11C6.23 15.96 8.09 18.43 10.69 19.82C11.96 20.45 13.38 20.79 14.82 20.79C16.26 20.79 17.68 20.45 18.95 19.82C19.58 19.5 20.17 19.1 20.69 18.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20.79 10.9C20.69 9.93 20.43 8.98 20.01 8.11C19.21 6.38 17.89 4.95 16.25 4.01C15.43 3.54 14.54 3.2 13.61 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Button>
            </>
          )}
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

      {/* Edit End Date Modal */}
      <Dialog open={isEditDateOpen} onOpenChange={setIsEditDateOpen}>
        <DialogContent className="sm:max-w-[425px] !fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[100]">
          <DialogHeader>
            <DialogTitle>Edit End Date</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#222526]">Select new end date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full rounded-full border-[#e1e1e1] px-4 py-3 h-12 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#69737c]" />
                      {endDate ? format(endDate, "PPP") : <span>DD/MM/YYYY</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#222526]">Time</label>
                <div className="bg-white border border-[#e1e1e1] rounded-full px-4 py-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#69737c]" />
                  <span className="text-[#222526] text-sm">23:59 CEST</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDateOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEndDate}
              className="bg-[#222526] hover:bg-[#061937] rounded-full"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Campaign Modal */}
      <Dialog open={isCloseCampaignOpen} onOpenChange={setIsCloseCampaignOpen}>
        <DialogContent className="sm:max-w-[500px] !fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[100]">
          <DialogHeader>
            <DialogTitle className="text-[#222526]">Close Campaign</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#fef3f2] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#d92d20]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="text-center space-y-2">
                <p className="text-[15px] font-semibold text-[#222526]">
                  Are you sure you want to close this campaign?
                </p>
                <p className="text-[14px] text-[#69737c]">
                  Once closed, users will no longer be able to claim NFTs from this campaign. This action cannot be undone.
                </p>
              </div>

              {/* Campaign Info */}
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#222526]">{campaign.name}</h4>
                    <p className="text-[13px] text-[#69737c]">
                      {campaign.claimedCount} of {campaign.totalCount} claimed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCloseCampaignOpen(false)}
              className="rounded-full flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseCampaign}
              className="bg-[#d92d20] hover:bg-[#b42318] text-white rounded-full flex-1"
            >
              Close Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reclaim NFTs Modal */}
      <Dialog open={isReclaimNFTsOpen} onOpenChange={setIsReclaimNFTsOpen}>
        <DialogContent className="sm:max-w-[500px] !fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[100]">
          <DialogHeader>
            <DialogTitle className="text-[#222526]">Reclaim NFTs</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* Info Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#eff8ff] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#0086c9]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="text-center space-y-2">
                <p className="text-[15px] font-semibold text-[#222526]">
                  Reclaim unclaimed NFTs?
                </p>
                <p className="text-[14px] text-[#69737c]">
                  This will transfer all unclaimed NFTs back to your account. The campaign will remain closed.
                </p>
              </div>

              {/* Campaign Info */}
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#222526]">{campaign.name}</h4>
                    <p className="text-[13px] text-[#69737c]">
                      {campaign.totalCount - campaign.claimedCount} NFTs available to reclaim
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReclaimNFTsOpen(false)}
              className="rounded-full flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReclaimNFTs}
              className="bg-[#0086c9] hover:bg-[#0077b6] text-white rounded-full flex-1"
            >
              Reclaim NFTs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Burn NFTs Modal */}
      <Dialog open={isBurnNFTsOpen} onOpenChange={setIsBurnNFTsOpen}>
        <DialogContent className="sm:max-w-[500px] !fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !z-[100]">
          <DialogHeader>
            <DialogTitle className="text-[#222526]">Burn NFTs</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#fef3f2] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#d92d20]" viewBox="0 0 24 24" fill="none">
                    <path d="M8.5 14.5C8.5 14.5 9.5 13.5 11 13.5C12.5 13.5 13.5 14.5 13.5 14.5M15 9H15.01M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.23 3.5C7.85 3.9 7.5 4.34 7.19 4.82C5.48 7.26 4.89 10.26 5.56 13.11C6.23 15.96 8.09 18.43 10.69 19.82C11.96 20.45 13.38 20.79 14.82 20.79C16.26 20.79 17.68 20.45 18.95 19.82C19.58 19.5 20.17 19.1 20.69 18.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.79 10.9C20.69 9.93 20.43 8.98 20.01 8.11C19.21 6.38 17.89 4.95 16.25 4.01C15.43 3.54 14.54 3.2 13.61 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="text-center space-y-2">
                <p className="text-[15px] font-semibold text-[#222526]">
                  Are you sure you want to burn these NFTs?
                </p>
                <p className="text-[14px] text-[#69737c]">
                  This will permanently destroy all unclaimed NFTs. This action cannot be undone and the NFTs cannot be recovered.
                </p>
              </div>

              {/* Campaign Info */}
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#222526]">{campaign.name}</h4>
                    <p className="text-[13px] text-[#69737c]">
                      {campaign.totalCount - campaign.claimedCount} NFTs will be burned
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsBurnNFTsOpen(false)}
              className="rounded-full flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBurnNFTs}
              className="bg-[#d92d20] hover:bg-[#b42318] text-white rounded-full flex-1"
            >
              Burn NFTs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
