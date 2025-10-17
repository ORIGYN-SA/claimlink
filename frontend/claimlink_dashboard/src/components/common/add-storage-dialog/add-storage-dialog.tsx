import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import icon from "@/assets/icon.svg";

export interface AddStorageDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentBalance?: number
  currentStorage?: {
    used: string
    total: string
    percentage: number
  }
}

type DialogState = 'form' | 'processing' | 'success'

export function AddStorageDialog({ 
  isOpen, 
  onOpenChange, 
  currentBalance = 0,
  currentStorage = { used: '1.92', total: '2.0', percentage: 96 }
}: AddStorageDialogProps) {
  const navigate = useNavigate()
  const [storageAmount, setStorageAmount] = useState("")
  const [dialogState, setDialogState] = useState<DialogState>('form')

  // Calculate pricing (example: 1GB = 100 OGY)
  const pricePerGB = 100
  const totalPrice = storageAmount ? parseFloat(storageAmount) * pricePerGB : 0
  const priceInUSD = totalPrice * 0.01072 // 1 OGY = 0.01072 USD

  const handleAddStorage = () => {
    console.log("Adding", storageAmount, "GB storage for", totalPrice, "OGY")
    setDialogState('processing')
    
    // Simulate processing time
    setTimeout(() => {
      setDialogState('success')
    }, 3000)
  }

  const handleClose = () => {
    onOpenChange(false)
    setDialogState('form')
    setStorageAmount("")
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
            Storage added successfully!
          </DialogTitle>
        </div>

        {/* Transaction Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#69737c] text-base font-medium">Index:</span>
            <span className="text-[#222526] text-lg font-semibold">186877</span>
          </div>
          <div className="flex items-center gap-1 bg-white border border-[#e1e1e1] rounded-full px-2 py-1">
            <span className="text-[#69737c] text-xs font-bold">Storage</span>
            <div className="bg-[#c7f2e0] px-2 py-0.5 rounded-full">
              <span className="text-[#061937] text-[10px] font-medium uppercase tracking-[0.5px]">
                completed
              </span>
            </div>
          </div>
        </div>

        {/* Storage Details */}
        <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full px-1 py-2 mb-4">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-[39px] h-[39px] bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-[#222526] text-xs font-bold">SC</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#69737c] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">S</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-[#69737c] font-normal">Added: </span>
                <span className="text-[#222526] font-bold text-xs">
                  {storageAmount} GB storage
                </span>
              </div>
            </div>
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
                  {totalPrice} OGY
                </span>
              </div>
              <p className="text-[#69737c] text-xs font-medium">0.002 OGY</p>
            </div>
          </div>
        </div>

        {/* Go to Collections Button */}
        <Button
          onClick={() => {
            handleClose()
            navigate({ to: '/collections' })
          }}
          className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
        >
          Go to collections
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
            {(currentBalance - totalPrice).toLocaleString(undefined, {
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
            <DialogTitle className="text-[#222526] text-2xl font-semibold mb-2">
              Add more storage
            </DialogTitle>
            <DialogDescription className="text-[#69737c] text-sm leading-normal">
              Fusce ultricies nibh ac magna molestie tempor. Pellentesque molestie ante ut orci venenatis, sit amet.
            </DialogDescription>
          </div>

          {/* Current Storage Warning */}
          <div className="border-2 border-[#ffe2db] rounded-[16px] p-0 w-full">
            <div className="bg-white border border-[#ffa58f] rounded-[16px] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#69737c] text-xs font-normal uppercase tracking-wider">
                  Storage
                </span>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-[#e84c25]" />
                  <Info className="w-3 h-3 text-[#69737c]" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-[#e1e1e1] rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-[#822b15] to-[#e84c25] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${currentStorage.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#222526] font-medium">
                    {currentStorage.used} / {currentStorage.total} GB
                  </span>
                  <span className="text-[#e84c25] font-medium">
                    Storage is almost full
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Amount Input */}
          <div className="w-full">
            <label className="text-[#6f6d66] text-sm font-medium mb-2 block">
              How much would you like to add?
            </label>
            <Input
              value={storageAmount}
              onChange={(e) => setStorageAmount(e.target.value)}
              placeholder="-- GB"
              className="h-[50px] rounded-full border-[#e1e1e1] bg-white px-4"
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white border-t border-[#e1e1e1] px-5 py-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[#6f6d66] text-base font-medium">
              Total price for {storageAmount || 'XX'} GB storage:
            </h3>
            <p className="text-[#69737c] text-xs">
              Price in dollar:
            </p>
            <p className="text-white text-xs">
              Price in dollar:
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <img src={icon} alt="logo" className="w-4 h-4" />
              <span className="text-[#222526] text-xl font-semibold">
                {totalPrice || '1325'} OGY
              </span>
            </div>
            <p className="text-[#69737c] text-base">
              (${priceInUSD.toFixed(2)})
            </p>
            <p className="text-[#69737c] text-xs">
              (1 OGY = 0.01072 USD)
            </p>
          </div>
        </div>

        {/* Add Storage Button */}
        <Button
          onClick={handleAddStorage}
          className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
          disabled={!storageAmount || parseFloat(storageAmount) <= 0}
        >
          Add {storageAmount || 'XX'} GB storage for {totalPrice || '1325'} OGY
        </Button>
      </div>

      {/* Current Balance Section */}
      <div className="bg-[#f9fafe] border-t border-[#e1e1e1] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#69737c] text-xs font-medium uppercase tracking-wide">
            Your account balance:
          </span>
          <img src={icon} alt="logo" className="w-3 h-3" />
          <span className="text-[#69737c] text-sm font-semibold">
            {currentBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} OGY
          </span>
          <span className="text-[#69737c] text-xs">
            ($0.1337)
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
