# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClaimLink is a certificate minting platform built on the Internet Computer (ICP). It consists of a Rust-based backend canister system and a React/TypeScript frontend dashboard. The project uses a monorepo structure managed with Cargo workspaces (backend) and pnpm (frontend).

**Token Architecture:**
All tokens in ClaimLink are ORIGYN NFTs (ICRC-7 standard) at the technical level. They represent verified real-world assets (gold, diamonds, watches) with the ORIGYN badge.

**Naming Convention (Important!):**
- **Backend/IC APIs**: Use "NFT" terminology (e.g., `get_nft_details`, `NftDetails`, `get_collection_nfts`)
  - This reflects the technical reality - all tokens are ORIGYN NFTs implementing ICRC-7 standard
- **Frontend/UI**: Use "Certificate" terminology (e.g., `Certificate` type, `MintCertificatePage`)
  - This reflects the business domain - tokens represent certified real-world assets
- **Service/Transform Layer**: Bridges between NFT (technical) and Certificate (business) domains
  - Example: `transformNftDetailsToCertificate()` converts IC API responses to frontend types

This dual naming is **intentional** and should be maintained. There is only ONE token type, just different terminology at different layers.

## Essential Commands

### Full Stack Development

**Start local IC replica:**
```bash
dfx start --clean
```

**Deploy all canisters locally:**
```bash
dfx deploy
```

### Backend (Rust Canisters)

All backend commands must be run from repository root:

**Build specific canister:**
```bash
./scripts/build-canister.sh claimlink
```

**Build with integration test features:**
```bash
./scripts/build-canister.sh --integration-test claimlink
```

**Build all canisters:**
```bash
./scripts/build-all-canister.sh
```

**Generate Candid interface:**
```bash
./scripts/generate-did.sh claimlink
```

**Run integration tests:**
```bash
./scripts/run-integration-tests.sh              # With rebuild
./scripts/run-integration-tests.sh --no-build   # Without rebuild
```

**Run unit tests:**
```bash
cargo test -p claimlink
cargo test -p integration_tests
cargo test -p types
```

**Lint:**
```bash
cargo clippy
```

**Deploy to network:**
```bash
./scripts/deploy-backend-canister.sh claimlink <network> <arguments>
# network: local, staging, ic
```

### Frontend (React/TypeScript)

Navigate to frontend directory: `cd frontend/claimlink_dashboard`

**Development:**
```bash
pnpm install        # First time only
pnpm dev            # Start dev server (http://localhost:5173)
```

**Quality & Build:**
```bash
pnpm lint           # Run ESLint
pnpm build          # TypeScript compilation + Vite build
pnpm preview        # Preview production build
```

## Monorepo Structure

```
claimlink/
├── backend/                           # Rust canisters
│   ├── canisters/                    # Proprietary canisters
│   │   └── claimlink/                # Main backend canister
│   │       ├── api/                  # Public API types
│   │       └── impl/                 # Implementation
│   ├── external_canisters/           # External canister APIs
│   │   ├── ic_management/
│   │   ├── icrc_ledger/
│   │   └── origyn_nft/
│   ├── libraries/                    # Shared libraries
│   │   ├── http_request/
│   │   ├── types/
│   │   └── utils/
│   └── integration_tests/            # PocketIC tests
├── frontend/
│   └── claimlink_dashboard/          # React dashboard
│       ├── src/
│       │   ├── routes/               # TanStack Router (file-based)
│       │   ├── features/             # Business logic modules
│       │   │   └── [feature]/
│       │   │       ├── api/          # Service layer
│       │   │       ├── components/
│       │   │       ├── stores/       # Jotai atoms
│       │   │       └── types/
│       │   ├── components/
│       │   │   ├── ui/               # shadcn/ui primitives
│       │   │   ├── layout/
│       │   │   └── common/
│       │   └── services/             # IC Canister integrations
│       │       └── [canister]/
│       │           ├── hooks/
│       │           ├── idlFactory.js
│       │           └── interfaces.ts
│       └── package.json
├── scripts/                           # Build & deployment scripts
├── Cargo.toml                         # Workspace definition
└── dfx.json                           # DFX configuration
```

## Backend Architecture

### Canister Structure

Each canister follows a two-crate pattern:
1. **API crate** (`api/`) - Public types, errors, request/response definitions
2. **Implementation crate** (`impl/`) - Canister logic:
   - `lib.rs` - Entry point with `export_candid!()`
   - `state.rs` - State management using `canister_state!` macro
   - `lifecycle/` - Init, pre_upgrade, post_upgrade hooks
   - `updates/` - Update call handlers
   - `queries/` - Query call handlers
   - `guards.rs` - Access control guards
   - `memory.rs` - Stable memory management
   - `wasm/` - Embedded WASM files for sub-canisters

### State Management

- `RuntimeState` contains `env` (CanisterEnv) and `data` (Data struct)
- Accessed via `read_state()` and `mutate_state()` macros
- Lifecycle hooks handle serialization/deserialization for upgrades

### External Canister Integration

External canisters have two crates each:
- `api/` - Type definitions and interfaces
- `c2c_client/` - Canister-to-canister client for inter-canister calls

### Sub-Canister Management

The claimlink canister manages ORIGYN NFT sub-canisters:
- Uses `OrigynSubCanisterManager` to create and manage NFT collection canisters
- Embeds ORIGYN NFT WASM in `impl/wasm/origyn_nft_canister.wasm.gz`
- Creates canisters with initial cycles funding

### Key Backend Dependencies

- **Bity IC libraries**: `bity-ic-*` (state, memory, tracing, subcanister-manager)
- **ic-cdk**: Internet Computer Canister Development Kit
- **candid**: Interface definition language
- **pocket-ic**: Integration testing framework
- **ic-stable-structures**: Stable memory data structures

## Frontend Architecture

### Technology Stack

- **UI**: React 19.1, TypeScript 5.8, shadcn/ui, Tailwind CSS 4.1
- **Routing**: TanStack Router 1.131 (file-based, auto code-splitting)
- **State Management**: Jotai 2.14 (atomic state) + TanStack Query 5.87 (server state)
- **Forms**: TanStack React Form 1.23
- **Blockchain**: @dfinity/agent 2.4, @nfid/identitykit 1.0
- **Build Tool**: Vite 7.1

### State Management Layers

```typescript
// Layer 1: UI State (local component state)
const [isOpen, setIsOpen] = useState(false);

// Layer 2: Feature State (Jotai atoms)
const authState = useAtom(authStateAtom);

// Layer 3: Server State (TanStack Query)
const { data } = useCertificates();
```

**Rules:**
- Local state: UI-only concerns (modals, toggles, form inputs)
- Jotai atoms: Feature-level state, cross-component data sharing
- TanStack Query: ALL server/canister data fetching and mutations

### Service Layer Pattern

Always use the service layer for IC canister interactions:

```typescript
// features/[feature]/api/[feature].service.ts - Business logic
// Note: Service layer may use "NFT" terminology when calling IC APIs,
// then transform to "Certificate" types for frontend consumption
export class CertificatesService {
  static async fetchCertificates(): Promise<Certificate[]> {
    const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // IC API uses "nft" terminology (technical layer)
    const nftDetails = await actor.get_nft_details({ token_ids });
    // Transform to Certificate type (business layer)
    return nftDetails.map(transformNftDetailsToCertificate);
  }
}

// features/[feature]/api/[feature].queries.ts - React Query hooks
export const useCertificates = () => {
  return useQuery({
    queryKey: certificatesKeys.list(),
    queryFn: () => CertificatesService.fetchCertificates(),
  });
};
```

**Never call IC canister methods directly from components.**

### IC Canister Integration Flow

```
Component → Hook (TanStack Query/Mutation) → Service Layer → Actor (Candid) → IC Canister
```

### Authentication Flow (NFID IdentityKit)

- `AuthProvider` wraps app in `routes/__root.tsx`
- Creates both authenticated & unauthenticated agents
- Stores principal ID and agents in Jotai atom (`authStateAtom`)
- Auto-navigation: login → dashboard on connect, dashboard → logout on disconnect
- Environment-specific config for localhost vs production signing

**NFID Localhost Configuration:**
Requires specific environment variables for localhost signing:
```
VITE_NFID_LOCALHOST_TARGETS=http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
```

### Layout System

`DashboardLayout` handles:
- Page-level spacing (`p-[24px]`)
- Background styling (`bg-[#fcfafa]`)
- HeaderBar with dynamic titles and back navigation
- Sidebar (250px fixed width)

**Individual pages should NOT:**
- Add backgrounds or padding
- Handle navigation UI
- Apply rounded corners

### Routing Pattern

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

Route tree is auto-generated in `routeTree.gen.ts` by TanStack Router plugin. **No Hot Module Replacement for Routes**: Route changes require dev server restart.

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
- **Hooks**: camelCase with "use" prefix (`useCertificates.tsx`)
- **Services**: kebab-case with suffix (`certificates.service.ts`, `certificates.queries.ts`)
- **Types**: kebab-case with suffix (`certificate.types.ts`)

### Design System

CSS custom properties in `src/styles.css`:
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

## Important Notes

### Backend

- All build scripts must be run from repository root
- Workspace defined in `Cargo.toml`
- Canister builds produce optimized WASM files using `ic-wasm` (shrink + optimize)
- DFX version: 0.29.0
- Integration tests use PocketIC to simulate full IC environment

### Frontend

- Use pnpm, not npm/yarn
- Query Client: 5-minute stale time, single retry, no refetch on window focus (optimized for IC latency)
- TypeScript: Strict mode enabled
- Current state: UI complete, migrating to full IC canister integration
- Mock data in `shared/data/` during development
- See `frontend/claimlink_dashboard/CLAUDE.md` for comprehensive details and `AGENTS.md` for architecture diagrams

### CI/CD

- GitLab CI/CD pipeline in `.gitlab-ci.yml`
- Stages: preparation, lint, build, test, integration_testing, deploy
- Networks: local, staging, preprod, ic (production)
- Rust linting runs on backend changes
- Frontend linting runs on frontend changes
- Integration tests run with `--integration-test` feature flag
