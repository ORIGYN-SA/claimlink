import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransferOwnershipForm } from "./transfer-ownership-form";
import { TransferOwnershipLoading } from "./transfer-ownership-loading";
import { TransferOwnershipSuccess } from "./transfer-ownership-success";
import { TransferOwnershipError } from "./transfer-ownership-error";

export type TransferType = "wallet" | "principal";

export interface TransferOwnershipData {
  type: TransferType;
  principalId: string;
}

export type TransferState = "form" | "loading" | "success" | "error";

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateId?: string;
  currentBalance?: string;
  onTransfer?: (data: TransferOwnershipData) => Promise<void>;
}

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  currentBalance = "6,201.50 OGY",
  onTransfer,
}: TransferOwnershipDialogProps) {
  const [state, setState] = useState<TransferState>("form");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleTransfer = async (data: TransferOwnershipData) => {
    setState("loading");
    
    // Simulate processing time with random success/error (matching withdraw-dialog behavior)
    setTimeout(() => {
      try {
        // Randomly choose success or error for testing (70% success rate)
        const isSuccess = Math.random() > 0.3;
        
        if (isSuccess) {
          // Call the parent callback if provided
          onTransfer?.(data);
          setState("success");
        } else {
          throw new Error("Transfer failed. Please try again.");
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Transfer failed. Please try again."
        );
        setState("error");
      }
    }, 3000); // 3 second delay matching withdraw-dialog
  };

  const handleClose = () => {
    // Reset state when closing
    setState("form");
    setErrorMessage("");
    onOpenChange(false);
  };

  const handleRetry = () => {
    setState("form");
    setErrorMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[400px] p-0 gap-0 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999]"
        showCloseButton={false}
      >
        {/* Custom Close Button */}
        <DialogClose
          className={cn(
            "absolute top-[32px] right-[20px] z-10",
            "w-6 h-6 flex items-center justify-center",
            "rounded-sm opacity-70 hover:opacity-100",
            "transition-opacity",
            "focus:outline-none focus:ring-2 focus:ring-[#222526] focus:ring-offset-2"
          )}
        >
          <X className="w-[14px] h-[14px] text-[#222526]" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Content Based on State */}
        {state === "form" && (
          <TransferOwnershipForm
            currentBalance={currentBalance}
            onTransfer={handleTransfer}
          />
        )}

        {state === "loading" && <TransferOwnershipLoading />}

        {state === "success" && (
          <TransferOwnershipSuccess onClose={handleClose} />
        )}

        {state === "error" && (
          <TransferOwnershipError
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

