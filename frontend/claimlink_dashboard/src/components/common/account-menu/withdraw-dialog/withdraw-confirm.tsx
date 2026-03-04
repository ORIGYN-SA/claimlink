import { X, ArrowLeft } from "lucide-react"
import { useAtomValue } from "jotai"
import { Button } from "@/components/ui/button"
import authStateAtom from "@/features/auth/atoms/atoms"
import icon from "@/assets/icon.svg"
import type { WithdrawFormData } from "./types"

interface WithdrawConfirmProps {
  data: WithdrawFormData
  currentBalance: number
  transferFee: number
  onBack: () => void
  onConfirm: () => void
  onClose: () => void
}

export function WithdrawConfirm({
  data,
  currentBalance,
  transferFee,
  onBack,
  onConfirm,
  onClose,
}: WithdrawConfirmProps) {
  const authState = useAtomValue(authStateAtom)
  const { principalId } = authState

  const amount = parseFloat(data.amount)
  const totalDeducted = amount + transferFee

  const truncateAddress = (address: string) => {
    if (address.length <= 40) return address
    return `${address.substring(0, 20)}...${address.substring(address.length - 20)}`
  }

  return (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white px-5 pt-5 pb-10">
        {/* Header with Back and Close */}
        <div className="flex justify-between items-center mb-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-8 h-8 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-[#222526] text-2xl font-normal tracking-[1.2px] mb-1">
            Review Transfer
          </h2>
          <p className="text-[#69737c] text-sm leading-normal">
            Please review your transaction details before confirming
          </p>
        </div>

        {/* Transaction Details Card */}
        <div className="border border-[#e1e1e1] rounded-lg p-4 mb-6">
          {/* Sending Account */}
          <div className="mb-4">
            <div className="text-[#69737c] text-xs font-medium mb-2">
              Sending Account
            </div>
            <div className="text-[#222526] text-sm font-mono break-all">
              {truncateAddress(principalId || "")}
            </div>
          </div>

          <div className="border-b border-dashed border-[#e1e1e1] my-4" />

          {/* Receiving Account */}
          <div className="mb-4">
            <div className="text-[#69737c] text-xs font-medium mb-2">
              Receiving Account
            </div>
            <div className="text-[#222526] text-sm font-mono break-all">
              {truncateAddress(data.recipientAddress)}
            </div>
          </div>

          <div className="border-b border-dashed border-[#e1e1e1] my-4" />

          {/* Amount Breakdown */}
          <div>
            <div className="text-[#69737c] text-xs font-medium mb-3">Total</div>

            <div className="flex flex-col gap-3">
              {/* Amount to Send */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#69737c]">Amount to send</span>
                <div className="flex items-center gap-2">
                  <img src={icon} alt="OGY" className="w-4 h-4" />
                  <span className="text-[#222526] font-semibold">
                    {amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}{" "}
                    OGY
                  </span>
                </div>
              </div>

              {/* Transaction Fee */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#69737c]">Transaction fee</span>
                <div className="flex items-center gap-2">
                  <img src={icon} alt="OGY" className="w-4 h-4" />
                  <span className="text-[#69737c]">
                    {transferFee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}{" "}
                    OGY
                  </span>
                </div>
              </div>

              <div className="border-b border-[#e1e1e1]" />

              {/* Total Deducted */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#222526] font-medium">
                  Total deducted from your balance
                </span>
                <div className="flex items-center gap-2">
                  <img src={icon} alt="OGY" className="w-4 h-4" />
                  <span className="text-[#222526] font-bold">
                    {totalDeducted.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}{" "}
                    OGY
                  </span>
                </div>
              </div>

              {/* Amount Recipient Receives */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#69737c]">Recipient will receive</span>
                <div className="flex items-center gap-2">
                  <img src={icon} alt="OGY" className="w-4 h-4" />
                  <span className="text-[#222526] font-semibold">
                    {amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}{" "}
                    OGY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
        >
          Confirm Transfer
        </Button>
      </div>

      {/* Current Balance Section */}
      <div className="bg-[#fcfafa] border-t border-[#e1e1e1] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#69737c] text-xs font-medium uppercase tracking-wide">
            Current balance:
          </span>
          <img src={icon} alt="logo" className="w-3 h-3" />
          <span className="text-[#69737c] text-sm font-semibold">
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
