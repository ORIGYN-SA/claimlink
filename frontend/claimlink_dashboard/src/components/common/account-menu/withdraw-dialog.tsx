import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WithdrawDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawDialog({ isOpen, onOpenChange }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")

  const handleTransfer = () => {
    console.log("Transferring", amount, "OGY to", recipientAddress)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[400px] p-0 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999]"
        showCloseButton={false}
      >
        {/* Single container with proper sections */}
        <div className="flex flex-col">
          {/* Main Content Section */}
          <div className="bg-white px-5 pt-5 pb-10">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Title and Description */}
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="text-[#222526] text-2xl font-normal tracking-[1.2px] mb-1">
                  Transfer OGY
                </h2>
                <p className="text-[#69737c] text-sm leading-normal">
                  You can only send OGY from your available balance.
                </p>
              </div>

              {/* Amount Input */}
              <div className="w-full">
                <label className="text-[#6f6d66] text-sm font-medium mb-2 block">
                  Amount
                </label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-[50px] rounded-full border-[#e1e1e1] bg-white px-4"
                />
              </div>

              {/* Recipient Address Input */}
              <div className="w-full">
                <label className="text-[#6f6d66] text-sm font-medium mb-2 block">
                  Recipient Address
                </label>
                <Input
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter recipient address"
                  className="h-[50px] rounded-full border-[#e1e1e1] bg-white px-4"
                />
              </div>
            </div>
          </div>

          {/* Recap Section - No gaps, direct continuation */}
          <div className="bg-white border-t border-[#e1e1e1] px-5 py-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-[#222526] text-base font-medium">
                  Amount
                </h3>
                <p className="text-[#69737c] text-xs">
                  Transaction Fee
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">O</span>
                  </div>
                  <span className="text-[#222526] text-base font-semibold">
                    {amount || "0"} OGY
                  </span>
                </div>
                <p className="text-[#69737c] text-sm">
                  0.002 OGY
                </p>
              </div>
            </div>

            {/* Transfer Button */}
            <Button
              onClick={handleTransfer}
              className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
              disabled={!amount || !recipientAddress}
            >
              Transfer OGY
            </Button>
          </div>

          {/* Current Balance Section - Direct continuation */}
          <div className="bg-[#fcfafa] border-t border-[#e1e1e1] px-4 py-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#69737c] text-xs font-medium uppercase tracking-wide">
                Current balance:
              </span>
              <div className="w-2 h-2 bg-[#615bff] rounded-full flex items-center justify-center">
                <span className="text-white text-[6px] font-bold">O</span>
              </div>
              <span className="text-[#69737c] text-sm font-semibold">
                6,201.50 OGY
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}