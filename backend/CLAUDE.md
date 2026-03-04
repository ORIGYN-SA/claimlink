# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the backend for ClaimLink, built on the Internet Computer (ICP) using Rust canisters. The project uses a monorepo structure with the main claimlink canister, external canister APIs, shared libraries, and integration tests.

## Build and Development Commands

### Building Canisters

Build a specific canister:
```bash
cd .. # Must run from repository root
./scripts/build-canister.sh claimlink
```

Build with integration test features:
```bash
./scripts/build-canister.sh --integration-test claimlink
```

Build all canisters:
```bash
./scripts/build-all-canister.sh
```

### Testing

Run integration tests (builds and runs tests):
```bash
cd .. # Must run from repository root
./scripts/run-integration-tests.sh
```

Run integration tests without rebuilding:
```bash
./scripts/run-integration-tests.sh --no-build
```

Run unit tests for a specific package:
```bash
cargo test -p claimlink
cargo test -p integration_tests
```

Run unit tests for libraries:
```bash
cargo test -p types
cargo test -p utils
cargo test -p http_request
```

### Linting

Run clippy:
```bash
cargo clippy
```

### Candid Generation

Generate Candid interface file:
```bash
cd .. # Must run from repository root
./scripts/generate-did.sh claimlink
```

## Architecture

### Directory Structure

- **`canisters/`** - Proprietary canisters for ClaimLink
  - `claimlink/` - Main backend canister
    - `api/` - Public API types and interfaces
    - `impl/` - Implementation with business logic
- **`external_canisters/`** - External canister APIs for inter-canister communication
  - `ic_management/` - IC management canister API and C2C client
  - `icrc_ledger/` - ICRC ledger API and C2C client
  - `origyn_nft/` - ORIGYN NFT canister API and C2C client
- **`libraries/`** - Shared libraries used across canisters
  - `http_request/` - HTTP request handling
  - `types/` - Common type definitions
  - `utils/` - Utility functions (env, memory, constants)
- **`integration_tests/`** - PocketIC-based integration tests

### Canister Structure

Each canister follows a two-crate pattern:

1. **API crate** (`api/`) - Contains public types, errors, and request/response definitions
2. **Implementation crate** (`impl/`) - Contains the actual canister logic organized as:
   - `lib.rs` - Main entry point with `export_candid!()`
   - `state.rs` - Canister state management using `canister_state!` macro
   - `lifecycle/` - Init, pre_upgrade, post_upgrade hooks
   - `updates/` - Update call handlers
   - `queries/` - Query call handlers
   - `guards.rs` - Access control guards
   - `memory.rs` - Stable memory management
   - `wasm/` - Embedded WASM files for sub-canisters

### External Canister Integration

External canisters have two crates each:
- `api/` - Type definitions and interfaces
- `c2c_client/` - Canister-to-canister client for making inter-canister calls

### State Management

The canister state uses Bity's state management pattern:
- `RuntimeState` contains `env` (CanisterEnv) and `data` (Data struct)
- State accessed via `read_state()` and `mutate_state()` macros
- Lifecycle hooks handle serialization/deserialization for upgrades

### Key Dependencies

- **Bity IC libraries**: Custom canister development libraries (`bity-ic-*`)
- **ic-cdk**: Internet Computer Canister Development Kit
- **candid**: Interface definition language
- **pocket-ic**: Integration testing framework
- **ic-stable-structures**: Stable memory data structures

### Sub-Canister Management

The claimlink canister manages ORIGYN NFT sub-canisters:
- Uses `OrigynSubCanisterManager` to create and manage NFT collection canisters
- Embeds ORIGYN NFT WASM in `impl/wasm/origyn_nft_canister.wasm.gz`
- Creates canisters with initial cycles funding

## Integration Tests

Tests use PocketIC to simulate the full IC environment:
- Located in `integration_tests/src/`
- Test suite in `claimlink_suite/tests/`
- Client modules provide typed access to canisters
- Run with `cargo test -p integration_tests`

## Important Notes

- All build scripts must be run from the repository root (parent of `backend/`)
- The workspace is defined in `../Cargo.toml`
- Canister builds produce optimized WASM files using `ic-wasm` (shrink + optimize)
- DFX version: 0.29.0 (specified in `../dfx.json`)
- The project uses GitLab CI/CD defined in `../.gitlab-ci.yml`
