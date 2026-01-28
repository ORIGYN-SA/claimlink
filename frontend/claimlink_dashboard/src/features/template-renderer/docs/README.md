# Template Renderer Feature

The template-renderer feature handles the parsing of ORIGYN metadata and rendering of dynamic certificate views using template nodes.

## Purpose

- Parse ORIGYN NFT metadata into structured data
- Render template nodes (layout, text, media, etc.)
- Build ORIGYN-compatible metadata for minting
- Convert between ClaimLink and ORIGYN formats
- Resolve asset URLs across environments

## File Structure

```
template-renderer/
├── components/
│   ├── nodes/
│   │   ├── columns-node.tsx          # Grid layout
│   │   ├── elements-node.tsx         # Flex column
│   │   ├── section-node.tsx          # Collapsible section
│   │   ├── title-node.tsx            # Heading
│   │   ├── subtitle-node.tsx         # Subheading
│   │   ├── text-node.tsx             # Body text
│   │   ├── value-field-node.tsx      # Dynamic field value
│   │   ├── field-node.tsx            # Label + value pair
│   │   ├── image-node.tsx            # Single image
│   │   ├── main-image-node.tsx       # Hero image
│   │   ├── multi-image-node.tsx      # Image grid
│   │   ├── collection-image-node.tsx # Collection logo
│   │   ├── gallery-node.tsx          # Image gallery
│   │   ├── video-node.tsx            # Video player
│   │   ├── attachments-node.tsx      # File attachments
│   │   ├── separator-node.tsx        # Horizontal line
│   │   └── history-node.tsx          # Transaction history
│   ├── template-block.tsx            # Recursive renderer
│   └── template-renderer.tsx         # Main component
├── context/
│   └── template-context.tsx          # Render context provider
├── atoms/
│   └── template-renderer.atom.ts     # Rendering state
├── types/
│   └── origyn-template.types.ts      # ORIGYN type definitions
└── utils/
    ├── metadata-builder.ts           # Build ORIGYN metadata
    ├── metadata-parser.ts            # Parse ORIGYN metadata
    ├── icrc3-converter.ts            # Convert to ICRC3 format
    ├── view-generator.ts             # Generate ORIGYN views
    ├── url-resolver.ts               # Asset URL resolution
    ├── template-converter.ts         # Format conversions
    └── date-formatter.ts             # Date utilities
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE CREATION                                    │
│                                                                             │
│  TemplateStructure + FormData + Files                                       │
│         │                                                                   │
│         │ buildOrigynApps()                                                 │
│         │ buildOrigynNftMetadata()                                          │
│         │ convertToIcrc3Metadata()                                          │
│         ▼                                                                   │
│  ICRC3 Metadata Array                                                       │
│  [                                                                          │
│    ["public.metadata.title", { Text: "..." }],                              │
│    ["public.metadata.template", { Array: [...] }],                          │
│    ["library", { Array: [...] }]                                            │
│  ]                                                                          │
│         │                                                                   │
│         │ actor.mint()                                                      │
│         ▼                                                                   │
│  ORIGYN NFT Canister                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE VIEWING                                     │
│                                                                             │
│  actor.icrc7_token_metadata([tokenId])                                      │
│         │                                                                   │
│         │ parseOrigynMetadata()                                             │
│         ▼                                                                   │
│  ParsedOrigynMetadata                                                       │
│  {                                                                          │
│    metadata: { title: "...", description: "..." },                          │
│    templates: { template: [...], certificateTemplate: [...] },              │
│    library: [{ library_id: "...", location: "..." }]                        │
│  }                                                                          │
│         │                                                                   │
│         │ TemplateRenderer                                                  │
│         ▼                                                                   │
│  Rendered Certificate View                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### ORIGYN Template Node Types (`types/origyn-template.types.ts`)

```typescript
type TemplateNodeType =
  // Layout
  | 'columns'
  | 'elements'
  | 'section'
  // Text
  | 'title'
  | 'subTitle'
  | 'text'
  | 'valueField'
  | 'field'
  // Media
  | 'image'
  | 'mainImage'
  | 'multiImage'
  | 'collectionImage'
  | 'gallery'
  | 'video'
  | 'attachments'
  | 'filesAttachments'
  // Special
  | 'separator'
  | 'history'
  | 'certificate';

interface BaseNode {
  type: TemplateNodeType;
}

// Layout nodes
interface ColumnsNode extends BaseNode {
  type: 'columns';
  columns: number;
  gap?: number;
  children: TemplateNode[];
}

interface ElementsNode extends BaseNode {
  type: 'elements';
  direction?: 'row' | 'column';
  gap?: number;
  children: TemplateNode[];
}

interface SectionNode extends BaseNode {
  type: 'section';
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: TemplateNode[];
}

// Text nodes
interface TitleNode extends BaseNode {
  type: 'title';
  label: string;
  size?: 'small' | 'medium' | 'large';
}

interface ValueFieldNode extends BaseNode {
  type: 'valueField';
  source: string;      // Field name to read from metadata
  label?: string;
  format?: 'text' | 'date' | 'number' | 'currency';
}

interface FieldNode extends BaseNode {
  type: 'field';
  label: string;
  source: string;
}

// Media nodes
interface ImageNode extends BaseNode {
  type: 'image';
  source: string;      // Library ID or field reference
  alt?: string;
  aspectRatio?: string;
}

interface MainImageNode extends BaseNode {
  type: 'mainImage';
  source: string;
  showBadge?: boolean;
}

interface MultiImageNode extends BaseNode {
  type: 'multiImage';
  source: string;      // Field containing file array
  columns?: number;
  maxImages?: number;
}

interface GalleryNode extends BaseNode {
  type: 'gallery';
  source: string;
  layout?: 'grid' | 'carousel';
}

interface VideoNode extends BaseNode {
  type: 'video';
  source: string;
  autoplay?: boolean;
  controls?: boolean;
}

type TemplateNode =
  | ColumnsNode
  | ElementsNode
  | SectionNode
  | TitleNode
  | SubTitleNode
  | TextNode
  | ValueFieldNode
  | FieldNode
  | ImageNode
  | MainImageNode
  | MultiImageNode
  | CollectionImageNode
  | GalleryNode
  | VideoNode
  | AttachmentsNode
  | SeparatorNode
  | HistoryNode;
```

### Template Container

```typescript
interface TemplateContainer {
  template?: TemplateNode[];           // Default view
  userViewTemplate?: TemplateNode[];   // Simple user view
  certificateTemplate?: TemplateNode[]; // Formal certificate view
  formTemplate?: FormTemplateCategory[]; // Form definition (deprecated)
  languages?: TemplateLanguageConfig[];
  searchField?: string;
}
```

### Parsed Metadata

```typescript
interface ParsedOrigynMetadata {
  metadata: Record<string, MetadataFieldValue | FileReference[] | string>;
  templates: TemplateContainer;
  library: LibraryItem[];
  tokenId: string;
  canisterId: string;
  collectionId?: string;
}

type MetadataFieldValue = string | number | Date | null;

interface LibraryItem {
  library_id: string;
  filename: string;
  location: string;       // Full URL
  content_type: string;
  content_hash: string;
  size: number;
  created_at: string;
}

interface FileReference {
  library_id: string;
  filename: string;
  url: string;
  content_type: string;
}
```

### Render Context

```typescript
interface TemplateRenderContext {
  dataSource: 'preview' | 'onchain';
  canisterId: string;
  tokenId?: string;
  language: string;
  variant: 'default' | 'certificate' | 'information';
  showPlaceholders: boolean;

  // Utility functions
  resolveAssetUrl: (path: string) => string;
  getFieldValue: (fieldName: string) => string | null;
  getFileArray: (pointer: string) => FileReference[];
  getDateValue: (fieldName: string) => Date | null;
}
```

## Metadata Building

### buildOrigynApps (`utils/metadata-builder.ts`)

Constructs ORIGYN-compatible metadata structure from form data.

```typescript
interface BuildOrigynAppsConfig {
  template: TemplateStructure;
  formData: CertificateFormData;
  files: Map<string, FileReference[]>;
  writerPrincipal?: string;
}

function buildOrigynApps(config: BuildOrigynAppsConfig): OrigynAppEntry[] {
  const apps: OrigynAppEntry[] = [];

  // 1. Build metadata app
  apps.push(buildMetadataApp(config));

  // 2. Build template app (all view variants)
  apps.push(buildTemplateApp(config.template, config.formData));

  return apps;
}

function buildMetadataApp(config: BuildOrigynAppsConfig): OrigynAppEntry {
  const { template, formData, files } = config;
  const fields: Record<string, unknown> = {};

  // Convert form data to metadata fields
  for (const section of template.sections) {
    for (const item of section.items) {
      if (item.type === 'input') {
        fields[item.id] = formData[item.id];
      }
      if (item.type === 'image' || item.type === 'video') {
        fields[item.id] = files.get(item.id) || [];
      }
    }
  }

  return {
    path: 'public.metadata',
    value: fields,
  };
}

function buildTemplateApp(
  template: TemplateStructure,
  formData: CertificateFormData
): OrigynAppEntry {
  // Generate ORIGYN template nodes from TemplateStructure
  const defaultView = generateDefaultView(template);
  const certificateView = generateCertificateView(template);
  const informationView = generateInformationView(template);

  return {
    path: 'public.metadata.template',
    value: {
      template: defaultView,
      certificateTemplate: certificateView,
      userViewTemplate: informationView,
    },
  };
}
```

### Library Item Structure

```typescript
interface LibraryItemDef {
  library_id: string;      // Path: "/-/images/filename.png"
  filename: string;
  location_type: 'canister' | 'collection';
  location: string;        // Full URL
  content_type: string;    // MIME type
  content_hash: string;    // SHA-256
  created_at: string;      // ISO timestamp
  size: number;
  sort: string;
  read: 'public' | 'private';
}

// Built during file upload
function buildLibraryItem(file: File, uploadedPath: string, canisterId: string): LibraryItemDef {
  return {
    library_id: uploadedPath,
    filename: file.name,
    location_type: 'canister',
    location: normalizeFileUrl(uploadedPath, canisterId),
    content_type: file.type,
    content_hash: await computeHash(file),
    created_at: new Date().toISOString(),
    size: file.size,
    sort: '0',
    read: 'public',
  };
}
```

## Metadata Parsing

### parseOrigynMetadata (`utils/metadata-parser.ts`)

Extracts structured data from raw ICRC3 values.

```typescript
function parseOrigynMetadata(
  rawMetadata: ICRC3Value,
  tokenId: string,
  canisterId: string
): ParsedOrigynMetadata {
  // 1. Extract metadata fields
  const metadata = extractMetadataFields(rawMetadata);

  // 2. Extract template nodes
  const templates = extractTemplateNodes(rawMetadata);

  // 3. Extract library items
  const library = extractLibraryItems(rawMetadata);

  return {
    metadata,
    templates,
    library,
    tokenId,
    canisterId,
  };
}

function extractValue(value: ICRC3Value): unknown {
  if ('Text' in value) return value.Text;
  if ('Nat' in value) return Number(value.Nat);
  if ('Int' in value) return Number(value.Int);
  if ('Blob' in value) return value.Blob;
  if ('Array' in value) return value.Array.map(extractValue);
  if ('Map' in value) {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of value.Map) {
      obj[key] = extractValue(val);
    }
    return obj;
  }
  return null;
}

function extractMetadataFields(value: ICRC3Value): Record<string, unknown> {
  // Navigate to public.metadata
  const publicMetadata = navigatePath(value, ['public', 'metadata']);
  if (!publicMetadata) return {};

  return extractValue(publicMetadata) as Record<string, unknown>;
}

function extractTemplateNodes(value: ICRC3Value): TemplateContainer {
  // Navigate to public.metadata.template
  const templateValue = navigatePath(value, ['public', 'metadata', 'template']);
  if (!templateValue) return {};

  const container = extractValue(templateValue) as TemplateContainer;
  return {
    template: container.template || [],
    certificateTemplate: container.certificateTemplate || [],
    userViewTemplate: container.userViewTemplate || [],
  };
}

function extractLibraryItems(value: ICRC3Value): LibraryItem[] {
  const libraryValue = navigatePath(value, ['library']);
  if (!libraryValue || !('Array' in libraryValue)) return [];

  return libraryValue.Array.map(extractValue) as LibraryItem[];
}
```

## ICRC3 Conversion

### convertToIcrc3Metadata (`utils/icrc3-converter.ts`)

Converts form data and template to ICRC3 metadata format.

```typescript
function convertToIcrc3Metadata(
  origynApps: OrigynAppEntry[]
): Array<[string, ICRC3Value]> {
  const result: Array<[string, ICRC3Value]> = [];

  for (const app of origynApps) {
    const icrc3Value = convertValueToIcrc3(app.value);
    result.push([app.path, icrc3Value]);
  }

  return result;
}

function convertValueToIcrc3(value: unknown): ICRC3Value {
  if (typeof value === 'string') {
    return { Text: value };
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { Nat: BigInt(value) }
      : { Text: value.toString() };
  }
  if (value instanceof Date) {
    return { Nat: BigInt(value.getTime() * 1_000_000) }; // Nanoseconds
  }
  if (Array.isArray(value)) {
    return { Array: value.map(convertValueToIcrc3) };
  }
  if (typeof value === 'object' && value !== null) {
    const entries: Array<[string, ICRC3Value]> = Object.entries(value).map(
      ([k, v]) => [k, convertValueToIcrc3(v)]
    );
    return { Map: entries };
  }
  return { Text: '' };
}
```

## View Generation

### generateDefaultView (`utils/view-generator.ts`)

Converts TemplateStructure to ORIGYN TemplateNode[].

```typescript
function generateDefaultView(template: TemplateStructure): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  for (const section of template.sections) {
    if (section.name === 'Certificate') {
      nodes.push(...generateCertificateSectionNodes(section));
    } else {
      nodes.push(...generateInformationSectionNodes(section));
    }
  }

  return nodes;
}

function generateCertificateSectionNodes(section: TemplateSection): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  for (const item of section.items) {
    switch (item.type) {
      case 'title':
        nodes.push({
          type: 'title',
          label: item.label,
          size: item.size,
        });
        break;

      case 'input':
        nodes.push({
          type: 'valueField',
          source: item.id,
          label: item.label,
        });
        break;

      case 'image':
        nodes.push(
          item.multiple
            ? { type: 'multiImage', source: item.id }
            : { type: 'mainImage', source: item.id }
        );
        break;

      case 'badge':
        nodes.push({
          type: 'text',
          content: item.value,
        });
        break;
    }
  }

  return nodes;
}
```

## Template Rendering

### TemplateRenderer Component

```typescript
interface TemplateRendererProps {
  data: ParsedOrigynMetadata;
  variant?: 'default' | 'certificate' | 'information';
  language?: string;
}

function TemplateRenderer({
  data,
  variant = 'default',
  language = 'en',
}: TemplateRendererProps) {
  // Select template variant
  const nodes = useMemo(() => {
    switch (variant) {
      case 'certificate':
        return data.templates.certificateTemplate || [];
      case 'information':
        return data.templates.userViewTemplate || [];
      default:
        return data.templates.template || [];
    }
  }, [data, variant]);

  // Build render context
  const context: TemplateRenderContext = useMemo(() => ({
    dataSource: 'onchain',
    canisterId: data.canisterId,
    tokenId: data.tokenId,
    language,
    variant,
    showPlaceholders: false,

    resolveAssetUrl: (path) => resolveAssetUrl(path, data.canisterId, data.library),
    getFieldValue: (fieldName) => getFieldFromMetadata(data.metadata, fieldName),
    getFileArray: (pointer) => getFilesFromMetadata(data.metadata, data.library, pointer),
    getDateValue: (fieldName) => getDateFromMetadata(data.metadata, fieldName),
  }), [data, language, variant]);

  return (
    <TemplateContext.Provider value={context}>
      <div className={variantStyles[variant]}>
        {nodes.map((node, index) => (
          <TemplateBlock key={index} node={node} />
        ))}
      </div>
    </TemplateContext.Provider>
  );
}
```

### TemplateBlock (Recursive Renderer)

```typescript
interface TemplateBlockProps {
  node: TemplateNode;
}

function TemplateBlock({ node }: TemplateBlockProps) {
  switch (node.type) {
    case 'columns':
      return <ColumnsNode node={node} />;
    case 'elements':
      return <ElementsNode node={node} />;
    case 'section':
      return <SectionNode node={node} />;
    case 'title':
      return <TitleNode node={node} />;
    case 'subTitle':
      return <SubTitleNode node={node} />;
    case 'text':
      return <TextNode node={node} />;
    case 'valueField':
      return <ValueFieldNode node={node} />;
    case 'field':
      return <FieldNode node={node} />;
    case 'image':
      return <ImageNode node={node} />;
    case 'mainImage':
      return <MainImageNode node={node} />;
    case 'multiImage':
      return <MultiImageNode node={node} />;
    case 'gallery':
      return <GalleryNode node={node} />;
    case 'video':
      return <VideoNode node={node} />;
    case 'attachments':
      return <AttachmentsNode node={node} />;
    case 'separator':
      return <SeparatorNode node={node} />;
    case 'history':
      return <HistoryNode node={node} />;
    default:
      console.warn(`Unknown node type: ${(node as BaseNode).type}`);
      return null;
  }
}
```

## URL Resolution

### resolveAssetUrl (`utils/url-resolver.ts`)

```typescript
function resolveAssetUrl(
  path: string,
  canisterId: string,
  library: LibraryItem[]
): string {
  // 1. Check if it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return normalizeExistingUrl(path);
  }

  // 2. Look up in library by library_id
  const libraryItem = library.find((item) => item.library_id === path);
  if (libraryItem) {
    return libraryItem.location;
  }

  // 3. Build URL from path
  const icHost = import.meta.env.VITE_IC_HOST || 'https://ic0.app';

  if (icHost.includes('localhost') || icHost.includes('127.0.0.1')) {
    return `http://127.0.0.1:8000/?canisterId=${canisterId}/-${path}`;
  }

  return `https://${canisterId}.raw.icp0.io/-${path}`;
}

function normalizeExistingUrl(url: string): string {
  // Ensure .raw.icp0.io for direct asset access
  if (url.includes('.icp0.io') && !url.includes('.raw.icp0.io')) {
    return url.replace('.icp0.io', '.raw.icp0.io');
  }
  return url;
}
```

## Integration Points

### With Certificates Feature

- `parseOrigynMetadata()` used by `useCertificate` hook
- `TemplateRenderer` renders certificate views
- `buildOrigynApps()` used during minting

### With Templates Feature

- `view-generator.ts` converts TemplateStructure to TemplateNode[]
- Background configuration applied during rendering
- Multi-language support via context

## Known Issues / TODOs

1. **Missing Node Types**: Some ORIGYN node types may not have renderers yet. Fallback to null with console warning.

2. **Performance**: Large metadata parsing on every render. Consider memoization.

3. **Asset Caching**: URLs resolved but no client-side caching. Browser cache handles this.

4. **Preview Mode**: Preview rendering with local files works but URL handling differs from on-chain.

5. **Responsive Images**: Image nodes don't yet support responsive loading or lazy loading.

## Related Documentation

- [Templates Feature](../../templates/docs/README.md)
- [Certificates Feature](../../certificates/docs/README.md)
- [Data Flows](../../../../docs/DATA-FLOWS.md)
