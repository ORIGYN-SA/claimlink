# Auth Feature

This feature contains all components and logic related to authentication in the ClaimLink application.

## Structure

```
auth/
├── components/
│   ├── login-page.tsx              # Main login page component
│   ├── wallet-connection-section.tsx  # Wallet authentication section
│   ├── integrator-login-section.tsx   # Integrator ID login section
│   ├── login-footer.tsx              # Login page footer
│   └── wallet-icons.tsx              # Wallet provider icons
├── hooks/                             # Custom hooks (future)
├── stores/                            # Auth state management (future)
├── types/                             # TypeScript types (future)
├── utils/                             # Auth utilities (future)
├── index.ts                           # Feature exports
└── README.md                          # This file
```

## Components

### LoginPage
Main container component that orchestrates the entire login experience.
- **Features**: Video background, glassmorphism design, responsive layout
- **Sections**: Logo, welcome title, wallet connection, integrator login, footer

### WalletConnectionSection
Handles wallet-based authentication options.
- **Wallets**: NFID (primary), Internet Identity, OISY, Plug Wallet
- **Features**: Hover states, distinct styling for primary option

### IntegratorLoginSection
Traditional email/password login for integrator accounts.
- **Features**: Form inputs, login button, forgot password link
- **Styling**: Glassmorphism inputs matching design system

### LoginFooter
Terms and conditions footer.
- **Features**: Legal text, clickable policy links

### WalletIcons
Reusable icon components for different wallet providers.
- **Icons**: NFID, Internet Identity, OISY, Plug, Info, Arrow Right
- **Styling**: Consistent sizing and brand colors

## Design System Integration

All components follow the AGENTS.md guidelines:
- ✅ Uses shadcn/ui components as foundation
- ✅ Feature-based organization
- ✅ Proper component composition
- ✅ Consistent import patterns
- ✅ TypeScript types for props

## Route Integration

The login route (`/login`) is now minimal and follows the pattern:
```typescript
import { LoginPage } from '@/features/auth'
export const Route = createFileRoute('/login')({
  component: LoginPage,
})
```

## Future Enhancements

- [ ] Add authentication hooks in `hooks/`
- [ ] Implement auth state management in `stores/`
- [ ] Add TypeScript types in `types/`
- [ ] Create auth utilities in `utils/`
- [ ] Integrate with IC authentication
- [ ] Add loading states and error handling
- [ ] Implement form validation
