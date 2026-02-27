import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export interface UnauthorizedWarningDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onContactSupport?: () => void
}

/**
 * Warning dialog shown to users who are not authorized principals.
 * Displayed when a user's principal is not in the authorized principals list.
 */
export function UnauthorizedWarningDialog({
  isOpen,
  onOpenChange,
  onContactSupport,
}: UnauthorizedWarningDialogProps) {
  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport()
    } else {
      // Default: open email client
      window.location.href = 'mailto:admin@origyn.com?subject=ClaimLink%20Access%20Request'
    }
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999] max-w-md"
        showCloseButton={false}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-[#222526] mb-2">
          Access Restricted
        </h2>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-[#69737c] text-sm leading-relaxed">
            You are not currently an authorized principal for this application.
          </p>
          <p className="text-[#69737c] text-sm leading-relaxed mt-2">
            To get access, please contact ORIGYN at{' '}
            <a
              href="mailto:admin@origyn.com"
              className="text-[#615bff] hover:underline font-medium"
            >
              admin@origyn.com
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full sm:w-auto bg-[#e1e1e1] hover:bg-[#e1e1e1]/80 border-[#e1e1e1] text-[#222526] rounded-full px-6 py-3 text-sm font-semibold"
          >
            Close
          </Button>
          <Button
            onClick={handleContactSupport}
            className="w-full sm:w-auto bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full px-6 py-3 text-sm font-semibold"
          >
            Contact Support
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
