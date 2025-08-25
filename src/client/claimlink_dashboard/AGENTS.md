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
````

## Tech Stack

- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Jotai (atoms) + React Query (server state)
- **Styling**: Tailwind CSS with CSS variables
- **IC Integration**: @dfinity/agent, @dfinity/candid, @dfinity/principal

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
import { CampaignsPage } from '@/features/campaigns/CampaignsPage'

export const Route = createFileRoute('/campaigns/')({
  component: CampaignsPage,
  beforeLoad: async ({ context }) => {
    // Auth check, data preloading, etc.
  }
})
```

## Component Organization: Three-Layer System

### 1. **`components/ui/` - shadcn/ui Components**

**Purpose**: Pre-built, customizable UI components from shadcn/ui

**Characteristics**:

- Installed via CLI: `pnpm dlx shadcn-ui@latest add [component]`
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Customizable through CSS variables
- Located in `components/ui/` by shadcn convention

**Available Components**:

```
components/ui/
├── button.tsx          # From shadcn/ui
├── card.tsx           # From shadcn/ui
├── dialog.tsx         # From shadcn/ui
├── dropdown-menu.tsx  # From shadcn/ui
├── input.tsx          # From shadcn/ui
├── label.tsx          # From shadcn/ui
├── select.tsx         # From shadcn/ui
├── table.tsx          # From shadcn/ui
├── tabs.tsx           # From shadcn/ui
├── toast.tsx          # From shadcn/ui
└── ... (other shadcn components)
```

### 2. **`features/` - Feature Modules**

**Purpose**: Feature-specific components and logic, organized by domain

**Characteristics**:

- Self-contained feature implementations
- Can have own components, hooks, and utils
- Import from shadcn/ui and shared components
- Maps loosely to route structure

**Structure**:

```
features/
├── campaigns/
│   ├── CampaignsPage.tsx       # Main page component
│   ├── CampaignCard.tsx        # Feature-specific component
│   ├── CampaignForm.tsx        # Feature-specific form
│   ├── hooks/
│   │   └── useCampaignData.tsx
│   └── types.ts
├── collections/
├── links/
└── dashboard/
```

### 3. **`shared/` - Shared Application Code**

**Purpose**: Cross-cutting concerns and app-specific shared components

**Structure**:

```
shared/
├── components/              # App-specific shared components
│   ├── AppLayout.tsx       # Main layout wrapper
│   ├── NavigationMenu.tsx  # App navigation
│   ├── ConnectWallet.tsx   # Wallet connection
│   ├── NFTSelector.tsx     # NFT picker component
│   └── TokenBalance.tsx    # Token display
├── hooks/                   # Shared custom hooks
├── utils/                   # Helper functions
└── lib/                     # Library configurations
    └── utils.ts            # cn() utility for shadcn
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
import { cn } from "@/lib/utils"

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

## Feature Organization Pattern

### Feature Module Structure

```
features/campaigns/
├── CampaignsPage.tsx           # Main route component
├── CampaignsList.tsx           # List view component
├── CampaignCard.tsx           # List item component
├── CampaignForm.tsx           # Create/edit form
├── CampaignDetail.tsx         # Detail view
├── components/                # Feature-specific components
│   ├── CampaignStats.tsx
│   └── CampaignActions.tsx
├── hooks/
│   ├── useCampaigns.tsx      # React Query hook
│   └── useCampaignForm.tsx   # Form logic
├── services/
│   └── campaignService.ts    # API calls
└── types.ts                   # TypeScript types
```

## State Management

### Jotai Atoms

```typescript
// shared/atoms/user.atom.ts
import { atom } from 'jotai'

export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom(
  (get) => get(userAtom) !== null
)
```

### React Query Integration

```typescript
// features/campaigns/hooks/useCampaigns.tsx
import { useQuery } from '@tanstack/react-query'
import { campaignService } from '../services/campaignService'

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignService.fetchAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

## Service Layer Rules

### Canister Service Pattern

```typescript
// services/claimlink/campaignService.ts
import { Actor } from '@dfinity/agent'
import { idlFactory } from './idlFactory'

export const campaignService = {
  async fetchAll(actor: Actor) {
    try {
      const result = await actor.get_campaigns()
      if ('err' in result) throw new Error(result.err)
      return result.ok
    } catch (error) {
      throw new Error('Failed to fetch campaigns')
    }
  },

  async create(actor: Actor, data: CreateCampaignInput) {
    // Implementation
  }
}
```

## Import Rules & Path Aliases

```json
// tsconfig.json paths
{
  "@/components/*": ["components/*"],      // shadcn/ui components
  "@/features/*": ["features/*"],          // Feature modules
  "@/shared/*": ["shared/*"],              // Shared code
  "@/services/*": ["services/*"],          // API services
  "@/lib/*": ["lib/*"],                    // Library code
  "@/routes/*": ["routes/*"]               // Route components
}
```

### Import Order

```typescript
// 1. React/External libraries
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Routing
import { createFileRoute, Link } from '@tanstack/react-router'

// 3. UI Components (shadcn)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 4. Shared components
import { AppLayout } from '@/shared/components/AppLayout'

// 5. Feature components
import { CampaignCard } from '@/features/campaigns/CampaignCard'

// 6. Services/Utils
import { campaignService } from '@/services/claimlink/campaignService'
import { cn } from '@/lib/utils'

// 7. Types
import type { Campaign } from '@/features/campaigns/types'
```

## Testing Requirements

### Component Testing

```typescript
// features/campaigns/CampaignCard.test.tsx
import { render, screen } from '@testing-library/react'
import { CampaignCard } from './CampaignCard'

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
