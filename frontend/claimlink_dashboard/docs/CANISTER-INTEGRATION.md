# ClaimLink Canister Integration

This document describes the patterns and utilities for integrating with Internet Computer canisters.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENT                                      │
│                                                                             │
│  const { data } = useCertificates(collectionId);                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUERY/MUTATION HOOK                                     │
│                                                                             │
│  useQuery({                                                                 │
│    queryFn: () => CertificatesService.fetch(agent, canisterId),             │
│  })                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVICE CLASS                                        │
│                                                                             │
│  static async fetch(agent, canisterId) {                                    │
│    const actor = createCanisterActor(agent, canisterId, idlFactory);        │
│    return actor.icrc7_tokens_of(...);                                       │
│  }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACTOR FACTORY                                         │
│                                                                             │
│  createCanisterActor<T>(agent, canisterId, idlFactory)                      │
│  - Validates inputs                                                         │
│  - Creates typed actor                                                      │
│  - Returns actor instance                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      IC CANISTER (WASM)                                      │
│                                                                             │
│  ClaimLink / ORIGYN NFT / Token Ledgers                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Actor Factory

### Core Utilities (`shared/canister/actor-factory.ts`)

```typescript
import { Actor, type Agent, type ActorSubclass } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

/**
 * Creates a type-safe canister actor
 */
export function createCanisterActor<T>(
  agent: Agent,
  canisterId: string,
  idlFactory: IDL.InterfaceFactory
): ActorSubclass<T> {
  if (!agent) {
    throw new Error('Agent is required to create canister actor');
  }
  if (!canisterId) {
    throw new Error('Canister ID is required');
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
}

/**
 * Creates actor with named error messages
 */
export function createNamedCanisterActor<T>(
  agent: Agent,
  canisterName: string,
  canisterId: string,
  idlFactory: IDL.InterfaceFactory
): ActorSubclass<T> {
  if (!agent) {
    throw new Error(`Agent is required to create ${canisterName} actor`);
  }
  if (!canisterId) {
    throw new Error(`${canisterName} canister ID is required`);
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
}
```

### Usage in Services

```typescript
// features/certificates/api/certificates.service.ts
import { createCanisterActor } from '@shared/canister';
import { idlFactory } from '@shared/canisters/origyn_nft';
import type { OrigynNftService } from '@shared/canisters/origyn_nft/interfaces';

export class CertificatesService {
  static async getCertificatesOf(
    agent: Agent,
    collectionCanisterId: string
  ): Promise<Certificate[]> {
    const actor = createCanisterActor<OrigynNftService>(
      agent,
      collectionCanisterId,
      idlFactory
    );

    const tokenIds = await actor.icrc7_tokens_of(
      { owner: agent.getPrincipal(), subaccount: [] },
      [],  // prev
      []   // take
    );

    // Transform and return
    return tokenIds.map(transformTokenToCertificate);
  }
}
```

## Canister Configuration

### Centralized Canister IDs (`shared/canister/canister-config.ts`)

```typescript
export const CANISTER_IDS = {
  // Core canisters
  claimlink: import.meta.env.VITE_CLAIMLINK_CANISTER_ID,
  origynNft: import.meta.env.VITE_NFT_CANISTER_ID,
  certificate: import.meta.env.VITE_CERTIFICATE_CANISTER_ID,

  // Token ledgers
  icpLedger: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  gldtLedger: '6c7su-kiaaa-aaaar-qaira-cai',
  ogyLedger: import.meta.env.VITE_LEDGER_CANISTER_ID,
  ckusdtLedger: 'xevnm-gaaaa-aaaar-qafnq-cai',

  // Index canisters
  icpIndex: 'qhbym-qaaaa-aaaaa-aaafq-cai',
  gldtIndex: '7vojr-tyaaa-aaaar-qairq-cai',
  ogyIndex: import.meta.env.VITE_INDEX_CANISTER_ID,
} as const;

export type CanisterName = keyof typeof CANISTER_IDS;

export function getCanisterId(name: CanisterName): string {
  const id = CANISTER_IDS[name];
  if (!id) {
    throw new Error(`Canister ID not configured: ${name}`);
  }
  return id;
}

export function getCanisterIdOptional(name: CanisterName): string | undefined {
  return CANISTER_IDS[name];
}

export function isCanisterConfigured(name: CanisterName): boolean {
  return !!CANISTER_IDS[name];
}
```

## Chunked File Upload Protocol

ORIGYN NFT canisters use a chunked upload protocol for files over 1MB.

### Upload Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: INIT UPLOAD                                                         │
│                                                                             │
│  actor.init_upload({                                                        │
│    filename: "sanitized_1706012345678_image.png",                           │
│    content_type: "image/png",                                               │
│    content_hash: Uint8Array (SHA-256),                                      │
│    total_size: 2500000n                                                     │
│  })                                                                         │
│                              │                                              │
│                              ▼                                              │
│                        upload_id: string                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: STORE CHUNKS (repeat for each 1MB chunk)                            │
│                                                                             │
│  for (let i = 0; i < chunkCount; i++) {                                     │
│    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);         │
│                                                                             │
│    await retryWithBackoff(() => {                                           │
│      actor.store_chunk({                                                    │
│        upload_id: string,                                                   │
│        chunk_index: BigInt(i),                                              │
│        data: new Uint8Array(chunk)                                          │
│      })                                                                     │
│    }, { maxRetries: 3 });                                                   │
│                                                                             │
│    onProgress((i + 1) / chunkCount);                                        │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: FINALIZE UPLOAD                                                     │
│                                                                             │
│  actor.finalize_upload({ upload_id: string })                               │
│                              │                                              │
│                              ▼                                              │
│                     file_path: "/images/sanitized_...png"                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// features/certificates/api/certificates.service.ts

const CHUNK_SIZE = 1024 * 1024; // 1MB (IC message size limit)

export async function uploadCertificateFile(
  agent: Agent,
  collectionCanisterId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const actor = createCanisterActor<OrigynNftService>(
    agent,
    collectionCanisterId,
    idlFactory
  );

  // 1. Prepare file
  const sanitizedName = sanitizeFilename(file.name);
  const timestampedName = `${Date.now()}_${sanitizedName}`;
  const arrayBuffer = await file.arrayBuffer();
  const contentHash = await crypto.subtle.digest('SHA-256', arrayBuffer);

  // 2. Init upload
  const initResult = await actor.init_upload({
    filename: timestampedName,
    content_type: file.type,
    content_hash: new Uint8Array(contentHash),
    total_size: BigInt(file.size),
  });

  if ('Err' in initResult) {
    throw new Error(`Init upload failed: ${JSON.stringify(initResult.Err)}`);
  }

  const uploadId = initResult.Ok.upload_id;
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);

  // 3. Store chunks with retry
  for (let i = 0; i < chunkCount; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = arrayBuffer.slice(start, end);

    await retryWithBackoff(
      async () => {
        const result = await actor.store_chunk({
          upload_id: uploadId,
          chunk_index: BigInt(i),
          data: new Uint8Array(chunk),
        });

        if ('Err' in result) {
          throw new Error(`Chunk ${i} failed: ${JSON.stringify(result.Err)}`);
        }
      },
      { maxRetries: 3, initialDelayMs: 1000, backoffMultiplier: 2 }
    );

    onProgress?.((i + 1) / chunkCount);
  }

  // 4. Finalize upload
  const finalResult = await actor.finalize_upload({ upload_id: uploadId });

  if ('Err' in finalResult) {
    throw new Error(`Finalize failed: ${JSON.stringify(finalResult.Err)}`);
  }

  return finalResult.Ok.file_path;
}
```

## Retry Utilities

### Exponential Backoff (`shared/canister/retry.ts`)

```typescript
export interface RetryOptions {
  maxRetries?: number;
  operationName?: string;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  logRetries?: boolean;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    operationName = 'operation',
    initialDelayMs = 1000,
    backoffMultiplier = 2,
    logRetries = true,
  } = options;

  let lastError: Error | undefined;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        if (logRetries) {
          console.warn(
            `${operationName} attempt ${attempt + 1} failed, ` +
            `retrying in ${delay}ms...`,
            lastError.message
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= backoffMultiplier;
      }
    }
  }

  throw lastError;
}

export async function retryWithFixedDelay<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  return retryWithBackoff(operation, {
    maxRetries,
    initialDelayMs: delayMs,
    backoffMultiplier: 1, // Fixed delay
  });
}
```

## URL Normalization

Asset URLs must be normalized for different environments.

```typescript
// features/certificates/api/certificates.service.ts

export function normalizeFileUrl(
  filePath: string,
  collectionCanisterId: string
): string {
  // Already a full URL
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return normalizeExistingUrl(filePath);
  }

  // Relative path - build full URL
  const icHost = import.meta.env.VITE_IC_HOST || 'https://ic0.app';

  if (icHost.includes('127.0.0.1') || icHost.includes('localhost')) {
    // Local development
    return `http://127.0.0.1:8000/?canisterId=${collectionCanisterId}/-${filePath}`;
  }

  // Production - use raw subdomain for direct access
  return `https://${collectionCanisterId}.raw.icp0.io/-${filePath}`;
}

function normalizeExistingUrl(url: string): string {
  // Fix common issues
  let normalized = url;

  // Replace .icp0.io with .raw.icp0.io for direct asset access
  if (normalized.includes('.icp0.io') && !normalized.includes('.raw.icp0.io')) {
    normalized = normalized.replace('.icp0.io', '.raw.icp0.io');
  }

  // Ensure /-/ path prefix for assets
  if (!normalized.includes('/-/') && !normalized.includes('/?canisterId')) {
    const urlObj = new URL(normalized);
    if (!urlObj.pathname.startsWith('/-/')) {
      urlObj.pathname = `/-${urlObj.pathname}`;
      normalized = urlObj.toString();
    }
  }

  return normalized;
}
```

## Error Handling Patterns

### Result Type Handling

ORIGYN canisters return Rust-style Result types:

```typescript
type Result<T, E> = { Ok: T } | { Err: E };

// Handling results
async function handleCanisterResult<T>(
  result: Result<T, unknown>,
  operationName: string
): Promise<T> {
  if ('Err' in result) {
    const errorMsg = formatCanisterError(result.Err);
    throw new Error(`${operationName} failed: ${errorMsg}`);
  }
  return result.Ok;
}

function formatCanisterError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null) {
    // Handle variant types
    const variant = Object.keys(error)[0];
    const value = (error as Record<string, unknown>)[variant];
    return `${variant}: ${JSON.stringify(value)}`;
  }
  return JSON.stringify(error);
}
```

### User-Friendly Error Messages

```typescript
// features/collections/api/collections.service.ts

export function formatCreateCollectionError(error: CreateCollectionError): string {
  if ('InsufficientBalance' in error) {
    return 'Insufficient balance to create collection. Please add more tokens.';
  }
  if ('InvalidName' in error) {
    return 'Invalid collection name. Please use only letters, numbers, and spaces.';
  }
  if ('QuotaExceeded' in error) {
    return 'You have reached the maximum number of collections.';
  }
  if ('Unauthorized' in error) {
    return 'You are not authorized to create collections.';
  }
  return `Failed to create collection: ${JSON.stringify(error)}`;
}
```

## Polling Patterns

### Wait for Async Operations

```typescript
// features/collections/api/collections.service.ts

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

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Timeout waiting for collection canister (${maxWaitMs}ms)`);
}

export async function waitForCollectionInstalled(
  agent: Agent,
  collectionId: string,
  onStatusChange?: (status: BackendCollectionStatus) => void,
  maxWaitMs: number = 120000,  // WASM installation takes time
  pollIntervalMs: number = 3000
): Promise<{ canisterId: string; status: BackendCollectionStatus }> {
  const startTime = Date.now();
  let lastStatus: BackendCollectionStatus | null = null;

  while (Date.now() - startTime < maxWaitMs) {
    const info = await getCollectionInfoById(agent, collectionId);

    if (info.status !== lastStatus) {
      lastStatus = info.status;
      onStatusChange?.(info.status);
    }

    // Success states
    if (info.status === 'Installed' || info.status === 'TemplateUploaded') {
      return { canisterId: info.canister_id!, status: info.status };
    }

    // Failure states
    if (['Failed', 'ReimbursingQueued', 'QuarantinedReimbursement', 'Reimbursed']
        .includes(info.status)) {
      throw new Error(`Collection creation failed with status: ${info.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Timeout waiting for collection installation (${maxWaitMs}ms)`);
}
```

## Canister Types

### ClaimLink Canister

Location: `shared/canisters/claimlink/`

```typescript
// Key methods
interface ClaimLinkService {
  // Collections
  create_collection(args: CreateCollectionArgs): Promise<Result<{ collection_id: bigint }, CreateCollectionError>>;
  get_collection_info(canisterId: Principal): Promise<CollectionInfo | undefined>;
  list_all_collections(args: PaginationArgs): Promise<CollectionInfo[]>;

  // Templates
  create_template(args: CreateTemplateArgs): Promise<Result<{ template_id: bigint }, Error>>;
  get_template(templateId: bigint): Promise<BackendTemplate | undefined>;
  list_templates(): Promise<BackendTemplate[]>;

  // Campaigns
  create_campaign(args: CreateCampaignArgs): Promise<Result<{ campaign_id: bigint }, Error>>;
  get_campaign(campaignId: bigint): Promise<Campaign | undefined>;
}
```

### ORIGYN NFT Canister

Location: `shared/canisters/origyn_nft/`

```typescript
// Key methods
interface OrigynNftService {
  // ICRC-7 Standard
  icrc7_tokens_of(owner: Account, prev: [] | [bigint], take: [] | [bigint]): Promise<bigint[]>;
  icrc7_token_metadata(tokenIds: bigint[]): Promise<Array<[] | [ICRC3Value]>>;
  icrc7_collection_metadata(): Promise<ICRC3Value>;

  // ICRC-3 History
  icrc3_get_blocks(args: GetBlocksArgs): Promise<GetBlocksResult>;

  // Minting
  mint(args: MintArgs): Promise<Result<MintResult, MintError>>;

  // File upload
  init_upload(args: InitUploadArgs): Promise<Result<{ upload_id: string }, Error>>;
  store_chunk(args: StoreChunkArgs): Promise<Result<void, Error>>;
  finalize_upload(args: FinalizeUploadArgs): Promise<Result<{ file_path: string }, Error>>;

  // Metadata updates
  update_token_metadata(args: UpdateMetadataArgs): Promise<Result<void, Error>>;
}
```

## Environment Configuration

### Required Environment Variables

```bash
# .env file

# Core canisters
VITE_CLAIMLINK_CANISTER_ID=xxxxx-xxxxx-xxxxx-xxxxx-cai
VITE_NFT_CANISTER_ID=xxxxx-xxxxx-xxxxx-xxxxx-cai
VITE_CERTIFICATE_CANISTER_ID=xxxxx-xxxxx-xxxxx-xxxxx-cai
VITE_LEDGER_CANISTER_ID=xxxxx-xxxxx-xxxxx-xxxxx-cai

# IC network
VITE_IC_HOST=https://ic0.app       # or http://127.0.0.1:8000 for local

# NFID authentication (required for localhost signing)
VITE_NFID_LOCALHOST_TARGETS=http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
```

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [DATA-FLOWS.md](./DATA-FLOWS.md) - Key data flow diagrams
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management patterns
