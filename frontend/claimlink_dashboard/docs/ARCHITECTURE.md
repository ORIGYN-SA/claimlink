# ClaimLink Frontend Architecture

## Overview

ClaimLink is a certificate minting platform built on the Internet Computer (ICP). This document describes the frontend architecture of the React/TypeScript dashboard application.

## Technology Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 19.1 + TypeScript 5.8 |
| Build Tool | Vite 7.1 |
| Routing | TanStack Router 1.131 (file-based) |
| Server State | TanStack Query 5.87 |
| Feature State | Jotai 2.14 |
| Forms | TanStack React Form 1.23 |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS 4.1) |
| Blockchain | @dfinity/agent 2.4 + @nfid/identitykit 1.0 |

## 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROUTES LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   /login    │  │ /dashboard  │  │ /templates  │  │ /campaigns  │  ...   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
│         └────────────────┴────────────────┴────────────────┘                │
│                                    │                                        │
│                          TanStack Router                                    │
│                    (file-based, auto code-splitting)                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FEATURES LAYER                                   │
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │  certificates │  │   templates   │  │  collections  │  │  campaigns  │  │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├─────────────┤  │
│  │ pages/        │  │ pages/        │  │ pages/        │  │ pages/      │  │
│  │ components/   │  │ components/   │  │ components/   │  │ components/ │  │
│  │ api/          │  │ api/          │  │ api/          │  │ api/        │  │
│  │ atoms/        │  │ atoms/        │  │ atoms/        │  │ atoms/      │  │
│  │ types/        │  │ types/        │  │ types/        │  │ types/      │  │
│  │ utils/        │  │ utils/        │  │ utils/        │  │ utils/      │  │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬──────┘  │
│          │                  │                  │                 │          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │ template-     │  │   dashboard   │  │     auth      │  │   account   │  │
│  │ renderer      │  │               │  │               │  │             │  │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬──────┘  │
│          │                  │                  │                 │          │
└──────────┴──────────────────┴──────────────────┴─────────────────┴──────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SERVICES LAYER                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Service Classes (*.service.ts)                    │   │
│  │  - Business logic and data transformation                           │   │
│  │  - Canister actor creation and method calls                         │   │
│  │  - Error handling and retry logic                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                  React Query Hooks (*.queries.ts)                    │   │
│  │  - useQuery / useMutation wrappers                                  │   │
│  │  - Cache key management                                             │   │
│  │  - Optimistic updates and invalidation                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CANISTERS LAYER                                    │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │    ClaimLink    │  │   ORIGYN NFT    │  │  Token Ledgers  │             │
│  │    Canister     │  │   Canisters     │  │  (ICP, OGY...)  │             │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤             │
│  │ - Collections   │  │ - Minting       │  │ - Balances      │             │
│  │ - Templates     │  │ - Metadata      │  │ - Transfers     │             │
│  │ - Campaigns     │  │ - File uploads  │  │ - History       │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│                         Internet Computer (ICP)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Feature Map

| Feature | Purpose | Complexity | Key Files |
|---------|---------|------------|-----------|
| **auth** | NFID authentication, agents, principals | Medium | `atoms/atoms.ts`, `components/AuthGate.tsx` |
| **certificates** | Minting, viewing, editing, transfers | High | `api/certificates.service.ts`, `api/certificates.queries.ts` |
| **collections** | ORIGYN NFT canister management | High | `api/collections.service.ts` |
| **templates** | Template creation and storage | High | `utils/template-serializer.ts`, `types/template.types.ts` |
| **template-renderer** | ORIGYN node rendering | High | `utils/metadata-builder.ts`, `utils/metadata-parser.ts` |
| **campaigns** | Certificate distribution campaigns | Medium | `api/campaigns.service.ts` |
| **dashboard** | Statistics and overview | Low | `pages/dashboard-page.tsx` |
| **account** | User management, transactions | Medium | `api/account.service.ts` |
| **tokens** | Token integrations (ICP, OGY, etc.) | Low | Various hooks |

## Naming Convention

**Critical**: The codebase uses different terminology at different layers.

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND / UI LAYER                       │
│              Uses "Certificate" terminology                  │
│                                                             │
│   Certificate, CertificateCard, useCertificates,            │
│   MintCertificatePage, certificate.types.ts                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Transform Layer
              transformNftDetailsToCertificate()
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   BACKEND / IC API LAYER                     │
│                 Uses "NFT" terminology                       │
│                                                             │
│   get_nft_details, NftDetails, get_collection_nfts,         │
│   icrc7_tokens_of, icrc7_token_metadata                     │
└─────────────────────────────────────────────────────────────┘
```

**Why**: All tokens are ORIGYN NFTs (ICRC-7 standard) technically, but represent certified real-world assets in the business domain.

## Project Structure

```
src/
├── main.tsx                        # App entry point
├── routes/                         # TanStack Router (file-based)
│   ├── __root.tsx                  # Root layout with AuthProvider
│   ├── _authenticated.tsx          # Protected route layout
│   └── _authenticated/             # Feature routes
│       ├── dashboard.tsx
│       ├── mint_certificate/
│       ├── collections/
│       ├── templates/
│       ├── campaigns/
│       └── account/
│
├── features/                       # Business logic modules
│   └── [feature]/
│       ├── api/                    # Service layer
│       │   ├── *.service.ts        # Business logic
│       │   └── *.queries.ts        # React Query hooks
│       ├── components/             # Feature UI
│       ├── pages/                  # Page components
│       ├── atoms/                  # Jotai atoms
│       ├── types/                  # Type definitions
│       └── utils/                  # Feature utilities
│
├── shared/                         # Shared infrastructure
│   ├── canister/                   # Actor factory, config
│   ├── canisters/                  # Canister type definitions
│   ├── hooks/                      # Shared React hooks
│   ├── constants/                  # App constants
│   └── data/                       # Mock data
│
├── components/                     # Shared components
│   ├── ui/                         # shadcn/ui primitives
│   ├── layout/                     # DashboardLayout, Sidebar
│   └── common/                     # Business components
│
└── services/                       # Legacy IC integrations
```

## Shared Infrastructure

### Canister Utilities (`shared/canister/`)

```typescript
// actor-factory.ts - Type-safe actor creation
createCanisterActor<T>(agent, canisterId, idlFactory) → T

// canister-config.ts - Centralized canister IDs
getCanisterId(name: CanisterName) → string
isCanisterConfigured(name: CanisterName) → boolean

// retry.ts - Retry utilities for IC operations
retryWithBackoff<T>(operation, options?) → Promise<T>
```

### Design System (`styles.css`)

```css
--charcoal: #222526      /* Primary dark text */
--slate: #69737c         /* Secondary text */
--paper: #fcfafa         /* Background */
--azure: #85f1ff         /* Accent */
--jade: #50be8f          /* Success */
--candy-floss: #ff55c5   /* Highlight */
```

## Import Path Aliases

```typescript
"@/*"           → "./src/*"
"@services/*"   → "./src/services/*"
"@components/*" → "./src/components/*"
"@hooks/*"      → "./src/hooks/*"
"@utils/*"      → "./src/utils/*"
"@assets/*"     → "./src/assets/*"
"@shared/*"     → "./src/shared/*"
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `token-card.tsx` |
| Routes | kebab-case or snake_case | `mint_certificate.tsx` |
| Hooks | camelCase with "use" prefix | `useCertificates.tsx` |
| Services | kebab-case with suffix | `certificates.service.ts` |
| Query hooks | kebab-case with suffix | `certificates.queries.ts` |
| Types | kebab-case with suffix | `certificate.types.ts` |

## Layout System

`DashboardLayout` provides:
- Fixed sidebar (250px)
- Page spacing (`p-[24px]`)
- Background (`bg-[#fcfafa]`)
- HeaderBar with dynamic titles

**Rule**: Individual pages should NOT add backgrounds, padding, or navigation UI.

```typescript
// Correct route pattern
function FeatureRoute() {
  return (
    <DashboardLayout>
      <FeaturePage />
    </DashboardLayout>
  );
}
```

## Component Priority

1. Use **shadcn/ui** component if available
2. Extend with `className` prop if needed
3. Create custom component only if truly unique functionality required

## Related Documentation

- [DATA-FLOWS.md](./DATA-FLOWS.md) - Key data flow diagrams
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management patterns
- [CANISTER-INTEGRATION.md](./CANISTER-INTEGRATION.md) - IC integration details
