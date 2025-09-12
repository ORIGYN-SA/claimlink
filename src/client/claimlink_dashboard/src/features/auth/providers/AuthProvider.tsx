import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  IdentityKitAuthType,
  NFIDW,
  InternetIdentity,
} from "@nfid/identitykit";
import type { IdentityKitSignerConfig } from "@nfid/identitykit";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  IdentityKitProvider,
  useAuth,
  useIsInitializing,
  useAgent,
} from "@nfid/identitykit/react";
import { HttpAgent } from "@dfinity/agent";
import type { Agent } from "@dfinity/agent";
import authStateAtom from "../stores/atoms";

// Internal component to handle auth state initialization
const AuthProviderInit = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const isInitializing = useIsInitializing();
  const [state, setState] = useAtom(authStateAtom);
  const [unauthenticatedAgent, setUnauthenticatedAgent] = useState<
    HttpAgent | Agent | undefined
  >();
  const authenticatedAgent = useAgent({ host: "https://ic0.app" });
  const navigate = useNavigate();

  // Create unauthenticated agent for public queries
  useEffect(() => {
    HttpAgent.create({ host: "https://ic0.app" }).then(setUnauthenticatedAgent);
  }, []);

  // Update agents in state
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      unauthenticatedAgent,
      authenticatedAgent,
    }));
  }, [unauthenticatedAgent, authenticatedAgent, setState]);

  // Handle user authentication state changes
  useEffect(() => {
    if (user) {
      setState((prevState) => ({
        ...prevState,
        principalId: user.principal.toText(),
        isConnected: true,
        isInitializing: false,
        authenticatedAgent,
      }));
      // Navigate to dashboard when user connects
      navigate({ to: "/dashboard" });
    } else {
      setState((prevState) => ({
        ...prevState,
        principalId: "",
        isConnected: false,
        isInitializing: false,
        authenticatedAgent: undefined,
      }));
      // Navigate to login when user disconnects
      // navigate({ to: "/login" });
    }
  }, [user, authenticatedAgent, setState, navigate]);

  // Show loading screen during initialization
  if (isInitializing || (user && !state.isConnected)) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">Loading authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
};

// Main AuthProvider component
const AuthProvider = ({
  children,
  targets = [],
  signers = [NFIDW, InternetIdentity],
  derivationOrigin = undefined,
  maxTimeToLive = 604800000000000n, // one week
}: {
  children: ReactNode;
  targets?: string[];
  signers?: IdentityKitSignerConfig[];
  derivationOrigin?: string | undefined;
  maxTimeToLive?: bigint;
}) => {
  const queryClient = useQueryClient();

  return (
    <IdentityKitProvider
      signers={signers}
      authType={IdentityKitAuthType.DELEGATION}
      signerClientOptions={{
        targets,
        maxTimeToLive,
        derivationOrigin,
        idleOptions: {
          disableIdle: false,
        },
      }}
      onConnectFailure={(err: Error) => {
        console.error("Connection failed:", err);
      }}
      onConnectSuccess={() => {
        // Clear query cache on successful connection
        queryClient.clear();
      }}
      onDisconnect={() => {
        // Handle disconnect if needed
      }}
    >
      <AuthProviderInit>{children}</AuthProviderInit>
    </IdentityKitProvider>
  );
};

export default AuthProvider;
