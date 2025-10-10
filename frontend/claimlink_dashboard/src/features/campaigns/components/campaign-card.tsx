import { Badge } from '@/components/ui/badge';
import { CampaignStatusBadge } from './campaign-status-badge';
import type { Campaign, CampaignTimer } from '../types/campaign.types';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: (campaign: Campaign) => void;
  className?: string;
}

// Timer badge component for different timer states
function TimerBadge({ timerText, timerType }: { timerText: string; timerType: CampaignTimer }) {
  const timerStyles = {
    Urgent: 'bg-[#ffe2db] text-[#e84c25]',
    Ongoing: 'bg-[#c7f2e0] text-[#50be8f]',
    'Starting Soon': 'bg-[#ffedf9] text-[#993376]',
    Finished: 'bg-[#fcfafa] text-[#69737c]',
  };

  return (
    <Badge className={`${timerStyles[timerType]} border-0`}>
      {timerText}
    </Badge>
  );
}

export function CampaignCard({ campaign, onClick, className }: CampaignCardProps) {
  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-white box-border content-stretch flex gap-[16px] items-center px-[12px] py-[9px] relative rounded-[16px] ${className}`}
      onClick={() => onClick?.(campaign)}
    >
      {/* Border */}
      <div
        className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[16px]"
        aria-hidden="true"
      />

      {/* Campaign Image - exactly matching template card dimensions */}
      <div className="relative w-[76px] h-[76px] shrink-0">
        <img
          src={campaign.imageUrl}
          alt={campaign.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Campaign Content - matching template card layout */}
      <div className="flex flex-row items-center self-stretch min-w-0 flex-1">
        <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0 min-w-0 flex-1 gap-1">
          {/* Campaign Name */}
          <h3
            className="w-full text-[18px] font-normal text-[#222526] leading-normal truncate"
            title={campaign.name}
          >
            {campaign.name}
          </h3>

          {/* Claimed NFTs Info - similar to certificate count in template */}
          <div className="bg-white box-border flex gap-[4px] items-center px-0 py-[4px] relative rounded-[100px] min-w-0 w-full">
            <div className="opacity-40 relative shrink-0 w-[14px] h-[14px]">
              <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                <path
                  d="M8 0L10.4 5.6L16 8L10.4 10.4L8 16L5.6 10.4L0 8L5.6 5.6L8 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0 font-sans font-medium text-[#061937] text-[10px] uppercase leading-[24px]">
              <span className="truncate">
                {campaign.claimedCount} / {campaign.totalCount} claimed nfts
              </span>
            </div>
          </div>

          {/* Status and Timer Badges */}
          <div className="flex gap-2">
            {campaign.timerText && campaign.timerType && (
              <TimerBadge timerText={campaign.timerText} timerType={campaign.timerType} />
            )}
            <CampaignStatusBadge status={campaign.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
