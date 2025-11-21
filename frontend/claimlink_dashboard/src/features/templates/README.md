# Templates Feature

## Overview
The Templates feature allows users to create, manage, and use certificate templates. Users can create templates manually, use AI assistance, or choose from existing templates.

## Structure

```
features/templates/
├── api/                          # Data fetching logic (future)
├── components/
│   ├── template-card.tsx        # Template card component
│   ├── templates-page.tsx       # Main templates page
│   └── index.ts                 # Component exports
├── hooks/                       # Custom hooks (future)
├── stores/                      # Feature state (future)
├── types/
│   └── template.types.ts        # TypeScript types
├── utils/                       # Helper functions (future)
├── index.ts                     # Feature exports
└── README.md                    # This file
```

## Components

### TemplateCard
Displays template information in card format. Supports multiple variants:
- `create-manual`: Card for manual template creation
- `create-ai`: Card for AI-assisted template creation
- `create-existing`: Card for using existing templates
- `template`: Card for displaying existing templates

### TemplatesPage
Main page component that displays:
- Header with title and wallet/account info
- Create template options (3 cards)
- My templates section with pagination
- Footer with pagination controls

## Design Implementation

The implementation follows the Figma design specifications:

### Colors
- Background: `#fcfafa`
- Primary text: `#222526` (Charcoal)
- Secondary text: `#69737c` (Slate)
- Primary accent: `#061937` (Cobalt)
- Borders: `#e1e1e1` (Mouse)
- Highlights: `#cde9ec66` (Celeste40)

### Typography
- General Sans font family
- Multiple weights: Light (300), Regular (400), Medium (500), Semibold (600)
- Responsive text sizes following design system

### Layout
- 20px border radius for main container
- 16px border radius for cards
- 24px padding for main container
- 16px grid gap between elements

## Usage

```tsx
import { TemplatesPage, TemplateCard } from '@/features/templates'

// Use in route
function TemplatesRoute() {
  return (
    <DashboardLayout>
      <TemplatesPage />
    </DashboardLayout>
  )
}

// Use individual card
function ExampleCard() {
  return (
    <TemplateCard 
      variant="create-manual"
      onClick={() => console.log('Create manual template')}
    />
  )
}
```

## Future Enhancements

- API integration for real template data
- Search and filtering functionality
- Template creation forms
- Template editing capabilities
- Export/import functionality
- Template categories and tags
