import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
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
import {
    IC_HOST,
    APP_MODE,
    getNfidTargets,
    getDerivationOrigin,
} from "@/shared/constants";
import { isLocalICReplica } from "@/shared/utils/environment";

// Internal component to handle auth state initialization
const AuthProviderInit = ({
    children,
    onRefReady,
}: {
    children: ReactNode;
    onRefReady?: (ref: React.MutableRefObject<boolean>) => void;
}) => {
    const { user } = useAuth();
    const isInitializing = useIsInitializing();
    const [state, setState] = useAtom(authStateAtom);
    const [unauthenticatedAgent, setUnauthenticatedAgent] = useState<
        HttpAgent | Agent | undefined
    >();
    const authenticatedAgent = useAgent({ host: IC_HOST });
    const navigate = useNavigate();

    // Track whether auth changes are from intentional user actions (connect/disconnect)
    // vs automatic initialization (page reload). Prevents unwanted navigation on reload.
    const isIntentionalAuthAction = useRef(false);

    // Expose ref to parent component
    useEffect(() => {
        if (onRefReady) {
            onRefReady(isIntentionalAuthAction);
        }
    }, [onRefReady]);

    // Create unauthenticated agent for public queries
    useEffect(() => {
        const initUnauthenticatedAgent = async () => {
            const agent = await HttpAgent.create({ host: IC_HOST });

            // Fetch root key for local development
            if (isLocalICReplica(IC_HOST, APP_MODE)) {
                await agent.fetchRootKey();
                console.log('[AuthProvider] Fetched root key for local IC replica (unauthenticated agent)');
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
                console.log('[AuthProvider] Fetched root key for local IC replica (authenticated agent)');
            }
        };

        initAuthenticatedAgent();
    }, [authenticatedAgent]);

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

            // Only navigate if this was an intentional connect action
            if (isIntentionalAuthAction.current) {
                navigate({ to: "/dashboard" });
                isIntentionalAuthAction.current = false; // Reset flag
            }
        } else {
            setState((prevState) => ({
                ...prevState,
                principalId: "",
                isConnected: false,
                isInitializing: false,
                authenticatedAgent: undefined,
            }));

            // Navigate to login if intentional disconnect OR session expired
            // (session expiration doesn't trigger onDisconnect callback)
            if (isIntentionalAuthAction.current || state.isConnected) {
                navigate({ to: "/login" });
                isIntentionalAuthAction.current = false; // Reset flag
            }
        }
    }, [user, authenticatedAgent, setState, navigate, state.isConnected]);

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
    targets,
    signers = [NFIDW, InternetIdentity],
    derivationOrigin,
    maxTimeToLive = 604800000000000n, // one week
}: {
    children: ReactNode;
    targets?: string[];
    signers?: IdentityKitSignerConfig[];
    derivationOrigin?: string | undefined;
    maxTimeToLive?: bigint;
}) => {
    const queryClient = useQueryClient();
    const [authActionRef, setAuthActionRef] = useState<React.MutableRefObject<boolean> | null>(null);

    // Use helper functions to get environment-specific configuration
    const nfidTargets = targets || getNfidTargets();
    const nfidDerivationOrigin =
        derivationOrigin !== undefined
            ? derivationOrigin
            : getDerivationOrigin();

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
                console.error("Connection failed:", err);
            }}
            onConnectSuccess={() => {
                // Mark this as an intentional auth action
                if (authActionRef) {
                    authActionRef.current = true;
                }
                // Clear query cache on successful connection
                queryClient.clear();
            }}
            onDisconnect={() => {
                // Mark this as an intentional auth action
                if (authActionRef) {
                    authActionRef.current = true;
                }
            }}
        >
            <AuthProviderInit onRefReady={setAuthActionRef}>
                {children}
            </AuthProviderInit>
        </IdentityKitProvider>
    );
};

export default AuthProvider;
