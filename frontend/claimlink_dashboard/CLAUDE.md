# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
pnpm install              # Install dependencies (use pnpm, not npm/yarn)
pnpm dev                  # Start dev server (http://localhost:5173)

# Local IC Development
dfx start --clean         # Start local IC replica
dfx deploy                # Deploy canisters locally

# Quality & Build
pnpm lint                 # Run ESLint
pnpm build                # Build for production (TypeScript + Vite)
pnpm preview              # Preview production build
```

## High-Level Architecture

### Platform & Purpose
ClaimLink "Minting Studio" - A React dashboard for NFT and Certificate minting on the Internet Computer (ICP) blockchain. The app manages two distinct token types:
- **Certificates**: Integrator-only, verified real-world assets (gold, diamonds, watches) with ORIGYN badge
- **NFTs**: Public minting, digital collectibles

Both share UI components with conditional rendering via props (e.g., `showCertifiedBadge`).

### Core Technology Stack
- **Frontend**: React 19.1 + TypeScript 5.8 + Vite 7.1
- **Routing**: TanStack Router 1.131 (file-based, auto code-splitting)
- **State Management**: Jotai 2.14 (atomic state) + TanStack Query 5.87 (server state)
- **UI**: shadcn/ui (Radix UI + Tailwind CSS 4.1)
- **Forms**: TanStack React Form 1.23
- **Blockchain**: @dfinity/agent 2.4 + @nfid/identitykit 1.0 (authentication)
- **Tokens**: ICP, GLDT, OGY, ckUSDT ledger integrations

### Project Structure (4-Layer Architecture)

```
src/
├── routes/                    # TanStack Router (file-based routing)
│   └── __root.tsx            # Root layout with AuthProvider
├── features/                  # Business logic modules (dashboard, templates, collections, campaigns, etc.)
│   └── [feature]/
│       ├── api/              # Service layer pattern
│       │   ├── *.service.ts  # Business logic & canister calls
│       │   └── *.queries.ts  # TanStack Query hooks
│       ├── components/       # Feature-specific UI
│       ├── stores/           # Jotai atoms
│       └── types/
├── components/
│   ├── ui/                   # shadcn/ui primitives (20+ components)
│   ├── layout/               # DashboardLayout, Sidebar, HeaderBar
│   └── common/               # Reusable business components (token-card, token-grid-view, etc.)
└── services/                 # IC Canister integrations (ledger, nft, swap, governance, etc.)
    └── [canister]/
        ├── hooks/            # useMutation hooks for canister operations
        ├── idlFactory.js     # Candid interface
        └── interfaces.ts
```

### Key Architectural Patterns

**1. Authentication Flow (NFID IdentityKit)**
- `AuthProvider` wraps app in `__root.tsx`
- Creates both authenticated & unauthenticated agents
- Stores principal ID and agents in Jotai atom (`authStateAtom`)
- Auto-navigation: login → dashboard on connect, dashboard → login on disconnect
- Environment-specific config for localhost vs production signing

**2. State Management Layers**
```typescript
// Layer 1: UI State (local component state)
const [isOpen, setIsOpen] = useState(false);

// Layer 2: Feature State (Jotai atoms)
const authState = useAtom(authStateAtom); // Cross-component sharing

// Layer 3: Server State (TanStack Query)
const { data } = useNFTs(); // Canister data fetching
```

**Rules:**
- Local state: UI-only concerns (modals, toggles, form inputs)
- Jotai atoms: Feature-level state, cross-component data sharing
- TanStack Query: ALL server/canister data fetching and mutations

**3. Service Layer Pattern**
```typescript
// features/[feature]/api/[feature].service.ts - Business logic
export class NFTService {
  static async fetchNFTs(): Promise<NFT[]> {
    const actor = Actor.createActor(idlFactory, { agent, canisterId });
    return await actor.get_nfts();
  }
}

// features/[feature]/api/[feature].queries.ts - React Query hooks
export const useNFTs = () => {
  return useQuery({
    queryKey: nftKeys.list(),
    queryFn: () => NFTService.fetchNFTs(),
  });
};
```

**Never call IC canister methods directly from components.** Always use the service layer.

**4. IC Canister Integration Flow**
```
Component → Hook (TanStack Query/Mutation) → Service Layer → Actor (Candid) → IC Canister
```

**5. Layout System Rules**
`DashboardLayout` handles:
- Page-level spacing (`p-[24px]`)
- Background styling (`bg-[#fcfafa]`)
- HeaderBar with dynamic titles and back navigation
- Sidebar (250px fixed width)

**Individual pages should NOT:**
- Add backgrounds or padding
- Handle navigation UI
- Apply rounded corners

**6. Routing Pattern**
```typescript
// routes/[feature]/index.tsx
export const Route = createFileRoute('/feature')({
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

Route tree is auto-generated in `routeTree.gen.ts` by TanStack Router plugin.

### Import Path Aliases

```typescript
"@/*"           → "./src/*"
"@services/*"   → "./src/services/*"
"@components/*" → "./src/components/*"
"@hooks/*"      → "./src/hooks/*"
"@utils/*"      → "./src/utils/*"
"@assets/*"     → "./src/assets/*"
"@shared/*"     → "./src/shared/*"
```

### File Naming Conventions
- **Components**: kebab-case (`token-card.tsx`)
- **Routes**: kebab-case or snake_case matching URL (`mint_certificate.tsx`)
- **Hooks**: camelCase with "use" prefix (`useFetchNFTs.tsx`)
- **Services**: kebab-case with suffix (`nfts.service.ts`, `nfts.queries.ts`)
- **Types**: kebab-case with suffix (`token.types.ts`)

### Design System (CSS Custom Properties)

Located in `src/styles.css`:
```css
--charcoal: #222526      /* Primary dark text */
--slate: #69737c         /* Secondary text */
--paper: #fcfafa         /* Background */
--azure: #85f1ff         /* Accent */
--jade: #50be8f          /* Success */
--candy-floss: #ff55c5   /* Highlight */
```

### Component Priority Order
1. Use **shadcn/ui** component if available
2. Extend with `className` prop if needed
3. Create custom component only if truly unique functionality required

### Environment Configuration

Create `.env` file (see `env.example`):
- Canister IDs for all integrated services
- `VITE_IC_HOST` for network selection
- NFID configuration (requires special localhost setup for signing)

### Current Development State
- **Mock Data**: Using `shared/data/` for development
- **IC Integration**: In progress, service hooks being implemented
- **Testing**: Setup exists (Vitest, Testing Library) but no tests written yet
- **Phase**: UI complete, migrating to full IC canister integration

### Important Notes
- **No Hot Module Replacement for Routes**: Route changes require dev server restart
- **Query Client Config**: 5-minute stale time, single retry, no refetch on window focus (optimized for IC latency)
- **TypeScript**: Strict mode enabled, no unused locals/parameters allowed
- **ESLint**: Currently 57 errors exist (mostly `any` types and unused variables)

## Additional Documentation

For comprehensive project details, architecture diagrams, migration plans, and development guidelines, see **AGENTS.md** (43KB detailed guide covering all patterns, Jotai implementation roadmap, and component organization rules).

For setup instructions and tech stack overview, see **README.md**.
