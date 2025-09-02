## Project Overview

ClaimLink is a React/TypeScript frontend application for an Internet Computer (ICP) dApp that enables users to create, share, and claim NFT links through campaigns, dispensers, and QR codes.

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
- **State Management**: Zustand + React Query (server state)
- **Styling**: Tailwind CSS with CSS variables
- **IC Integration**: @dfinity/agent, @dfinity/candid, @dfinity/principal

## Project Structure: Modern React Architecture

### Complete Directory Structure

```
src/
├── app/                          # Application-wide configuration
│   ├── provider.tsx             # App-wide providers (Router, Query, etc.)
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
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   └── common/                  # Reusable business components
│       ├── data-table.tsx
│       ├── loading-spinner.tsx
│       ├── connect-wallet.tsx
│       ├── nft-selector.tsx
│       └── error-boundary.tsx
├── routes/                      # TanStack Router file-based routing
│   ├── __root.tsx              # Root route with global layout
│   ├── index.tsx               # Home page (/)
│   ├── dashboard/
│   │   ├── index.tsx           # Dashboard index (/dashboard)
│   │   ├── settings.tsx        # Dashboard settings (/dashboard/settings)
│   │   └── profile.tsx         # User profile (/dashboard/profile)
│   ├── campaigns/
│   │   ├── index.tsx           # Campaigns list (/campaigns)
│   │   ├── $campaignId.tsx     # Campaign detail (/campaigns/:id)
│   │   └── new.tsx             # Create campaign (/campaigns/new)
│   ├── collections/
│   │   ├── index.tsx           # Collections list
│   │   └── $collectionId.tsx   # Collection detail
│   └── (auth)/                 # Route group for auth pages
│       ├── login.tsx           # Login page (/login)
│       └── register.tsx        # Register page (/register)
├── features/                    # Feature-based modules
│   ├── campaigns/
│   │   ├── api/
│   │   │   ├── campaigns.queries.ts    # TanStack Query hooks
│   │   │   └── campaigns.mutations.ts
│   │   ├── components/
│   │   │   ├── campaign-card.tsx
│   │   │   ├── campaign-form.tsx
│   │   │   └── campaign-stats.tsx
│   │   ├── hooks/
│   │   │   └── use-campaign-data.ts
│   │   ├── stores/
│   │   │   └── campaigns.store.ts      # Zustand store
│   │   ├── types/
│   │   │   └── campaign.types.ts
│   │   └── utils/
│   │       └── campaign.utils.ts
│   ├── collections/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── links/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── stores/
└── shared/                     # Shared utilities and configurations
    ├── api/
    │   ├── client.ts           # API client configuration
    │   ├── query-client.ts     # TanStack Query client setup
    │   └── types.ts            # Shared API types
    ├── config/
    │   ├── env.ts              # Environment variables
    │   └── constants.ts        # App constants
    ├── hooks/
    │   ├── use-local-storage.ts
    │   ├── use-debounce.ts
    │   └── use-media-query.ts
    ├── lib/
    │   ├── utils.ts            # shadcn/ui utility functions
    │   ├── validations.ts      # Schema validations (Zod)
    │   └── date.ts             # Date utilities
    ├── stores/
    │   └── global.store.ts     # Global Zustand store
    ├── types/
    │   ├── api.ts              # Global API types
    │   └── common.ts           # Common types
    └── utils/
        ├── helpers.ts          # Helper functions
        ├── formatters.ts       # Data formatters
        └── validators.ts       # Validation utilities
```

### Component Organization: Four-Layer System

#### 1. **`components/ui/` - shadcn/ui Foundation**

**Purpose**: Pre-built, customizable UI primitives from shadcn/ui

**Characteristics**:

- Installed via CLI: `pnpm dlx shadcn-ui@latest add [component]`
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Customizable through CSS variables
- Auto-generated, don't modify these files

#### 2. **`components/layout/` - Layout Components**

**Purpose**: Structural layout components used across the application

**Examples**:

- Header with navigation and user menu
- Sidebar for dashboard layouts
- Footer with links and info
- Navigation components

#### 3. **`components/common/` - Reusable Business Components**

**Purpose**: Application-specific reusable components that combine UI primitives with business logic

**Characteristics**:

- Combine shadcn/ui components
- Include ClaimLink-specific logic
- Used across multiple features
- Know about app context (auth, routing)

#### 4. **`features/[feature]/components/` - Feature-Specific Components**

**Purpose**: Components that belong to a specific feature and are not reused elsewhere

**Structure per Feature**:

```
features/campaigns/
├── api/                        # Data fetching logic
│   ├── campaigns.queries.ts   # React Query hooks
│   └── campaigns.mutations.ts # Mutation hooks
├── components/                # Feature components
│   ├── campaign-card.tsx
│   ├── campaign-form.tsx
│   └── campaign-detail.tsx
├── hooks/                     # Custom hooks
│   └── use-campaign-form.ts
├── stores/                    # Feature state
│   └── campaigns.store.ts
├── types/                     # TypeScript types
│   └── campaign.types.ts
└── utils/                     # Feature utilities
    └── campaign.utils.ts
```

### Layout System & Component Integration

#### HeaderBar Component (`components/layout/HeaderBar.tsx`)

**Purpose**: Persistent header component used across all dashboard pages with integrated navigation and user controls.

**Key Features**:
- **Persistent Navigation**: Appears on all dashboard pages within DashboardLayout
- **Responsive Design**: Adapts to different screen sizes while maintaining visual consistency
- **Page Title Integration**: Dynamically displays current page title from routing context
- **User Controls**: Wallet balance display and account management
- **Back Navigation**: Conditional back button for multi-step flows (e.g., create certificate → back to mint certificate)

**Usage Pattern**:
```typescript
// Integrated within DashboardLayout - not used directly in individual pages
<DashboardLayout>
  <HeaderBar title={pageTitle} showBackButton={hasBackNavigation} backTo={backRoute} />
  <PageContent />
</DashboardLayout>
```

**Styling Integration**:
- White background (`bg-white`) to match page content
- Top rounded corners (`rounded-t-[20px]`) that merge with page containers
- Page components use bottom rounded corners (`rounded-b-[20px]`) for seamless integration

#### Sidebar Navigation (`components/layout/Sidebar.tsx`)

**Purpose**: Main navigation sidebar with collapsible menu items and branding.

**Key Features**:
- **Fixed Positioning**: Stays visible while scrolling through page content
- **Menu Items**: Dashboard, Collections, Templates, Mint Certificate, Mint NFT, Account
- **Active State**: Visual indication of current page/section
- **Branding**: ORIGYN logo prominently displayed at top
- **Footer Links**: Technical help and contact information

**Layout Integration**:
- Fixed width (250px) for consistent navigation experience
- Positioned alongside HeaderBar and page content
- Creates the main dashboard layout structure with DashboardLayout wrapper

#### DashboardLayout System (`components/layout/DashboardLayout.tsx`)

**Purpose**: Main layout wrapper that combines HeaderBar, Sidebar, and page content into cohesive dashboard experience.

**Key Features**:
- **Unified Container**: Single source for dashboard page structure
- **Background Integration**: Blur overlay and dark background for visual depth
- **Responsive Layout**: Flex-based layout that adapts to content size
- **Navigation Context**: Manages page titles and back navigation logic
- **Route Awareness**: Dynamically determines page titles and navigation options

**Layout Structure**:
```typescript
<div className="min-h-screen bg-[#222526] relative">
  {/* Blur background overlay */}
  <div className="absolute backdrop-blur-[100px] backdrop-filter bg-[rgba(19,19,19,0.4)] h-full w-full" />

  <div className="relative flex">
    {/* Fixed sidebar */}
    <div className="w-[250px]">
      <Sidebar />
    </div>

    {/* Main content area */}
    <main className="flex-1 px-6 py-6">
      <div className="bg-[#fcfafa] rounded-[20px] p-[24px] overflow-hidden">
        <HeaderBar title={currentPageTitle} showBackButton={showBack} backTo={backRoute} />
        <div className="mt-6">
          {children} {/* Page content */}
        </div>
      </div>
    </main>
  </div>
</div>
```

### Layout Responsibility Separation

**DashboardLayout handles**:
- **Page-level spacing and padding** (`p-[24px]`) - provides consistent internal spacing
- **Background styling** (`bg-[#fcfafa]`) - unified page background
- **Container boundaries** (`rounded-[20px] overflow-hidden`) - visual container definition
- **HeaderBar positioning** - ensures proper header placement and spacing
- **Content area margin** (`mt-6`) - separates header from page content

**Individual page components should NOT**:
- Add their own background colors (conflicts with DashboardLayout)
- Manage page-level padding (handled by DashboardLayout)
- Apply rounded corners (handled by DashboardLayout)
- Handle header spacing (DashboardLayout manages HeaderBar positioning)

**Example of proper page component**:
```typescript
// ✅ GOOD: Clean page component that relies on DashboardLayout
export function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Page content only - no layout concerns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Content components */}
      </div>
    </div>
  )
}

// ❌ BAD: Page component trying to handle layout
export function TemplatesPage() {
  return (
    <div className="bg-[#fcfafa] p-6 rounded-[20px] space-y-6">
      {/* This creates conflicts with DashboardLayout */}
    </div>
  )
}
```

**Page Integration Rules**:
- Page components should use `rounded-b-[20px]` (bottom only) to merge with HeaderBar
- HeaderBar handles top rounded corners (`rounded-t-[20px]`)
- Avoid duplicate rounded corners on individual page containers
- Use consistent background colors (`bg-[#fcfafa]`) across pages

## Decision Tree for Component Placement

```mermaid
graph TD
    A[New Component] --> B{Is it a shadcn/ui component?}
    B -->|Yes| C[components/ui/]
    B -->|No| D{Is it a layout component?}
    D -->|Yes| E[components/layout/]
    D -->|No| F{Used across multiple features?}
    F -->|Yes| G[components/common/]
    F -->|No| H[features/[feature]/components/]
```

## App Provider Configuration

```typescript
// app/provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

export function AppProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
```

## Routing Structure (TanStack Router)

### File-Based Routes

```
src/
├── routes/
│   ├── __root.tsx              # Root layout with providers
│   ├── index.tsx                # Home page (/)
│   ├── dashboard.tsx            # Dashboard (/dashboard)
│   ├── campaigns/
│   │   ├── index.tsx           # Campaigns list (/campaigns)
│   │   ├── $campaignId.tsx     # Campaign detail (/campaigns/:id)
│   │   └── new.tsx             # Create campaign (/campaigns/new)
│   ├── collections/
│   │   ├── index.tsx           # Collections list
│   │   └── $collectionId.tsx   # Collection detail
│   └── _authenticated/         # Route group for auth-required pages
│       ├── _layout.tsx         # Auth layout wrapper
│       └── profile.tsx         # User profile
```

### Route Components Pattern

```typescript
// routes/campaigns/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { CampaignsPage } from '@/features/campaigns/components/campaigns-page'

export const Route = createFileRoute('/campaigns/')({
  component: CampaignsPage,
  beforeLoad: async ({ context }) => {
    // Auth check, data preloading, etc.
  }
})
```

## Service Layer & API Organization

### API Client Structure

```typescript
// shared/api/client.ts
import { Actor } from '@dfinity/agent'
import { createAgent } from '@dfinity/agent'
import { idlFactory } from '@/services/claimlink/idlFactory'

export const apiClient = {
  async createActor(canisterId: string) {
    const agent = await createAgent({
      host: import.meta.env.VITE_IC_HOST || 'http://127.0.0.1:4943',
    })
    
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  }
}
```

### Feature API Pattern

```typescript
// features/campaigns/api/campaigns.queries.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { campaignService } from './campaign.service'

export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: string) => [...campaignKeys.lists(), { filters }] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
}

export const useCampaigns = (filters?: string) => {
  return useQuery({
    queryKey: campaignKeys.list(filters || ''),
    queryFn: () => campaignService.fetchAll(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCampaign = () => {
  return useMutation({
    mutationFn: campaignService.create,
    onSuccess: () => {
      // Invalidate and refetch campaigns
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}
```

### Service Implementation

```typescript
// features/campaigns/api/campaign.service.ts
import { apiClient } from '@/shared/api/client'
import type { Campaign, CreateCampaignInput } from '../types/campaign.types'

export const campaignService = {
  async fetchAll(): Promise<Campaign[]> {
    try {
      const actor = await apiClient.createActor(CLAIMLINK_CANISTER_ID)
      const result = await actor.get_user_campaigns()
      
      if ('err' in result) {
        throw new Error(result.err)
      }
      
      return result.ok || []
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error}`)
    }
  },
  
  async create(data: CreateCampaignInput): Promise<Campaign> {
    try {
      const actor = await apiClient.createActor(CLAIMLINK_CANISTER_ID)
      const result = await actor.create_campaign(data)
      
      if ('err' in result) {
        throw new Error(result.err)
      }
      
      return result.ok
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error}`)
    }
  }
}
```

## State Management with Zustand

### Feature Store Pattern

```typescript
// features/campaigns/stores/campaigns.store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Campaign } from '../types/campaign.types'

interface CampaignState {
  selectedCampaign: Campaign | null
  isCreating: boolean
  filters: {
    status: string
    tokenType: string
  }
}

interface CampaignActions {
  setSelectedCampaign: (campaign: Campaign | null) => void
  setIsCreating: (isCreating: boolean) => void
  updateFilters: (filters: Partial<CampaignState['filters']>) => void
  resetFilters: () => void
}

const initialState: CampaignState = {
  selectedCampaign: null,
  isCreating: false,
  filters: {
    status: 'all',
    tokenType: 'all',
  },
}

export const useCampaignStore = create<CampaignState & CampaignActions>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setSelectedCampaign: (campaign) =>
        set({ selectedCampaign: campaign }, false, 'setSelectedCampaign'),
      
      setIsCreating: (isCreating) =>
        set({ isCreating }, false, 'setIsCreating'),
      
      updateFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
          }),
          false,
          'updateFilters'
        ),
      
      resetFilters: () =>
        set({ filters: initialState.filters }, false, 'resetFilters'),
    }),
    { name: 'campaign-store' }
  )
)
```

### Global Store

```typescript
// shared/stores/global.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface GlobalState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  user: User | null
}

interface GlobalActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setUser: (user: User | null) => void
}

export const useGlobalStore = create<GlobalState & GlobalActions>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: true,
        user: null,
        
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setUser: (user) => set({ user }),
      }),
      {
        name: 'claimlink-global',
        partialize: (state) => ({ theme: state.theme }), // Only persist theme
      }
    )
  )
)
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

### Import Order & Best Practices

```typescript
// 1. React/External libraries
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

// 2. UI Components (shadcn/ui)
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

// 3. Layout Components
import { Header } from '@/components/layout/header'

// 4. Common/Shared Components
import { ConnectWallet } from '@/components/common/connect-wallet'
import { NFTSelector } from '@/components/common/nft-selector'

// 5. Feature Components
import { CampaignCard } from '@/features/campaigns/components/campaign-card'

// 6. API/Services
import { useCampaigns } from '@/features/campaigns/api/campaigns.queries'
import { campaignService } from '@/features/campaigns/api/campaign.service'

// 7. Stores/Hooks
import { useCampaignStore } from '@/features/campaigns/stores/campaigns.store'
import { useGlobalStore } from '@/shared/stores/global.store'

// 8. Utils/Lib
import { cn } from '@/shared/lib/utils'
import { formatDate } from '@/shared/utils/formatters'

// 9. Types
import type { Campaign } from '@/features/campaigns/types/campaign.types'

// 10. Relative imports (avoid when possible)
import { LocalComponent } from './local-component'
```

## File Naming Conventions

|Type|Convention|Examples|
|---|---|---|
|**Components**|kebab-case|`campaign-card.tsx`, `nft-selector.tsx`|
|**Pages/Routes**|kebab-case|`dashboard.tsx`, `campaign-detail.tsx`|
|**Hooks**|camelCase with "use"|`useCampaigns.ts`, `use-auth.ts`|
|**Services**|kebab-case with suffix|`campaign.service.ts`, `auth.service.ts`|
|**Types**|kebab-case with suffix|`campaign.types.ts`, `common.types.ts`|
|**Stores**|kebab-case with suffix|`campaigns.store.ts`, `global.store.ts`|
|**Utils**|kebab-case|`formatters.ts`, `validators.ts`|
|**Constants**|SCREAMING_SNAKE_CASE|`API_ENDPOINTS.ts`, `ROUTES.ts`|

## Feature Module Example: Campaigns

### Complete Feature Structure

```
features/campaigns/
├── api/
│   ├── campaigns.queries.ts      # React Query hooks
│   ├── campaigns.mutations.ts    # Mutation hooks
│   └── campaign.service.ts       # Service layer
├── components/
│   ├── campaign-card.tsx         # Campaign list item
│   ├── campaign-form.tsx         # Create/edit form
│   ├── campaign-detail.tsx       # Detail view
│   ├── campaign-stats.tsx        # Statistics component
│   └── campaign-actions.tsx      # Action buttons
├── hooks/
│   ├── use-campaign-form.ts      # Form logic hook
│   └── use-campaign-actions.ts   # Action handlers
├── stores/
│   └── campaigns.store.ts        # Feature state
├── types/
│   └── campaign.types.ts         # TypeScript definitions
└── utils/
    └── campaign.utils.ts         # Helper functions
```

### Implementation Examples

**Route Component:**

```typescript
// routes/campaigns/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { CampaignsPage } from '@/features/campaigns/components/campaigns-page'

export const Route = createFileRoute('/campaigns/')({
  component: CampaignsPage,
  beforeLoad: async ({ context }) => {
    // Auth validation, preloading, etc.
    if (!context.auth.user) {
      throw redirect({ to: '/login' })
    }
  }
})
```

**Feature Page Component:**

```typescript
// features/campaigns/components/campaigns-page.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCampaigns } from '../api/campaigns.queries'
import { CampaignCard } from './campaign-card'
import type { Campaign } from '../types/campaign.types'

export function CampaignsPage() {
  const { data: campaigns, isLoading, error } = useCampaigns()

  if (isLoading) return <div>Loading campaigns...</div>
  if (error) return <div>Error loading campaigns</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button asChild>
          <Link to="/campaigns/new">Create Campaign</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign: Campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
```

## shadcn/ui Integration Guidelines

### Component Customization

**CSS Variables Alignment**:

```css
/* app/globals.css or index.css */
@layer base {
  :root {
    /* Map Figma design tokens to shadcn CSS variables */
    --background: 0 0% 100%;          /* #ffffff */
    --foreground: 213 13% 16%;        /* #222526 */
    
    --primary: 217 77% 13%;           /* #061937 - Figma primary */
    --primary-foreground: 0 0% 100%;  
    
    --secondary: 249 87% 68%;         /* #615bff - Figma accent */
    --secondary-foreground: 0 0% 100%;
    
    --muted: 0 0% 96%;                /* #f2f2f2 */
    --muted-foreground: 206 8% 48%;   /* #69737c */
    
    --card: 0 0% 100%;
    --card-foreground: 213 13% 16%;
    
    --destructive: 11 79% 53%;        /* #e84c25 - Figma error */
    --success: 153 47% 55%;           /* #50be8f - Figma success */
    
    --border: 0 0% 88%;               /* #e1e1e1 */
    --ring: 217 77% 13%;
    
    --radius: 1rem;                   /* 16px default radius */
  }
}
```

### Using shadcn Components

```typescript
// ✅ CORRECT: Import from components/ui
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// ✅ CORRECT: Use with cn() for additional styles
import { cn } from "@/shared/lib/utils"

<Button 
  variant="default"
  size="lg"
  className={cn("w-full", someCondition && "opacity-50")}
>
  Click me
</Button>

// ❌ WRONG: Don't recreate shadcn components
const MyButton = () => { /* custom implementation */ }
```

## Figma Design Implementation Rules

### When Creating Components from Figma

1. **Check shadcn/ui first**:
    
    ```typescript
    // Before creating custom components, check if shadcn/ui has it:
    // - Button, Card, Dialog, Dropdown, Input, Select, Table, etc.
    // Install if needed: pnpm dlx shadcn-ui@latest add [component]
    ```
    
2. **Component Priority Order**:
    
    - Use shadcn/ui component if available
    - Extend shadcn component with className if needed
    - Create custom component only if truly unique
3. **Figma to shadcn Mapping**:
    
    |Figma Component|shadcn/ui Component|Notes|
    |---|---|---|
    |Button/Primary|`<Button variant="default">`|Adjust CSS variables|
    |Button/Secondary|`<Button variant="outline">`||
    |Card|`<Card>`|Use CardHeader, CardContent|
    |Input Field|`<Input>` with `<Label>`||
    |Dropdown|`<Select>` or `<DropdownMenu>`||
    |Modal|`<Dialog>`||
    |Table|`<Table>`||
    |Tabs|`<Tabs>`||
    |Toast/Alert|`<Toast>` or `<Alert>`||
    
4. **Style Alignment Process**:
    
    ```typescript
    // Step 1: Use shadcn component
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
    </Card>
    
    // Step 2: Adjust with className if needed
    <Card className="shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] border-[#f2f2f2]">
    
    // Step 3: Update CSS variables if systematic changes needed
    // (in globals.css, not inline)
    ```
    

### Figma Style Extraction Checklist

When implementing a Figma design:

1. [ ] **Identify shadcn equivalent** - Can I use an existing shadcn component?
2. [ ] **Extract design tokens** - What are the colors, spacing, radii?
3. [ ] **Check CSS variables** - Do I need to update the theme?
4. [ ] **Component composition** - Can I compose this from shadcn parts?
5. [ ] **Custom styles needed** - What Figma-specific styles must be added?

### Post-Generation CSS Alignment

After generating components with AI, run this alignment check:

```typescript
// Style Alignment Checklist:
// 1. Border radius matches Figma? (update --radius if needed)
// 2. Colors match exactly? (update CSS variables)
// 3. Shadows correct? (may need custom shadow-[] classes)
// 4. Spacing consistent? (use Tailwind spacing scale)
// 5. Typography matches? (font-size, line-height, font-weight)
```

## Testing Requirements

### Component Testing

```typescript
// features/campaigns/components/__tests__/campaign-card.test.tsx
import { render, screen } from '@testing-library/react'
import { CampaignCard } from '../campaign-card'

describe('CampaignCard', () => {
  it('renders campaign title', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    expect(screen.getByText(mockCampaign.title)).toBeInTheDocument()
  })
})
```

## Common Pitfalls to Avoid

### DON'T

- Create custom components when shadcn/ui has equivalent
- Override shadcn components extensively (update CSS variables instead)
- Put route components in features/ (use routes/ directory)
- Create inline styles when Tailwind classes exist
- Ignore TypeScript errors
- Mix styling approaches

### DO

- Use shadcn/ui components as foundation
- Customize via CSS variables for systematic changes
- Use className with cn() for component-specific styles
- Follow TanStack Router file-based routing
- Create feature modules for domain logic
- Test critical user paths

## Figma to Code Workflow

### Step 1: Analyze Design

1. Identify all shadcn/ui components that can be used
2. Note custom components needed
3. Extract color palette and spacing

### Step 2: Setup Theme

1. Update CSS variables to match Figma
2. Configure Tailwind if needed
3. Test shadcn components with new theme

### Step 3: Implement

1. Use shadcn components
2. Add custom className for specific styles
3. Create custom components only when necessary

### Step 4: Align Styles

Run this checklist after implementation:

- [ ] Colors match Figma exactly
- [ ] Border radius consistent
- [ ] Shadows accurate
- [ ] Spacing follows design
- [ ] Typography matches
- [ ] Responsive behavior correct
- [ ] Dark mode considered (if applicable)

## Quick Reference

### Available shadcn/ui Components

- Accordion, Alert, AlertDialog, AspectRatio, Avatar
- Badge, Button, Breadcrumb
- Calendar, Card, Carousel, Checkbox, Collapsible, Command, ContextMenu
- Dialog, Drawer, DropdownMenu
- Form, HoverCard
- Input, Label
- Menubar, NavigationMenu
- Popover, Progress
- RadioGroup, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Switch
- Table, Tabs, Textarea, Toast, Toggle, Tooltip

### Install New Component

```bash
pnpm dlx shadcn-ui@latest add [component-name]
```

### Update Existing Component

```bash
pnpm dlx shadcn-ui@latest add [component-name] --overwrite
```

## Questions or Updates?

This file is the source of truth. Update immediately if something changes. For feature-specific guidelines, create `features/[feature]/README.md`.