import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  TransferOwnershipData,
  TransferType,
} from "./transfer-ownership-dialog";

interface TransferOwnershipFormProps {
  currentBalance: string;
  onTransfer: (data: TransferOwnershipData) => void;
}

export function TransferOwnershipForm({
  currentBalance,
  onTransfer,
}: TransferOwnershipFormProps) {
  const [type, setType] = useState<TransferType>("wallet");
  const [principalId, setPrincipalId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer({ type, principalId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Top Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-tl-[20px] rounded-tr-[20px] flex flex-col gap-[40px] items-center justify-center pt-[32px] pb-[40px] px-[20px]">
        {/* Title */}
        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <h2 className="font-['General_Sans',sans-serif] font-medium text-[24px] leading-[32px] text-[#222526] text-center whitespace-nowrap">
            Transfer Ownership
          </h2>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-[24px] items-center justify-center w-full">
          {/* Type Select */}
          <div className="flex flex-col gap-2 items-start justify-center w-full">
            <label
              htmlFor="transfer-type"
              className="font-['General_Sans',sans-serif] font-medium text-[13px] leading-normal text-[#69737c]"
            >
              Type
            </label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TransferType)}
            >
              <SelectTrigger
                id="transfer-type"
                className="w-full h-[50px] bg-white border border-[#e1e1e1] rounded-full px-4 font-['DM_Sans',sans-serif] font-semibold text-[14px] text-[#222526] focus:ring-2 focus:ring-[#222526] focus:border-[#222526]"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Principal ID Input */}
          <div className="flex flex-col gap-2 items-start justify-center w-full">
            <label
              htmlFor="principal-id"
              className="font-['General_Sans',sans-serif] font-medium text-[13px] leading-normal text-[#69737c]"
            >
              Principal ID
            </label>
            <Input
              id="principal-id"
              type="text"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              placeholder=""
              className="w-full h-[50px] bg-white border border-[#e1e1e1] rounded-full px-4 font-['DM_Sans',sans-serif] text-[14px] text-[#222526] focus:ring-2 focus:ring-[#222526] focus:border-[#222526]"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-[48px] bg-[#222526] text-white rounded-full px-[25px] font-['DM_Sans',sans-serif] font-semibold text-[14px] leading-[48px] hover:bg-[#222526]/90 transition-colors"
        >
          Transfer Certificate
        </Button>
      </div>

      {/* Bottom Section - Current Balance */}
      <div className="bg-[#fcfafa] border-l border-r border-b border-[#e1e1e1] rounded-bl-[16px] rounded-br-[16px] flex gap-2 items-center justify-center p-4">
        <div className="flex gap-2 items-center justify-center">
          <div className="flex gap-[5px] items-center justify-end">
            <p className="font-['General_Sans',sans-serif] font-medium text-[10px] leading-[24px] text-[#69737c] uppercase tracking-wide">
              Current balance:
            </p>
            <div className="w-[8.25px] h-2 flex items-center justify-center">
              <svg
                width="9"
                height="8"
                viewBox="0 0 9 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.25 4C8.25 6.07107 6.57107 7.75 4.5 7.75C2.42893 7.75 0.75 6.07107 0.75 4C0.75 1.92893 2.42893 0.25 4.5 0.25C6.57107 0.25 8.25 1.92893 8.25 4Z"
                  fill="#615BFF"
                />
              </svg>
            </div>
            <p className="font-['General_Sans',sans-serif] font-semibold text-[12px] leading-normal text-[#69737c] whitespace-nowrap">
              {currentBalance}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
