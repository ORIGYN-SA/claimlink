# ClaimLink Dashboard

A React/TypeScript frontend application for Internet Computer (ICP) dApp that enables users to create, share, and claim NFT links through campaigns, dispensers, and QR codes.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm
- dfx (IC SDK)

### Installation

```bash
pnpm install
```

### Local Development

1. **Start local IC replica:**
```bash
dfx start --clean
```

2. **Deploy local canisters:**
```bash
dfx deploy
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables for localhost:**
```bash
# Update .env file with:
VITE_IC_HOST=http://localhost:4943
VITE_NFID_LOCALHOST_TARGETS=http://localhost:3000,http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
```

5. **Start development server:**
```bash
pnpm dev
```

### NFID Wallet Configuration for Localhost

NFID requires specific configuration to trust localhost URLs for signing. The app automatically handles this based on your environment variables:

- **Development mode**: Uses localhost URLs from `VITE_NFID_LOCALHOST_TARGETS`
- **Production mode**: Uses canister IDs and your domain

**Important**: Make sure your `.env` file includes:
```bash
VITE_NFID_LOCALHOST_TARGETS=http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
```

## Tech Stack

- **UI**: React, TypeScript, shadcn/ui, Tailwind CSS
- **Routing**: TanStack Router
- **State Management**: Jotai
- **IC Integration**: @dfinity/agent, NFID IdentityKit
- **Build Tool**: Vite

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
