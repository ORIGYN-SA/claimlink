import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountHeaderSectionProps {
  onClose: () => void;
  onSignOut: () => void;
}

export function AccountHeaderSection({
  onClose,
  onSignOut,
}: AccountHeaderSectionProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10 rounded-full"
      >
        <X className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSignOut}
        className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10 rounded-full"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
}
