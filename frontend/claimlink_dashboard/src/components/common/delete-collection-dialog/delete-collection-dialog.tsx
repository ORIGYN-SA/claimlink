import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface DeleteCollectionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  collectionName?: string
  onConfirmDelete?: () => void
}

export function DeleteCollectionDialog({ 
  isOpen, 
  onOpenChange, 
  collectionName = "Collection name",
  onConfirmDelete
}: DeleteCollectionDialogProps) {

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleDelete = () => {
    onConfirmDelete?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className=" p-6 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999]"
        showCloseButton={false}
      >
          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-[#69737c] text-sm leading-normal">
              Are you sure you want to delete{' '}
              <span className="text-[#222526] font-medium">{collectionName}</span>
              . This action is definitive.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center justify-center">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="bg-[#e1e1e1] hover:bg-[#e1e1e1]/80 border-[#e1e1e1] text-[#222526] rounded-full px-6 py-3 text-sm font-semibold"
            >
              No, keep the collection
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full px-6 py-3 text-sm font-semibold"
            >
              Delete collection
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}
