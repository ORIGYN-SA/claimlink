import { CheckCircle, Copy, ArrowRight, X } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import icon from "@/assets/icon.svg"
import type { WithdrawSuccessData } from "./types"
import { useCopyToClipboard } from "@/shared/hooks"

interface WithdrawSuccessProps {
  data: WithdrawSuccessData
  currentBalance: number
  onClose: () => void
}

export function WithdrawSuccess({
  data,
  currentBalance,
  onClose,
}: WithdrawSuccessProps) {
  const navigate = useNavigate()
  const { copyToClipboard } = useCopyToClipboard()

  const handleCopyAddress = () => {
    copyToClipboard(data.recipientAddress)
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 30) return address
    return `${address.substring(0, 14)}...${address.substring(address.length - 14)}`
  }

  return (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-t-[20px] px-5 py-8">
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Success Icon and Title */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full bg-[#c7f2e0]" />
            {/* Success icon */}
            <CheckCircle className="w-[68px] h-[68px] text-[#50BE8F]" />
          </div>
          <h2 className="text-[#50BE8F] text-2xl font-medium text-center">
            Transfer was successful!
          </h2>
        </div>

        {/* Transaction Details */}
        {data.transactionIndex && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#69737c] text-base font-medium">
                Index:
              </span>
              <span className="text-[#222526] text-lg font-semibold">
                {data.transactionIndex}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#e1e1e1] rounded-full px-2 py-1">
              <ArrowRight className="w-4 h-4 text-[#69737c]" />
              <span className="text-[#69737c] text-xs font-bold">Transfer</span>
              <div className="bg-[#c7f2e0] px-2 py-0.5 rounded-full">
                <span className="text-[#061937] text-[10px] font-medium uppercase tracking-[0.5px]">
                  completed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recipient Address */}
        <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full px-1 py-2 mb-4">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-[39px] h-[39px] bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-[#222526] text-xs font-bold">IC</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#69737c] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">C</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-[#69737c] font-normal">Sent to: </span>
                <span className="text-[#222526] font-bold text-xs">
                  {truncateAddress(data.recipientAddress)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAddress}
              className="w-4 h-4 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Amount and Fee */}
        <div className="border-t border-[#e1e1e1] pt-2 mb-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h3 className="text-[#222526] text-base font-semibold">Amount</h3>
              <p className="text-[#69737c] text-xs font-medium">Fee</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <img src={icon} alt="logo" className="w-4 h-4" />
                <span className="text-[#222526] text-base font-semibold">
                  {data.amount} OGY
                </span>
              </div>
              <p className="text-[#69737c] text-xs font-medium">
                {data.fee} OGY
              </p>
            </div>
          </div>
        </div>

        {/* Go to Transaction History Button */}
        <Button
          onClick={() => {
            onClose()
            navigate({ to: "/account/transaction-history" })
          }}
          className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
        >
          Go to transaction history
        </Button>
      </div>

      {/* Current Balance Section */}
      <div className="bg-[#fcfafa] border-x border-b border-[#e1e1e1] rounded-b-[20px] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#69737c] text-[10px] font-medium uppercase tracking-wide">
            Current balance:
          </span>
          <img src={icon} alt="logo" className="w-2 h-2" />
          <span className="text-[#69737c] text-xs font-semibold">
            {currentBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            OGY
          </span>
        </div>
      </div>
    </div>
  )
}
