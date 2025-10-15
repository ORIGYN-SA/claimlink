import { useState } from "react"
import { X, CheckCircle, Copy, ArrowRight, XCircle } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import icon from "@/assets/icon.svg";

interface WithdrawDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentBalance?: number
}

type DialogState = 'form' | 'processing' | 'success' | 'error'

export function WithdrawDialog({ isOpen, onOpenChange, currentBalance = 0 }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [dialogState, setDialogState] = useState<DialogState>('form')
  const navigate = useNavigate()

  const handleTransfer = () => {
    console.log("Transferring", amount, "OGY to", recipientAddress)
    setDialogState('processing')
    
    // Simulate processing time with random success/error
    setTimeout(() => {
      // Randomly choose success or error for testing
      const isSuccess = Math.random() > 0.3 // 70% success rate
      setDialogState(isSuccess ? 'success' : 'error')
    }, 3000)
  }

  const handleClose = () => {
    onOpenChange(false)
    setDialogState('form')
    setAmount("")
    setRecipientAddress("")
  }

  const renderProcessingState = () => (
    <div className="bg-white border border-[#e1e1e1] rounded-[20px] h-[383px] flex flex-col items-center justify-center px-0 py-8 gap-6">
      {/* Loader */}
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#e1e1e1]" />
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#50BE8F] animate-spin" />
        {/* Inner circle */}
        <div className="w-[116px] h-[116px] bg-[#fcfafa] rounded-full flex items-center justify-center">
          {/* OGY Logo */}
          <div className="w-[43px] h-[42px] flex items-center justify-center">
            <img src={icon} alt="OGY Logo" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-2 text-center">
        <DialogTitle className="text-[#222526] text-2xl font-light tracking-[1.2px] uppercase">
          Processing
        </DialogTitle>
        <DialogDescription className="text-[#69737c] text-[13px] font-normal w-[353px]">
          This can take a few seconds
        </DialogDescription>
      </div>
    </div>
  )

  const renderSuccessState = () => (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-t-[20px] px-5 py-8">
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
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
          <DialogTitle className="text-[#50BE8F] text-2xl font-medium text-center">
            Transfer was successful!
          </DialogTitle>
        </div>

        {/* Transaction Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#69737c] text-base font-medium">Index:</span>
            <span className="text-[#222526] text-lg font-semibold">186876</span>
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
                  07537100b32fb7...6f6241e44b155e4c
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
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
                  {amount || "0"} OGY
                </span>
              </div>
              <p className="text-[#69737c] text-xs font-medium">0.002 OGY</p>
            </div>
          </div>
        </div>

        {/* Go to Transaction History Button */}
        <Button
          onClick={() => {
            handleClose()
            navigate({ to: '/account/transaction-history' })
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
            })} OGY
          </span>
        </div>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-t-[20px] px-5 py-8">
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
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
          <DialogTitle className="text-[#E84C25] text-2xl font-medium text-center">
            Something went wrong
          </DialogTitle>
          <DialogDescription className="text-[#69737c] text-[13px] font-medium text-center w-[353px]">
            Please try again and if the problem persist,{" "}
            <a 
              href="mailto:techsupport@origyn.ch" 
              className="text-[#69737c] underline hover:text-[#222526]"
            >
              contact us
            </a>
            .
          </DialogDescription>
        </div>

        {/* Try Again Button */}
        <Button
          onClick={() => {
            setDialogState('form')
          }}
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
            })} OGY
          </span>
        </div>
      </div>
    </div>
  )

  const renderFormState = () => (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white px-5 pt-5 pb-10">
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <DialogTitle className="text-[#222526] text-2xl font-normal tracking-[1.2px] mb-1">
              Transfer OGY
            </DialogTitle>
            <DialogDescription className="text-[#69737c] text-sm leading-normal">
              You can only send OGY from your available balance.
            </DialogDescription>
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

      {/* Recap Section */}
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
              <img src={icon} alt="logo" className="w-4 h-4" />
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
            })} OGY
          </span>
        </div>
      </div>
    </div>
  )

  const renderCurrentState = () => {
    switch (dialogState) {
      case 'processing':
        return renderProcessingState()
      case 'success':
        return renderSuccessState()
      case 'error':
        return renderErrorState()
      default:
        return renderFormState()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[400px] p-0 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999]"
        showCloseButton={false}
      >
        {renderCurrentState()}
      </DialogContent>
    </Dialog>
  )
}