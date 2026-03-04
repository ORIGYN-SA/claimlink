import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useAccounts, useAgent, useIdentity } from "@nfid/identitykit/react";
import { Principal } from "@dfinity/principal";
import { useEffect, useState } from "react";

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
  const { isConnected,  connect, disconnect, isInitializing } = useAuth();
  let [principal, setPrincipal] = useState<String>();
  // ICP Wallet Hooks
  const icpAccounts = useAccounts();
  const icpIdentity = useIdentity();
  // Agents
  const authenticatedAgent = useAgent();



  // Set ICP identity and authenticated agent
  useEffect(() => {
    if (icpAccounts != undefined && authenticatedAgent) {
      if (icpAccounts[0].principal.compareTo(Principal.anonymous()) != 'eq') {
        setPrincipal(icpAccounts[0].principal.toText());
      } else {
        disconnect();
      }
    }
    if (icpIdentity != undefined && authenticatedAgent) {
      if (icpIdentity.getPrincipal().compareTo(Principal.anonymous()) != 'eq') {
        setPrincipal(icpIdentity.getPrincipal().toString());
      } else {
        disconnect();
      }
    }
  }, [icpAccounts, icpIdentity]);


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
          {principal ? `${principal.slice(0, 8)}...${principal.slice(-8)}` : 'Connected'}
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
