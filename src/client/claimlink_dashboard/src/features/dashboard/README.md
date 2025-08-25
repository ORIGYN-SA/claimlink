# Dashboard Feature

This feature contains all components and logic related to the main dashboard page of the ClaimLink application.

## Structure

```
dashboard/
├── components/
│   ├── StatCard.tsx           # Statistics display card
│   ├── WelcomeCard.tsx        # Welcome banner with CTA
│   ├── FeedCard.tsx          # User activity feed item
│   ├── MintCard.tsx          # NFT minting status card
│   └── CertificateListCard.tsx # Certificate list with search
├── DashboardPage.tsx          # Main dashboard page component
├── types.ts                   # TypeScript types and interfaces
├── index.ts                   # Feature exports
└── README.md                  # This file
```

## Components

### StatCard
Displays key metrics with trend indicators.
- **Props**: `title`, `value`, `trend`, `trendColor`
- **Usage**: Shows minted certificates, awaiting certificates, etc.

### WelcomeCard
Hero banner with gradient background and call-to-action.
- **Features**: Welcome message, minting CTA button
- **Styling**: Custom gradient background matching brand colors

### FeedCard
Shows user activity in feed format.
- **Props**: `title`, `id` (optional)
- **Features**: Avatar placeholder, user ID display

### MintCard
Displays NFT certificates with status badges.
- **Props**: `title`, `status`, `date`, `imageUrl`
- **Status Types**: "Minted", "Transferred", "Waiting"
- **Features**: Status-colored indicators, image thumbnails

### CertificateListCard
Reusable card for displaying certificate lists.
- **Features**: Search functionality, view all button, scrollable list
- **Props**: `title`, `subtitle`, `items`, `searchPlaceholder`, `onViewAll`

### DashboardPage
Main container component that orchestrates all dashboard elements.
- **Layout**: Grid-based responsive layout
- **Sections**: Stats overview, welcome card, activity feeds, certificate grid

## Design System Integration

All components follow the AGENTS.md guidelines:
- ✅ Uses shadcn/ui components as foundation
- ✅ Brand colors via CSS variables
- ✅ Consistent spacing and typography
- ✅ Proper TypeScript types
- ✅ Feature-based organization

## Styling Approach

1. **Primary**: shadcn/ui components (Card, Button, Badge, Avatar, Input)
2. **Customization**: CSS variables for brand colors
3. **Specificity**: Tailwind utility classes for component-specific styling
4. **Shadows**: Custom shadow values matching Figma design

## Usage Example

```typescript
import { DashboardPage } from "@/features/dashboard"

function App() {
  return <DashboardPage />
}
```

## Data Flow

Currently uses mock data. In the future:
1. Add hooks/ directory for data fetching
2. Integrate with React Query for server state
3. Add services/ directory for API calls
4. Connect to IC canisters

## Future Enhancements

- [ ] Real-time data updates
- [ ] Interactive charts for statistics
- [ ] Filtering and sorting for certificate lists
- [ ] Pagination for large datasets
- [ ] Export functionality
- [ ] Dark mode support