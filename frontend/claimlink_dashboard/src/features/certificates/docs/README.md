# Certificates Feature

The certificates feature handles the core business logic for creating, viewing, editing, and transferring ORIGYN NFT certificates.

## Purpose

- Mint new certificates with dynamic template-based forms
- View certificate details with multiple template variants
- Edit certificate metadata (within constraints)
- Transfer certificate ownership
- Track transaction history

## File Structure

```
certificates/
├── api/
│   ├── certificates.service.ts    # Canister operations
│   └── certificates.queries.ts    # React Query hooks
├── components/
│   ├── create/
│   │   ├── dynamic-template-form.tsx    # Form from template
│   │   └── mint-certificate-wizard.tsx  # Multi-step wizard
│   ├── detail/
│   │   ├── certificate-tabs.tsx         # Tab container
│   │   ├── certificate-events.tsx       # Transaction events
│   │   ├── certificate-ledger.tsx       # Ledger table
│   │   └── certificate-metadata.tsx     # Raw metadata display
│   ├── transfer-ownership/
│   │   ├── transfer-dialog.tsx          # Transfer modal
│   │   └── transfer-form.tsx            # Recipient input
│   ├── certificate-card.tsx             # List item display
│   ├── certificate-viewer.tsx           # Template renderer wrapper
│   └── certificate-display.tsx          # Standalone display
├── pages/
│   ├── certificates-page.tsx            # List view
│   ├── certificate-detail-page.tsx      # Detail view
│   ├── mint-certificate-page.tsx        # Creation page
│   └── edit-certificate-page.tsx        # Edit page
├── atoms/
│   ├── certificate-creator.atom.ts      # Creation state
│   └── certificate-filters.atom.ts      # Filter state
├── types/
│   └── certificate.types.ts             # Type definitions
└── utils/
    └── certificate-utils.ts             # Helper functions
```

## Data Flow Diagram

### Certificate Minting

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER FILLS FORM                                       │
│                                                                             │
│  DynamicTemplateForm                                                        │
│  ├─ Renders from TemplateStructure                                          │
│  ├─ Handles file selection                                                  │
│  └─ Validates required fields                                               │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      useMintCertificateWithTemplate                          │
│                                                                             │
│  1. Extract files from form data                                            │
│  2. For each file:                                                          │
│     └─ uploadCertificateFile() (chunked upload)                             │
│        ├─ initUpload()                                                      │
│        ├─ storeChunk() × N (with retry)                                     │
│        └─ finalizeUpload() → normalized URL                                 │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BUILD ORIGYN METADATA                                   │
│                                                                             │
│  buildOrigynApps(template, formData, fileRefs)                              │
│  ├─ buildMetadataApp() → public.metadata fields                            │
│  └─ buildTemplateApp() → public.metadata.template nodes                    │
│                                                                             │
│  convertToIcrc3Metadata(origynApps)                                         │
│  └─ Transform to [key, ICRC3Value][]                                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MINT ON CANISTER                                        │
│                                                                             │
│  actor.mint({ metadata, ... })                                              │
│       │                                                                     │
│       ▼                                                                     │
│  Token ID returned                                                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INVALIDATE QUERIES                                      │
│                                                                             │
│  queryClient.invalidateQueries(certificatesKeys.collection(collectionId))   │
│  queryClient.invalidateQueries(certificatesKeys.all)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Certificate Viewing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ROUTE LOADS                                             │
│                                                                             │
│  /mint_certificate/:collectionId/:tokenId                                   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      useCertificate HOOK                                     │
│                                                                             │
│  1. Get authenticated agent                                                 │
│  2. Create ORIGYN NFT actor                                                 │
│  3. actor.icrc7_token_metadata([tokenId])                                   │
│  4. parseOrigynMetadata(rawMetadata)                                        │
│                     │                                                       │
│                     ▼                                                       │
│  ParsedOrigynMetadata {                                                     │
│    metadata: { fieldName → value },                                         │
│    templates: { template, certificateTemplate, ... },                       │
│    library: LibraryItem[],                                                  │
│    tokenId, canisterId                                                      │
│  }                                                                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RENDER TABS                                             │
│                                                                             │
│  CertificateTabs                                                            │
│  ├─ Information tab → TemplateRenderer (default variant)                   │
│  ├─ Certificate tab → TemplateRenderer (certificate variant)               │
│  ├─ Metadata tab → Raw field display                                       │
│  ├─ Events tab → Transaction history (events list)                         │
│  ├─ Ledger tab → Transaction history (table format)                        │
│  └─ Gallery tab → Images from library                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### Certificate (`types/certificate.types.ts`)

```typescript
interface BaseToken {
  id: string;
  name: string;
  imageUrl: string;
  status: TokenStatus;
  createdAt: string;
  ownerPrincipal?: string;
}

interface Certificate extends BaseToken {
  description?: string;
  issuer?: string;
  verificationCode?: string;
  certifiedBy?: 'ORIGYN';
  integratorId?: string;
  campaignId?: string;
  canisterId?: string;      // Collection canister ID
  tokenId?: string;         // Token ID within collection
}

type TokenStatus = 'minted' | 'draft' | 'pending' | 'transferred';
```

### Form Data Types

```typescript
interface CertificateFormData {
  [fieldId: string]: string | number | Date | File | File[] | undefined;
}

interface FileReference {
  fieldId: string;
  file: File;
  url?: string;         // After upload
  libraryId?: string;   // ORIGYN library reference
}

interface MintCertificateParams {
  collectionId: string;
  collectionCanisterId: string;
  template: TemplateStructure;
  formData: CertificateFormData;
  files: Map<string, FileReference[]>;
}
```

### Transaction History Types

```typescript
interface CertificateEvent {
  type: 'mint' | 'transfer' | 'burn';
  date: Date;
  description: string;
  from?: string;        // Principal ID
  to?: string;          // Principal ID
}

interface LedgerTransaction {
  id: string;
  type: 'mint' | 'transfer' | 'burn';
  from: string | null;
  to: string | null;
  timestamp: Date;
  blockIndex: bigint;
}

interface TransactionHistoryResult {
  events: CertificateEvent[];
  ledger: LedgerTransaction[];
}
```

## Service Layer

### CertificatesService (`api/certificates.service.ts`)

| Method | Purpose | Returns |
|--------|---------|---------|
| `getCertificatesOf(agent, canisterId)` | Get tokens owned by caller | `Certificate[]` |
| `getCertificateMetadata(agent, canisterId, tokenIds)` | Get metadata for tokens | `ParsedOrigynMetadata[]` |
| `uploadCertificateFile(agent, canisterId, file, onProgress)` | Chunked file upload | `string` (URL) |
| `mintCertificate(agent, canisterId, metadata)` | Mint new token | `string` (tokenId) |
| `updateCertificate(agent, canisterId, tokenId, metadata)` | Update metadata | `void` |
| `getTransactionHistory(agent, canisterId, tokenId)` | Get ICRC3 history | `TransactionHistoryResult` |
| `transferCertificate(agent, canisterId, tokenId, to)` | Transfer ownership | `void` |

### Key Implementation Details

**Chunked Upload:**
```typescript
const CHUNK_SIZE = 1024 * 1024; // 1MB

async function uploadCertificateFile(
  agent: Agent,
  collectionCanisterId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. Sanitize filename + add timestamp
  const filename = `${Date.now()}_${sanitizeFilename(file.name)}`;

  // 2. Calculate SHA-256 hash
  const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());

  // 3. Init upload
  const { upload_id } = await actor.init_upload({
    filename,
    content_type: file.type,
    content_hash: new Uint8Array(hash),
    total_size: BigInt(file.size),
  });

  // 4. Store chunks with retry
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  for (let i = 0; i < chunkCount; i++) {
    await retryWithBackoff(() =>
      actor.store_chunk({
        upload_id,
        chunk_index: BigInt(i),
        data: new Uint8Array(file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)),
      })
    );
    onProgress?.((i + 1) / chunkCount);
  }

  // 5. Finalize and normalize URL
  const { file_path } = await actor.finalize_upload({ upload_id });
  return normalizeFileUrl(file_path, collectionCanisterId);
}
```

**URL Normalization:**
```typescript
function normalizeFileUrl(path: string, canisterId: string): string {
  if (path.startsWith('http')) {
    return fixDomainForAssets(path); // .icp0.io → .raw.icp0.io
  }

  const host = import.meta.env.VITE_IC_HOST;
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return `http://127.0.0.1:8000/?canisterId=${canisterId}/-${path}`;
  }
  return `https://${canisterId}.raw.icp0.io/-${path}`;
}
```

## React Query Hooks

### Query Hooks (`api/certificates.queries.ts`)

```typescript
// Key factory
export const certificatesKeys = {
  all: ['certificates'] as const,
  collection: (id: string) => [...certificatesKeys.all, 'collection', id] as const,
  detail: (collectionId: string, tokenId: string) =>
    [...certificatesKeys.all, 'detail', collectionId, tokenId] as const,
  history: (collectionId: string, tokenId: string) =>
    [...certificatesKeys.detail(collectionId, tokenId), 'history'] as const,
};

// Hooks
useCollectionCertificates(collectionCanisterId)  // List tokens in collection
useCertificate(collectionId, tokenId)            // Single certificate
usePublicCertificate(collectionId, tokenId)      // Public view (no auth)
useCertificateTransactionHistory(collectionId, tokenId)  // History
```

### Mutation Hooks

```typescript
useMintCertificate()                    // Basic minting
useMintCertificateWithTemplate()        // Full template support
useUpdateCertificateWithTemplate()      // Update with files
useUploadCertificateImage()             // Image-only upload
useTransferCertificate()                // Transfer ownership
```

## State Management

### Creator Atom (`atoms/certificate-creator.atom.ts`)

```typescript
interface CreatorState {
  step: number;
  collectionId: string | null;
  template: TemplateStructure | null;
  formData: CertificateFormData;
  files: Map<string, FileReference[]>;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
}

// Actions
type CreatorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_COLLECTION'; collectionId: string }
  | { type: 'SET_TEMPLATE'; template: TemplateStructure }
  | { type: 'SET_FORM_DATA'; data: CertificateFormData }
  | { type: 'SET_FILES'; files: Map<string, FileReference[]> }
  | { type: 'SET_UPLOAD_PROGRESS'; progress: number }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };
```

### Filters Atom (`atoms/certificate-filters.atom.ts`)

```typescript
interface CertificateFilters {
  search: string;
  status: TokenStatus | 'all';
  sortBy: 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
}
```

## Integration Points

### With Templates Feature

- Receives `TemplateStructure` from collection metadata
- Uses template to render dynamic form
- Passes template to metadata builder

### With Template Renderer Feature

- Uses `parseOrigynMetadata()` to extract metadata
- Uses `TemplateRenderer` to display certificate
- Passes `TemplateRenderContext` for asset resolution

### With Collections Feature

- Fetches collection info for display
- Uses collection canister ID for all operations
- Template comes from collection metadata

### With Auth Feature

- Requires `authenticatedAgent` for mutations
- Uses `unauthenticatedAgent` for public views
- Gets principal ID for ownership checks

## Known Issues / TODOs

1. **Immutable Fields After Minting**: Most certificate fields cannot be updated after minting. The update flow needs to handle this gracefully.

2. **File Upload Progress**: Progress tracking is per-file, not per-chunk. Consider more granular progress for large files.

3. **Transaction History Pagination**: Currently fetches all blocks up to 1000. May need pagination for certificates with many transfers.

4. **Offline File Handling**: Files are not cached. If upload fails mid-way, user must re-upload all files.

5. **Template Version Mismatch**: If collection template changes after certificate creation, viewing may show incorrect fields.

## Usage Examples

### Minting a Certificate

```typescript
function MintCertificateForm({ collectionId }: Props) {
  const { data: template } = useCollectionTemplate(collectionId);
  const mintMutation = useMintCertificateWithTemplate();

  const handleSubmit = async (formData: CertificateFormData) => {
    await mintMutation.mutateAsync({
      collectionId,
      collectionCanisterId,
      template: template!,
      formData,
      files: extractFiles(formData),
    });
  };

  return (
    <DynamicTemplateForm
      template={template}
      onSubmit={handleSubmit}
      isSubmitting={mintMutation.isPending}
    />
  );
}
```

### Viewing a Certificate

```typescript
function CertificateDetailPage() {
  const { collectionId, tokenId } = Route.useParams();
  const { data: certificate, isLoading } = useCertificate(collectionId, tokenId);

  if (isLoading) return <Spinner />;

  return (
    <CertificateTabs>
      <TabPanel value="information">
        <TemplateRenderer
          data={certificate}
          variant="default"
        />
      </TabPanel>
      <TabPanel value="certificate">
        <TemplateRenderer
          data={certificate}
          variant="certificate"
        />
      </TabPanel>
      {/* ... other tabs */}
    </CertificateTabs>
  );
}
```

## Related Documentation

- [Template Renderer Feature](../../template-renderer/docs/README.md)
- [Templates Feature](../../templates/docs/README.md)
- [Collections Feature](../../collections/docs/README.md)
- [Data Flows](../../../../docs/DATA-FLOWS.md)
