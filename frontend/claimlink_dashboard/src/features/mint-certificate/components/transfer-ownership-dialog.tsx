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
    try {
      await onTransfer?.(data);
      setState("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Transfer failed. Please try again."
      );
      setState("error");
    }
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
        className="p-0 gap-0 max-w-[400px] rounded-[20px] border-0 overflow-hidden"
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

