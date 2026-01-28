# ClaimLink Data Flows

This document contains ASCII diagrams illustrating key data flows in the ClaimLink frontend.

## Table of Contents

1. [Certificate Minting Flow](#certificate-minting-flow)
2. [Authentication Flow](#authentication-flow)
3. [Collection Creation Flow](#collection-creation-flow)
4. [Template System Flow](#template-system-flow)
5. [File Upload (Chunked) Flow](#file-upload-chunked-flow)
6. [Certificate Viewing Flow](#certificate-viewing-flow)
7. [Transaction History Flow](#transaction-history-flow)

---

## Certificate Minting Flow

Complete flow from user form input to minted certificate on-chain.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INPUT (FORM)                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Dynamic Form (from TemplateStructure)                              │   │
│  │  - Text inputs (title, description, etc.)                           │   │
│  │  - File uploads (images, videos, documents)                         │   │
│  │  - Badges, selects, dates                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FORM VALIDATION                                      │
│                                                                             │
│  - Required field validation                                                │
│  - File type/size validation                                                │
│  - Template structure validation                                            │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FILE UPLOAD (CHUNKED)                                   │
│                                                                             │
│  For each file:                                                             │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐               │
│  │  initUpload() │───▶│ storeChunk()  │───▶│finalizeUpload()│              │
│  │  (with hash)  │    │   × N chunks  │    │               │               │
│  └───────────────┘    │  (with retry) │    └───────┬───────┘               │
│                       └───────────────┘            │                        │
│                                                    ▼                        │
│                                          ┌─────────────────┐                │
│                                          │  Normalized URL │                │
│                                          │ (canister path) │                │
│                                          └─────────────────┘                │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BUILD ORIGYN METADATA                                   │
│                                                                             │
│  buildOrigynApps(template, formData, files)                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ buildMetadataApp()                                                  │   │
│  │  ├─ public.metadata.fieldName → field values                       │   │
│  │  ├─ public.metadata.fieldName → file references                    │   │
│  │  └─ public.metadata.library → library items array                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ buildTemplateApp()                                                  │   │
│  │  ├─ public.metadata.template → default view nodes                  │   │
│  │  ├─ public.metadata.userViewTemplate → user view nodes             │   │
│  │  └─ public.metadata.certificateTemplate → certificate nodes        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONVERT TO ICRC3 METADATA                                │
│                                                                             │
│  convertToIcrc3Metadata(origynApps)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Form values  ───▶  ICRC3 Text values                               │   │
│  │  File refs    ───▶  ICRC3 Array/Map values                          │   │
│  │  Dates        ───▶  ICRC3 Nat values (timestamp)                    │   │
│  │  Numbers      ───▶  ICRC3 Nat/Int values                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│                   Array<[string, ICRC3Value]>                               │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MINT CERTIFICATE                                      │
│                                                                             │
│  actor.mint({                                                               │
│    metadata: icrc3Metadata,                                                 │
│    ...                                                                      │
│  })                                                                         │
│                              │                                              │
│                              ▼                                              │
│                      ┌─────────────┐                                        │
│                      │  Token ID   │                                        │
│                      └─────────────┘                                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       QUERY INVALIDATION                                     │
│                                                                             │
│  Invalidate:                                                                │
│  ├─ certificatesKeys.collection(collectionId)                              │
│  ├─ certificatesKeys.all                                                   │
│  └─ collectionsKeys.detail(collectionId)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

NFID IdentityKit authentication and agent creation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP STARTUP                                        │
│                                                                             │
│  main.tsx                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  <JotaiProvider>                                                    │   │
│  │    <QueryClientProvider>                                            │   │
│  │      <AuthGate>            ◄─── Loading until auth resolves         │   │
│  │        <RouterProvider />                                           │   │
│  │      </AuthGate>                                                    │   │
│  │    </QueryClientProvider>                                           │   │
│  │  </JotaiProvider>                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUTH INITIALIZATION                                 │
│                                                                             │
│  AuthGate Component                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Check delegation storage for existing session                   │   │
│  │  2. Create unauthenticated agent (always)                           │   │
│  │  3. If session exists: restore authenticated agent                  │   │
│  │  4. Set isInitializing = false                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
          ┌────────────────────────┴────────────────────────┐
          │                                                 │
          ▼                                                 ▼
┌─────────────────────────┐                  ┌─────────────────────────┐
│   NO EXISTING SESSION   │                  │  EXISTING SESSION       │
│                         │                  │                         │
│  - Show login page      │                  │  - Restore delegation   │
│  - Wait for wallet      │                  │  - Create auth agent    │
│    connection           │                  │  - Navigate to dashboard│
└────────────┬────────────┘                  └─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WALLET CONNECTION (NFID)                               │
│                                                                             │
│  User clicks "Connect Wallet"                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  NFID IdentityKit                                                   │   │
│  │  ├─ Opens NFID popup                                                │   │
│  │  ├─ User authenticates                                              │   │
│  │  ├─ Returns delegation identity                                     │   │
│  │  └─ Stores delegation in localStorage                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UPDATE AUTH STATE                                     │
│                                                                             │
│  authStateAtom (Jotai)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  {                                                                  │   │
│  │    isConnected: true,                                               │   │
│  │    isInitializing: false,                                           │   │
│  │    principalId: "xxxxx-xxxxx-xxxxx...",                             │   │
│  │    unauthenticatedAgent: Agent,                                     │   │
│  │    authenticatedAgent: Agent,     ◄─── Used for mutations           │   │
│  │    canisters: { ... }                                               │   │
│  │  }                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NAVIGATION                                            │
│                                                                             │
│  On connect: Navigate to /dashboard                                         │
│  On disconnect: Navigate to /login                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Collection Creation Flow

Creating a new ORIGYN NFT collection canister.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER CREATES COLLECTION                               │
│                                                                             │
│  Collection Form                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  - Name                                                             │   │
│  │  - Description                                                      │   │
│  │  - Symbol                                                           │   │
│  │  - Logo (optional, uploaded later)                                  │   │
│  │  - Template selection                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CALL CLAIMLINK CANISTER                                  │
│                                                                             │
│  createCollection(agent, {                                                  │
│    name: string,                                                            │
│    symbol: string,                                                          │
│    description: string,                                                     │
│    ...                                                                      │
│  })                                                                         │
│                              │                                              │
│                              ▼                                              │
│                      ┌─────────────────┐                                    │
│                      │  collection_id  │    ◄─── NOT canister_id yet        │
│                      │  (internal ID)  │                                    │
│                      └─────────────────┘                                    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND CREATES CANISTER (ASYNC)                          │
│                                                                             │
│  ClaimLink Backend                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Status: Queued                                                  │   │
│  │  2. Create ORIGYN NFT canister                                      │   │
│  │  3. Status: Created                                                 │   │
│  │  4. Install WASM code                                               │   │
│  │  5. Status: Installed                                               │   │
│  │  6. Configure metadata                                              │   │
│  │  7. Status: TemplateUploaded                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Failure path:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Status: Failed → ReimbursingQueued → QuarantinedReimbursement →    │   │
│  │  Reimbursed                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      POLL FOR CANISTER ID                                    │
│                                                                             │
│  waitForCollectionCanister(agent, collectionId, maxWait?, pollInterval?)    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Loop (max 60s, every 2s):                                          │   │
│  │    1. getCollectionInfoById(collectionId)                           │   │
│  │    2. Check if canister_id is present                               │   │
│  │    3. If yes: return canister_id                                    │   │
│  │    4. If no: wait and retry                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      POLL FOR INSTALLED STATUS                               │
│                                                                             │
│  waitForCollectionInstalled(agent, collectionId, onStatusChange?, ...)      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Loop (max 120s, every 3s):                                         │   │
│  │    1. getCollectionInfoById(collectionId)                           │   │
│  │    2. onStatusChange(status)      ◄─── UI callback for progress      │   │
│  │    3. If status === 'Installed' || 'TemplateUploaded': return       │   │
│  │    4. If failure status: throw error                                │   │
│  │    5. Else: wait and retry                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COLLECTION READY                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Collection is ready for:                                           │   │
│  │  ├─ Minting certificates                                            │   │
│  │  ├─ Uploading logo                                                  │   │
│  │  ├─ Creating campaigns                                              │   │
│  │  └─ Template configuration                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Template System Flow

Dual format template storage and retrieval.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TEMPLATE CREATION                                       │
│                                                                             │
│  Template Builder UI                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TemplateStructure (Frontend Format)                                │   │
│  │  {                                                                  │   │
│  │    sections: [                                                      │   │
│  │      { name: 'Certificate', items: [...] },                         │   │
│  │      { name: 'Information', items: [...] }                          │   │
│  │    ],                                                               │   │
│  │    languages: [...],                                                │   │
│  │    background: { type: 'standard' | 'custom', ... }                 │   │
│  │  }                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
          ┌────────────────────────┴────────────────────────┐
          │                                                 │
          ▼                                                 ▼
┌─────────────────────────┐                  ┌─────────────────────────┐
│  CLAIMLINK STORAGE      │                  │  ORIGYN STORAGE         │
│                         │                  │                         │
│  BackendTemplate        │                  │  Collection Metadata    │
│  {                      │                  │                         │
│    template_id: bigint, │                  │  serializeTemplateFor-  │
│    template_json:       │                  │  Origyn(template)       │
│      JSON.stringify({   │                  │         │               │
│        name,           │                  │         ▼               │
│        description,    │                  │  ["claimlink.template.  │
│        category,       │                  │   structure",           │
│        structure,      │                  │   { Text: JSON }]       │
│        metadata        │                  │                         │
│      })                │                  │                         │
│  }                      │                  │                         │
└─────────────────────────┘                  └─────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TEMPLATE RETRIEVAL                                      │
│                                                                             │
│  During Certificate Creation                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Get collection metadata                                         │   │
│  │  2. hasTemplateStructure(metadata) → check for key                  │   │
│  │  3. deserializeTemplateFromOrigyn(metadata) → TemplateStructure     │   │
│  │  4. Render dynamic form from sections/items                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              TEMPLATE → ORIGYN NODES CONVERSION                              │
│                                                                             │
│  When minting certificate:                                                  │
│                                                                             │
│  TemplateStructure              TemplateNode[] (ORIGYN Format)              │
│  ┌─────────────────┐           ┌─────────────────────────────────┐         │
│  │ sections:       │           │ [                               │         │
│  │  - Certificate  │  ────▶    │   { type: 'columns', children: [│         │
│  │    - TitleItem  │           │     { type: 'title', ... },     │         │
│  │    - ImageItem  │           │     { type: 'image', ... },     │         │
│  │  - Information  │           │     { type: 'elements', ... }   │         │
│  │    - InputItem  │           │   ]}                            │         │
│  │    - InputItem  │           │ ]                               │         │
│  └─────────────────┘           └─────────────────────────────────┘         │
│                                                                             │
│  view-generator.ts handles the conversion                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Upload (Chunked) Flow

Uploading files to ORIGYN NFT canister with chunking.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FILE PREPARATION                                     │
│                                                                             │
│  Input: File object                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Sanitize filename (remove special chars)                        │   │
│  │  2. Add timestamp prefix (avoid conflicts)                          │   │
│  │  3. Calculate SHA-256 hash of file content                          │   │
│  │  4. Determine chunk count (1MB chunks)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Example: "My Image (2).png"  →  "1706012345678_My_Image_2.png"            │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INIT UPLOAD                                            │
│                                                                             │
│  actor.init_upload({                                                        │
│    filename: string,                                                        │
│    content_type: string,      // MIME type                                  │
│    content_hash: Uint8Array,  // SHA-256                                    │
│    total_size: bigint         // File size in bytes                         │
│  })                                                                         │
│                              │                                              │
│                              ▼                                              │
│                      ┌─────────────────┐                                    │
│                      │   upload_id     │                                    │
│                      └─────────────────┘                                    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STORE CHUNKS (LOOP)                                     │
│                                                                             │
│  For chunk_index = 0 to N-1:                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  chunk = file.slice(index * 1MB, (index + 1) * 1MB)                 │   │
│  │                                                                     │   │
│  │  retryWithBackoff(() => {                                           │   │
│  │    actor.store_chunk({                                              │   │
│  │      upload_id: string,                                             │   │
│  │      chunk_index: bigint,                                           │   │
│  │      data: Uint8Array                                               │   │
│  │    })                                                               │   │
│  │  }, { maxRetries: 3 })                                              │   │
│  │                                                                     │   │
│  │  onProgress((index + 1) / totalChunks)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Retry config: 3 retries, 1000ms initial delay, 2x backoff                  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FINALIZE UPLOAD                                          │
│                                                                             │
│  actor.finalize_upload({                                                    │
│    upload_id: string                                                        │
│  })                                                                         │
│                              │                                              │
│                              ▼                                              │
│                      ┌─────────────────┐                                    │
│                      │  file_path      │    e.g., "/images/1706...png"      │
│                      └─────────────────┘                                    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      URL NORMALIZATION                                       │
│                                                                             │
│  normalizeFileUrl(filePath, collectionCanisterId)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Input: "/images/1706...png"                                        │   │
│  │                                                                     │   │
│  │  Local:                                                             │   │
│  │    → "http://127.0.0.1:8000/?canisterId=xxx-xxx/-/images/..."      │   │
│  │                                                                     │   │
│  │  Production:                                                        │   │
│  │    → "https://xxx-xxx.raw.icp0.io/-/images/..."                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Certificate Viewing Flow

Public and authenticated certificate viewing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PUBLIC VIEW                                             │
│                                                                             │
│  URL: /certificate/:collectionId/:tokenId                                   │
│  (No authentication required)                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  usePublicCertificate(collectionId, tokenId)                        │   │
│  │    │                                                                │   │
│  │    ├─► Get unauthenticated agent                                    │   │
│  │    ├─► createCanisterActor(agent, collectionId, origynIdl)          │   │
│  │    ├─► actor.icrc7_token_metadata([tokenId])                        │   │
│  │    └─► parseOrigynMetadata(rawMetadata)                             │   │
│  │              │                                                      │   │
│  │              ▼                                                      │   │
│  │        ParsedOrigynMetadata {                                       │   │
│  │          metadata: { field → value },                               │   │
│  │          templates: { template, userViewTemplate, ... },            │   │
│  │          library: LibraryItem[],                                    │   │
│  │          tokenId, canisterId                                        │   │
│  │        }                                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TemplateRenderer                                                   │   │
│  │    ├─► Select variant: 'default' | 'certificate' | 'information'   │   │
│  │    ├─► Get corresponding template nodes                             │   │
│  │    └─► Render recursively with context                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED VIEW                                        │
│                                                                             │
│  URL: /mint_certificate/:collectionId/:tokenId                              │
│  (Requires authentication)                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  useCertificate(collectionId, tokenId)                              │   │
│  │    │                                                                │   │
│  │    ├─► Get authenticated agent                                      │   │
│  │    ├─► Fetch metadata (same as public)                              │   │
│  │    ├─► Fetch collection info                                        │   │
│  │    └─► Fetch transaction history                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Certificate Detail Tabs                                            │   │
│  │    ├─► Information (rendered template)                              │   │
│  │    ├─► Certificate (certificate template variant)                   │   │
│  │    ├─► Metadata (raw field display)                                 │   │
│  │    ├─► Events (transaction history)                                 │   │
│  │    ├─► Ledger (transaction table)                                   │   │
│  │    └─► Gallery (images from library)                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Transaction History Flow

Fetching and parsing ICRC3 transaction blocks.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FETCH TRANSACTION HISTORY                                 │
│                                                                             │
│  getTransactionHistory(agent, collectionCanisterId, tokenId)                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  actor.icrc3_get_blocks({                                           │   │
│  │    start: 0n,                                                       │   │
│  │    length: 1000n                                                    │   │
│  │  })                                                                 │   │
│  │              │                                                      │   │
│  │              ▼                                                      │   │
│  │        GetBlocksResult {                                            │   │
│  │          blocks: ICRC3DataBlock[],                                  │   │
│  │          archived_blocks: []                                        │   │
│  │        }                                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FILTER BY TOKEN ID                                      │
│                                                                             │
│  blocks.filter(block => {                                                   │
│    const tokenIds = extractTokenIds(block);                                 │
│    return tokenIds.includes(targetTokenId);                                 │
│  })                                                                         │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PARSE EACH BLOCK                                        │
│                                                                             │
│  For each ICRC3DataBlock:                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  block.block = Map of key-value pairs                               │   │
│  │                                                                     │   │
│  │  Extract:                                                           │   │
│  │  ├─ "btype" → transaction type ("7mint", "7transfer", "7burn")     │   │
│  │  ├─ "ts" → timestamp (Nat, convert to Date)                        │   │
│  │  ├─ "tx" → transaction details Map                                  │   │
│  │  │    ├─ "from" → sender principal (for transfers)                 │   │
│  │  │    ├─ "to" → recipient principal                                │   │
│  │  │    ├─ "tid" → token IDs array                                   │   │
│  │  │    └─ "memo" → optional memo                                    │   │
│  │  └─ "phash" → parent hash (for chain verification)                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BUILD RESULT                                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  events: [                          // For Events tab              │   │
│  │    {                                                                │   │
│  │      type: 'mint' | 'transfer' | 'burn',                           │   │
│  │      date: Date,                                                    │   │
│  │      description: "Minted by xxx...",                               │   │
│  │      from?: Principal,                                              │   │
│  │      to?: Principal                                                 │   │
│  │    }                                                                │   │
│  │  ]                                                                  │   │
│  │                                                                     │   │
│  │  ledger: [                          // For Ledger tab              │   │
│  │    {                                                                │   │
│  │      id: string,                                                    │   │
│  │      type: 'mint' | 'transfer' | 'burn',                           │   │
│  │      from: Principal | null,                                        │   │
│  │      to: Principal | null,                                          │   │
│  │      timestamp: Date,                                               │   │
│  │      blockIndex: bigint                                             │   │
│  │    }                                                                │   │
│  │  ]                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Note: Results are reversed (most recent first)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management patterns
- [CANISTER-INTEGRATION.md](./CANISTER-INTEGRATION.md) - IC integration details
