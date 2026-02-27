# ClaimLink State Management

This document describes the state management patterns used in the ClaimLink frontend.

## Three-Layer State Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 3: SERVER STATE (React Query)                       │
│                                                                             │
│   Purpose: Data from IC canisters (certificates, collections, etc.)         │
│   Scope: Application-wide, cached, auto-refetched                           │
│   Library: TanStack Query (useQuery, useMutation)                           │
│                                                                             │
│   Examples:                                                                 │
│   - Certificate list from canister                                          │
│   - Collection metadata                                                     │
│   - Transaction history                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ provides data to
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 2: FEATURE STATE (Jotai)                            │
│                                                                             │
│   Purpose: Cross-component state within a feature                           │
│   Scope: Feature-level, derived state, complex state logic                  │
│   Library: Jotai (atom, useAtom)                                            │
│                                                                             │
│   Examples:                                                                 │
│   - Auth state (principal, agents)                                          │
│   - Form wizard state (multi-step forms)                                    │
│   - Filter state                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ provides context to
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 1: UI STATE (Local Component)                       │
│                                                                             │
│   Purpose: Component-specific UI concerns                                   │
│   Scope: Single component                                                   │
│   API: useState, useReducer                                                 │
│                                                                             │
│   Examples:                                                                 │
│   - Modal open/close                                                        │
│   - Form input values (before submission)                                   │
│   - Dropdown expanded state                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Layer 1: UI State (Local Component)

Use `useState` for simple, component-local UI state.

```typescript
// Single component concerns only
function CertificateCard({ certificate }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ... */}
    </div>
  );
}
```

### When to Use UI State

- Modal open/close states
- Form input values (before submission)
- Accordion/dropdown expanded states
- Hover/focus states
- Animation states
- Temporary UI feedback

## Layer 2: Feature State (Jotai)

Use Jotai atoms for cross-component state sharing within a feature.

### Basic Atom Pattern

```typescript
// features/auth/atoms/atoms.ts
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
```

### Using Atoms in Components

```typescript
// features/auth/hooks/useAuth.ts
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { authStateAtom } from '../atoms/atoms';

// Read-only access
export function useAuthState() {
  return useAtomValue(authStateAtom);
}

// Write-only access
export function useSetAuthState() {
  return useSetAtom(authStateAtom);
}

// Read and write access
export function useAuth() {
  return useAtom(authStateAtom);
}
```

### Derived Atoms

```typescript
// Computed values from other atoms
export const isAuthenticatedAtom = atom((get) => {
  const auth = get(authStateAtom);
  return auth.isConnected && auth.authenticatedAgent !== undefined;
});

export const principalIdAtom = atom((get) => {
  return get(authStateAtom).principalId;
});
```

### Atom with Reducer Pattern

For complex state with multiple actions:

```typescript
// features/certificates/atoms/certificate-creator.atom.ts
import { atomWithReducer } from 'jotai/utils';

interface CreatorState {
  step: number;
  formData: Record<string, unknown>;
  uploadProgress: number;
  error: string | null;
}

type CreatorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_FORM_DATA'; data: Record<string, unknown> }
  | { type: 'SET_PROGRESS'; progress: number }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };

const initialState: CreatorState = {
  step: 0,
  formData: {},
  uploadProgress: 0,
  error: null,
};

function reducer(state: CreatorState, action: CreatorAction): CreatorState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_FORM_DATA':
      return { ...state, formData: action.data };
    case 'SET_PROGRESS':
      return { ...state, uploadProgress: action.progress };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const certificateCreatorAtom = atomWithReducer(initialState, reducer);
```

### Atom Patterns by Feature

| Feature | Atom | Purpose |
|---------|------|---------|
| auth | `authStateAtom` | Authentication state, agents, principal |
| certificates | `certificateCreatorAtom` | Multi-step creation wizard |
| certificates | `certificateFiltersAtom` | List filtering state |
| collections | `collectionCreatorAtom` | Collection creation state |
| collections | `collectionFiltersAtom` | List filtering state |
| templates | `templateEditorAtom` | Template editing state |
| template-renderer | `templateRendererAtom` | Rendering context |

### When to Use Jotai

- Authentication state
- Multi-step form wizard state
- Cross-component filter/search state
- Selected items (for bulk operations)
- Feature-level derived state
- State that persists across route changes (within feature)

## Layer 3: Server State (React Query)

Use TanStack Query for all canister data fetching and mutations.

### Query Key Factory Pattern

```typescript
// features/certificates/api/certificates.queries.ts

// Key factory - centralized key management
export const certificatesKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificatesKeys.all, 'list'] as const,
  list: (filters: CertificateFilters) => [...certificatesKeys.lists(), filters] as const,
  collection: (collectionId: string) => [...certificatesKeys.all, 'collection', collectionId] as const,
  details: () => [...certificatesKeys.all, 'detail'] as const,
  detail: (collectionId: string, tokenId: string) =>
    [...certificatesKeys.details(), collectionId, tokenId] as const,
  history: (collectionId: string, tokenId: string) =>
    [...certificatesKeys.detail(collectionId, tokenId), 'history'] as const,
};
```

### Query Hook Pattern

```typescript
// features/certificates/api/certificates.queries.ts
import { useQuery } from '@tanstack/react-query';
import { CertificatesService } from './certificates.service';
import { useAuthState } from '@/features/auth/hooks/useAuth';

export function useCollectionCertificates(collectionCanisterId: string) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: certificatesKeys.collection(collectionCanisterId),
    queryFn: () => CertificatesService.getCertificatesOf(
      authenticatedAgent!,
      collectionCanisterId
    ),
    enabled: !!authenticatedAgent && !!collectionCanisterId,
    staleTime: 5 * 60 * 1000, // 5 minutes (IC latency optimization)
  });
}

export function useCertificate(collectionId: string, tokenId: string) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: certificatesKeys.detail(collectionId, tokenId),
    queryFn: () => CertificatesService.getCertificateMetadata(
      authenticatedAgent!,
      collectionId,
      [tokenId]
    ),
    enabled: !!authenticatedAgent && !!collectionId && !!tokenId,
    select: (data) => data[0], // Return first item
  });
}
```

### Mutation Hook Pattern

```typescript
// features/certificates/api/certificates.queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMintCertificateWithTemplate() {
  const queryClient = useQueryClient();
  const { authenticatedAgent } = useAuthState();

  return useMutation({
    mutationFn: async (params: MintCertificateParams) => {
      return CertificatesService.mintCertificateWithTemplate(
        authenticatedAgent!,
        params
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.collection(variables.collectionId)
      });
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.all
      });
    },
    onError: (error) => {
      console.error('Mint failed:', error);
    },
  });
}
```

### Query Client Configuration

```typescript
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes (IC latency optimization)
      retry: 1,                      // Single retry (prevent excessive IC calls)
      refetchOnWindowFocus: false,   // IC doesn't benefit from frequent refetches
    },
  },
});
```

### Cache Invalidation Patterns

```typescript
// After successful mutation
queryClient.invalidateQueries({ queryKey: certificatesKeys.all });

// Specific collection
queryClient.invalidateQueries({
  queryKey: certificatesKeys.collection(collectionId)
});

// Exact match
queryClient.invalidateQueries({
  queryKey: certificatesKeys.detail(collectionId, tokenId),
  exact: true
});

// Optimistic update
queryClient.setQueryData(
  certificatesKeys.detail(collectionId, tokenId),
  (old) => ({ ...old, ...newData })
);
```

### When to Use React Query

- **All canister data fetching**
- Certificate lists and details
- Collection metadata
- Transaction history
- Template data
- Account information
- Any data that:
  - Comes from IC canisters
  - Needs caching
  - Needs invalidation on mutations
  - Benefits from loading/error states

## Service Layer Integration

Services handle canister communication; queries provide the React interface.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT                                            │
│  const { data, isLoading } = useCertificates();                             │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ calls
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUERY HOOK (certificates.queries.ts)                    │
│  useQuery({                                                                 │
│    queryKey: certificatesKeys.all,                                          │
│    queryFn: () => CertificatesService.fetchAll(agent),                      │
│  })                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ delegates to
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SERVICE CLASS (certificates.service.ts)                  │
│  static async fetchAll(agent: Agent) {                                      │
│    const actor = createCanisterActor(agent, canisterId, idlFactory);        │
│    const result = await actor.get_certificates();                           │
│    return result.map(transformNftToCertificate);                            │
│  }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ calls
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          IC CANISTER                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Rules Summary

| State Type | Library | Scope | Examples |
|------------|---------|-------|----------|
| UI State | `useState` | Component | Modals, inputs, hover |
| Feature State | Jotai | Feature/App | Auth, wizard, filters |
| Server State | React Query | App-wide, cached | Canister data |

### Decision Tree

```
Need to store state?
│
├─► Is it from IC canister?
│   └─► YES → React Query (useQuery/useMutation)
│
├─► Does multiple components need it?
│   └─► YES → Jotai atom
│
├─► Does it persist across routes?
│   └─► YES → Jotai atom
│
└─► Is it component-local UI?
    └─► YES → useState
```

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [DATA-FLOWS.md](./DATA-FLOWS.md) - Key data flow diagrams
- [CANISTER-INTEGRATION.md](./CANISTER-INTEGRATION.md) - IC integration details
