import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border border-[#e1e1e1] !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#222526]">
            Delete User
          </DialogTitle>
          <DialogDescription className="text-[#69737c] pt-2">
            Are you sure you want to delete <span className="font-semibold text-[#222526]">{userName}</span>? 
            This action cannot be undone and will permanently remove the user from your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 pt-4 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:flex-1 bg-white hover:bg-gray-50 border-[#e1e1e1] text-[#222526] rounded-full h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="sm:flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full h-12"
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

