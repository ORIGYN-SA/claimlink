# Template System Architecture

This document clarifies the template system architecture, storage locations, and ongoing refactoring decisions.

## Table of Contents
- [Storage Locations Overview](#storage-locations-overview)
- [Key Terminology](#key-terminology)
- [Data Flow](#data-flow)
- [Current Architecture (As-Is)](#current-architecture-as-is)
- [Proposed Simplified Architecture](#proposed-simplified-architecture)
- [Migration Status](#migration-status)
- [Open Decisions](#open-decisions)

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

## Next Steps

1. **Decide on architecture** (Option A, B, or C)
2. **Decide on backwards compatibility** (support old format or clean break)
3. **If migrating:** Plan staging data recreation/migration
4. **Execute:** Update code, delete old files, deploy

---

*Last updated: February 2025*
*Status: Awaiting architecture decision*
