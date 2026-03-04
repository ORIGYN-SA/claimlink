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

export interface TransferResult {
  transactionIndex: bigint;
  recipientPrincipal: string;
}

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateId?: string;
  currentBalance?: string;
  onTransfer?: (data: TransferOwnershipData) => Promise<TransferResult>;
}

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  currentBalance = "6,201.50 OGY",
  onTransfer,
}: TransferOwnershipDialogProps) {
  const [state, setState] = useState<TransferState>("form");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);

  const handleTransfer = async (data: TransferOwnershipData) => {
    setState("loading");

    try {
      const result = await onTransfer?.(data);
      if (result) {
        setTransferResult(result);
      }
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
    setTransferResult(null);
    onOpenChange(false);
  };

  const handleRetry = () => {
    setState("form");
    setErrorMessage("");
    setTransferResult(null);
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
          <TransferOwnershipSuccess
            onClose={handleClose}
            transactionIndex={transferResult?.transactionIndex.toString()}
            recipientAddress={transferResult?.recipientPrincipal}
          />
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

