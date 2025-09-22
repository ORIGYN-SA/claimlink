# ClaimLink Frontend Development Guide

## Project Overview

ClaimLink is a React/TypeScript frontend application for an Internet Computer (ICP) dApp that enables users to create, share, and claim NFT links through campaigns, dispensers, and QR codes. The application supports two main token types: Certificates (integrator-only, verified assets) and NFTs (public minting).

## Development Environment

### Prerequisites

- Node.js 18+ and pnpm
- dfx (IC SDK) for local canister development
- Git

### Setup Instructions

```bash
# Install dependencies
pnpm install

# Start local IC replica (in separate terminal)
dfx start --clean

# Deploy local canisters
dfx deploy

# Start development server
pnpm dev
```

## Tech Stack

- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Jotai (atomic state management for both client and async state)
- **Styling**: Tailwind CSS with CSS variables
- **IC Integration**: @dfinity/agent, @dfinity/candid, @dfinity/principal

## Project Structure: Modern React Architecture

### Complete Directory Structure

```
src/
├── app/                          # Application-wide configuration (future)
│   ├── provider.tsx             # App-wide providers (Router, Jotai, etc.)
│   ├── router.tsx               # Router configuration
│   └── globals.css              # Global styles and Tailwind imports
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (other shadcn components)
│   ├── layout/                  # Layout components
│   │   ├── dashboard-layout.tsx
│   │   ├── headerbar.tsx
│   │   ├── sidebar.tsx
│   │   └── sidebar-nav-items.tsx
│   └── common/                  # Reusable business components
│       ├── account-menu.tsx
│       ├── search-input.tsx
│       ├── withdraw-dialog.tsx
│       ├── add-token-card/      # Generic add token card component
│       │   ├── add-token-card.tsx
│       │   └── index.ts
│       ├── token-card/          # Shared NFT/Certificate components
│       │   ├── token-card.tsx
│       │   ├── token.types.ts
│       │   └── index.ts
│       ├── token-grid-view/
│       │   ├── token-grid-view.tsx
│       │   └── index.ts
│       └── token-status-badge/
│           ├── token-status-badge.tsx
│           └── index.ts
├── routes/                      # TanStack Router file-based routing
│   ├── __root.tsx              # Root route with global layout
│   ├── index.tsx               # Home page (/)
│   ├── dashboard.tsx           # Dashboard page
│   ├── login.tsx               # Login page
│   ├── templates.tsx           # Templates page
│   ├── mint_nft.tsx           # NFT minting page
│   ├── account/
│   │   ├── index.tsx          # Account main page
│   │   ├── new.tsx            # Create new account
│   │   ├── edit_user.tsx      # Edit user profile
│   │   └── edit_company.tsx   # Edit company info
│   ├── collections/
│   │   ├── index.tsx          # Collections list
│   │   ├── new.tsx            # Create new collection
│   │   └── $collectionId.tsx  # Collection detail (dynamic)
│   └── mint_certificate/
│       ├── index.tsx          # Certificate minting list
│       └── new.tsx            # Create new certificate
├── features/                    # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-page.tsx
│   │   │   ├── wallet-connection-section.tsx
│   │   │   ├── integrator-login-section.tsx
│   │   │   ├── login-footer.tsx
│   │   │   └── wallet-icons.tsx
│   │   ├── hooks/              # Custom hooks (future)
│   │   ├── stores/             # State management (future)
│   │   ├── types/              # TypeScript types (future)
│   │   ├── utils/              # Auth utilities (future)
│   │   ├── index.ts            # Feature exports
│   │   └── README.md
│   ├── dashboard/
│   │   ├── api/                # Data fetching logic (future)
│   │   ├── components/
│   │   │   ├── dashboard-page.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── welcome-card.tsx
│   │   │   ├── feed-card.tsx
│   │   │   ├── mint-card.tsx
│   │   │   ├── certificate-list-card.tsx
│   │   │   ├── icons.tsx
│   │   │   └── index.ts
│   │   ├── hooks/              # Custom hooks (future)
│   │   ├── stores/             # Feature state management (future)
│   │   ├── types/
│   │   │   └── dashboard.types.ts
│   │   ├── utils/              # Feature utilities (future)
│   │   ├── index.ts            # Feature exports
│   │   └── README.md
│   ├── certificates/           # Certificate-specific logic
│   │   ├── components/
│   │   │   ├── add-certificate-card.tsx
│   │   │   ├── certificate-card.tsx
│   │   │   ├── certificate-grid-view.tsx
│   │   │   ├── certificate-list-view.tsx
│   │   │   └── certificate-status-badge.tsx
│   │   ├── types/
│   │   │   └── certificate.types.ts
│   │   └── index.ts
│   ├── nfts/                   # NFT-specific logic
│   │   ├── api/
│   │   │   ├── nfts.service.ts
│   │   │   └── nfts.queries.ts
│   │   ├── components/
│   │   │   └── nft-list.tsx
│   │   ├── hooks/              # Custom hooks (future)
│   │   ├── stores/             # State management (future)
│   │   ├── types/
│   │   │   └── nft.types.ts
│   │   ├── utils/              # Utilities (future)
│   │   └── index.ts
│   ├── mint-certificate/       # Certificate minting feature
│   │   ├── components/
│   │   │   ├── mint-certificate-page.tsx
│   │   │   ├── create-certificate-page.tsx
│   │   │   ├── collection-section.tsx
│   │   │   ├── company-form.tsx
│   │   │   ├── form-field.tsx
│   │   │   ├── image-upload-section.tsx
│   │   │   └── pricing-sidebar.tsx
│   │   ├── types/              # Feature types (future)
│   │   ├── utils/              # Feature utilities (future)
│   │   └── index.ts
│   ├── mint-nft/               # NFT minting feature
│   │   ├── api/                # Data fetching (future)
│   │   ├── components/
│   │   │   └── mint-nft-page.tsx
│   │   ├── hooks/              # Custom hooks (future)
│   │   ├── stores/             # State management (future)
│   │   ├── types/              # Feature types (future)
│   │   ├── utils/              # Feature utilities (future)
│   │   └── index.ts
│   ├── collections/            # Collections management
│   │   ├── components/
│   │   │   ├── collections-page.tsx
│   │   │   ├── collection-detail-page.tsx
│   │   │   ├── new-collection-page.tsx
│   │   │   ├── add-collection-card.tsx
│   │   │   ├── collection-card.tsx
│   │   │   ├── collection-grid-view.tsx
│   │   │   ├── collection-list-view.tsx
│   │   │   └── collection-status-badge.tsx
│   │   ├── types/
│   │   │   └── collection.types.ts
│   │   └── index.ts
│   ├── account/                # Account management
│   │   ├── components/
│   │   │   ├── account-page.tsx
│   │   │   ├── create-user-page.tsx
│   │   │   ├── edit-user-page.tsx
│   │   │   └── edit-company-page.tsx
│   │   └── index.ts
│   └── templates/              # Template management
│       ├── api/                # Data fetching (future)
│       ├── components/
│       │   ├── templates-page.tsx
│       │   ├── template-card.tsx
│       │   └── index.ts
│       ├── hooks/              # Custom hooks (future)
│       ├── stores/             # State management (future)
│       ├── types/
│       │   └── template.types.ts
│       ├── utils/              # Feature utilities (future)
│       ├── index.ts            # Feature exports
│       └── README.md
└── shared/                     # Shared utilities and configurations
    ├── api/                    # API utilities (future)
    ├── data/                   # Mock data
    │   ├── certificates.ts
    │   ├── collections.ts
    │   ├── templates.ts
    │   ├── users.ts
    │   └── index.ts
    ├── hooks/                  # Global hooks (future)
    └── ui/
        └── icons/
            └── index.tsx
```

## Token System Architecture (NFTs vs Certificates)

### Overview

ClaimLink supports two distinct token types that share UI components but have different business logic:

1. **Certificates**: Integrator-only digital certificates for real assets (gold, diamonds, watches)
2. **NFTs**: Public tokens that anyone can mint

### Shared Token Components

Located in `components/common/token-*`, these components handle both types:

```typescript
// components/common/token-card/token-card.tsx
interface TokenCardProps {
  title: string;
  collectionName: string;
  imageUrl: string;
  status: 'Minted' | 'Transferred' | 'Waiting' | 'Burned';
  date: string;
  showCertifiedBadge?: boolean; // ORIGYN badge for certificates
  onClick?: () => void;
}

export function TokenCard({
  showCertifiedBadge = false,
  ...props
}: TokenCardProps) {
  // Renders card with conditional ORIGYN badge
}
```

### Feature Separation

**Certificates** (`features/certificates/`):

- Integrator authentication required
- ORIGYN verification badge
- Restricted minting permissions
- Real-world asset metadata

**NFTs** (`features/nfts/`):

- Public minting access
- No certification badge
- Open marketplace features
- Digital-native metadata

### Usage Pattern

```typescript
// features/mint-certificate/components/mint-certificate-page.tsx
import { TokenGridView } from '@/components/common/token-grid-view';
import { useIntegratorAuth } from '@/features/certificates/hooks/use-integrator-auth';

export function MintCertificatePage() {
  const { isIntegrator } = useIntegratorAuth();

  if (!isIntegrator) {
    return <IntegratorOnlyMessage />;
  }

  return (
    <TokenGridView
      tokens={certificates}
      showCertifiedBadge={true}  // Shows ORIGYN badge
      addButtonText="Create a certificate"
    />
  );
}

// features/mint-nft/components/mint-nft-page.tsx
export function MintNFTPage() {
  return (
    <TokenGridView
      tokens={nfts}
      showCertifiedBadge={false}  // No badge for NFTs
      addButtonText="Mint an NFT"
    />
  );
}
```

## Jotai State Management

### Setup

```typescript
// app/provider.tsx (when implemented)
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';

export function AppProvider() {
  return (
    <JotaiProvider>
      <RouterProvider router={router} />
      <DevTools />
    </JotaiProvider>
  );
}
```

### Atom Patterns

#### Basic Atoms

```typescript
// features/certificates/atoms/certificates.atoms.ts (future implementation)
import { atom } from 'jotai';
import type { Certificate } from '../types/certificate.types';

// Primitive atoms
export const certificatesAtom = atom<Certificate[]>([]);
export const selectedCertificateAtom = atom<Certificate | null>(null);
export const certificateFiltersAtom = atom({
  status: 'all',
  search: '',
  page: 1,
});

// Derived atoms (computed)
export const filteredCertificatesAtom = atom((get) => {
  const certificates = get(certificatesAtom);
  const filters = get(certificateFiltersAtom);

  return certificates.filter(cert => {
    if (filters.status !== 'all' && cert.status !== filters.status) {
      return false;
    }
    if (filters.search && !cert.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });
});

// Write-only atoms (actions)
export const updateFiltersAtom = atom(
  null,
  (get, set, update: Partial<typeof certificateFiltersAtom>) => {
    const current = get(certificateFiltersAtom);
    set(certificateFiltersAtom, { ...current, ...update });
  }
);
```

#### Async Atoms for API Calls

```typescript
// features/certificates/atoms/certificates-async.atoms.ts (future implementation)
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { certificateService } from '../api/certificates.service';

// Async atom for fetching certificates
export const fetchCertificatesAtom = atom(async () => {
  const result = await certificateService.fetchAll();
  return result;
});

// Loadable wrapper for handling loading/error states
export const certificatesLoadableAtom = loadable(fetchCertificatesAtom);

// Atom with refresh capability
export const certificatesWithRefreshAtom = atom(
  async (get) => {
    const trigger = get(refreshTriggerAtom);
    return await certificateService.fetchAll();
  }
);

const refreshTriggerAtom = atom(0);
export const refreshCertificatesAtom = atom(
  null,
  (get, set) => {
    set(refreshTriggerAtom, get(refreshTriggerAtom) + 1);
  }
);

// Async mutation atom for minting
export const mintCertificateAtom = atom(
  null,
  async (get, set, data: CreateCertificateInput) => {
    try {
      const result = await certificateService.mint(data);

      // Update local state optimistically
      const current = get(certificatesAtom);
      set(certificatesAtom, [...current, result]);

      return result;
    } catch (error) {
      throw error;
    }
  }
);

// Atom family for individual certificate status polling
import { atomFamily } from 'jotai/utils';

export const certificateStatusFamily = atomFamily(
  (id: string) => atom(async () => {
    return await certificateService.getStatus(id);
  })
);
```

#### Global Atoms

```typescript
// shared/atoms/global.atoms.ts (future implementation)
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Persisted atoms (localStorage)
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'light');
export const sidebarOpenAtom = atomWithStorage('sidebarOpen', true);

// Session atoms
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isIntegratorAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === 'integrator';
});

// Loading states
export const globalLoadingAtom = atom(false);
export const loadingMessageAtom = atom('');
```

### Using Atoms in Components

```typescript
// features/certificates/components/certificate-list.tsx (future implementation)
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  certificatesLoadableAtom,
  filteredCertificatesAtom,
  updateFiltersAtom,
  mintCertificateAtom
} from '../atoms/certificates-async.atoms';

export function CertificateList() {
  // Read atom value
  const certificatesLoadable = useAtomValue(certificatesLoadableAtom);
  const filteredCertificates = useAtomValue(filteredCertificatesAtom);

  // Write-only atom
  const updateFilters = useSetAtom(updateFiltersAtom);
  const mintCertificate = useSetAtom(mintCertificateAtom);

  // Read and write
  const [selectedCert, setSelectedCert] = useAtom(selectedCertificateAtom);

  // Handle loading states
  if (certificatesLoadable.state === 'loading') {
    return <Spinner />;
  }

  if (certificatesLoadable.state === 'hasError') {
    return <Error error={certificatesLoadable.error} />;
  }

  const handleMint = async (data: CreateCertificateInput) => {
    try {
      await mintCertificate(data);
      toast.success('Certificate minted!');
    } catch (error) {
      toast.error('Failed to mint certificate');
    }
  };

  return (
    <div>
      <SearchInput
        onChange={(search) => updateFilters({ search })}
      />
      <TokenGridView
        tokens={filteredCertificates}
        showCertifiedBadge={true}
        onMint={handleMint}
      />
    </div>
  );
}
```

## Component Organization: Four-Layer System

### 1. **`components/ui/` - shadcn/ui Foundation**

Pre-built, customizable UI primitives from shadcn/ui

### 2. **`components/layout/` - Layout Components**

Structural layout components (DashboardLayout, HeaderBar, Sidebar)

### 3. **`components/common/` - Reusable Business Components**

Application-specific reusable components that combine UI primitives with business logic. Includes shared token components used by both NFTs and Certificates.

### 4. **`features/[feature]/components/` - Feature-Specific Components**

Components that belong to a specific feature and are not reused elsewhere

## Layout System & Component Integration

### DashboardLayout System

The main layout wrapper that combines HeaderBar, Sidebar, and page content:

```typescript
<DashboardLayout>
  <PageContent />
</DashboardLayout>
```

**DashboardLayout handles**:

- Page-level spacing and padding (`p-[24px]`)
- Background styling (`bg-[#fcfafa]`)
- Container boundaries (`rounded-[20px] overflow-hidden`)
- HeaderBar positioning and title management
- Back button navigation logic
- Content area margin (`mt-6`)

**Individual page components should NOT**:

- Add their own background colors
- Manage page-level padding
- Apply rounded corners
- Handle header spacing or navigation

## Service Layer & API Organization

### API Client Structure (Future Implementation)

```typescript
// shared/api/client.ts
import { Actor } from '@dfinity/agent';

export const apiClient = {
  async createActor(canisterId: string) {
    const agent = await createAgent({
      host: import.meta.env.VITE_IC_HOST || 'http://127.0.0.1:4943',
    });

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  }
};
```

### Service Implementation Pattern

```typescript
// features/certificates/api/certificate.service.ts (future implementation)
export const certificateService = {
  async fetchAll(): Promise<Certificate[]> {
    const actor = await apiClient.createActor(CLAIMLINK_CANISTER_ID);
    const result = await actor.get_certificates();

    if ('err' in result) {
      throw new Error(result.err);
    }

    return result.ok || [];
  },

  async mint(data: CreateCertificateInput): Promise<Certificate> {
    const actor = await apiClient.createActor(CLAIMLINK_CANISTER_ID);
    const result = await actor.mint_certificate(data);

    if ('err' in result) {
      throw new Error(result.err);
    }

    return result.ok;
  }
};
```

## Routing Structure (TanStack Router)

### File-Based Routes

```
src/routes/
├── __root.tsx              # Root layout with providers
├── index.tsx               # Home page (/)
├── dashboard.tsx           # Dashboard page
├── login.tsx               # Login page
├── templates.tsx           # Templates page
├── mint_nft.tsx           # NFT minting page
├── account/
│   ├── index.tsx          # Account main page
│   ├── new.tsx            # Create new account
│   ├── edit_user.tsx      # Edit user profile
│   └── edit_company.tsx   # Edit company info
├── collections/
│   ├── index.tsx          # Collections list
│   ├── new.tsx            # Create new collection
│   └── $collectionId.tsx  # Collection detail (dynamic)
└── mint_certificate/
    ├── index.tsx          # Certificate minting list
    └── new.tsx            # Create new certificate
```

### Route Components Pattern

```typescript
// routes/mint_certificate/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout';
import { MintCertificatePage } from '@/features/mint-certificate';

export const Route = createFileRoute('/mint_certificate/')({
  component: MintCertificateRoute,
});

function MintCertificateRoute() {
  return (
    <DashboardLayout>
      <MintCertificatePage />
    </DashboardLayout>
  );
}
```

## Import Rules & Path Aliases

```json
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/features/*": ["./src/features/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/routes/*": ["./src/routes/*"],
  "@/assets/*": ["./src/assets/*"]
}
```

### Import Order Best Practices

```typescript
// 1. React/External libraries
import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';

// 2. UI Components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Layout Components
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// 4. Common/Shared Components
import { TokenCard } from '@/components/common/token-card';

// 5. Feature Components
import { CertificateList } from '@/features/certificates/components';

// 6. Atoms (future)
import { certificatesAtom, mintCertificateAtom } from '@/features/certificates/atoms';

// 7. API/Services
import { certificateService } from '@/features/certificates/api/certificate.service';

// 8. Hooks
import { useIntegratorAuth } from '@/features/certificates/hooks';

// 9. Utils/Lib
import { cn } from '@/lib/utils';

// 10. Types
import type { Certificate } from '@/features/certificates/types';
```

## File Naming Conventions

|Type|Convention|Examples|
|---|---|---|
|**Components**|kebab-case|`token-card.tsx`, `nft-selector.tsx`|
|**Pages/Routes**|kebab-case or snake_case (match routes)|`mint_certificate.tsx`, `dashboard.tsx`|
|**Hooks**|camelCase with "use"|`useCertificates.ts`, `use-integrator-auth.ts`|
|**Atoms**|kebab-case with suffix|`certificates.atoms.ts`, `nfts-async.atoms.ts`|
|**Services**|kebab-case with suffix|`certificate.service.ts`, `nft.service.ts`|
|**Types**|kebab-case with suffix|`certificate.types.ts`, `token.types.ts`|

## Design System Implementation

### Figma Design Variables (CSS Custom Properties)

```css
/* From styles.css - Design System Colors */
:root {
  /* Core Colors */
  --slate: 206 8% 48%;        /* #69737c - Neutral/Slate */
  --cobalt: 217 77% 13%;      /* #061937 - Contrast/Cobalt */
  --charcoal: 213 13% 16%;    /* #222526 - Neutral/Charcoal */
  --mouse: 0 0% 88%;          /* #e1e1e1 - Neutral/Mouse */
  --paper: 252 98% 98%;       /* #fcfafa - Neutral/Paper */
  --azure: 186 100% 76%;      /* #85f1ff - Contrast/Azure */
  --space-purple: 249 87% 68%; /* #615bff - Space Purple */
  --jade: 153 47% 55%;        /* #50be8f - Jade */
  --jade-90: 153 47% 89%;     /* #c7f2e0 - Jade/JD90 */
  --candy-floss: 323 100% 66%; /* #ff55c5 - Candy Floss */
  --candy-floss-95: 323 100% 94%; /* #ffd4f0 - Candy Floss/CF95 */
  --celeste: 183 64% 79%;     /* #cde9ec - Contrast/Celeste */
  --celeste-40: 183 64% 79% / 0.4; /* #cde9ec66 - Contrast/Celeste40 */
}
```

### Component Priority Order

1. Use shadcn/ui component if available
2. Extend shadcn component with className if needed
3. Create custom component only if truly unique

### Figma to shadcn Mapping

|Figma Component|shadcn/ui Component|Notes|
|---|---|---|
|Button/Primary|`<Button variant="default">`|Adjust CSS variables|
|Card|`<Card>`|Use CardHeader, CardContent|
|Token Card|`<TokenCard>` (custom)|Shared component for NFTs/Certificates|
|Status Badge|`<Badge>` + custom|Extended for token statuses|

## Mock Data System

Currently using mock data located in `shared/data/`:

```typescript
// shared/data/certificates.ts
export const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "The midsummer Night Dream",
    collectionName: "Collection's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    status: "Minted",
    date: "20 Feb, 2024"
  },
  // ... more mock data
];

// shared/data/index.ts
export * from './certificates';
export * from './collections';
export * from './templates';
export * from './users';
```

This mock data system will be replaced with real API calls when backend integration is implemented.

## Testing Requirements (Future Implementation)

### Component Testing

```typescript
// features/certificates/components/__tests__/certificate-card.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { TokenCard } from '@/components/common/token-card';

describe('TokenCard', () => {
  it('shows ORIGYN badge for certificates', () => {
    render(
      <Provider>
        <TokenCard {...mockCertificate} showCertifiedBadge={true} />
      </Provider>
    );
    expect(screen.getByTestId('origyn-badge')).toBeInTheDocument();
  });

  it('hides badge for NFTs', () => {
    render(
      <Provider>
        <TokenCard {...mockNFT} showCertifiedBadge={false} />
      </Provider>
    );
    expect(screen.queryByTestId('origyn-badge')).not.toBeInTheDocument();
  });
});
```

### Atom Testing

```typescript
// features/certificates/atoms/__tests__/certificates.atoms.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useAtom } from 'jotai';
import { Provider } from 'jotai';
import { certificatesAtom, filteredCertificatesAtom } from '../certificates.atoms';

describe('certificatesAtom', () => {
  it('filters certificates correctly', () => {
    const wrapper = ({ children }) => <Provider>{children}</Provider>;

    const { result } = renderHook(() => {
      const [certs, setCerts] = useAtom(certificatesAtom);
      const filtered = useAtomValue(filteredCertificatesAtom);
      return { certs, setCerts, filtered };
    }, { wrapper });

    act(() => {
      result.current.setCerts(mockCertificates);
    });

    expect(result.current.filtered).toHaveLength(mockCertificates.length);
  });
});
```

## Common Pitfalls to Avoid

### DON'T

- Mix NFT and Certificate business logic
- Create duplicate token components for each type
- Forget to check integrator permissions for certificates
- Create circular atom dependencies
- Use atoms for purely local component state
- Override DashboardLayout styling in page components
- Import from feature components across features

### DO

- Use shared token components with conditional props
- Leverage Jotai atoms for global and async state
- Separate business logic in feature folders
- Use loadable atoms for async operations
- Keep atoms small and focused
- Follow the established layout system
- Keep feature boundaries clean

## Quick Reference

### Jotai Setup (Future)

```bash
pnpm add jotai jotai-devtools
```

### Create New Token Feature

1. Add feature folder: `features/[token-type]/`
2. Create atoms: `stores/[token-type].atoms.ts` (future)
3. Create async atoms: `stores/[token-type]-async.atoms.ts` (future)
4. Create service: `api/[token-type].service.ts`
5. Add types: `types/[token-type].types.ts`
6. Use shared components from `components/common/token-*`
7. Create feature-specific components in `features/[token-type]/components/`
8. Export everything through `features/[token-type]/index.ts`

### Common Jotai Patterns (Future Implementation)

```typescript
// Basic atom
const countAtom = atom(0);

// Derived atom
const doubleAtom = atom((get) => get(countAtom) * 2);

// Async atom
const fetchAtom = atom(async () => await fetchData());

// Write-only atom
const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1);
});

// Atom with storage
const themeAtom = atomWithStorage('theme', 'light');
```

### Available shadcn/ui Components

```bash
pnpm dlx shadcn-ui@latest add [component-name]
```

Current components installed:

- button, card, dialog, dropdown-menu, input, select, sheet, table, textarea
- avatar, badge

## Development Workflow

### Adding a New Feature

1. **Create feature directory structure**:

    ```bash
    mkdir -p src/features/[feature-name]/{components,api,hooks,stores,types,utils}
    ```

2. **Create index.ts for exports**:

    ```typescript
    // features/[feature-name]/index.ts
    export { FeaturePage } from './components/feature-page';
    export type { FeatureType } from './types/feature.types';
    ```

3. **Add route if needed**:

    ```typescript
    // routes/feature-name.tsx
    import { createFileRoute } from '@tanstack/react-router';
    import { DashboardLayout } from '@/components/layout';
    import { FeaturePage } from '@/features/feature-name';

    export const Route = createFileRoute('/feature-name')({
      component: FeatureRoute,
    });

    function FeatureRoute() {
      return (
        <DashboardLayout>
          <FeaturePage />
        </DashboardLayout>
      );
    }
    ```

4. **Add navigation if needed**:

    ```typescript
    // components/layout/sidebar-nav-items.tsx
    const navItems = [
      // ... existing items
      {
        title: "Feature Name",
        url: "/feature-name",
        icon: <Icon.FeatureName />,
      },
    ];
    ```


### Creating Shared Components

When creating components that will be shared across features:

1. **Place in `components/common/`**

2. **Create component directory**:

    ```bash
    mkdir src/components/common/new-component
    touch src/components/common/new-component/{index.ts,new-component.tsx}
    ```

3. **Follow the shared component pattern**:

    ```typescript
    // components/common/new-component/new-component.tsx
    interface NewComponentProps {
      // Props that work for both NFTs and Certificates
      title: string;
      status: TokenStatus;
      showSpecialBadge?: boolean; // For feature-specific display
    }

    export function NewComponent({
      showSpecialBadge = false,
      ...props
    }: NewComponentProps) {
      return (
        <div>
          {/* Base component logic */}
          {showSpecialBadge && <SpecialBadge />}
        </div>
      );
    }
    ```

4. **Export from index.ts**:

    ```typescript
    // components/common/new-component/index.ts
    export { NewComponent } from './new-component';
    export type { NewComponentProps } from './new-component';
    ```

5. **Add to common index**:

    ```typescript
    // components/common/index.ts
    export * from './new-component';
    ```


### Page Component Structure

All page components should follow this structure:

```typescript
// features/[feature]/components/feature-page.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common';
import { FeatureCard } from './feature-card';

export function FeaturePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Page logic here

  return (
    <div className="space-y-6">
      {/* Page description (if needed) */}
      <div>
        <p className="text-[#69737c] text-base leading-8">
          Page description text
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Content here */}
      </div>
    </div>
  );
}
```

**Key Points**:

- Use `space-y-6` for main page spacing
- Don't add backgrounds or padding (handled by DashboardLayout)
- Use semantic HTML structure
- Include TypeScript types for all props

## Backend Integration Strategy (Future)

When integrating with the Internet Computer backend:

### 1. **Service Layer First**

Replace mock data with real API calls:

```typescript
// features/certificates/api/certificate.service.ts
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './certificate.did.js';

const CERTIFICATE_CANISTER_ID = process.env.REACT_APP_CERTIFICATE_CANISTER_ID;

export const certificateService = {
  async getActor() {
    const agent = new HttpAgent({
      host: process.env.REACT_APP_IC_HOST || 'https://ic0.app',
    });

    if (process.env.NODE_ENV === 'development') {
      await agent.fetchRootKey();
    }

    return Actor.createActor(idlFactory, {
      agent,
      canisterId: CERTIFICATE_CANISTER_ID,
    });
  },

  async fetchAll(): Promise<Certificate[]> {
    const actor = await this.getActor();
    const result = await actor.get_certificates();

    if ('err' in result) {
      throw new Error(result.err);
    }

    return result.ok.map(cert => ({
      id: cert.id.toString(),
      title: cert.title,
      collectionName: cert.collection_name,
      imageUrl: cert.image_url,
      status: cert.status,
      date: new Date(Number(cert.created_at) / 1000000).toLocaleDateString(),
    }));
  }
};
```

### 2. **State Management Integration**

Use Jotai atoms to manage API state:

```typescript
// features/certificates/stores/certificate.atoms.ts
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { certificateService } from '../api/certificate.service';

export const fetchCertificatesAtom = atom(() => certificateService.fetchAll());
export const certificatesLoadableAtom = loadable(fetchCertificatesAtom);
```

### 3. **Component Integration**

Update components to use real data:

```typescript
// features/certificates/components/certificate-list.tsx
import { useAtomValue } from 'jotai';
import { certificatesLoadableAtom } from '../stores/certificate.atoms';

export function CertificateList() {
  const certificatesLoadable = useAtomValue(certificatesLoadableAtom);

  if (certificatesLoadable.state === 'loading') {
    return <div>Loading certificates...</div>;
  }

  if (certificatesLoadable.state === 'hasError') {
    return <div>Error loading certificates</div>;
  }

  return (
    <TokenGridView
      tokens={certificatesLoadable.data}
      showCertifiedBadge={true}
    />
  );
}
```

## Error Handling Patterns

### Global Error Boundary

```typescript
// components/common/error-boundary.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// shared/api/error-handler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
}
```

## Performance Optimization

### Code Splitting by Route

```typescript
// routes/heavy-feature.tsx
import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

const HeavyFeaturePage = lazy(() =>
  import('@/features/heavy-feature').then(m => ({ default: m.HeavyFeaturePage }))
);

export const Route = createFileRoute('/heavy-feature')({
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>
        <HeavyFeaturePage />
      </DashboardLayout>
    </Suspense>
  ),
});
```

### Atom Optimization

```typescript
// Use atomic updates for better performance
export const updateCertificateAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Certificate> }) => {
    const certificates = get(certificatesAtom);
    const updated = certificates.map(cert =>
      cert.id === id ? { ...cert, ...updates } : cert
    );
    set(certificatesAtom, updated);
  }
);

// Use atom families for individual items
export const certificateFamily = atomFamily(
  (id: string) => atom(
    (get) => get(certificatesAtom).find(cert => cert.id === id),
    (get, set, certificate: Certificate) => {
      set(updateCertificateAtom, { id, updates: certificate });
    }
  )
);
```

## Accessibility Guidelines

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
// Example: Token card with proper keyboard support
export function TokenCard({ token, onClick }: TokenCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(token);
    }
  };

  return (
    <Card
      tabIndex={0}
      role="button"
      onClick={() => onClick?.(token)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:ring-2 focus:ring-blue-500"
    >
      {/* Card content */}
    </Card>
  );
}
```

### ARIA Labels

```typescript
// Use semantic HTML and ARIA labels
<Button
  aria-label={`Delete certificate ${certificate.title}`}
  onClick={() => handleDelete(certificate.id)}
>
  <TrashIcon aria-hidden="true" />
</Button>
```

### Color Contrast

All text colors in the design system meet WCAG 2.1 AA standards:

- `--charcoal` (#222526) on white backgrounds
- `--slate` (#69737c) for secondary text
- `--cobalt` (#061937) for high contrast elements

## Deployment Configuration

### Environment Variables

```typescript
// shared/config/env.ts
export const env = {
  NODE_ENV: import.meta.env.NODE_ENV,
  IC_HOST: import.meta.env.VITE_IC_HOST || 'https://ic0.app',
  CERTIFICATE_CANISTER_ID: import.meta.env.VITE_CERTIFICATE_CANISTER_ID,
  NFT_CANISTER_ID: import.meta.env.VITE_NFT_CANISTER_ID,
  CLAIMLINK_CANISTER_ID: import.meta.env.VITE_CLAIMLINK_CANISTER_ID,
} as const;
```

### Build Configuration

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Security Considerations

### Input Validation

```typescript
// shared/lib/validations.ts
import { z } from 'zod';

export const certificateSchema = z.object({
  title: z.string().min(1).max(100),
  collectionName: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
```

### Principal Validation

```typescript
// shared/utils/validation.ts
import { Principal } from '@dfinity/principal';

export function isValidPrincipal(text: string): boolean {
  try {
    Principal.fromText(text);
    return true;
  } catch {
    return false;
  }
}
```

## Migration Plan: Current to Target Architecture

### Phase 1: Foundation (Immediate)

1. ✅ Already implemented: Basic routing structure with TanStack Router
2. ✅ Already implemented: shadcn/ui components and design system
3. ✅ Already implemented: Feature-based organization
4. ✅ Already implemented: Shared token components
5. ✅ Already implemented: Mock data system

### Phase 2: State Management (Next Sprint)

1. Install and configure Jotai
2. Create global atoms in `shared/atoms/`
3. Migrate mock data to atoms
4. Add loading and error states
5. Implement atom devtools

### Phase 3: Backend Integration (Following Sprint)

1. Create IC agent configuration
2. Generate Candid interfaces
3. Implement service layer
4. Replace mock data with API calls
5. Add authentication flow

### Phase 4: Testing & Polish (Final Sprint)

1. Add component testing with Vitest
2. Add E2E testing with Playwright
3. Performance optimization
4. Accessibility audit
5. Production deployment

## Current Status & Next Steps

### ✅ Already Implemented

- Complete routing structure with TanStack Router
- shadcn/ui component library integration
- Feature-based architecture with proper separation
- Shared token components for NFTs and Certificates
- Layout system with DashboardLayout
- Mock data system for development
- Design system implementation with CSS variables
- All major pages (Dashboard, Templates, Collections, Account, Mint Certificate, Mint NFT)

### 🔄 In Progress

- Finalizing page component implementations
- Refining shared component APIs
- Completing mock data for all features

### ⏳ Next Steps (Priority Order)

1. **Install Jotai** and set up basic state management
2. **Create service layer** for IC integration
3. **Add authentication** and user management
4. **Replace mock data** with real API calls
5. **Add comprehensive testing**
6. **Performance optimization** and bundle analysis

### 📋 Immediate Action Items

1. Add Jotai to project dependencies
2. Create `shared/atoms/global.atoms.ts` for app-wide state
3. Set up `app/provider.tsx` with Jotai provider
4. Create first API service in `features/certificates/api/`
5. Add TypeScript strict mode configuration

## Questions or Updates?

This document is the **source of truth** for the ClaimLink frontend architecture. Update this file immediately when:

- New features are added
- Architecture decisions change
- New patterns are established
- Dependencies are updated

For feature-specific guidelines, create `features/[feature]/README.md` files following the examples in `features/dashboard/README.md` and `features/auth/README.md`.

**Remember**: This is a living document that should evolve with the project. Keep it accurate and comprehensive to maintain development velocity and code quality.
