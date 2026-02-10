# Template System Architecture

This document clarifies the template system architecture, storage locations, and ongoing refactoring decisions.

## Table of Contents
- [Storage Locations Overview](#storage-locations-overview)
- [Key Terminology](#key-terminology)
- [Data Flow](#data-flow)
- [Current Architecture (As-Is)](#current-architecture-as-is)
- [Proposed Simplified Architecture](#proposed-simplified-architecture) (Options A/B/C)
- [Migration Status](#migration-status)
- [Open Decisions](#open-decisions)
- [Key Clarifications](#key-clarifications)
- [Target Mental Model: Schema + Layout + Data](#target-mental-model-schema--layout--data)
- [First Principles: Code vs Layout](#first-principles-code-vs-layout)
- [Simple Mode vs Advanced Mode](#simple-mode-vs-advanced-mode)
- [Rendering Flow (Target)](#rendering-flow-target)
- [Template Versioning System](#template-versioning-system)
- [Impact on Existing Code](#impact-on-existing-code-if-this-model-is-adopted)
- [References](#references)
- [Next Steps](#next-steps)
- [Discussion Log](#discussion-log)

---

## Storage Locations Overview

### Where Is Everything Stored?

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CLAIMLINK CANISTER (Rust Backend)               │
├─────────────────────────────────────────────────────────────────────┤
│  • Collection records (id, name, owner, canister_id, status)        │
│  • User accounts                                                    │
│  • Campaign data                                                    │
│                                                                     │
│  Does NOT store templates - only references to collection canisters │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ references
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│              ORIGYN NFT COLLECTION CANISTER (One per collection)    │
├─────────────────────────────────────────────────────────────────────┤
│  collection_metadata:                                               │
│                                                                     │
│  "claimlink.template.structure" = TemplateStructure JSON            │
│    → FORM DEFINITION (what fields exist, types, labels, validation) │
│    → Used when creating/editing certificates                        │
│                                                                     │
│  "claimlink.template.tree" = TemplateNode[] JSON (NEW, unused)      │
│    → Same purpose, different format                                 │
│                                                                     │
│  Also: collection name, description, logo, etc.                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ contains tokens
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│              ORIGYN NFT TOKEN (One per minted certificate)          │
├─────────────────────────────────────────────────────────────────────┤
│  token_metadata (ICRC3Value format):                                │
│                                                                     │
│  Standard fields:                                                   │
│    "name", "description", "image", "minted_at"                      │
│                                                                     │
│  User-filled form values:                                           │
│    "company_name", "certification_date", etc.                       │
│                                                                     │
│  "__apps" = ORIGYN Apps Structure containing:                       │
│    └── app_id: "public.metadata"                                    │
│        └── data:                                                    │
│            ├── template            (TemplateNode[] - info view)     │
│            ├── certificateTemplate (TemplateNode[] - cert view)     │
│            ├── userViewTemplate    (TemplateNode[] - user view)     │
│            ├── formTemplate        (TemplateNode[] - form def)      │
│            └── ... field values ...                                 │
│                                                                     │
│  Library: uploaded files (images, videos, documents)                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Terminology

### Metadata Keys Explained

| Key | Location | Format | Purpose |
|-----|----------|--------|---------|
| `claimlink.template.structure` | Collection | TemplateStructure | Form definition - what fields to show in the editor |
| `claimlink.template.tree` | Collection | TemplateNode[] | Form definition in new tree format (not yet used) |
| `__apps[].data.template` | Token | TemplateNode[] | "Information" tab layout - how to display the info view |
| `__apps[].data.certificateTemplate` | Token | TemplateNode[] | "Certificate" tab layout - formal certificate presentation |
| `__apps[].data.userViewTemplate` | Token | TemplateNode[] | User/summary view layout |
| `__apps[].data.formTemplate` | Token | TemplateNode[] | Form structure stored for potential editing |

### Two Different "Template" Concepts

**1. FORM DEFINITION (Collection Level)**
- Defines what fields exist, their types, labels, validation rules
- Stored in `collection_metadata["claimlink.template.structure"]`
- Format: `TemplateStructure` (ClaimLink custom format)
- Used when: Rendering the form for creating/editing certificates

```typescript
// TemplateStructure example
{
  sections: [
    {
      id: "certificate",
      name: "Certificate Details",
      items: [
        { id: "name", type: "input", label: "Name", required: true },
        { id: "image", type: "image", label: "Certificate Image" },
      ]
    }
  ],
  languages: [{ code: "en", name: "English" }],
  background: { type: "standard" }
}
```

**2. RENDERED VIEWS (Token Level)**
- Defines how to DISPLAY the certificate (layout, styling)
- Stored in `token_metadata["__apps"][0].data.*`
- Format: `TemplateNode[]` (ORIGYN tree format)
- Used when: Viewing certificates - rendering the display

```typescript
// TemplateNode[] example
[
  {
    type: "section",
    id: "cert-section",
    title: { en: "Certificate Details" },
    content: [
      { type: "field", id: "name-field", title: { en: "Name" }, fields: ["name"] },
      { type: "image", id: "cert-image", field: "image" }
    ]
  }
]
```

---

## Data Flow

### Current Flow (How It Works Today)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ 1. CREATE        │     │ 2. MINT          │     │ 3. VIEW          │
│    TEMPLATE      │     │    CERTIFICATE   │     │    CERTIFICATE   │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│                  │     │                  │     │                  │
│ User designs     │     │ Load template    │     │ Fetch token      │
│ form in editor   │     │ from collection  │     │ metadata         │
│       │          │     │ (TemplateStruct) │     │       │          │
│       ▼          │     │       │          │     │       ▼          │
│ TemplateStructure│     │       ▼          │     │ Extract views    │
│       │          │     │ User fills form  │     │ from __apps      │
│       ▼          │     │       │          │     │       │          │
│ Store in         │     │       ▼          │     │       ▼          │
│ collection as    │     │ generateOrigyn   │     │ TemplateRenderer │
│ claimlink.       │     │ Views() converts │     │ renders view     │
│ template.        │     │ to TemplateNode[]│     │                  │
│ structure        │     │       │          │     │ (No conversion   │
│                  │     │       ▼          │     │  needed - views  │
│                  │     │ Store 4 views    │     │  are pre-baked)  │
│                  │     │ in token __apps  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### The Conversion That Happens at Mint Time

```typescript
// In certificates.service.ts / useMintCertificateWithTemplate

// 1. Load form definition from collection
const templateStructure = await getCollectionTemplate(collectionId);

// 2. User fills out the form based on templateStructure
const formData = { name: "My Certificate", image: uploadedFile, ... };

// 3. Convert to ORIGYN views (THIS IS THE CONVERSION)
const origynViews = generateOrigynViews(templateStructure);
// Returns: { template, certificateTemplate, userViewTemplate, formTemplate }

// 4. Build metadata with all views embedded
const metadata = buildOrigynApps(templateStructure, formData, origynViews);

// 5. Convert to ICRC3 format and mint
const icrc3Metadata = convertToIcrc3Metadata(metadata);
await actor.mint({ metadata: icrc3Metadata, ... });
```

---

## Current Architecture (As-Is)

### File Locations

**Form Definition (TemplateStructure):**
- Types: `src/features/templates/types/template.types.ts`
- Serialization: `src/features/templates/utils/template-serializer.ts`
- Editor: `src/features/templates/components/create/edit-template-step-v2.tsx`

**View Generation (TemplateNode[]):**
- Types: `src/features/template-renderer/types/origyn-template.types.ts`
- Converter: `src/features/template-renderer/utils/template-converter.ts` (~397 lines)
- View Generator: `src/features/template-renderer/utils/view-generator.ts` (~593 lines)
- Renderer: `src/features/template-renderer/components/template-renderer.tsx`

**Compatibility Layer (created during refactor):**
- Tree utilities: `src/features/templates/utils/template-tree-utils.ts`
- Compat layer: `src/features/templates/utils/template-compat.ts`
- Simple mode: `src/features/templates/utils/simple-mode-constraints.ts`

### The Redundancy Problem

Currently, we store the same structural information multiple times:

```
Collection level:
  └── TemplateStructure (form definition)
        │
        │ generateOrigynViews() runs at mint time
        ▼
Token level:
  └── __apps[].data
        ├── template            ← Generated view #1
        ├── certificateTemplate ← Generated view #2 (slightly different)
        ├── userViewTemplate    ← Generated view #3 (slightly different)
        └── formTemplate        ← Basically a copy of the source
```

**This means:**
- ~1000 lines of conversion code exists
- Template data is duplicated 4x in each token
- Changes to display logic require re-minting tokens

---

## Proposed Simplified Architecture

### Option A: Single Template + Variants at Render Time

```
Collection level:
  └── TemplateNode[] (single definition with all fields)

Token level:
  └── Just the field VALUES (no template copies)

Render time:
  └── Fetch template from collection
  └── Apply variant ("certificate" | "information" | "user") via CSS/props
```

**Pros:**
- No redundancy
- Smaller token metadata
- Template updates can affect existing tokens (if desired)
- Delete ~1000 lines of conversion code

**Cons:**
- Tokens depend on collection template
- If collection deleted/changed, token display affected

### Option B: Single Template Copied to Token

```
Collection level:
  └── TemplateNode[] (single definition)

Token level:
  └── Same TemplateNode[] (copied once at mint)
  └── Field values

Render time:
  └── Use token's template copy
  └── Apply variant as render prop
```

**Pros:**
- Self-contained tokens (survive collection changes)
- Single source of truth
- Still delete most conversion code

**Cons:**
- Some duplication (but 1x not 4x)

### Option C: Current System (Keep As-Is)

Keep everything as it is with the compatibility layer for gradual changes.

**Pros:**
- No risk of breaking staging
- Works today

**Cons:**
- Complexity remains
- ~1000 lines of conversion code
- 4x template redundancy per token

---

## Migration Status

### What's Been Done

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Created tree utilities (`template-tree-utils.ts`) |
| Phase 2 | ✅ Complete | Created compatibility layer (`template-compat.ts`) |
| Phase 3 | ⏸️ Pending | Delete conversion code (blocked on architecture decision) |
| Phase 4 | ✅ Complete | Form generation works with current system |
| Phase 5-6 | ✅ Complete | Certificate viewer, events feature |
| Phase 7-8 | ✅ Complete | Code quality, type cleanup |

### What Exists on Staging

- Collections store templates as `claimlink.template.structure` (TemplateStructure format)
- Minted certificates have views baked into `__apps`
- New `claimlink.template.tree` key is NOT used yet

### To Complete Full Migration (if chosen)

1. **Update template editor** to work directly with TemplateNode[]
2. **Update mock templates** in `shared/data/templates.ts`
3. **Update serialization** to only use `claimlink.template.tree`
4. **Delete conversion files:**
   - `template-converter.ts`
   - `view-generator.ts`
   - `template-compat.ts` (if no backwards compat needed)
5. **Update staging data:**
   - Either recreate collections
   - Or run migration script to convert existing templates

---

## Open Decisions

### Decision 1: Architecture Choice

**Question:** Which architecture do we want?

| Option | Complexity | Token Size | Self-Contained | Migration Effort |
|--------|------------|------------|----------------|------------------|
| A: Render-time variants | Simplest | Smallest | No | High |
| B: Single template copy | Medium | Medium | Yes | Medium |
| C: Keep current (4 views) | Highest | Largest | Yes | None |

**Recommendation:** Option B balances simplicity with self-contained tokens.

### Decision 2: Backwards Compatibility

**Question:** Do we need to support old `TemplateStructure` format?

- **If YES:** Keep compat layer, read both formats, write new format only
- **If NO:** Delete compat layer, only support TemplateNode[], recreate staging data

**Current staging status:** Only has TemplateStructure data. Full migration = recreate collections.

### Decision 3: When to Migrate

**Question:** Do this refactor now or defer?

- **Now:** Cleaner codebase, but staging disruption
- **Later:** Works today, but carries tech debt

---

## Key Clarifications

### Q: Why do we have `__apps` with multiple views?

**A:** `__apps` is ORIGYN's standard for app-specific data. The multiple views (template, certificateTemplate, userViewTemplate) were designed to pre-render different display layouts at mint time. However, this creates redundancy - we could achieve the same with one template + render variants.

### Q: What's the difference between TemplateStructure and TemplateNode[]?

**A:**
- `TemplateStructure` = ClaimLink's custom format for form definition (sections/items)
- `TemplateNode[]` = ORIGYN's tree format for rendering (nodes with types)

They represent the same information differently. The conversion code (`generateOrigynViews`) transforms one to the other.

### Q: If we fully migrate, what breaks on staging?

**A:**
- Existing certificates still VIEW fine (views baked in)
- Existing collection templates won't LOAD (wrong format)
- Solution: Recreate collections after code deployment

### Q: Why wasn't the old code deleted yet?

**A:** The conversion code is still actively used. Deleting it requires:
1. Choosing target architecture
2. Updating editor to work with TemplateNode[]
3. Updating all consumers
4. Migrating or recreating staging data

---

## Target Mental Model: Schema + Layout + Data

*This section captures architectural thinking after analyzing the b2b-minting-dapp (legacy minting studio), researching established patterns (JSON Schema + UI Schema, JSON Forms, Server-Driven UI), and working through first principles.*

### The Fundamental Problem

We are solving three things:

1. **Define** what data a certificate needs (field definitions)
2. **Arrange** how that data is displayed (layout/presentation)
3. **Store** the actual filled-in values (data)

This is a well-solved problem. The established pattern is **Schema + UI Schema + Data**, used by [JSON Forms](https://jsonforms.io/docs/architecture/), [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/), Salesforce Lightning, Drupal View Modes, and others.

### Why the Current System Is Complex

The current system conflates these three concerns:

- `TemplateStructure` mixes schema + partial layout (sections determine which view a field appears in)
- `TemplateNode[]` mixes schema + layout (a `field` node contains both the label definition AND its position in the tree)
- At mint time, ~1000 lines of code convert between the two, then bakes 4 copies into each token

The b2b-minting-dapp had the same problem. Each token stored:
```
__apps:
  ├── "public.metadata"           ← data (field values)
  └── "public.metadata.template"  ← everything else mixed together
      ├── formTemplate            (schema)
      ├── template                (info view layout + schema duplication)
      ├── certificateTemplate     (cert view layout + schema duplication)
      └── userViewTemplate        (summary layout + schema duplication)
```

The layout nodes duplicated field labels, types, and other schema info that was already defined in `formTemplate`. This is the pattern we want to avoid.

### Three Separate Concerns

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SCHEMA — What data exists (flat list)                       │
│     Defines: field ID, type, label, validation, required        │
│     Lives on: Collection                                        │
│     Edited by: Template editor (simple mode)                    │
├─────────────────────────────────────────────────────────────────┤
│  2. LAYOUT — How to arrange it (tree per view)                  │
│     Defines: groups, columns, field ordering, static elements   │
│     References: schema fields by ID (never duplicates them)     │
│     Lives on: Collection (and optionally copied to token)       │
│     Edited by: Auto-generated (simple) or visual builder (adv.) │
├─────────────────────────────────────────────────────────────────┤
│  3. DATA — Actual values (flat key-value pairs)                 │
│     Contains: just the user-filled values, keyed by field ID    │
│     Lives on: Token                                             │
│     Filled by: Certificate minting form                         │
└─────────────────────────────────────────────────────────────────┘
```

### Concrete Example

```typescript
// ===== SCHEMA (stored on collection) =====
// Flat list of field definitions. No layout info.
schema: [
  { id: "company-name", type: "text", label: { en: "Company Name", it: "Nome Azienda" }, required: true },
  { id: "vat", type: "text", label: { en: "VAT Number", it: "Partita IVA" } },
  { id: "award", type: "text", label: { en: "Award", it: "Premio" }, required: true },
  { id: "reason", type: "textarea", label: { en: "Reason for Award", it: "Motivo del premio" } },
  { id: "date", type: "text", label: { en: "Date", it: "Data" } },
  { id: "main-image", type: "image", label: { en: "Photo" } },
  { id: "gallery", type: "image", multiple: true, label: { en: "Gallery", it: "Galleria" } },
  { id: "attachments", type: "files", label: { en: "Documents", it: "Allegati" } },
]

// ===== LAYOUT (stored on collection, per view) =====
// Tree structure referencing field IDs. Never duplicates labels/types.
layout: {
  certificate: [
    { type: "asset", ref: "logo" },
    { type: "group", title: { en: "Company Details" }, children: [
      { type: "columns", columns: 2, children: [
        { type: "field", ref: "company-name" },
        { type: "field", ref: "vat" },
      ]},
    ]},
    { type: "field", ref: "award" },
    { type: "field", ref: "reason" },
    { type: "field", ref: "date" },
    { type: "text", content: { en: "Certified by FEDERITALY" } },
    { type: "asset", ref: "signature" },
  ],
  information: [
    { type: "field", ref: "main-image" },
    { type: "group", title: { en: "Gallery" }, children: [
      { type: "field", ref: "gallery" },
    ]},
    { type: "separator" },
    { type: "field", ref: "attachments" },
  ]
}

// ===== ASSETS (stored on collection) =====
assets: {
  logo: "logo.png",
  background: "bg.jpg",
  signature: "signature.png"
}

// ===== LANGUAGES (stored on collection) =====
languages: [{ code: "en", name: "English" }, { code: "it", name: "Italian" }]

// ===== DATA (stored on token) =====
// Just values. No schema info, no layout info.
data: {
  "company-name": { en: "CASA VISSANI", it: "CASA VISSANI" },
  "vat": { en: "IT12345678" },
  "award": { en: "Ambassador of Excellence", it: "Ambasciatore dell'Eccellenza" },
  "reason": { en: "For representing Italian cuisine...", it: "Per aver rappresentato..." },
  "date": { en: "Roma 26 November 2025", it: "Roma 26 Novembre 2025" },
  "main-image": [{ path: "photo.jpeg" }],
  "attachments": [{ path: "document.pdf" }],
}
```

### Layout Node Types

The layout uses a small set of primitives:

| Node Type | Purpose | Has children? | References |
|-----------|---------|---------------|------------|
| `field` | Renders a schema field (label + value) | No | `ref` -> schema field ID |
| `group` | Visual section with title | Yes | -- |
| `columns` | Side-by-side arrangement | Yes | `columns` count |
| `separator` | Divider line | No | -- |
| `asset` | Collection-level image (logo, signature) | No | `ref` -> asset key |
| `text` | Static text, not data-bound | No | `content` (localized) |

The renderer looks up the field type and label from the schema, the value from the data, and applies styling based on the variant (`certificate`, `information`, `default`).

---

## First Principles: Code vs Layout

These principles determine what goes in the stored layout vs what's handled by rendering code:

**1. What changes between collections vs what stays the same?**
- Same for every certificate -> code (e.g., how a `field` renders as label + value)
- Differs per collection -> layout data (e.g., which fields exist, their order)

**2. Store intent, not implementation.**
- Layout says `{ type: "field", ref: "company-name" }` (intent)
- Code decides: in certificate view -> centered, 24px, bold; in info view -> left-aligned, white, with label row (implementation)

**3. The less you store, the more you can change later.**
- If styling is baked into token metadata, redesigns require re-minting
- If tokens only store data and the renderer handles styling, a code deploy can change the look of every certificate

**4. Who needs to control it?**
- Developer controls it -> code
- User controls it through UI -> layout data
- User MIGHT control it later -> code for now, move to layout data when needed

**What this means in practice:**

| In layout data (user decides) | In rendering code (developer decides) |
|-------------------------------|---------------------------------------|
| Which fields exist and their types/labels | How a `field` renders in each variant |
| Which fields go in which view | Typography, spacing, color per variant |
| Field ordering and grouping | Responsive behavior |
| Column arrangements | How `group`, `columns`, `separator` render |
| Which collection assets to use | Overall page structure per variant |

---

## Simple Mode vs Advanced Mode

The key insight: **the duality between simple and flexible should live in the editor UI, not in the data format.** Both modes produce the same schema + layout structure.

**Simple mode (current):**
- User only edits the schema (add/remove/reorder fields)
- Each field is assigned to a view (certificate or information) via a section/tag
- Layout is auto-generated: one group per section, all fields stacked vertically
- No columns, no custom nesting

**Advanced mode / visual builder (future):**
- User edits both schema AND layout
- WYSIWYG: see the certificate live, click to add fields, drag into columns
- Full control over groups, columns, ordering, static text
- Same underlying format -- just fewer constraints in the editor

```
Simple mode editor                    Advanced mode editor
┌─────────────────────┐              ┌──────────────────────────────┐
│ Certificate section  │              │ ┌────────────┬─────────────┐ │
│  + Company Name      │              │ │ [Logo]     │             │ │
│  + VAT Number        │              │ ├────────────┴─────────────┤ │
│  + Award             │   same       │ │ Company Name | VAT Number│ │
│                      │   format     │ ├──────────────────────────┤ │
│ Information section  │ ──────────>  │ │ Award                    │ │
│  + Gallery           │              │ │ Date                     │ │
│  + Attachments       │              │ │ [Signature]              │ │
└─────────────────────┘              └──────────────────────────────┘
```

### WYSIWYG Visual Builder (Future)

The long-term goal is to replace the step-by-step template creation with a visual builder:

- User sees a live certificate preview
- Click to add fields, sections, columns, static text
- Drag to reorder and rearrange
- Changes are reflected immediately (no switching between edit and preview steps)
- The builder edits both schema (field definitions) and layout (arrangement) simultaneously
- Underlying data format is identical to what simple mode produces

This is explicitly deferred. The current simple mode editor should work well within the current system first. The visual builder can be built on top of the same format later without any data migration.

---

## Rendering Flow (Target)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ 1. CREATE        │     │ 2. MINT          │     │ 3. VIEW          │
│    TEMPLATE      │     │    CERTIFICATE   │     │    CERTIFICATE   │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│                  │     │                  │     │                  │
│ User adds fields │     │ Load schema from │     │ Load schema +    │
│ (simple mode)    │     │ collection       │     │ layout from      │
│   or             │     │       │          │     │ collection       │
│ Designs layout   │     │       ▼          │     │       │          │
│ (advanced mode)  │     │ Generate form    │     │ Load data from   │
│       │          │     │ from schema      │     │ token            │
│       ▼          │     │       │          │     │       │          │
│ Store schema +   │     │       ▼          │     │       ▼          │
│ layout on        │     │ User fills data  │     │ Renderer combines│
│ collection       │     │       │          │     │ layout + schema  │
│                  │     │       ▼          │     │ + data + variant │
│ (No conversion   │     │ Store ONLY data  │     │                  │
│  between formats)│     │ on token         │     │ (No conversion   │
│                  │     │                  │     │  needed)          │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### How the Renderer Combines the Three Inputs

```typescript
// Renderer receives three separate inputs:
<TemplateRenderer
  schema={collectionSchema}              // field definitions
  layout={collectionLayout.certificate}  // which view's layout tree
  data={tokenData}                       // filled values
  assets={collectionAssets}              // logos, signatures, etc.
  variant="certificate"                  // controls styling
  language="en"
/>

// Internally, for each layout node:
// 1. See { type: "field", ref: "company-name" }
// 2. Look up schema: { id: "company-name", type: "text", label: { en: "Company Name" } }
// 3. Look up data: { en: "CASA VISSANI" }
// 4. Render based on variant: CertificateField renders centered, bold, etc.
```

---

## Template Versioning System

*Discussed: February 2025. The idea is to version templates so that breaking changes to the rendering system don't break old certificates.*

### The Problem Versioning Solves

If we change how templates are stored or rendered (e.g., switching from Option B to Option A, or adopting Schema + Layout + Data), certificates minted under the old system could break. Versioning decouples the storage/rendering strategy from the minted data.

### How It Works

Every template gets a version. Every token records the version it was minted with. The renderer dispatches to the appropriate logic based on version.

```
Token minted under v1.0 (Option B era — template embedded in token):
  ├── template_version: "1.0"
  ├── template: { ... }         ← Full copy stored in token
  └── field_values: { ... }

Token minted under v2.0 (Option A era — template lives in collection):
  ├── template_version: "2.0"
  ├── collection_id: "abc-123"  ← Reference only
  └── field_values: { ... }

Token minted under v3.0 (Schema + Layout + Data era):
  ├── template_version: "3.0"
  ├── collection_id: "abc-123"
  └── data: { ... }             ← Flat key-value pairs only
```

### Renderer Registry

```typescript
// Each version knows how to resolve and render its tokens
const renderers: Record<string, VersionedRenderer> = {
  "1.0": {
    resolveTemplate: (token) => token.template,  // embedded
    Renderer: TemplateRendererV1,
  },
  "2.0": {
    resolveTemplate: (token) => fetchFromCollection(token.collection_id),
    Renderer: TemplateRendererV1,  // same renderer, different data source
  },
  "3.0": {
    resolveTemplate: (token) => fetchSchemaAndLayout(token.collection_id),
    Renderer: TemplateRendererV3,  // new Schema+Layout+Data renderer
  },
};

function TemplateRenderer({ tokenMetadata }) {
  const version = tokenMetadata.template_version ?? "1.0";
  const { resolveTemplate, Renderer } = renderers[version];
  const template = resolveTemplate(tokenMetadata);
  return <Renderer template={template} data={tokenMetadata} />;
}
```

### Version Bumping Strategy

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1   Patch: Rendering bug fix, no data change
1.0.0 → 1.1.0   Minor: New optional node type (old tokens ignore it)
1.0.0 → 2.0.0   Major: Breaking change — different storage, different renderer
```

**When to bump:**
- **Patch:** Fix rendering bug, no schema/storage change
- **Minor:** Add new optional feature (backwards compatible)
- **Major:** Change storage strategy, change renderer logic, remove/rename fields

### Why This Makes Architecture Decisions Reversible

**Version = contract with the renderer, not a storage commitment.**

This means you can:
1. Start with Option B (safe, self-contained) → version 1.0
2. Gain confidence, switch to Option A (leaner) → version 2.0
3. Adopt Schema + Layout + Data → version 3.0

Old tokens still work because v1.0 renderer is frozen and knows how to handle v1.0 tokens. Each version is a snapshot of "how things worked when this token was minted."

```
v1.0 — Launch with Option B (template embedded in token)
  │     Safe starting point, tokens are self-contained
  │
  │     (gain confidence, system is stable)
  ▼
v2.0 — Switch to Option A (template in collection only)
  │     Leaner tokens, template updates affect existing certs
  │
  │     (adopt Schema + Layout + Data model)
  ▼
v3.0 — Schema + Layout + Data separation
        Cleanest architecture, full flexibility
```

### Handling Deleted Collections

If a token references a collection that no longer exists:

**Option 1: Fallback archive**
Store a copy of each template version when a collection is created/updated. If the collection is deleted, fall back to the archive.

**Option 2: Minimal snapshot in token**
Store a compact fallback copy in the token alongside the collection reference:
```typescript
{
  template_version: "2.0",
  collection_id: "abc-123",       // Primary source
  template_snapshot: { ... },     // Fallback if collection unavailable
  data: { ... }
}
```

**Option 3: Collections are never deleted**
Simplest approach. Disable collection deletion, or soft-delete only.

### Open Questions on Versioning

- **Where to store version registry?** In code (simplest), in a config canister (more flexible), or on-chain?
- **Migration tool?** Should we build a tool to upgrade old tokens to new versions, or just maintain old renderers forever?
- **Version in collection metadata?** Should the collection declare its template version, or is it inferred from the storage format?

---

## Impact on Existing Code (If This Model Is Adopted)

Files that could be **deleted or significantly simplified**:
- `template-converter.ts` (~400 lines) -- no format conversion needed
- `view-generator.ts` (~600 lines) -- no view generation needed
- `template-compat.ts` (~400 lines) -- no compatibility layer needed
- `template-tree-utils.ts` -- may be simplified or repurposed for layout manipulation

Files that would need **updating**:
- `template.types.ts` -- define Schema, LayoutNode, and Data as separate types
- `template-renderer.tsx` -- accept schema + layout + data as separate props
- `template-block.tsx` -- look up field info from schema context, not from node props
- `template-context.tsx` -- provide schema, layout, data, and assets via context
- `edit-template-step-v2.tsx` -- emit schema (and optionally layout) instead of TemplateStructure
- `icrc3-converter.ts` -- only convert data to ICRC3 format (no template embedding)
- Node components in `nodes/` -- read field type/label from schema context instead of node props

---

## References

- [JSON Forms Architecture](https://jsonforms.io/docs/architecture/) -- the Schema + UI Schema + Data pattern
- [JSON Forms UI Schema](https://jsonforms.io/docs/uischema/) -- layout primitives (VerticalLayout, HorizontalLayout, Group, Control)
- [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/) -- alternative implementation of the same pattern
- [Schema-Driven UIs at Expedia](https://medium.com/expedia-group-tech/schema-driven-uis-dd8fdb516120) -- real-world schema-driven architecture
- [Server-Driven UI Patterns](https://devcookies.medium.com/server-driven-ui-design-patterns-a-professional-guide-with-examples-a536c8f9965f) -- broader SDUI patterns
- [Martin Fowler -- Separated Presentation](https://martinfowler.com/eaaDev/uiArchs.html) -- foundational thinking on separating data from display
- `docs/B2B-MINTING-DAPP-REFERENCE.md` -- how the legacy minting studio handled templates and metadata

---

## Next Steps

### Decisions Needed

1. **Confirm target architecture:** The Schema + Layout + Data model appears to be the preferred direction. Does the team agree?
2. **Confirm versioning approach:** Do we version templates from v1.0 and maintain a renderer registry?
3. **Starting point:** Option A (collection-only) or Option B (copy to token) for v1.0? Versioning means this is changeable later.
4. **Staging plan:** Clean break (recreate collections) or write a migration script?

### Implementation Order (Once Decisions Made)

1. Define new types: `TemplateSchema`, `LayoutNode`, `TemplateData`
2. Add `template_version` field to minting flow
3. Update renderer to accept schema + layout + data separately
4. Update template editor to emit schema + layout
5. Update serialization to store new format on collection
6. Update minting to store only data + version on token
7. Keep old renderer as v0 (frozen) for existing tokens
8. Delete conversion code (~1000 lines)
9. Deploy to staging, recreate test collections

---

## Discussion Log

This section tracks what was discussed, when, and what was decided vs left open.

### Session: February 3, 2025 (Claude Code)

**Context:** Continuation of template system refactor work. Language toggle was added to certificate detail and public certificate pages.

**Discussed:**
- Where everything is stored and in what format (ClaimLink canister vs collection vs token)
- What each metadata key means (`claimlink.template.structure`, `__apps[].data.template`, etc.)
- Why `__apps` stores 4 separate views (redundancy problem)
- What breaks on staging with a full migration
- Template versioning system — version each template, renderer registry pattern
- Versioning makes Options A/B/C reversible (version = contract with renderer, not storage commitment)

**Key clarifications given:**
- ClaimLink canister does NOT store templates, only references to collection canisters
- `claimlink.template.*` = form definition (collection level)
- `__apps[].data.*` = pre-rendered display views (token level)
- These are two different "template" concepts that happen to share the name
- Existing certificates VIEW fine after migration (views baked in), collection templates won't LOAD (wrong format key)
- `claimlink.template.tree` key exists in code but is not used in staging yet

**Decided:** Nothing final — awaiting team discussion

**Left open:**
- Which architecture option to go with
- Whether to implement versioning from day one
- Staging migration approach (recreate vs script)

### Earlier Session (pre-February 3, 2025)

**Context:** Research into b2b-minting-dapp, JSON Forms, and established patterns.

**Added to doc (not discussed in Feb 3 session):**
- "Target Mental Model: Schema + Layout + Data" section — the three-concern separation pattern
- "First Principles: Code vs Layout" section — decision framework for what goes in data vs code
- "Simple Mode vs Advanced Mode" section — both modes produce same format, editor constrains
- "WYSIWYG Visual Builder (Future)" — deferred, builds on same format
- "Rendering Flow (Target)" section — how the new renderer would work
- "Impact on Existing Code" section — what gets deleted vs updated
- "References" section — JSON Forms, RJSF, Expedia, Martin Fowler, SDUI patterns

These sections represent the **preferred architectural direction** based on research, but have not been formally decided on by the team.

---

*Last updated: February 3, 2025*
*Status: Awaiting architecture decision + versioning decision*
