export interface WithdrawDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentBalance?: number
}

export type DialogState = 'form' | 'confirm' | 'processing' | 'success' | 'error'

export interface WithdrawFormData {
  amount: string
  recipientAddress: string
}

export interface WithdrawSuccessData {
  transactionIndex?: string
  recipientAddress: string
  amount: string
  fee: string
}

export interface WithdrawErrorData {
  message?: string
}
