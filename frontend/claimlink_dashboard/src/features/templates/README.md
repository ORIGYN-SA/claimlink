# Templates Feature

## Overview
The Templates feature allows users to create, manage, and use certificate templates. Templates define the structure and layout for certificate forms and rendering.

## Structure

```
features/templates/
├── api/
│   ├── templates.service.ts      # Template CRUD operations
│   └── templates.queries.ts      # React Query hooks
├── atoms/
│   ├── template-editor.atom.ts   # Editor state management
│   └── template-filters.atom.ts  # List filtering state
├── components/
│   ├── create/                   # Template creation wizard
│   │   ├── choose-template-step.tsx
│   │   ├── choose-background-step.tsx
│   │   ├── upload-background-step.tsx
│   │   ├── edit-template-step-v2.tsx
│   │   └── preview-deploy-step.tsx
│   ├── template-card.tsx         # Template card display
│   ├── template-section-card.tsx # Section editor card
│   └── template-item-row.tsx     # Field editor row
├── pages/
│   ├── templates-page.tsx        # Template list page
│   ├── new-template-page.tsx     # Create template page
│   └── edit-template-page.tsx    # Edit template page
├── types/
│   └── template.types.ts         # TypeScript type definitions
├── utils/
│   ├── template-serializer.ts    # Serialize/deserialize for ORIGYN storage
│   ├── template-tree-utils.ts    # Tree manipulation utilities
│   ├── template-compat.ts        # Compatibility layer (legacy ↔ tree)
│   ├── template-validation.ts    # Validation and semantic field detection
│   ├── template-utils.ts         # General utilities
│   └── simple-mode-constraints.ts # Simple mode validation
├── docs/
│   └── TEMPLATE_STRUCTURE.md     # Template format documentation
├── index.ts                      # Feature exports
└── README.md                     # This file
```

## Template Formats

The system supports two template formats with a compatibility layer:

### TemplateStructure (Legacy Format)
Form-oriented structure with sections and items:
```typescript
interface TemplateStructure {
  sections: TemplateSection[];
  languages?: TemplateLanguage[];
  searchIndexField?: string;
  background?: TemplateBackground;
}

interface TemplateSection {
  id: string;
  name: string;
  items: TemplateItem[];
  order: number;
}
```

### TemplateNode[] (ORIGYN Tree Format)
Rendering-oriented tree structure:
```typescript
type TemplateNode =
  | RootNode      // Top-level container
  | SectionNode   // Grouping container
  | FieldNode     // Label + value field
  | TitleNode     // Heading text
  | ImageNode     // Single image
  | GalleryNode   // Multiple images
  | VideoNode     // Video element
  | ValueFieldNode // Text block
  // ... and more
```

## Key Utilities

### Tree Manipulation (`template-tree-utils.ts`)
```typescript
// Finding nodes
findNodeById(nodes, id)          // Find by ID
findNodesByType(nodes, 'field')  // Find all of type
getSectionNodes(nodes)           // Get all sections

// Modifying tree (immutable operations)
addNode(nodes, parentId, newNode)
removeNode(nodes, nodeId)
updateNode(nodes, nodeId, updates)
moveNode(nodes, nodeId, newParentId, index)
reorderChildren(nodes, parentId, newOrder)

// Field extraction
getAllFieldIds(nodes)            // For validation
extractFormFields(nodes)         // For form generation

// Creation helpers
createRootNode()
createSectionNode(id, title)
generateNodeId()
toLocalizedContent(text, languages)
```

### Compatibility Layer (`template-compat.ts`)
```typescript
// Format detection
getTemplateFormat(template)      // Returns 'tree' | 'structure' | 'empty'
hasTreeFormat(template)
hasStructureFormat(template)

// Conversion
convertStructureToTree(structure)
ensureTreeFormat(template)

// Unified access (works with either format)
getUnifiedSections(template)
getUnifiedLanguages(template)
getUnifiedSearchIndexField(template)
```

### Simple Mode Constraints (`simple-mode-constraints.ts`)
```typescript
// Validation
isValidSimpleModeTemplate(nodes)
getSimpleModeWarnings(nodes)

// Allowed sections in simple mode
SIMPLE_MODE_SECTIONS = ['certificate', 'information']

// Node creation
createSimpleFieldNode(id, label, options)
createSimpleTitleNode(title)
createSimpleImageNode(id)
```

## Multi-Language Support

Templates support multiple languages:

```typescript
// Define languages in RootNode or TemplateStructure
languages: [
  { code: 'en', name: 'English' },
  { code: 'RU', name: 'Russian' }
]

// Localized content in nodes
title: { en: 'Certificate Name', RU: 'Название сертификата' }
```

Form fields can store `LocalizedValue` objects:
```typescript
{ en: "English text", RU: "Русский текст" }
```

## Template Storage Flow

1. **Collection Creation**
   - User creates/selects template
   - Template stored in collection's `collection_metadata` as JSON
   - Uses `serializeTemplateForOrigyn()` or `serializeTreeForOrigyn()`

2. **Certificate Creation**
   - Template auto-loaded from collection via `useCollectionTemplate()`
   - `DynamicTemplateForm` renders form from template
   - Form data converted to ICRC3 metadata via `convertToIcrc3Metadata()`

3. **Certificate Viewing**
   - Template fetched from collection
   - `TemplateRenderer` renders certificate from TemplateNode[]
   - Language toggle available when multiple languages defined

## Usage Examples

### Creating a Template Programmatically
```typescript
import { createRootNode, createSectionNode, createSimpleFieldNode } from '@/features/templates';

const template: TemplateNode[] = [
  {
    ...createRootNode(),
    languages: [{ key: 'en', name: 'English' }],
    content: [
      {
        ...createSectionNode('main', { en: 'Certificate Details' }),
        content: [
          createSimpleFieldNode('name', { en: 'Name' }),
          createSimpleImageNode('image'),
        ]
      }
    ]
  }
];
```

### Working with Either Format
```typescript
import { getUnifiedSections, ensureTreeFormat } from '@/features/templates';

// Works with either format
const sections = getUnifiedSections(template);

// Convert to tree format if needed
const treeTemplate = ensureTreeFormat(template);
```

## Components

### Edit Template Step (Simple Mode)
The template editor (`edit-template-step-v2.tsx`) provides:
- Section management (add/remove/reorder)
- Field management within sections
- Semantic field presets (name, description, image, etc.)
- Simple/Advanced mode toggle (Advanced mode coming soon)

### Preview Deploy Step
Shows template preview with:
- Language toggle for multi-language templates
- Certificate preview with mock data
- Background preview (standard or custom)

## Exports

Key exports from `index.ts`:
```typescript
// Pages
export { TemplatesPage, NewTemplatePage, EditTemplatePage }

// Components
export { TemplateCard, TemplateSectionCard, TemplateItemRow }
export { ChooseTemplateStep, EditTemplateStepV2, PreviewDeployStep, ... }

// API
export { TemplateService, useMyTemplates, useTemplate, ... }

// Utilities
export { serializeTemplateForOrigyn, deserializeTemplateFromOrigyn, ... }
export { findNodeById, addNode, removeNode, ... }
export { getTemplateFormat, convertStructureToTree, ... }
export { isValidSimpleModeTemplate, createSimpleModeTemplate, ... }

// Types
export type { Template, TemplateNode, TemplateStructure, ... }
```
