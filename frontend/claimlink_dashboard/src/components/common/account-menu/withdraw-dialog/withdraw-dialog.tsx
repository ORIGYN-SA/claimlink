import { useState } from "react"
import { useAtomValue } from "jotai"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import authStateAtom from "@/features/auth/atoms/atoms"
import useTransfer from "@/services/ledger/hooks/useTransfer"
import useFetchTransferFee from "@/services/ledger/hooks/useFetchTransferFee"
import { OGY_LEDGER_CANISTER_ID } from "@/shared/constants"
import { WithdrawForm } from "./withdraw-form"
import { WithdrawConfirm } from "./withdraw-confirm"
import { WithdrawLoading } from "./withdraw-loading"
import { WithdrawSuccess } from "./withdraw-success"
import { WithdrawError } from "./withdraw-error"
import type {
  WithdrawDialogProps,
  DialogState,
  WithdrawFormData,
  WithdrawSuccessData,
  WithdrawErrorData,
} from "./types"

const OGY_TO_E8S = 100_000_000n

export function WithdrawDialog({
  isOpen,
  onOpenChange,
  currentBalance = 0,
}: WithdrawDialogProps) {
  const [dialogState, setDialogState] = useState<DialogState>("form")
  const [formData, setFormData] = useState<WithdrawFormData | null>(null)
  const [successData, setSuccessData] = useState<WithdrawSuccessData | null>(
    null
  )
  const [errorData, setErrorData] = useState<WithdrawErrorData | null>(null)

  const authState = useAtomValue(authStateAtom)
  const { authenticatedAgent } = authState

  // Fetch transfer fee
  const { data: transferFeeData } = useFetchTransferFee(
    OGY_LEDGER_CANISTER_ID,
    authenticatedAgent,
    {
      ledger: OGY_LEDGER_CANISTER_ID,
      enabled: isOpen && !!authenticatedAgent,
    }
  )

  // Convert bigint fee to number for display
  const transferFee = transferFeeData
    ? Number(transferFeeData) / Number(OGY_TO_E8S)
    : 0.002

  // Setup transfer mutation
  const transferMutation = useTransfer(
    OGY_LEDGER_CANISTER_ID,
    authenticatedAgent,
    {
      ledger: OGY_LEDGER_CANISTER_ID,
      is_principal_standard: true,
    }
  )

  const handleFormSubmit = (data: WithdrawFormData) => {
    // Save form data and move to confirmation screen
    setFormData(data)
    setDialogState("confirm")
  }

  const handleBackToForm = () => {
    setDialogState("form")
  }

  const handleConfirmTransfer = async () => {
    if (!formData) return

    setDialogState("processing")

    try {
      const amountInE8s = BigInt(
        Math.floor(parseFloat(formData.amount) * Number(OGY_TO_E8S))
      )
      const feeInE8s = transferFeeData || BigInt(Math.floor(0.002 * Number(OGY_TO_E8S)))

      const blockIndex = await transferMutation.mutateAsync({
        amount: amountInE8s,
        account: formData.recipientAddress.trim(),
        fee: feeInE8s,
      })

      // Transfer successful
      setSuccessData({
        recipientAddress: formData.recipientAddress.trim(),
        amount: formData.amount,
        fee: transferFee.toString(),
        transactionIndex: blockIndex ? blockIndex.toString() : undefined,
      })
      setDialogState("success")
    } catch (error) {
      console.error("Transfer error:", error)
      setErrorData({
        message: error instanceof Error ? error.message : "Something went wrong",
      })
      setDialogState("error")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setDialogState("form")
      setFormData(null)
      setSuccessData(null)
      setErrorData(null)
    }, 200)
  }

  const handleRetry = () => {
    // Go back to form to allow user to edit their transaction
    setDialogState("form")
    setErrorData(null)
    // Keep formData so user can see their previous input
  }

  const renderCurrentState = () => {
    switch (dialogState) {
      case "confirm":
        return formData ? (
          <WithdrawConfirm
            data={formData}
            currentBalance={currentBalance}
            transferFee={transferFee}
            onBack={handleBackToForm}
            onConfirm={handleConfirmTransfer}
            onClose={handleClose}
          />
        ) : null

      case "processing":
        return <WithdrawLoading />

      case "success":
        return successData ? (
          <WithdrawSuccess
            data={successData}
            currentBalance={currentBalance}
            onClose={handleClose}
          />
        ) : null

      case "error":
        return errorData ? (
          <WithdrawError
            data={errorData}
            currentBalance={currentBalance}
            onRetry={handleRetry}
            onClose={handleClose}
          />
        ) : null

      default:
        return (
          <WithdrawForm
            currentBalance={currentBalance}
            transferFee={transferFee}
            onSubmit={handleFormSubmit}
            onClose={handleClose}
            initialData={formData}
          />
        )
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
