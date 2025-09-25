import { RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountHeaderSectionProps {
  onRefresh: () => void;
  onSignOut: () => void;
  isRefreshing: boolean;
}

export function AccountHeaderSection({
  onRefresh,
  onSignOut,
  isRefreshing,
}: AccountHeaderSectionProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10 rounded-full"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
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
