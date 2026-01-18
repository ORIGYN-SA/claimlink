import { cn } from "@/lib/utils";
import type { BackendCollectionStatus, SimpleCollectionStatus } from "../types/collection.types";

interface StatusConfig {
  text: string;
  className: string;
  dotColor: string;
  dotBorder: string;
}

/**
 * Get display configuration for backend status (detailed view)
 */
function getBackendStatusConfig(status: BackendCollectionStatus): StatusConfig {
  switch (status) {
    case 'Queued':
      return {
        text: 'Queued',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#f59e0b]', // amber
        dotBorder: 'border-[#fde68a]'
      };
    case 'Created':
      return {
        text: 'Creating',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#615bff]', // purple
        dotBorder: 'border-[#dddbff]'
      };
    case 'Installed':
      return {
        text: 'Installing',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#3b82f6]', // blue
        dotBorder: 'border-[#bfdbfe]'
      };
    case 'TemplateUploaded':
      return {
        text: 'Ready',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#50be8f]', // green
        dotBorder: 'border-[#c7f2e0]'
      };
    case 'Failed':
      return {
        text: 'Failed',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#ef4444]', // red
        dotBorder: 'border-[#fecaca]'
      };
    case 'ReimbursingQueued':
      return {
        text: 'Refunding',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#f59e0b]', // amber
        dotBorder: 'border-[#fde68a]'
      };
    case 'QuarantinedReimbursement':
      return {
        text: 'Quarantined',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#ef4444]', // red
        dotBorder: 'border-[#fecaca]'
      };
    case 'Reimbursed':
      return {
        text: 'Refunded',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#6b7280]', // gray
        dotBorder: 'border-[#d1d5db]'
      };
    default:
      return {
        text: status,
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-gray-500',
        dotBorder: 'border-gray-200'
      };
  }
}

/**
 * Get display configuration for simple status (filtering view)
 */
function getSimpleStatusConfig(status: SimpleCollectionStatus | 'all'): StatusConfig {
  switch (status) {
    case 'Active':
      return {
        text: 'Active',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#50be8f]',
        dotBorder: 'border-[#c7f2e0]'
      };
    case 'Inactive':
      return {
        text: 'Inactive',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#ff55c5]',
        dotBorder: 'border-[#ffd4f0]'
      };
    case 'Draft':
      return {
        text: 'Draft',
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-[#615bff]',
        dotBorder: 'border-[#dddbff]'
      };
    default:
      return {
        text: String(status),
        className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
        dotColor: 'bg-gray-500',
        dotBorder: 'border-gray-200'
      };
  }
}

interface CollectionStatusBadgeProps {
  /** Backend status for detailed display */
  backendStatus?: BackendCollectionStatus;
  /** Simple status for backwards compatibility */
  status?: SimpleCollectionStatus | 'all';
  className?: string;
}

/**
 * Display collection status as a badge
 *
 * Prefers `backendStatus` for detailed display (Queued, Creating, Installing, Ready, etc.)
 * Falls back to `status` for simplified display (Active, Inactive, Draft)
 */
export function CollectionStatusBadge({ backendStatus, status, className }: CollectionStatusBadgeProps) {
  // Prefer backend status for detailed display
  const config = backendStatus
    ? getBackendStatusConfig(backendStatus)
    : status
      ? getSimpleStatusConfig(status)
      : getSimpleStatusConfig('Draft');

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-full border border-solid",
      config.className,
      className
    )}>
      <div className={cn(
        "w-2.5 h-2.5 rounded-full border",
        config.dotColor,
        config.dotBorder
      )} />
      <span className="text-[12px] font-medium leading-normal whitespace-nowrap">
        {config.text}
      </span>
    </div>
  );
}
