# Collections Feature

The collections feature manages ORIGYN NFT collection canisters, including creation, configuration, and template assignment.

## Purpose

- Create new ORIGYN NFT collection canisters
- Monitor collection creation status (async process)
- Configure collection metadata and templates
- List and manage existing collections
- Upload collection assets (logo, etc.)

## File Structure

```
collections/
├── api/
│   ├── collections.service.ts    # Canister operations
│   └── collections.queries.ts    # React Query hooks
├── components/
│   ├── form/
│   │   ├── collection-form-section.tsx      # Create form
│   │   └── edit-collection-form-section.tsx # Edit form
│   ├── collection-card.tsx                  # List item display
│   ├── add-collection-card.tsx              # "New" card
│   └── collection-status-badge.tsx          # Status indicator
├── pages/
│   ├── collections-page.tsx                 # List view
│   ├── new-collection-page.tsx              # Creation page
│   └── edit-collection-page.tsx             # Edit page
├── atoms/
│   ├── collection-creator.atom.ts           # Creation state
│   └── collection-filters.atom.ts           # Filter state
├── types/
│   └── collection.types.ts                  # Type definitions
└── utils/
    └── collection-utils.ts                  # Helper functions
```

## Hybrid Architecture

Collections in ClaimLink involve two layers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLAIMLINK CANISTER                                      │
│                                                                             │
│  Manages collection records and orchestrates canister creation              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  CollectionInfo {                                                     │ │
│  │    collection_id: bigint,        // Internal ID                       │ │
│  │    canister_id?: Principal,      // ORIGYN canister (when created)    │ │
│  │    status: BackendCollectionStatus,                                   │ │
│  │    owner: Principal,                                                  │ │
│  │    name: string,                                                      │ │
│  │    symbol: string,                                                    │ │
│  │    description: string,                                               │ │
│  │    created_at: bigint                                                 │ │
│  │  }                                                                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Creates and manages
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ORIGYN NFT CANISTER                                     │
│                                                                             │
│  Individual canister for each collection                                    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  - Minting certificates (ICRC-7)                                      │ │
│  │  - Token metadata storage                                             │ │
│  │  - File uploads (chunked)                                             │ │
│  │  - Collection metadata (ICRC-7)                                       │ │
│  │  - Transaction history (ICRC-3)                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Collection Creation (Async)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER SUBMITS FORM                                       │
│                                                                             │
│  CreateCollectionInput {                                                    │
│    name: "Gold Certificates",                                               │
│    symbol: "GOLD",                                                          │
│    description: "Collection of gold certificates",                          │
│    template_id?: bigint                                                     │
│  }                                                                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CALL CLAIMLINK CANISTER                                 │
│                                                                             │
│  actor.create_collection(args)                                              │
│         │                                                                   │
│         ▼                                                                   │
│  Result { Ok: { collection_id: 123n } }                                     │
│                                                                             │
│  NOTE: This returns immediately but canister creation is ASYNC              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND CREATES CANISTER                                │
│                                                                             │
│  Status progression:                                                        │
│  ┌─────────┐   ┌─────────┐   ┌───────────┐   ┌──────────────────┐          │
│  │ Queued  │──▶│ Created │──▶│ Installed │──▶│ TemplateUploaded │          │
│  └─────────┘   └─────────┘   └───────────┘   └──────────────────┘          │
│                                                                             │
│  Failure path:                                                              │
│  ┌────────┐   ┌──────────────────┐   ┌─────────────────────────┐           │
│  │ Failed │──▶│ ReimbursingQueued│──▶│QuarantinedReimbursement │──▶Reimbursed│
│  └────────┘   └──────────────────┘   └─────────────────────────┘           │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      POLL FOR CANISTER ID                                    │
│                                                                             │
│  waitForCollectionCanister(agent, collectionId)                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Loop (max 60s, every 2s):                                            │ │
│  │    1. getCollectionInfoById(collectionId)                             │ │
│  │    2. If canister_id present → return canister_id                    │ │
│  │    3. Else → wait and retry                                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      POLL FOR INSTALLED STATUS                               │
│                                                                             │
│  waitForCollectionInstalled(agent, collectionId, onStatusChange)            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Loop (max 120s, every 3s):                                           │ │
│  │    1. getCollectionInfoById(collectionId)                             │ │
│  │    2. onStatusChange(status)  ← UI progress callback                 │ │
│  │    3. If 'Installed' | 'TemplateUploaded' → return success           │ │
│  │    4. If failure status → throw error                                │ │
│  │    5. Else → wait and retry                                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COLLECTION READY                                        │
│                                                                             │
│  Can now:                                                                   │
│  - Mint certificates                                                        │
│  - Upload logo                                                              │
│  - Update metadata                                                          │
│  - Create campaigns                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### Collection Status (`types/collection.types.ts`)

```typescript
// Backend status (from ClaimLink canister)
type BackendCollectionStatus =
  | 'Queued'
  | 'Created'
  | 'Installed'
  | 'TemplateUploaded'
  | 'Failed'
  | 'ReimbursingQueued'
  | 'QuarantinedReimbursement'
  | 'Reimbursed';

// Simplified frontend status
type SimpleCollectionStatus = 'Active' | 'Inactive' | 'Draft';

// Status mapping
function mapBackendToSimpleStatus(backend: BackendCollectionStatus): SimpleCollectionStatus {
  switch (backend) {
    case 'Installed':
    case 'TemplateUploaded':
      return 'Active';
    case 'Queued':
    case 'Created':
      return 'Draft';
    default:
      return 'Inactive';
  }
}
```

### Collection Types

```typescript
interface Collection {
  id: string;                       // Canister ID (when available)
  collectionId: string;             // Internal collection_id
  title: string;
  description: string;
  symbol: string;
  imageUrl: string;
  itemCount: number;
  status: SimpleCollectionStatus;
  backendStatus: BackendCollectionStatus;
  createdDate: string;
  lastModified: string;
  creator: string;                  // Owner principal
}

interface CreateCollectionInput {
  name: string;
  symbol: string;
  description: string;
  template_id?: bigint;
}

interface CollectionInfo {
  collection_id: bigint;
  canister_id?: string;
  status: BackendCollectionStatus;
  owner: string;
  name: string;
  symbol: string;
  description: string;
  created_at: bigint;
}
```

## Service Layer

### CollectionsService (`api/collections.service.ts`)

| Method | Purpose | Returns |
|--------|---------|---------|
| `listAllCollections(agent, offset?, limit?)` | List all collections | `CollectionInfo[]` |
| `getCollectionsByOwner(agent, owner, offset?, limit?)` | User's collections | `CollectionInfo[]` |
| `getCollectionInfo(agent, canisterId)` | Get by canister ID | `CollectionInfo` |
| `getCollectionInfoById(agent, collectionId)` | Get by internal ID | `CollectionInfo` |
| `getCollectionCount(agent)` | Total count | `number` |
| `createCollection(agent, args)` | Create new (async) | `{ collection_id: bigint }` |
| `waitForCollectionCanister(agent, id, maxWait?, interval?)` | Poll for canister | `string` (canisterId) |
| `waitForCollectionInstalled(agent, id, onStatusChange?, ...)` | Poll for installed | `{ canisterId, status }` |
| `getCollectionNfts(agent, canisterId, prev?, take?)` | Get token IDs | `bigint[]` |
| `uploadLogoToCollection(agent, canisterId, file, onProgress?)` | Upload logo | `string` (URL) |
| `getCollectionMetadata(agent, canisterId)` | Get ICRC7 metadata | `ICRC3Value` |

### Polling Implementation

```typescript
export async function waitForCollectionCanister(
  agent: Agent,
  collectionId: string,
  maxWaitMs: number = 60000,
  pollIntervalMs: number = 2000
): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const info = await getCollectionInfoById(agent, collectionId);

    if (info.canister_id) {
      return info.canister_id;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Timeout waiting for collection canister (${maxWaitMs}ms)`);
}

export async function waitForCollectionInstalled(
  agent: Agent,
  collectionId: string,
  onStatusChange?: (status: BackendCollectionStatus) => void,
  maxWaitMs: number = 120000,
  pollIntervalMs: number = 3000
): Promise<{ canisterId: string; status: BackendCollectionStatus }> {
  const startTime = Date.now();
  let lastStatus: BackendCollectionStatus | null = null;

  while (Date.now() - startTime < maxWaitMs) {
    const info = await getCollectionInfoById(agent, collectionId);

    // Notify on status change
    if (info.status !== lastStatus) {
      lastStatus = info.status;
      onStatusChange?.(info.status);
    }

    // Success states
    if (info.status === 'Installed' || info.status === 'TemplateUploaded') {
      return { canisterId: info.canister_id!, status: info.status };
    }

    // Failure states
    const failureStatuses = [
      'Failed',
      'ReimbursingQueued',
      'QuarantinedReimbursement',
      'Reimbursed',
    ];
    if (failureStatuses.includes(info.status)) {
      throw new Error(`Collection creation failed: ${info.status}`);
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Timeout waiting for collection installation (${maxWaitMs}ms)`);
}
```

## React Query Hooks

### Query Hooks (`api/collections.queries.ts`)

```typescript
// Key factory
export const collectionsKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionsKeys.all, 'list'] as const,
  list: (filters: CollectionFilters) => [...collectionsKeys.lists(), filters] as const,
  details: () => [...collectionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionsKeys.details(), id] as const,
  metadata: (id: string) => [...collectionsKeys.detail(id), 'metadata'] as const,
  nfts: (id: string) => [...collectionsKeys.detail(id), 'nfts'] as const,
};

// Hooks
useCollections()                          // All collections
useMyCollections()                        // Current user's collections
useCollection(collectionId)               // Single collection (with polling)
useCollectionMetadata(canisterId)         // ICRC7 metadata
useCollectionNfts(canisterId)             // Token IDs
```

### Mutation Hooks

```typescript
useCreateCollection()                     // Create with polling
useUpdateCollection()                     // Update metadata
useDeleteCollection()                     // Delete collection
useUploadCollectionLogo()                 // Logo upload
```

### Create Collection Hook Implementation

```typescript
export function useCreateCollection() {
  const queryClient = useQueryClient();
  const { authenticatedAgent } = useAuthState();

  return useMutation({
    mutationFn: async (input: CreateCollectionInput) => {
      // 1. Create collection record
      const { collection_id } = await CollectionsService.createCollection(
        authenticatedAgent!,
        input
      );

      // 2. Wait for canister ID
      const canisterId = await CollectionsService.waitForCollectionCanister(
        authenticatedAgent!,
        collection_id.toString()
      );

      // 3. Wait for installed status
      const result = await CollectionsService.waitForCollectionInstalled(
        authenticatedAgent!,
        collection_id.toString(),
        (status) => {
          console.log(`Collection status: ${status}`);
        }
      );

      return {
        collectionId: collection_id.toString(),
        canisterId: result.canisterId,
        status: result.status,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionsKeys.all });
    },
  });
}
```

## State Management

### Creator Atom (`atoms/collection-creator.atom.ts`)

```typescript
interface CreatorState {
  step: number;
  formData: CreateCollectionInput | null;
  status: BackendCollectionStatus | null;
  canisterId: string | null;
  error: string | null;
  isCreating: boolean;
}

type CreatorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_FORM_DATA'; data: CreateCollectionInput }
  | { type: 'SET_STATUS'; status: BackendCollectionStatus }
  | { type: 'SET_CANISTER_ID'; canisterId: string }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_CREATING'; isCreating: boolean }
  | { type: 'RESET' };
```

### Filters Atom (`atoms/collection-filters.atom.ts`)

```typescript
interface CollectionFilters {
  search: string;
  status: SimpleCollectionStatus | 'all';
  sortBy: 'createdAt' | 'name' | 'itemCount';
  sortOrder: 'asc' | 'desc';
}
```

## Integration Points

### With Templates Feature

- `template_id` can be passed during creation
- Templates stored in collection metadata after creation
- `useCollectionTemplate()` retrieves assigned template

### With Certificates Feature

- Certificates are minted into collections
- Collection canister ID used for all certificate operations
- Token IDs fetched via `getCollectionNfts()`

### With Campaigns Feature

- Campaigns are associated with collections
- Collection provides certificates for distribution

## Known Issues / TODOs

1. **Template Permission**: Storing templates in collection metadata requires `update_collection_metadata` permission. Backend needs to grant this during canister setup.

2. **Creation Timeout**: Long timeout (120s) for WASM installation. May need to surface progress to user more clearly.

3. **Reimbursement Handling**: Failed collections go through reimbursement flow. UI should guide users through this process.

4. **Logo Upload Timing**: Logo can only be uploaded after collection is installed. Consider queueing logo for upload during creation.

5. **Collection Deletion**: Deleting a collection with certificates needs clarification. Are certificates orphaned?

## Usage Examples

### Creating a Collection

```typescript
function NewCollectionPage() {
  const createMutation = useCreateCollection();
  const [creatorState, dispatch] = useAtom(collectionCreatorAtom);

  const handleSubmit = async (data: CreateCollectionInput) => {
    dispatch({ type: 'SET_CREATING', isCreating: true });

    try {
      const result = await createMutation.mutateAsync(data);
      dispatch({ type: 'SET_CANISTER_ID', canisterId: result.canisterId });
      navigate(`/collections/${result.canisterId}`);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    } finally {
      dispatch({ type: 'SET_CREATING', isCreating: false });
    }
  };

  return (
    <CollectionForm
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  );
}
```

### Listing User Collections

```typescript
function CollectionsPage() {
  const { data: collections, isLoading } = useMyCollections();
  const [filters] = useAtom(collectionFiltersAtom);

  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    return collections
      .filter((c) => {
        if (filters.status !== 'all' && c.status !== filters.status) {
          return false;
        }
        if (filters.search && !c.title.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        return a[filters.sortBy] > b[filters.sortBy] ? order : -order;
      });
  }, [collections, filters]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <AddCollectionCard />
      {filteredCollections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
```

### Monitoring Creation Status

```typescript
function CollectionCreationProgress({ collectionId }: Props) {
  const [status, setStatus] = useState<BackendCollectionStatus>('Queued');
  const { authenticatedAgent } = useAuthState();

  useEffect(() => {
    CollectionsService.waitForCollectionInstalled(
      authenticatedAgent!,
      collectionId,
      (newStatus) => setStatus(newStatus)
    ).then((result) => {
      // Navigate to collection page
    }).catch((error) => {
      // Handle error
    });
  }, [collectionId, authenticatedAgent]);

  return (
    <div>
      <CollectionStatusBadge status={status} />
      <ProgressBar value={getProgressPercentage(status)} />
    </div>
  );
}

function getProgressPercentage(status: BackendCollectionStatus): number {
  switch (status) {
    case 'Queued': return 25;
    case 'Created': return 50;
    case 'Installed': return 75;
    case 'TemplateUploaded': return 100;
    default: return 0;
  }
}
```

## Related Documentation

- [Certificates Feature](../../certificates/docs/README.md)
- [Templates Feature](../../templates/docs/README.md)
- [Campaigns Feature](../../campaigns/docs/README.md)
- [Canister Integration](../../../../docs/CANISTER-INTEGRATION.md)
