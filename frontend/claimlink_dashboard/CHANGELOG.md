# Changelog

All notable changes to the **frontend** will be documented in this file.
This changelog is versioned independently from the backend.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2026-03-18

### Added

- Terms and Conditions page

## [1.0.3] - 2026-03-10

### Fixed

- Fix Oisy wallet login failing with "request not supported by signer" error by removing derivationOrigin from global signerClientOptions (OISY doesn't support ICRC-95)

## [1.0.2] - 2026-03-09

### Added

- Custom domain and alternative origins config for minting.origyn.com

### Fixed

- Switch all query calls to use anonymous caller for Oisy wallet compatibility (principalId still available from auth)

## [1.0.0] - 2026-03-06

### Added

- React/TypeScript dashboard with shadcn/ui component library and Tailwind CSS
- NFID IdentityKit authentication with auto-navigation on connect/disconnect
- Collection management: create, view, and manage ORIGYN NFT collections
- Template creation and editing with dynamic fields, custom backgrounds, and multi-language support
- Certificate minting flow with batch support
- Certificate renderer (v2) with custom backgrounds, company logos, watermarks, and badges
- Paid certificate minting UI with OGY token payments
- Public certificate viewing pages with QR code generation
- Dashboard with collection overview and recent activity
- Transaction history and OGY withdrawal functionality
- Mobile-responsive design across all pages
- Template version system for backwards-compatible certificate rendering
- File upload with image and video support (chunked uploads to IC)
- TanStack Router file-based routing with auto code-splitting
- Jotai atomic state management and TanStack Query for server state
- Service layer pattern for all IC canister interactions
- ESLint configuration and CI/CD pipeline integration
