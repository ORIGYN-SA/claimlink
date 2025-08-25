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

## Project Structure

### Component Organization Rules

**CRITICAL**: We use a three-layer component system. Place components correctly:

1. **`components/`** - Generic UI library components with ZERO business logic
    - Could work in ANY React project
    - No app-specific imports
    - Pure presentational

2. **`shared/ui/`** - Base design system primitives
    - Atomic design elements (buttons, icons, logos)
    - Define visual consistency
    - Building blocks for other components

3. **`shared/components/`** - App-aware shared components
    - Use auth hooks, services, routing
    - Contain business logic
    - Used across multiple features

4. **`apps/[feature]/components/`** - Feature-specific components
    - Only used within that feature
    - Tightly coupled to feature logic

### Import Rules

- Always use path aliases (@components, @services, @shared, etc.)
- Never use relative imports crossing module boundaries
- Barrel exports required for all component directories

## Code Style & Conventions

### TypeScript Rules

- **NO `any` types** - Use `unknown` or proper types
- Define interfaces in:
    - `services/[service]/interfaces.ts` for API types
    - `apps/[feature]/types.ts` for feature types
    - `shared/components/[component]/types.ts` for component props
- Strict mode enabled - no exceptions

### Naming Conventions

- Components: PascalCase (`CampaignCard.tsx`)
- Hooks: camelCase with `use` prefix (`useCampaignData.tsx`)
- Service functions: camelCase (`createCampaign.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Path aliases: lowercase with @ prefix

### Component Patterns

```typescript
// ✅ Good - Presentational component in components/
const Card = ({ children, className }) => {
  return <div className={`rounded-xl ${className}`}>{children}</div>;
};

// ✅ Good - App-aware component in shared/components/
const ConnectWalletBtn = () => {
  const { connect } = useAuth(); // App-specific hook
  return <Button onClick={connect}>Connect</Button>;
};

// ❌ Bad - Business logic in components/
const Card = () => {
  const { user } = useAuth(); // NO! This belongs in shared/components/
  return <div>{user.name}</div>;
};
```

## State Management

### Jotai Atoms

- Global state atoms go in `shared/atoms/`
- Feature-specific atoms in `apps/[feature]/atoms/`
- Always export read/write atoms separately
- Atom names end with `Atom` suffix

### React Query

- Query keys: SCREAMING_SNAKE_CASE arrays `['FETCH_CAMPAIGNS']`
- Custom hooks wrapper required for all queries
- Place in `shared/hooks/` or feature-specific hooks
- Handle errors at the hook level

## Service Layer Rules

### Canister Interactions

```typescript
// Every service function MUST:
// 1. Accept actor as first parameter
// 2. Handle errors with try/catch
// 3. Return typed responses
// 4. Throw meaningful error messages

export default async function createCampaign(
  actor: Actor,
  args: CreateCampaignArgs
): Promise<Campaign> {
  try {
    const result = await actor.create_campaign(args);
    if ('err' in result) throw new Error(result.err);
    return result.ok;
  } catch (error) {
    throw new Error('Campaign creation failed');
  }
}
```

### IDL Factory Organization

- One IDL factory per canister in `services/[canister]/idlFactory.ts`
- Interfaces in `services/[canister]/interfaces.ts`
- Functions in `services/[canister]/fn/[function].ts`

## Testing Requirements

### Before Committing

```bash
# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Run tests
pnpm test

# Build to verify
pnpm build
```

### Test Coverage Requirements

- Service functions: 100% coverage required
- Shared hooks: 90% coverage minimum
- UI components: Snapshot tests required
- Feature components: Integration tests for critical paths

## Authentication & Security

### Auth Provider Rules

- NFID/Internet Identity only
- Anonymous principals blocked at component level
- Auth state managed via Jotai atoms
- Required for all write operations

### Principal Validation

```typescript
// Always validate principals before canister calls
import { Principal } from "@dfinity/principal";

if (Principal.isAnonymous(user)) {
  throw Error("Anonymous principals not allowed");
}
```

## CSS & Styling

### Tailwind Rules

- Use Tailwind utilities exclusively
- Custom CSS only in App.css for theme variables
- Component styles via className prop
- Responsive classes required (mobile-first)

### Theme Structure

```css
/* CSS variables in App.css only */
:root {
  --color-background: /* ... */;
  --color-surface-primary: /* ... */;
  --color-content: /* ... */;
}

/* Dark mode via data-theme attribute */
[data-theme='dark'] {
  --color-background: /* ... */;
}
```

## File Structure Validation

### Required Files Per Feature

```
apps/[feature]/
├── index.tsx         # REQUIRED: Feature entry
├── components/       # REQUIRED: Feature components
├── hooks/           # OPTIONAL: Feature hooks
└── types.ts         # REQUIRED: Type definitions
```

### Barrel Export Requirements

Every directory with multiple exports needs index.ts:

```typescript
// components/index.ts
export { Card } from './cards/Card';
export { Table } from './tables/Table';
export type { CardProps, TableProps } from './types';
```

## Performance Guidelines

### Code Splitting

- Dynamic imports for routes
- Lazy load heavy features
- Chunk vendors separately

### React Query Optimization

```typescript
// Set appropriate stale times
staleTime: 60 * 1000,        // 1 minute for frequently changing
staleTime: 5 * 60 * 1000,     // 5 minutes for stable data
refetchOnWindowFocus: false,  // Disable for most queries
```

## Error Handling

### User-Facing Errors

- Toast notifications for actions
- Error boundaries for crashes
- Loading states required
- Friendly error messages (no technical jargon)

### Developer Errors

- Console.error with context
- Sentry integration for production
- Source maps enabled

## Git & PR Conventions

### Branch Naming

- `feature/[feature-name]`
- `fix/[bug-description]`
- `refactor/[component-name]`

### Commit Format

```
type(scope): description

- feat(campaigns): add campaign creation form
- fix(auth): resolve NFID connection issue
- refactor(components): reorganize table structure
```

### PR Requirements

1. Type checking passes
2. Linting passes
3. Tests pass
4. Build succeeds
5. Screenshots for UI changes

## Deployment Checklist

### Pre-deployment

```bash
# Set production environment
cp .env.production .env.local

# Build with production config
pnpm build

# Test production build locally
pnpm preview

# Verify canister IDs match production
dfx canister id claimlink_backend --network ic
```

### Environment Variables

```bash
# Required in .env
VITE_CLAIMLINK_BACKEND_CANISTER_ID=
VITE_LEDGER_CANISTER_ID=
VITE_NFT_CANISTER_ID=
VITE_IDENTITY_PROVIDER=
```

## Common Pitfalls to Avoid

### DON'T

- Place business logic in `components/` directory
- Use relative imports across module boundaries
- Commit without running type checks
- Use `any` type
- Create components without TypeScript interfaces
- Skip loading states
- Ignore error handling
- Mix styling approaches (stick to Tailwind)

### DO

- Follow the three-layer component system
- Use path aliases for all imports
- Run full test suite before committing
- Define proper TypeScript types
- Handle all error cases
- Implement loading and error states
- Use React Query for data fetching
- Keep components small and focused

## Architecture Decisions

### Why Three Component Layers?

1. **components/** - Publishing-ready, zero coupling
2. **shared/ui/** - Design system consistency
3. **shared/components/** - App integration layer

### Why Jotai + React Query?

- Jotai: Atomic, composable state
- React Query: Server state with caching
- Together: Complete state solution

### Why Service Layer Pattern?

- Isolates IC/canister complexity
- Enables testing
- Consistent error handling
- Type safety at boundaries


## Figma Design Implementation Rules

### When Creating Components from Figma

1. **NEVER create inline components** - Extract to appropriate directory:
   - Reusable across features → `shared/components/`
   - Feature-specific → `apps/[feature]/components/`
   - Pure UI elements → `shared/ui/`

2. **Use existing design tokens**:
   ```typescript
   // Colors from Figma → CSS variables
   --color-primary: #061937     // Figma: "Primary/Navy"
   --color-success: #50be8f     // Figma: "Status/Success"
   --color-error: #e84c25       // Figma: "Status/Error"

   // Spacing from Figma → Tailwind classes
   8px → "p-2"
   16px → "p-4"
   24px → "p-6"

   // Border radius from Figma
   8px → "rounded-lg"
   16px → "rounded-2xl"
   full → "rounded-full"
```

3. **Component extraction checklist**:

    - [ ] Does this component appear more than once? → Extract it
    - [ ] Could this be parameterized? → Make it configurable
    - [ ] Does it have business logic? → Move to shared/components
    - [ ] Is it purely visual? → Move to shared/ui
4. **Import existing components first**:

    ```typescript
    // ✅ GOOD - Check for existing components
    import { Card } from "@shared/ui/card/Card";
    import { StatCard } from "@shared/components/stat-card/StatCard";

    // ❌ BAD - Creating inline when component exists
    function StatCard() { /* inline implementation */ }
    ```


### Figma Property Mapping

|Figma Property|Code Implementation|
|---|---|
|Auto Layout|Flexbox/Grid with gap|
|Fill Container|`flex-1` or `w-full`|
|Fixed Width|Exact pixel/rem values|
|Corner Radius|`rounded-[value]`|
|Effects/Shadows|Extract to design tokens|
|Text Styles|Typography components|

### Component Naming from Figma

- Figma component "Card/Stat" → `StatCard.tsx`
- Figma variant "Button/Primary/Large" → `<Button variant="primary" size="lg">`
- Figma instance "Dashboard Stats Card" → Use existing `StatCard` component

````

## 3. **Create a Component Library Reference**

Create a file that Cursor can reference:

```typescript
// docs/COMPONENT_LIBRARY.md

# Available Components

## UI Primitives (`@shared/ui`)

### Button
```tsx
import { Button } from "@shared/ui/button/Button";

<Button variant="primary" size="md" leftIcon={<Icon />}>
  Click me
</Button>
````

### Card

```tsx
import { Card } from "@shared/ui/card/Card";

<Card variant="elevated" padding="lg">
  Content
</Card>
```

### Badge

```tsx
import { Badge } from "@shared/ui/badge/Badge";

<Badge variant="success" dot>56%</Badge>
```

## Questions or Updates?

This file is the source of truth. If something is unclear or outdated, update it immediately. The closest AGENTS.md to the code wins - place feature-specific rules in `apps/[feature]/AGENTS.md`.
