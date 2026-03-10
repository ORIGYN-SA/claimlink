# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.2] - 2026-03-09

### Fixed

- Fix ICRC-21 consent message types to match official spec
- Fix ICRC-21 consent message API (moved to correct query/update handlers)
- Make backend query calls compatible with Oisy wallet by using anonymous caller pattern
- Add production domains to ICRC-28 trusted origins config

## [1.0.0] - 2026-03-06

### Added

- Rust-based canister architecture on the Internet Computer
- Collection management: create, query, and manage ORIGYN NFT collections
- Template system with full CRUD operations (create, read, update, delete)
- Batch minting of ORIGYN NFTs (ICRC-7 standard)
- Paid minting flow with OGY token payments
- OGY/USD price fetching via KongSwap
- Automatic cycles top-up for collection sub-canisters
- Reentrancy guard for create_collection
- Proxy logo upload methods for collections
- Canister metrics and operational observability
- ICRC-28 supported origins configuration
- Version manager for canister state and post-upgrade migrations
- Stable memory storage for templates, collections, and events
- Canister event system with audit logging
- Mint request state management with reimbursement process
- `get_collections_for_users` query endpoint
- Integration tests with PocketIC framework
- CI/CD pipeline for linting, building, testing, and deployment
