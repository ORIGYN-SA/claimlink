# B2B Minting Dapp Reference (Legacy Minting Studio)

This document serves as a reference for how templates and metadata were stored in the b2b-minting-dapp (the original minting studio). Use this as a guide when implementing similar functionality in ClaimLink.

---

## Table of Contents

1. [Overview](#overview)
2. [Template Storage](#template-storage)
3. [Metadata Storage (Candy Format)](#metadata-storage-candy-format)
4. [Data Models & Types](#data-models--types)
5. [State Management](#state-management)
6. [IC Canister Integration](#ic-canister-integration)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Key File Locations](#key-file-locations)

---

## Overview

The b2b-minting-dapp uses a hierarchical, block-based template system stored in a backend database (MongoDB) and retrieved via API. NFT metadata is stored as **Candy objects** in the Internet Computer canister.

**Architecture Summary:**
- **Templates**: Block-based layouts stored in MongoDB via backend API
- **Metadata**: Candy format objects stored on IC canister
- **Data Structures**: Define available fields and their types
- **Collections**: Link to data structures and contain NFT tokens

---

## Template Storage

### Template Block Types

Templates are composed of nested blocks. Each block has a `type` and optional `content` array for nesting:

| Block Type | Purpose |
|------------|---------|
| `columns` | Grid layout container with responsive column settings |
| `elements` | Generic container for nested content |
| `mainPhoto` | Primary image display |
| `section` | Named sections with titles |
| `field` | Data field display with title and field references |
| `valueField` | Simple value display |
| `title` | Text titles |
| `text` | Static text blocks |
| `image` | Single image block |
| `gallery` | Multi-image gallery |
| `attachments` | Document/file attachments display |
| `video` | Video embedding (collection or certificate level) |
| `history` | Historical records display |
| `separator` | Visual divider |
| `certificate` | Certificate of authenticity display |
| `collectionImage` | Library-based image (logos, signatures) |

### Template Structure Example

```typescript
{
  id: "unique-hash-32chars",
  type: "columns",
  columns: {
    smColumns: "1",    // Mobile columns
    columns: "2"       // Desktop columns
  },
  content: [
    {
      type: "elements",
      id: "element-id",
      content: [
        {
          type: "mainPhoto",
          pointer: "files-mainImage"
        },
        {
          type: "section",
          title: { en: "Product Details" },
          content: [
            {
              type: "field",
              title: { en: "Serial Number" },
              fields: [["serial_number"]]
            },
            {
              type: "field",
              title: { en: "Weight" },
              fields: [["weight", "weight_unit"]]  // Multiple fields in one row
            }
          ]
        }
      ]
    }
  ]
}
```

### Template Types

Three separate templates are maintained per data structure:

1. **`template`** - Main NFT display template
2. **`certificateTemplate`** - Certificate of authenticity layout
3. **`detailsTemplate`** - Detailed view layout

### Template CRUD Operations

```typescript
// API endpoints (from canister-api/api.ts)
createDataStructure(data)                              // Create new structure with templates
getDataStructure(id)                                   // Fetch structure including templates
updateDataStructure(id, { data: { template, ... } })   // Update templates
deleteDataStructure(id)                                // Remove structure
setCollectionDataStructure(collectionId, { dataStructureId })  // Link to collection
```

### Template Manipulation Helpers

```typescript
// Add unique IDs to template blocks (recursive)
const addIds = (tObj) => {
  return tObj?.map((item) => {
    const tmpTObj = item;
    tmpTObj.id = genRanHex(32);
    if (tmpTObj.content) {
      tmpTObj.content = addIds(tmpTObj.content);
    }
    return tmpTObj;
  });
};

// Remove block by ID (recursive tree traversal)
const removeById = (tObj, id) => {
  return tObj.filter((item) => {
    if (item.content) {
      item.content = removeById(item.content, id);
    }
    return item.id !== id;
  });
};

// Update block by ID (recursive tree traversal)
const updateById = (tObj, id, newObj) => {
  return tObj?.map((item) => {
    if (item.id === id) {
      return newObj;
    }
    if (item.content) {
      item.content = updateById(item.content, id, newObj);
    }
    return item;
  });
};
```

---

## Metadata Storage (Candy Format)

### What is Candy?

Candy is a hierarchical data format used by ORIGYN NFT canisters. It's similar to JSON but with explicit type wrappers.

### Candy Type Wrappers

```typescript
// Supported Candy value types
{ "Text": "string value" }           // String
{ "Nat": 123 }                       // Natural number
{ "Int": -456 }                      // Integer
{ "Bool": true }                     // Boolean
{ "Class": [...] }                   // Nested object (array of named fields)
{ "Array": [...] }                   // Array of Candy values
{ "Principal": "aaaaa-aa" }          // IC Principal
{ "Blob": [...] }                    // Binary data
```

### Candy Object Structure

```typescript
// A Candy "Class" is an array of named fields
{
  "Class": [
    { "name": "field_name", "value": { "Text": "value" } },
    { "name": "nested_field", "value": {
      "Class": [
        { "name": "inner_field", "value": { "Nat": 100 } }
      ]
    }},
    { "name": "array_field", "value": {
      "Array": [
        { "Text": "item1" },
        { "Text": "item2" }
      ]
    }}
  ]
}
```

### NFT Metadata Structure on IC

```typescript
{
  metadata: {
    meta: {
      metadata: {
        Class: [
          {
            name: "__apps",
            value: {
              Array: [
                // App 1: Public metadata (actual field values)
                {
                  Class: [
                    { name: "app_id", value: { Text: "public.metadata" } },
                    { name: "data", value: {
                      Class: [
                        { name: "serial_number", value: { Text: "ABC123" } },
                        { name: "weight", value: { Text: "100" } },
                        // ... more fields
                      ]
                    }}
                  ]
                },
                // App 2: Template definition
                {
                  Class: [
                    { name: "app_id", value: { Text: "public.metadata.template" } },
                    { name: "data", value: { Array: [/* template blocks */] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

### Candy Parsing Functions

```typescript
// Extract actual value from Candy type wrapper
export const getCandyValue = (obj) => {
  const type = Object.keys(obj?.value || obj)[0];
  const value = Object.values(obj?.value || obj)[0];

  if (type === 'Class') {
    const pData = {};
    value.forEach((item) => {
      pData[item.name] = getCandyValue(item);
    });
    return pData;
  }
  if (type === 'Array') {
    return value?.map(parseCandyObj) || [];
  }
  return value;
};

// Convert full Candy object to plain JavaScript object
export const parseCandyObj = (obj) => {
  let field = {};
  if (obj.Class) {
    obj.Class.forEach((item) => {
      field[item.name] = getCandyValue(item);
    });
    return field;
  }
  const value = getCandyValue(obj);
  if (obj.name) {
    field[obj.name] = value;
    return field;
  }
  field = value;
  return field;
};
```

---

## Data Models & Types

### DataStructure

```typescript
export interface DataStructure {
  _id?: string;           // MongoDB ObjectId
  name?: string;          // Human-readable name
  data?: {
    dataStructure: FieldDefinition[];   // Field definitions
    template: TemplateBlock[];          // Main display template
    certificateTemplate: TemplateBlock[]; // Certificate template
    detailsTemplate: TemplateBlock[];   // Details template
  };
}
```

### FieldDefinition (within dataStructure)

```typescript
interface FieldDefinition {
  name: string;           // Field identifier (snake_case)
  label: {                // Display labels (multi-language)
    en: string;
    // other languages...
  };
  type: string;           // Data type: "text", "number", "images", "files", "date", etc.
  inputType?: string;     // Input variant: "text", "textarea", "select", etc.
  options?: string[];     // For select/dropdown fields
  required?: boolean;
  section?: string;       // Grouping category
}
```

### NftToken

```typescript
export interface NftToken {
  _id?: string;
  collectionId?: string;
  tokenId?: string;
  status?: NftTokenStatus;
  tokenUrl?: string;
  ownerPrincipalId?: string;
  statusHistory?: NftTokenStatusHistory[];
  previewUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum NftTokenStatus {
  PRE_STAGE = 'PRE_STAGE',
  WAITING_FOR_QR = 'WAITING_FOR_QR',
  WAITING_FOR_OWNER = 'WAITING_FOR_OWNER',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING'
}
```

### OrganizationCollection

```typescript
export interface OrganizationCollection {
  _id?: string;
  canisterPrincipalId?: string;   // IC canister ID
  name?: string;
  canisterType?: WasmType;
  ownerPrincipalId?: string;
  status?: CanisterStatus;
  accountId?: string;
  icpUrl?: string;
  tokens?: NftToken[];
  dataStructure?: string;         // Reference to DataStructure _id
  wasm?: string;
}
```

### Form Data Structure (for minting)

```typescript
const formFullData = {
  files: Array<{
    id: string;
    path: string;           // Storage path
    source: string;         // File source URL
    pointer: string;        // "files-media", "files-mainImage", "files-attachments"
    download?: boolean;
  }>,
  data: Array<{
    name: string;           // Field name matching dataStructure
    type: string;           // "text", "number", "images", "files", etc.
    value: {
      content?: object | Array;
      language?: boolean;   // If true, content is language-keyed
    }
  }>,
  display: object           // Template configuration overrides
}
```

---

## State Management

### Frontend State (React useState)

```typescript
// Template Editor State
const [template, setTemplate] = useState([]);           // Current template blocks
const [fullDataStructure, setFullDataStructure] = useState<any>();
const [fields, setFields] = useState<any>([]);          // Available fields
const [collections, setCollections] = useState<any>([]); // Collections list

// Minter State
const [selectedCollectionId, setSelectedCollectionId] = useState();
const [templateFormData, setTemplateFormData] = useState<any>();
const [templatesData, setTemplatesData] = useState<any>();
const [dataStructure, setDataStructure] = useState<any>();
const [languages, setLanguages] = useState([]);          // Supported languages
```

### Data Flow

```
DataStructure API → fullDataStructure state →
  ├── fields (extracted field definitions)
  ├── template (display template)
  ├── certificateTemplate
  └── detailsTemplate
```

---

## IC Canister Integration

### Fetching Collection Metadata

```typescript
const actor = await getActor<ActorCollectionMethod>({
  isLocal: isLocal(),
  canisterId: collection.canisterPrincipalId,
  idlFactory: origynNftIdl,
});

// Fetch collection-level metadata
const result = await actor.collection_nft_origyn([]);

if ('ok' in result) {
  const metadata = result.ok.metadata?.[0];

  // Extract library (uploaded files)
  const libs = metadata?.Class?.find(({ name }) => name === 'library');
  if (libs) {
    const parsed = parseCandyObj(libs);
    const libraryIds = parsed.library.map((item) => item.library_id);
  }
}
```

### Fetching NFT Metadata

```typescript
// Fetch specific NFT metadata
const nftResult = await actor.nft_origyn(tokenId);

if ('ok' in nftResult) {
  const nftMetadata = nftResult.ok.metadata;
  const parsed = parseCandyObj(nftMetadata);

  // Extract apps data
  const apps = parsed.__apps || [];
  const publicMetadata = apps.find(app => app.app_id === 'public.metadata');
  const templateData = apps.find(app => app.app_id === 'public.metadata.template');
}
```

---

## Data Flow Diagrams

### Minting Process

```
1. User fills form in Minter UI
2. Form data validated and structured:

   Form Input → FormData { files, data, display }

3. Files uploaded to storage (IPFS or similar)
4. Metadata converted to Candy format
5. NFT staged on IC canister:

   FormData → Candy Object → stage_nft_origyn() → IC Canister

6. NFT minted:

   mint_nft_origyn() → Token created with metadata
```

### Display Process

```
1. Fetch NFT from canister:

   nft_origyn(tokenId) → Candy Object

2. Parse Candy to JavaScript:

   Candy Object → parseCandyObj() → Plain Object

3. Extract template and data:

   Plain Object → { template, metadata }

4. Render template with data bindings:

   TemplateRender(template, metadata) → UI
```

### Template Management

```
1. User edits template in Template Editor
2. Block operations (add/edit/remove):

   UI Action → updateById/removeById → Updated template array

3. Save to backend:

   Template Array → updateDataStructure() → MongoDB

4. Template applied to new NFTs during minting
```

---

## Template Rendering System

### How the Renderer Works

The `TemplateRender` component (`TemplateRender.tsx`) uses a **recursive switch-case pattern** to render templates. It iterates through the template array and matches each block's `type` to a specific rendering case.

### Core Rendering Logic

```tsx
const RenderTemplateBlock = ({ templateObject, dataStructure, data, lang = 'en' }) => {
  return templateObject?.map((tempObj, index) => {
    switch (tempObj.type) {
      case 'columns':
        // Renders a responsive grid, recursively renders children
        return (
          <Grid key={index} {...tempObj.columns}>
            <RenderTemplateBlock templateObject={tempObj.content} data={data} lang={lang} />
          </Grid>
        );

      case 'elements':
        // Generic flex container, recursively renders children
        return (
          <Flex key={index} flexFlow="column">
            <RenderTemplateBlock templateObject={tempObj.content} data={data} lang={lang} />
          </Flex>
        );

      case 'section':
        // Accordion-style section with title and nested content
        return (
          <>
            <Accordion>
              <span>{tempObj?.title[lang]}</span>
              <ArrowIcon />
            </Accordion>
            <AccordionSection>
              <RenderTemplateBlock templateObject={tempObj.content} data={data} />
            </AccordionSection>
          </>
        );

      case 'mainPhoto':
        // Main product image using pointer to find file in data
        return (
          <img src={`${canisterUrl}/-/${tokenId}/-/${data[tempObj.pointer][0]?.path}`} />
        );

      case 'field':
        // Labeled field with title and value from data
        const fieldValue = tempObj.fields
          .map(name => data[name]?.content[lang])
          .join(', ');
        return (
          <FieldBlock>
            <p>{tempObj?.title[lang]}</p>
            <p className="fieldValue">{fieldValue}</p>
          </FieldBlock>
        );

      case 'valueField':
        // Value-only field (no label)
        return <ValueBlock>{fieldValue}</ValueBlock>;

      case 'title':
        return <Title className={tempObj.className}>{tempObj?.title[lang]}</Title>;

      case 'text':
        return <pre>{tempObj?.text[lang]}</pre>;

      case 'image':
        return <img src={`${canisterUrl}/-/${tokenId}/-/${data[tempObj.field][0]?.path}`} />;

      case 'video':
        // Supports both token-level and collection-level videos
        if (tempObj.isCanister) {
          return <video src={`${canisterUrl}/collection/-/${tempObj.libId}`} />;
        }
        return <video src={`${canisterUrl}/-/${tokenId}/-/${field.path}`} />;

      case 'gallery':
        return <Gallery data={data} templateObj={tempObj} />;

      case 'attachments':
        // Grid of downloadable documents
        return (
          <Grid columns={2}>
            {data[tempObj.pointer]?.map(doc => (
              <Card>
                <PDFIcon />
                <span>{doc.path}</span>
                <a href={downloadUrl}>Download</a>
              </Card>
            ))}
          </Grid>
        );

      case 'collectionImage':
        // Image from collection library (logos, badges, signatures)
        return <img src={`${canisterUrl}/collection/-/${tempObj.libId}`} />;

      case 'history':
        // Timeline of events
        return (
          <History>
            {field?.records?.map(r => (
              <>
                <h3>{formatDate(r.date)}</h3>
                <p><b>{r.category}</b></p>
                <p>{r.description}</p>
              </>
            ))}
          </History>
        );

      case 'separator':
        return <hr />;

      case 'certificate':
        // Placeholder for certificate rendering
        return null;
    }
  });
};
```

### Key Rendering Concepts

#### 1. Recursive Rendering
Container blocks (`columns`, `elements`, `section`) recursively call `RenderTemplateBlock` with their `content` array, enabling unlimited nesting.

#### 2. Data Binding via Pointers
Blocks reference data using:
- **`pointer`**: For file arrays (e.g., `"files-mainImage"` → `data["files-mainImage"]`)
- **`field`/`fields`**: For data fields (e.g., `["serial_number"]` → `data["serial_number"].content[lang]`)
- **`libId`**: For collection-level library files (uploaded to canister directly)

#### 3. Multi-language Support
Text content is accessed via language key: `tempObj.title[lang]` or `data[field].content[lang]`

#### 4. File URL Construction
Files are served from the IC canister:
```
Token-level:      {canisterUrl}/-/{tokenId}/-/{filePath}
Collection-level: {canisterUrl}/collection/-/{libraryId}
```

### Data Structure for Rendering

The `data` object passed to the renderer contains:

```typescript
{
  // Identifiers
  canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  collectionId: "collection-123",
  tokenId: "token-456",

  // File pointers (grouped by pointer name)
  "files-mainImage": [{ path: "main.jpg", ... }],
  "files-gallery": [{ path: "img1.jpg" }, { path: "img2.jpg" }],
  "files-attachments": [{ path: "report.pdf" }],

  // Field data (from metadata)
  serial_number: { content: { en: "ABC123" } },
  weight: { content: { en: "100g" } },
  description: { content: { en: "Product description" } },

  // Special fields
  content: [...],  // Raw content array for history/records
}
```

### Template → Renderer Mapping

| Template Block | Renderer Output | Data Source |
|----------------|-----------------|-------------|
| `columns` | `<Grid>` with responsive columns | `tempObj.columns` for settings |
| `elements` | `<Flex>` vertical container | Children in `tempObj.content` |
| `section` | Accordion with title + content | `tempObj.title[lang]` + children |
| `mainPhoto` | Full-width image | `data[tempObj.pointer][0].path` |
| `field` | Label + value row | `tempObj.title[lang]` + `data[field].content[lang]` |
| `valueField` | Value only (no label) | `data[field].content[lang]` |
| `title` | Styled heading | `tempObj.title[lang]` |
| `text` | Preformatted text | `tempObj.text[lang]` |
| `image` | Single image | `data[tempObj.field][0].path` |
| `video` | Video player | Token or collection library |
| `gallery` | Image carousel/grid | `data[tempObj.pointer]` array |
| `attachments` | Downloadable file cards | `data[tempObj.pointer]` array |
| `collectionImage` | Collection library image | `tempObj.libId` |
| `history` | Timeline component | `data.content` records |
| `separator` | Horizontal rule | None |

---

## Key File Locations

| Component | Path |
|-----------|------|
| **API Contracts/Types** | `packages/common/services/src/apis/canister-api/data-contracts.ts` |
| **API Methods** | `packages/common/services/src/apis/canister-api/api.ts` |
| **Template Editor** | `packages/apps/studio/src/minting/pages/Main/Tabs/Template.tsx` |
| **Certificate Template Editor** | `packages/apps/studio/src/minting/pages/Main/Tabs/CertificateTemplate.tsx` |
| **Details Template Editor** | `packages/apps/studio/src/minting/pages/Main/Tabs/DetailsTemplate.tsx` |
| **Data Structure Editor** | `packages/apps/studio/src/minting/pages/Main/Tabs/DataStructure.tsx` |
| **Minter (Form)** | `packages/apps/studio/src/minting/pages/Main/Tabs/Minter.tsx` |
| **Template Renderer** | `packages/apps/luxury/src/pages/NFTPage/TemplateRender.tsx` |
| **Candy Parsing** | `packages/apps/luxury/src/pages/NFTPage/index.tsx` |
| **Form Block Components** | `packages/apps/studio/src/minting/components/forms/Block.tsx` |

---

## Key Differences to Consider for ClaimLink

1. **Backend Storage**: b2b-minting-dapp uses MongoDB via a backend API; ClaimLink uses IC canister state directly

2. **Template Storage Location**: Templates were stored separately from NFT metadata in MongoDB; consider if templates should be stored in canister state or embedded in NFT metadata

3. **Multi-language Support**: The legacy system has built-in i18n for field labels and content; determine if ClaimLink needs this

4. **File Handling**: Legacy uses external file storage with pointers; ClaimLink may handle files differently

5. **Data Structure Reusability**: Legacy allows sharing data structures across collections; consider similar patterns for ClaimLink
