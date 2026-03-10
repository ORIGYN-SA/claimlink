# ClaimLink

Certificate minting platform built on the Internet Computer (ICP). Mint and manage ORIGYN NFT certificates representing verified real-world assets (gold, diamonds, watches).

## Architecture

- **Backend** — Rust canister deployed to ICP (`backend/canisters/claimlink/`)
- **Frontend** — React/TypeScript dashboard (`frontend/claimlink_dashboard/`)
- **External Canisters** — ICRC ledger, ORIGYN NFT, IC management interfaces

## Prerequisites

- [dfx 0.29.0+](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- Rust + `wasm32-unknown-unknown` target
- Node.js + pnpm

## Quick Start

```bash
# Start local IC replica
dfx start --clean

# Deploy all canisters
dfx deploy

# Start frontend dev server
cd frontend/claimlink_dashboard
pnpm install
pnpm dev
```

## Backend Commands

Run from repository root:

```bash
./scripts/build-canister.sh claimlink          # Build canister
./scripts/build-all-canister.sh                # Build all canisters
./scripts/generate-did.sh claimlink            # Generate Candid interface
./scripts/run-integration-tests.sh             # Run integration tests
cargo test -p claimlink                        # Run unit tests
cargo clippy                                   # Lint
```

## Frontend Commands

Run from `frontend/claimlink_dashboard/`:

```bash
pnpm dev       # Dev server at http://localhost:5173
pnpm build     # Production build
pnpm lint      # ESLint
```

## Deployment

```bash
./scripts/deploy-backend-canister.sh claimlink <network> <arguments>
# network: local, staging, ic
```

## Tech Stack

| Layer    | Stack |
|----------|-------|
| Backend  | Rust, ic-cdk, Candid, PocketIC |
| Frontend | React 19, TypeScript, TanStack Router/Query, Jotai, shadcn/ui, Tailwind CSS |
| Auth     | NFID IdentityKit |
| Build    | Vite, Cargo, dfx |
