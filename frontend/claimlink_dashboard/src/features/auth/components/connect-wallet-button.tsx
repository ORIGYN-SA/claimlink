import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

interface ConnectWalletButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ConnectWalletButton({
  className,
  variant = "default",
  size = "default"
}: ConnectWalletButtonProps) {
  const { isConnected, principalId, connect, disconnect, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        Connecting...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {principalId ? `${principalId.slice(0, 8)}...${principalId.slice(-8)}` : 'Connected'}
        </span>
        <Button
          variant="outline"
          size={size}
          className={className}
          onClick={disconnect}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={connect}
    >
      Connect Wallet
    </Button>
  );
}
