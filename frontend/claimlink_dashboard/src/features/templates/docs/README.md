# Templates Feature

The templates feature handles the creation, storage, and management of certificate templates that define the form structure and rendering layout.

## Purpose

- Create and edit template structures for certificate forms
- Store templates in dual format (ClaimLink + ORIGYN)
- Serialize/deserialize templates for on-chain storage
- Manage template backgrounds (standard and custom)

## File Structure

```
templates/
├── api/
│   ├── templates.service.ts       # CRUD operations
│   └── templates.queries.ts       # React Query hooks
├── components/
│   ├── create/
│   │   ├── edit-template-step-v2.tsx      # Main editor step
│   │   ├── choose-background-step.tsx     # Background selection
│   │   ├── upload-background-step.tsx     # Custom background upload
│   │   └── template-preview-step.tsx      # Preview step
│   ├── form/
│   │   ├── template-item-editor.tsx       # Item editing
│   │   └── sortable-template-item-row.tsx # Drag-drop reordering
│   ├── template-card.tsx                  # List item display
│   ├── template-section-card.tsx          # Section display
│   └── templates-grid.tsx                 # Grid layout
├── pages/
│   ├── templates-page.tsx                 # List view
│   ├── new-template-page.tsx              # Creation wizard
│   └── edit-template-page.tsx             # Edit page
├── atoms/
│   ├── template-editor.atom.ts            # Editor state
│   └── template-filters.atom.ts           # Filter state
├── types/
│   └── template.types.ts                  # Type definitions
└── utils/
    ├── template-serializer.ts             # Serialize for ORIGYN
    └── template-utils.ts                  # Helper functions
```

## Dual Format System

Templates exist in two formats that serve different purposes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TemplateStructure (ClaimLink Format)                      │
│                                                                             │
│  Purpose: Define form structure for certificate creation                    │
│  Storage: ClaimLink canister + ORIGYN collection metadata                   │
│  Used by: Dynamic form rendering, template editor                           │
│                                                                             │
│  {                                                                          │
│    sections: [                                                              │
│      { name: 'Certificate', items: [InputItem, ImageItem, ...] },           │
│      { name: 'Information', items: [InputItem, InputItem, ...] }            │
│    ],                                                                       │
│    languages: [{ code: 'en', name: 'English' }],                            │
│    background: { type: 'standard', value: 'light' }                         │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ view-generator.ts
                                   │ (converts during minting)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TemplateNode[] (ORIGYN Format)                            │
│                                                                             │
│  Purpose: Define rendering layout for certificate display                   │
│  Storage: Certificate metadata (public.metadata.template)                   │
│  Used by: Template renderer during certificate viewing                      │
│                                                                             │
│  [                                                                          │
│    { type: 'columns', children: [                                           │
│      { type: 'title', label: 'Certificate Title' },                        │
│      { type: 'image', source: 'mainImage' },                                │
│      { type: 'valueField', source: 'description' }                          │
│    ]}                                                                       │
│  ]                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Template Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TEMPLATE BUILDER UI                                     │
│                                                                             │
│  User adds sections, items, configures fields                               │
│  ├─ Add/remove sections                                                     │
│  ├─ Add/remove items (inputs, images, badges, etc.)                        │
│  ├─ Drag-drop reorder                                                       │
│  ├─ Configure validation (required, min/max)                               │
│  └─ Set background (standard or custom upload)                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SAVE TEMPLATE                                           │
│                                                                             │
│  TemplateStructure → JSON string                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  {                                                                    │ │
│  │    name: "Gold Certificate",                                          │ │
│  │    description: "Template for gold certificates",                     │ │
│  │    category: "precious_metals",                                       │ │
│  │    structure: TemplateStructure,                                      │ │
│  │    metadata: { version: "1.0", createdBy: "xxx-xxx" }                 │ │
│  │  }                                                                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
          ┌────────────────────────┴────────────────────────┐
          │                                                 │
          ▼                                                 ▼
┌─────────────────────────┐                  ┌─────────────────────────┐
│  CLAIMLINK CANISTER     │                  │  ORIGYN COLLECTION      │
│                         │                  │  (when assigned)        │
│  BackendTemplate {      │                  │                         │
│    template_id: bigint, │                  │  serializeTemplateFor-  │
│    template_json: str   │                  │  Origyn(structure)      │
│  }                      │                  │         │               │
│                         │                  │         ▼               │
│  Used for:              │                  │  ["claimlink.template.  │
│  - Template listing     │                  │   structure",           │
│  - Template editing     │                  │   { Text: JSON }]       │
│  - Admin management     │                  │                         │
└─────────────────────────┘                  │  Used for:              │
                                             │  - Certificate creation │
                                             │  - Form rendering       │
                                             └─────────────────────────┘
```

### Template Retrieval (During Certificate Creation)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE CREATION PAGE                               │
│                                                                             │
│  User selects collection to mint into                                       │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      useCollectionTemplate HOOK                              │
│                                                                             │
│  1. Fetch collection metadata (icrc7_collection_metadata)                   │
│  2. Extract template key: "claimlink.template.structure"                    │
│  3. Parse JSON → TemplateStructure                                          │
│                                                                             │
│  deserializeTemplateFromOrigyn(collectionMetadata)                          │
│  ├─ Find key "claimlink.template.structure"                                │
│  ├─ Extract Text value                                                      │
│  └─ JSON.parse() → TemplateStructure                                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RENDER DYNAMIC FORM                                     │
│                                                                             │
│  DynamicTemplateForm receives TemplateStructure                             │
│  ├─ Iterate sections                                                        │
│  ├─ Render items based on type                                              │
│  └─ Apply validation rules                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### TemplateStructure (`types/template.types.ts`)

```typescript
interface TemplateStructure {
  sections: TemplateSection[];
  languages: TemplateLanguage[];
  translations?: TemplateTranslations;
  searchIndexField?: string;
  background?: TemplateBackground;
  metadata?: {
    version: string;
    createdBy: string;
    lastModified: string;
    certificateCount?: number;
  };
}

interface TemplateSection {
  id: string;
  name: 'Certificate' | 'Information';
  order: number;
  items: TemplateItem[];
  collapsible?: boolean;
}
```

### Template Items

```typescript
type TemplateItem =
  | TitleItem
  | InputItem
  | BadgeItem
  | ImageItem
  | VideoItem
  | ReadonlyItem;

interface BaseItem {
  id: string;
  order: number;
}

interface TitleItem extends BaseItem {
  type: 'title';
  label: string;
  size?: 'small' | 'medium' | 'large';
}

interface InputItem extends BaseItem {
  type: 'input';
  inputType: 'text' | 'number' | 'textarea' | 'email' | 'url' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface BadgeItem extends BaseItem {
  type: 'badge';
  label: string;
  value: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface ImageItem extends BaseItem {
  type: 'image';
  label: string;
  required?: boolean;
  multiple?: boolean;
  maxCount?: number;
  acceptedTypes?: string[];
  maxSizeMb?: number;
}

interface VideoItem extends BaseItem {
  type: 'video';
  label: string;
  required?: boolean;
  maxSizeMb?: number;
}

interface ReadonlyItem extends BaseItem {
  type: 'readonly';
  label: string;
  value: string;
}
```

### Background Configuration

```typescript
interface TemplateBackground {
  type: 'standard' | 'custom';
  value?: string;           // For standard: preset name
  dataUri?: string;         // For custom: base64 data URI
  mediaType?: 'image' | 'video';
}

// Standard backgrounds
const STANDARD_BACKGROUNDS = [
  { id: 'light', name: 'Light', preview: '...' },
  { id: 'dark', name: 'Dark', preview: '...' },
  { id: 'gradient', name: 'Gradient', preview: '...' },
];
```

### Backend Storage

```typescript
interface BackendTemplate {
  template_id: bigint;
  template_json: string;  // JSON.stringify(TemplateJsonPayload)
}

interface TemplateJsonPayload {
  name: string;
  description: string;
  category: string;
  structure: TemplateStructure;
  metadata: {
    version: string;
    createdBy: string;
    lastModified: string;
  };
  thumbnail?: string;  // Data URI for preview
}
```

## Service Layer

### Template Serialization (`utils/template-serializer.ts`)

```typescript
const TEMPLATE_STORAGE_KEY = 'claimlink.template.structure';

/**
 * Serialize template for ORIGYN collection metadata storage
 */
export function serializeTemplateForOrigyn(
  template: TemplateStructure
): [string, { Text: string }] {
  return [
    TEMPLATE_STORAGE_KEY,
    { Text: JSON.stringify(template) }
  ];
}

/**
 * Deserialize template from ORIGYN collection metadata
 */
export function deserializeTemplateFromOrigyn(
  metadata: ICRC3Value
): TemplateStructure | null {
  // Navigate metadata structure to find key
  const templateValue = findMetadataValue(metadata, TEMPLATE_STORAGE_KEY);

  if (!templateValue || !('Text' in templateValue)) {
    return null;
  }

  try {
    return JSON.parse(templateValue.Text) as TemplateStructure;
  } catch {
    console.error('Failed to parse template structure');
    return null;
  }
}

/**
 * Check if metadata contains a template structure
 */
export function hasTemplateStructure(metadata: ICRC3Value): boolean {
  const value = findMetadataValue(metadata, TEMPLATE_STORAGE_KEY);
  return value !== null && 'Text' in value;
}
```

### TemplatesService (`api/templates.service.ts`)

| Method | Purpose | Returns |
|--------|---------|---------|
| `getTemplates(agent)` | List all templates | `BackendTemplate[]` |
| `getTemplate(agent, templateId)` | Get single template | `BackendTemplate` |
| `createTemplate(agent, payload)` | Create new template | `{ template_id: bigint }` |
| `updateTemplate(agent, templateId, payload)` | Update template | `void` |
| `deleteTemplate(agent, templateId)` | Delete template | `void` |

## React Query Hooks

### Query Hooks (`api/templates.queries.ts`)

```typescript
// Key factory
export const templatesKeys = {
  all: ['templates'] as const,
  lists: () => [...templatesKeys.all, 'list'] as const,
  detail: (id: string) => [...templatesKeys.all, 'detail', id] as const,
};

// Hooks
useTemplates()                    // List all templates
useTemplate(templateId)           // Single template
useCollectionTemplate(collectionId)  // Template from collection
```

### Mutation Hooks

```typescript
useCreateTemplate()               // Create new template
useUpdateTemplate()               // Update existing
useDeleteTemplate()               // Delete template
useSetCollectionTemplate()        // Store in collection metadata
```

## State Management

### Editor Atom (`atoms/template-editor.atom.ts`)

```typescript
interface EditorState {
  step: number;
  template: TemplateStructure | null;
  activeSection: string | null;
  activeItem: string | null;
  isDirty: boolean;
  error: string | null;
}

// Actions
type EditorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_TEMPLATE'; template: TemplateStructure }
  | { type: 'ADD_SECTION'; section: TemplateSection }
  | { type: 'REMOVE_SECTION'; sectionId: string }
  | { type: 'ADD_ITEM'; sectionId: string; item: TemplateItem }
  | { type: 'UPDATE_ITEM'; sectionId: string; item: TemplateItem }
  | { type: 'REMOVE_ITEM'; sectionId: string; itemId: string }
  | { type: 'REORDER_ITEMS'; sectionId: string; itemIds: string[] }
  | { type: 'SET_BACKGROUND'; background: TemplateBackground }
  | { type: 'SET_DIRTY'; isDirty: boolean }
  | { type: 'RESET' };
```

## Integration Points

### With Collections Feature

- Templates are assigned to collections
- `useSetCollectionTemplate()` stores template in collection metadata
- `useCollectionTemplate()` retrieves template from collection

### With Certificates Feature

- Template defines form structure for certificate creation
- `DynamicTemplateForm` renders from `TemplateStructure`
- Form data maps to template item IDs

### With Template Renderer Feature

- `view-generator.ts` converts `TemplateStructure` → `TemplateNode[]`
- ORIGYN nodes are stored in certificate metadata during minting
- Renderer displays certificates using these nodes

## Known Issues / TODOs

1. **Template Permission**: Storing templates in collection metadata requires `update_collection_metadata` permission. Backend change needed to grant this during collection creation.

2. **Background Size Limit**: Custom backgrounds stored as data URIs. Max ~1.5MB to fit within 2MB template limit.

3. **Version Migration**: No automatic migration for templates when structure changes. Old templates may not render correctly.

4. **Validation Sync**: Template validation rules don't automatically propagate to existing certificates.

5. **Multi-language Support**: Language configuration exists but translations UI is incomplete.

## Usage Examples

### Creating a Template

```typescript
function TemplateBuilder() {
  const [template, setTemplate] = useState<TemplateStructure>(initialTemplate);
  const createMutation = useCreateTemplate();

  const handleSave = async () => {
    await createMutation.mutateAsync({
      name: 'Gold Certificate',
      description: 'Template for gold certificates',
      category: 'precious_metals',
      structure: template,
    });
  };

  return (
    <TemplateEditor
      template={template}
      onChange={setTemplate}
      onSave={handleSave}
    />
  );
}
```

### Assigning Template to Collection

```typescript
function CollectionForm({ collectionId }: Props) {
  const setTemplateMutation = useSetCollectionTemplate();

  const handleAssignTemplate = async (template: TemplateStructure) => {
    await setTemplateMutation.mutateAsync({
      collectionId,
      template,
    });
  };

  // ...
}
```

### Retrieving Template for Form

```typescript
function MintCertificatePage() {
  const { collectionId } = Route.useParams();
  const { data: template, isLoading } = useCollectionTemplate(collectionId);

  if (isLoading) return <Spinner />;
  if (!template) return <NoTemplateAssigned />;

  return (
    <DynamicTemplateForm template={template} onSubmit={handleMint} />
  );
}
```

## Related Documentation

- [Template Renderer Feature](../../template-renderer/docs/README.md)
- [Certificates Feature](../../certificates/docs/README.md)
- [Collections Feature](../../collections/docs/README.md)
