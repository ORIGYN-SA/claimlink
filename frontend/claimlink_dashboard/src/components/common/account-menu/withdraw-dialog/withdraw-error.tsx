import { XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import icon from "@/assets/icon.svg"
import type { WithdrawErrorData } from "./types"

interface WithdrawErrorProps {
  data: WithdrawErrorData
  currentBalance: number
  onRetry: () => void
  onClose: () => void
}

export function WithdrawError({
  data,
  currentBalance,
  onRetry,
  onClose,
}: WithdrawErrorProps) {
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

        {/* Error Icon and Title */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full bg-[#fef3f2]" />
            {/* Error icon */}
            <XCircle className="w-[68px] h-[68px] text-[#E84C25]" />
          </div>
          <h2 className="text-[#E84C25] text-2xl font-medium text-center">
            {data.message || "Something went wrong"}
          </h2>
          <p className="text-[#69737c] text-[13px] font-medium text-center w-[353px]">
            Please try again and if the problem persists,{" "}
            <a
              href="mailto:techsupport@origyn.ch"
              className="text-[#69737c] underline hover:text-[#222526]"
            >
              contact us
            </a>
            .
          </p>
        </div>

        {/* Try Again Button */}
        <Button
          onClick={onRetry}
          className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
        >
          Try again
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
