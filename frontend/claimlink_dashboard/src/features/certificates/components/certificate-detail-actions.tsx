import { useState } from "react";
import { Link2, Info, Pencil, Plus, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TokenStatusBadge } from "@/components/common/token-status-badge";
import type { TokenStatus } from "@/components/common/token-card/token.types";
import { cn } from "@/lib/utils";
import { TransferOwnershipDialog } from "./transfer-ownership";
import type { TransferOwnershipData } from "./transfer-ownership";

interface CertificateDetailActionsProps {
  certificateId: string;
  currentStatus: TokenStatus;
  unclaimedStatus?: boolean;
  shareLink?: string;
  onEditTemplate?: () => void;
  onLogEvent?: () => void;
  onDownloadQR?: () => void;
  onTransferOwnership?: () => void;
  className?: string;
}

export function CertificateDetailActions({
  certificateId,
  currentStatus,
  unclaimedStatus = false,
  shareLink = `https://claim.link/${certificateId}`,
  onEditTemplate,
  onLogEvent,
  onDownloadQR,
  onTransferOwnership,
  className,
}: CertificateDetailActionsProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTransferClick = () => {
    setTransferDialogOpen(true);
  };

  const handleTransfer = async (data: TransferOwnershipData) => {
    // Call the parent callback if provided
    if (onTransferOwnership) {
      await onTransferOwnership();
    }
    // Here you would implement the actual transfer logic
    console.log("Transfer data:", data);
  };

  return (
    <div
      className={cn(
        "flex gap-4 items-stretch w-full",
        className
      )}
    >
      {/* Left Section: Manage Certificate */}
      <div className="flex-1 bg-white border border-[#e1e1e1] rounded-2xl p-4 flex flex-col gap-2">
        {/* Section Title */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Link2 className="w-4 h-4 text-[#69737c]" />
            <p className="text-[13px] font-medium text-[#69737c]">
              Manage your certficate
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-3.5 h-3.5 opacity-50">
                <Info className="w-full h-full text-[#69737c]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage certificate status and template</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Status Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-full">
            <p className="text-[14px] font-medium text-[#69737c] uppercase tracking-[0.7px]">
              Current status:
            </p>
            <div className="flex gap-2 items-center flex-1">
              <TokenStatusBadge status={currentStatus} className="h-8" />
              {unclaimedStatus && (
                <TokenStatusBadge status="Unclaimed" className="h-8" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center w-full">
            {/* Edit Certificate Button */}
            <button
              onClick={onEditTemplate}
              className="flex-1 bg-white rounded-[20px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)] h-14 flex items-center justify-center gap-2.5 pl-6 pr-3 py-3 hover:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.2)] transition-shadow"
            >
              <span className="text-[14px] font-normal text-[#222526]">
                Edit Certificate
              </span>
              <div className="bg-[#222526] rounded-2xl w-8 h-8 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Log New Event Button */}
            <button
              onClick={onLogEvent}
              className="flex-1 bg-white rounded-[20px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)] h-14 flex items-center justify-center gap-2.5 pl-6 pr-3 py-3 hover:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.2)] transition-shadow"
            >
              <span className="text-[14px] font-normal text-[#222526]">
                Log New Event
              </span>
              <div className="bg-[#222526] rounded-2xl w-8 h-8 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Share Certificate */}
      <div className="flex-1 bg-white border border-[#e1e1e1] rounded-2xl p-4 flex flex-col gap-2">
        {/* Section Title */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Link2 className="w-4 h-4 text-[#69737c]" />
            <p className="text-[13px] font-medium text-[#69737c]">
              Share your Certificate
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-3.5 h-3.5 opacity-50">
                <Info className="w-full h-full text-[#69737c]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share certificate via link or QR code</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Link Display */}
        <div className="bg-white border border-[#e8e8e8] rounded-full flex items-center justify-between px-4 py-4 w-full">
          <p className="text-[14px] font-semibold text-[#615bff] flex-1 truncate font-['Manrope',_sans-serif]">
            {shareLink}
          </p>
          <button
            onClick={handleCopyLink}
            className="w-4 h-4 flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            aria-label="Copy link"
          >
            <Copy className={cn(
              "w-full h-full",
              copySuccess ? "text-[#50be8f]" : "text-[#222526]"
            )} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center w-full">
          {/* Download QR Button */}
          <Button
            onClick={onDownloadQR}
            className="flex-1 bg-[#222526] text-white rounded-full h-12 gap-2.5 hover:bg-[#222526]/90 font-semibold text-[14px] font-['DM_Sans',_sans-serif]"
          >
            <QrCode className="w-4 h-4" />
            Download QR
          </Button>

          {/* Transfer Ownership Button */}
          <Button
            onClick={handleTransferClick}
            className="flex-1 bg-[#222526] text-white rounded-full h-12 hover:bg-[#222526]/90 font-semibold text-[14px] font-['DM_Sans',_sans-serif]"
          >
            Transfer ownership
          </Button>
        </div>
      </div>

      {/* Transfer Ownership Dialog */}
      <TransferOwnershipDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        certificateId={certificateId}
        onTransfer={handleTransfer}
      />
    </div>
  );
}

