import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  IdentityKitAuthType,
  NFIDW,
  InternetIdentity,
} from "@nfid/identitykit";
import type { IdentityKitSignerConfig } from "@nfid/identitykit";
import { useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import {
  IdentityKitProvider,
  useAuth as useNfidAuth,
  useIsInitializing,
  useAgent,
} from "@nfid/identitykit/react";
import { HttpAgent } from "@dfinity/agent";
import type { Agent } from "@dfinity/agent";
import authStateAtom from "../atoms/atoms";
import type { RouterAuthContext } from "../types/router-context";
import {
  IC_HOST,
  APP_MODE,
  getNfidTargets,
  getDerivationOrigin,
} from "@/shared/constants";
import { isLocalICReplica } from "@/shared/utils/environment";
import {
  saveDelegationToStorage,
  clearDelegationFromStorage,
} from "../utils/delegation-storage";

/**
 * Loading screen shown while auth is initializing.
 * This renders BEFORE the router exists, preventing any flash of protected content.
 */
const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-[#fcfafa]">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#222526] border-r-transparent mb-4"></div>
      <p className="text-[#69737c] text-sm">Loading...</p>
    </div>
  </div>
);

interface AuthGateInnerProps {
  children: (authContext: RouterAuthContext) => ReactNode;
}

/**
 * Inner component that has access to NFID hooks (must be inside IdentityKitProvider).
 *
 * Key responsibility: Show loading until auth is FULLY resolved, then render
 * children with auth context. This ensures the router only exists when auth
 * state is definitive.
 */
const AuthGateInner = ({ children }: AuthGateInnerProps) => {
  const { user } = useNfidAuth();
  const isInitializing = useIsInitializing();
  const setState = useSetAtom(authStateAtom);
  const authenticatedAgent = useAgent({ host: IC_HOST });
  const [unauthenticatedAgent, setUnauthenticatedAgent] = useState<
    Agent | undefined
  >();
  const [agentsReady, setAgentsReady] = useState(false);

  // Create unauthenticated agent for public queries
  useEffect(() => {
    const initUnauthenticatedAgent = async () => {
      const agent = await HttpAgent.create({ host: IC_HOST });

      if (isLocalICReplica(IC_HOST, APP_MODE)) {
        await agent.fetchRootKey();
        console.log("[Auth] Fetched root key for unauthenticated agent");
      }

      setUnauthenticatedAgent(agent);
    };

    initUnauthenticatedAgent();
  }, []);

  // Fetch root key for authenticated agent in local development
  useEffect(() => {
    const initAuthenticatedAgent = async () => {
      if (authenticatedAgent && isLocalICReplica(IC_HOST, APP_MODE)) {
        await authenticatedAgent.fetchRootKey();
        console.log("[Auth] Fetched root key for authenticated agent");
      }
    };

    initAuthenticatedAgent();
  }, [authenticatedAgent]);

  // Mark agents as ready when initialization completes and unauthenticated agent exists
  useEffect(() => {
    if (!isInitializing && unauthenticatedAgent) {
      setAgentsReady(true);
    }
  }, [isInitializing, unauthenticatedAgent]);

  // Sync auth state to Jotai atom (for useAuth hook in components)
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isConnected: !!user,
      isInitializing,
      principalId: user?.principal.toText() || "",
      authenticatedAgent,
      unauthenticatedAgent,
    }));
  }, [user, isInitializing, authenticatedAgent, unauthenticatedAgent, setState]);

  // Save delegation to localStorage when user connects
  useEffect(() => {
    if (user && authenticatedAgent) {
      saveDelegationToStorage(user, authenticatedAgent);
    }
  }, [user, authenticatedAgent]);

  // Show loading until auth AND agents are resolved
  // This is the KEY INSIGHT: Router doesn't exist during this phase
  if (!agentsReady) {
    return <LoadingScreen />;
  }

  // Auth is resolved - create auth context and render children (RouterProvider)
  const authContext: RouterAuthContext = {
    isConnected: !!user,
    principalId: user?.principal.toText() || "",
    authenticatedAgent,
    unauthenticatedAgent,
  };

  return <>{children(authContext)}</>;
};

interface AuthGateProps {
  children: (authContext: RouterAuthContext) => ReactNode;
  targets?: string[];
  signers?: IdentityKitSignerConfig[];
  derivationOrigin?: string | undefined;
  maxTimeToLive?: bigint;
}

/**
 * AuthGate is the entry point for authentication.
 *
 * Key architectural decision: The children prop is a render function that
 * receives authContext. This allows the parent (main.tsx) to create the
 * router INSIDE this callback, ensuring the router only exists when auth
 * state is resolved.
 *
 * This follows the official TanStack Router authentication pattern:
 * - Loading happens BEFORE RouterProvider exists
 * - Router context gets definitive auth state (not "loading")
 * - beforeLoad guards have guaranteed auth info
 *
 * Responsibilities:
 * - Initialize NFID IdentityKit
 * - Create authenticated and unauthenticated IC agents
 * - Sync auth state to Jotai atom (for useAuth hook)
 * - Show loading screen until auth resolved
 * - Pass auth context to children via render prop
 * - Handle connect/disconnect events (clear query cache, delegation storage)
 */
export const AuthGate = ({
  children,
  targets,
  signers = [NFIDW, InternetIdentity],
  derivationOrigin,
  maxTimeToLive = 604800000000000n, // one week
}: AuthGateProps) => {
  const queryClient = useQueryClient();

  const nfidTargets = targets || getNfidTargets();
  const nfidDerivationOrigin =
    derivationOrigin !== undefined ? derivationOrigin : getDerivationOrigin();

  // Handle successful connection
  const handleConnectSuccess = () => {
    console.log("[Auth] Connection successful");
    queryClient.clear();
  };

  // Handle disconnection
  const handleDisconnect = () => {
    console.log("[Auth] Disconnecting...");
    clearDelegationFromStorage();
    queryClient.clear();
  };

  return (
    <IdentityKitProvider
      signers={signers}
      authType={IdentityKitAuthType.DELEGATION}
      signerClientOptions={{
        targets: nfidTargets,
        maxTimeToLive,
        derivationOrigin: nfidDerivationOrigin,
        idleOptions: {
          disableIdle: false,
        },
      }}
      onConnectFailure={(err: Error) => {
        console.error("[Auth] Connection failed:", err);
      }}
      onConnectSuccess={handleConnectSuccess}
      onDisconnect={handleDisconnect}
    >
      <AuthGateInner>{children}</AuthGateInner>
    </IdentityKitProvider>
  );
};
