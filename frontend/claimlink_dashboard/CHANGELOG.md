# Changelog

All notable changes to the **frontend** will be documented in this file.
This changelog is versioned independently from the backend.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.2.0] - 2026-03-20

### Fixed

- Fix templates page crashing with IC 3MB reply limit when user has templates with large custom background images (base64 data URIs)
- Fix template creation failing with `"Call was returned undefined"` error when custom background image pushed the IC ingress message past the 2MB limit
  - Root cause: `getDataUriSize()` was checking the decoded binary size (~25% smaller) instead of the data URI string size that actually gets sent in the Candid message
  - Reduced `MAX_BACKGROUND_SIZE_BYTES` from 1MB (binary) to 800KB (string) with proper string-length checking
  - Added pre-flight size validation in `TemplateService.createTemplate()` with clear error message before attempting the IC call

### Changed

- Adopt scatter-gather fetch pattern for templates: fetch lightweight IDs via `get_template_ids_by_owner`, then fetch each template individually via `get_template_by_id` in parallel
- Update Candid bindings to match backend v1.0.3 — added `get_template_ids_by_owner`, `get_template_by_id`, `TemplateIdsResult`, `GetTemplateByIdError` types
- `TemplateService.getTemplateById()` now uses dedicated backend query instead of fetching all templates and filtering client-side
- `useTemplate` hook no longer requires principal/owner parameter

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
