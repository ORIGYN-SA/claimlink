# Auth Feature

The auth feature handles user authentication using NFID IdentityKit, managing principals, agents, and session state.

## Purpose

- Authenticate users via NFID wallet connection
- Create and manage IC agents (authenticated and unauthenticated)
- Store and restore delegation tokens for session persistence
- Provide authentication state to the entire application

## File Structure

```
auth/
├── atoms/
│   └── atoms.ts                    # authStateAtom
├── components/
│   ├── AuthGate.tsx                # Auth initialization wrapper
│   ├── AuthProvider.tsx            # NFID provider wrapper
│   └── connect-wallet-button.tsx   # Wallet connection button
├── hooks/
│   └── useAuth.ts                  # Auth state hooks
├── types/
│   └── interfaces.ts               # AuthState, Canisters types
└── utils/
    ├── auth-service.ts             # Auth logic
    └── delegation-storage.ts       # Delegation persistence
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP STARTUP                                        │
│                                                                             │
│  main.tsx                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  <JotaiProvider>                                                      │ │
│  │    <QueryClientProvider>                                              │ │
│  │      <AuthProvider>           ← NFID IdentityKit                     │ │
│  │        <AuthGate>             ← Blocks until auth resolves           │ │
│  │          <RouterProvider />                                           │ │
│  │        </AuthGate>                                                    │ │
│  │      </AuthProvider>                                                  │ │
│  │    </QueryClientProvider>                                             │ │
│  │  </JotaiProvider>                                                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTH INITIALIZATION                                     │
│                                                                             │
│  AuthGate checks for existing session:                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  1. Check localStorage for delegation token                           │ │
│  │  2. Create unauthenticated agent (always)                             │ │
│  │  3. If delegation exists:                                             │ │
│  │     - Validate expiry                                                 │ │
│  │     - Create authenticated agent                                      │ │
│  │     - Extract principal ID                                            │ │
│  │  4. Update authStateAtom                                              │ │
│  │  5. Set isInitializing = false                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
          ┌────────────────────────┴────────────────────────┐
          │                                                 │
          ▼                                                 ▼
┌─────────────────────────┐                  ┌─────────────────────────┐
│   NO SESSION            │                  │   SESSION EXISTS        │
│                         │                  │                         │
│  authState = {          │                  │  authState = {          │
│    isConnected: false,  │                  │    isConnected: true,   │
│    isInitializing: false│                  │    isInitializing: false│
│    principalId: '',     │                  │    principalId: 'xxx...'│
│    unauthenticatedAgent │                  │    authenticatedAgent,  │
│  }                      │                  │    unauthenticatedAgent │
│                         │                  │  }                      │
│  → Show /login page     │                  │  → Navigate to dashboard│
└─────────────────────────┘                  └─────────────────────────┘
```

### Wallet Connection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER CLICKS "CONNECT WALLET"                            │
│                                                                             │
│  ConnectWalletButton triggers NFID                                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NFID AUTHENTICATION                                     │
│                                                                             │
│  1. NFID popup opens                                                        │
│  2. User authenticates (passkey, email, etc.)                               │
│  3. NFID returns delegation identity                                        │
│  4. Delegation stored in localStorage                                       │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CREATE AUTHENTICATED AGENT                              │
│                                                                             │
│  const agent = new HttpAgent({                                              │
│    host: IC_HOST,                                                           │
│    identity: delegationIdentity                                             │
│  });                                                                        │
│                                                                             │
│  // For local development                                                   │
│  if (isLocal) await agent.fetchRootKey();                                   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      UPDATE AUTH STATE                                       │
│                                                                             │
│  setAuthState({                                                             │
│    isConnected: true,                                                       │
│    isInitializing: false,                                                   │
│    principalId: identity.getPrincipal().toText(),                           │
│    authenticatedAgent: agent,                                               │
│    unauthenticatedAgent: unauthAgent,                                       │
│    canisters: { ... }                                                       │
│  });                                                                        │
│                                                                             │
│  → Navigate to /dashboard                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### AuthState (`types/interfaces.ts`)

```typescript
interface AuthState {
  isConnected: boolean;
  isInitializing: boolean;
  principalId: string;
  unauthenticatedAgent: Agent | undefined;
  authenticatedAgent: Agent | undefined;
  canisters: Canisters;
}

interface Canisters {
  claimlink?: ActorSubclass<ClaimLinkService>;
  // Add other canister actors as needed
}

// Initial state
const initialAuthState: AuthState = {
  isConnected: false,
  isInitializing: true,  // true until auth check completes
  principalId: '',
  unauthenticatedAgent: undefined,
  authenticatedAgent: undefined,
  canisters: {},
};
```

## Jotai Atoms

### authStateAtom (`atoms/atoms.ts`)

```typescript
import { atom } from 'jotai';
import type { AuthState } from '../types/interfaces';

export const authStateAtom = atom<AuthState>({
  isConnected: false,
  isInitializing: true,
  principalId: '',
  unauthenticatedAgent: undefined,
  authenticatedAgent: undefined,
  canisters: {},
});

// Derived atoms
export const isAuthenticatedAtom = atom((get) => {
  const auth = get(authStateAtom);
  return auth.isConnected && auth.authenticatedAgent !== undefined;
});

export const principalIdAtom = atom((get) => {
  return get(authStateAtom).principalId;
});

export const authenticatedAgentAtom = atom((get) => {
  return get(authStateAtom).authenticatedAgent;
});
```

## Hooks

### useAuth (`hooks/useAuth.ts`)

```typescript
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { authStateAtom } from '../atoms/atoms';

// Full access (read + write)
export function useAuth() {
  return useAtom(authStateAtom);
}

// Read-only access
export function useAuthState() {
  return useAtomValue(authStateAtom);
}

// Write-only access
export function useSetAuthState() {
  return useSetAtom(authStateAtom);
}

// Convenience hooks
export function useIsAuthenticated(): boolean {
  const { isConnected, authenticatedAgent } = useAuthState();
  return isConnected && authenticatedAgent !== undefined;
}

export function usePrincipalId(): string {
  return useAuthState().principalId;
}

export function useAuthenticatedAgent(): Agent | undefined {
  return useAuthState().authenticatedAgent;
}

export function useUnauthenticatedAgent(): Agent | undefined {
  return useAuthState().unauthenticatedAgent;
}
```

## Components

### AuthGate

Wrapper that blocks rendering until auth state is resolved.

```typescript
interface AuthGateProps {
  children: React.ReactNode;
}

function AuthGate({ children }: AuthGateProps) {
  const { isInitializing } = useAuthState();
  const setAuthState = useSetAuthState();

  useEffect(() => {
    initializeAuth().then((state) => {
      setAuthState(state);
    });
  }, [setAuthState]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

### AuthProvider

Wraps NFID IdentityKit provider with configuration.

```typescript
function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <IdentityKitProvider
      signers={[NFIDW]}
      featuredSigner={NFIDW}
      signerClientOptions={{
        targets: getTargets(),
        derivationOrigin: getDerivationOrigin(),
      }}
      onConnectSuccess={handleConnectSuccess}
      onDisconnect={handleDisconnect}
    >
      {children}
    </IdentityKitProvider>
  );
}

function getTargets(): string[] {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_NFID_LOCALHOST_TARGETS?.split(',') || [];
  }
  return [];
}

function getDerivationOrigin(): string | undefined {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_NFID_DERIVATION_ORIGIN;
  }
  return undefined;
}
```

### ConnectWalletButton

```typescript
function ConnectWalletButton() {
  const { connect, disconnect, isConnecting } = useIdentityKit();
  const { isConnected } = useAuthState();

  if (isConnected) {
    return (
      <Button onClick={disconnect} variant="outline">
        Disconnect
      </Button>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
```

## Delegation Storage

### Storage Utilities (`utils/delegation-storage.ts`)

```typescript
const DELEGATION_KEY = 'claimlink_delegation';

export function storeDelegation(delegation: DelegationChain): void {
  const json = JSON.stringify(delegation.toJSON());
  localStorage.setItem(DELEGATION_KEY, json);
}

export function loadDelegation(): DelegationChain | null {
  const json = localStorage.getItem(DELEGATION_KEY);
  if (!json) return null;

  try {
    const parsed = JSON.parse(json);
    return DelegationChain.fromJSON(parsed);
  } catch {
    clearDelegation();
    return null;
  }
}

export function clearDelegation(): void {
  localStorage.removeItem(DELEGATION_KEY);
}

export function isDelegationValid(delegation: DelegationChain): boolean {
  // Check if delegation has expired
  const now = BigInt(Date.now()) * BigInt(1_000_000); // nanoseconds
  return delegation.delegations.every((d) => {
    return !d.delegation.expiration || d.delegation.expiration > now;
  });
}
```

## Route Protection

### Protected Routes

```typescript
// routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { authState } = context;

    if (!authState.isConnected) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
```

### Router Context

```typescript
// main.tsx
const router = createRouter({
  routeTree,
  context: {
    authState: undefined!, // Will be provided by provider
  },
});

function App() {
  const authState = useAuthState();

  return (
    <RouterProvider
      router={router}
      context={{ authState }}
    />
  );
}
```

## Environment Configuration

### Required Environment Variables

```bash
# For production
VITE_IC_HOST=https://ic0.app

# For localhost signing (required for local development)
VITE_NFID_LOCALHOST_TARGETS=http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
```

### Local Development Setup

NFID requires specific configuration for localhost:

1. Set `VITE_NFID_LOCALHOST_TARGETS` to include your dev server and local replica
2. Set `VITE_NFID_DERIVATION_ORIGIN` to your dev server URL
3. Ensure local replica is running (`dfx start`)
4. Fetch root key for local agent (`agent.fetchRootKey()`)

## Integration Points

### With All Features

Every feature that needs canister access uses auth:

```typescript
function SomeFeatureComponent() {
  const { authenticatedAgent, isConnected } = useAuthState();

  // For mutations (write operations)
  const { mutate } = useSomeMutation();

  // Agent is passed to service layer
  const handleAction = () => {
    if (!authenticatedAgent) return;
    SomeService.doSomething(authenticatedAgent, params);
  };
}
```

### With React Query

Queries are enabled based on auth state:

```typescript
function useSomeData() {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: ['some-data'],
    queryFn: () => SomeService.fetch(authenticatedAgent!),
    enabled: !!authenticatedAgent,  // Only fetch when authenticated
  });
}
```

## Session Expiry

### Expiry Handling

```typescript
function useSessionExpiryWatcher() {
  const setAuthState = useSetAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const delegation = loadDelegation();
    if (!delegation) return;

    // Calculate time until expiry
    const expiryTime = getEarliestExpiry(delegation);
    const timeUntilExpiry = Number(expiryTime - BigInt(Date.now()) * BigInt(1_000_000));

    if (timeUntilExpiry <= 0) {
      handleExpiry();
      return;
    }

    // Set timeout to handle expiry
    const timeout = setTimeout(() => {
      handleExpiry();
    }, Math.min(timeUntilExpiry / 1_000_000, 2147483647)); // Max 32-bit int

    return () => clearTimeout(timeout);

    function handleExpiry() {
      clearDelegation();
      setAuthState(initialAuthState);
      navigate({ to: '/login' });
    }
  }, [setAuthState, navigate]);
}
```

## Known Issues / TODOs

1. **Session Refresh**: No automatic session refresh before expiry. User must re-authenticate.

2. **Multi-Tab Support**: Auth state is not synced across browser tabs. Changes in one tab don't reflect in others.

3. **Error Handling**: Network errors during auth initialization could leave app in broken state.

4. **Canister Actors**: The `canisters` field in AuthState is largely unused. Consider removing or utilizing properly.

5. **Logout Cleanup**: On logout, should invalidate all React Query cache.

## Usage Examples

### Checking Authentication

```typescript
function ProtectedAction() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <ActionButton />;
}
```

### Getting Agent for Service Calls

```typescript
function MintCertificateButton({ collectionId }: Props) {
  const { authenticatedAgent } = useAuthState();
  const mintMutation = useMintCertificate();

  const handleMint = async () => {
    if (!authenticatedAgent) {
      toast.error('Please connect your wallet');
      return;
    }

    await mintMutation.mutateAsync({
      agent: authenticatedAgent,
      collectionId,
      // ...
    });
  };

  return <Button onClick={handleMint}>Mint</Button>;
}
```

### Using Principal ID

```typescript
function UserProfile() {
  const principalId = usePrincipalId();

  return (
    <div>
      <p>Your Principal ID:</p>
      <code>{principalId || 'Not connected'}</code>
    </div>
  );
}
```

## Related Documentation

- [State Management](../../../../docs/STATE-MANAGEMENT.md)
- [Canister Integration](../../../../docs/CANISTER-INTEGRATION.md)
- [Architecture](../../../../docs/ARCHITECTURE.md)
