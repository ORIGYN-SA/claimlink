import { Badge } from '@/components/ui/badge';
import type { CampaignStatus } from '../types/campaign.types';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

const statusStyles = {
  Active: 'bg-[#c7f2e0] text-[#50be8f] border-[#c7f2e0]',
  Ready: 'bg-[#ffd4f0] text-[#ff55c5] border-[#ffd4f0]',
  Finished: 'bg-[#ccedff] text-[#00a2f7] border-[#ccedff]',
  Draft: 'bg-[#f0f0f0] text-[#69737c] border-[#e1e1e1]',
};

export function CampaignStatusBadge({ status, className }: CampaignStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`border ${statusStyles[status]} ${className}`}
    >
      {status}
    </Badge>
  );
}
