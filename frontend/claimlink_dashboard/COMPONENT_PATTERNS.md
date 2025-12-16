# Component Patterns Guide

This document defines the component organization patterns for the ClaimLink dashboard. Following these patterns ensures consistency, maintainability, and optimal developer experience.

## Component Philosophy: Generic vs Feature UI

### Generic UI Components (`src/components/ui/`)

**Purpose**: Truly reusable UI primitives used across any feature.

**Rules**:
- [ ] Never import Jotai atoms
- [ ] Never import feature-specific types
- [ ] Fully controlled via props
- [ ] No business logic or side effects
- [ ] No direct canister calls or service layer usage
- [ ] Reusable across any feature without modification

**Examples**:
```typescript
// ✅ GOOD - Generic, reusable
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>...</DialogContent>
</Dialog>

<Card className="p-6">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Available Generic Components** (from shadcn/ui):
- Button, Input, Select, Checkbox, Radio, Switch
- Dialog, Sheet, Popover, Dropdown Menu, Tooltip
- Card, Tabs, Accordion, Separator
- Table, Avatar, Badge, Progress
- Alert, Toast (via Sonner)

**When to Create a New Generic Component**:
1. Check if shadcn/ui has it first
2. If extending shadcn component, use `className` prop
3. Only create if truly reusable across multiple features
4. Document in this guide after creation

---

### Feature Components (`features/[feature]/components/`)

**Purpose**: Feature-specific UI that implements business logic and state management.

**Rules**:
- [ ] **CAN** directly use Jotai atoms (no prop drilling)
- [ ] **CAN** use TanStack Query hooks
- [ ] **CAN** have side effects (useEffect for cleanup, subscriptions)
- [ ] **CAN** call service layer methods
- [ ] **SHOULD** use atoms for cross-component state
- [ ] **SHOULD NOT** call canister methods directly (use service layer)
- [ ] Extract sub-components only if JSX > 300 lines or component is reused

**Component Splitting Strategy**:

**DO NOT split components immediately**. Follow this approach:

1. **First**: Migrate state to atomWithReducer (if complex workflow)
2. **Then**: Keep UI in the same file initially
3. **Only extract** sub-components if:
   - JSX becomes unreadable (>300 lines)
   - Component is reused across multiple places
   - Component has distinct, isolated responsibility

**Examples**:

```typescript
// ✅ GOOD - Feature component using atoms directly
import { useAtom } from 'jotai';
import { templateEditorAtom } from '../atoms/template-editor.atom';

export function EditTemplateStepV2() {
  const [state, dispatch] = useAtom(templateEditorAtom);

  // Direct atom usage - no prop drilling needed
  const handleAddSection = () => {
    dispatch({ type: 'ADD_SECTION', section: newSection });
  };

  return (
    <div>
      {state.sections.map(section => (
        <SectionCard key={section.id} section={section} />
      ))}
    </div>
  );
}

// ✅ GOOD - Feature component using TanStack Query
import { useTemplates } from '../api/templates.queries';

export function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) return <LoadingSpinner />;

  return <TemplateGrid templates={templates} />;
}

// ❌ BAD - Calling canister directly (skip service layer)
import { Actor } from '@dfinity/agent';
import { idlFactory } from '@services/origyn_nft/idlFactory';

export function BadComponent() {
  const mintNFT = async () => {
    const actor = Actor.createActor(idlFactory, { agent, canisterId });
    await actor.mint_nft(data); // ❌ Direct canister call
  };

  return <button onClick={mintNFT}>Mint</button>;
}
```

---

### Route Components (`routes/[feature]/index.tsx`)

**Purpose**: Entry points for TanStack Router with data loading and route configuration.

**Rules**:
- [ ] Handles URL params via TanStack Router
- [ ] Defines loaders for initial data fetch
- [ ] Renders the main feature component
- [ ] Sets up breadcrumbs, page metadata
- [ ] Wraps with `DashboardLayout`

**Example**:
```typescript
// routes/templates/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TemplatesPage } from '@/features/templates';

export const Route = createFileRoute('/templates')({
  component: TemplatesRoute,
});

function TemplatesRoute() {
  return (
    <DashboardLayout>
      <TemplatesPage />
    </DashboardLayout>
  );
}
```

---

## State Management Patterns

### Layer 1: UI State (Local Component State)

**Use for**: UI-only concerns that don't affect other components.

**Examples**:
- Modal open/close state
- Hover states
- Form input values (if not persisting)
- Dropdown expanded state

```typescript
const [isOpen, setIsOpen] = useState(false);
const [hoveredId, setHoveredId] = useState<string | null>(null);
```

---

### Layer 2: Feature State (Jotai Atoms)

**Use for**: Feature-level state that crosses component boundaries.

**Pattern 1: Simple Atoms** (for filters, settings, UI preferences)
```typescript
// features/templates/atoms/template-filters.atom.ts
import { atom } from 'jotai';

interface TemplateFiltersState {
  search: string;
  filterType: 'all' | 'certificate' | 'nft';
  pagination: { page: number; limit: number };
  view: 'grid' | 'list';
}

const initialState: TemplateFiltersState = {
  search: '',
  filterType: 'all',
  pagination: { page: 1, limit: 12 },
  view: 'grid',
};

export const templateFiltersAtom = atom<TemplateFiltersState>(initialState);
```

**Pattern 2: atomWithReducer** (for complex workflows)
```typescript
// features/templates/atoms/template-editor.atom.ts
import { atomWithReducer } from 'jotai/utils';

interface TemplateEditorState {
  step: 'info' | 'sections' | 'preview';
  template: Template | null;
  selectedSection: string | null;
  modals: {
    addSection: boolean;
    editSection: boolean;
    addField: boolean;
    editField: boolean;
  };
  selectedFieldForEdit: FieldConfig | null;
}

type TemplateEditorAction =
  | { type: 'SET_TEMPLATE'; template: Template }
  | { type: 'OPEN_ADD_SECTION_MODAL' }
  | { type: 'CLOSE_ADD_SECTION_MODAL' }
  | { type: 'SELECT_SECTION'; sectionId: string }
  | { type: 'ADD_FIELD'; field: FieldConfig };

const initialState: TemplateEditorState = {
  step: 'info',
  template: null,
  selectedSection: null,
  modals: {
    addSection: false,
    editSection: false,
    addField: false,
    editField: false,
  },
  selectedFieldForEdit: null,
};

function reducer(
  state: TemplateEditorState,
  action: TemplateEditorAction
): TemplateEditorState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action.template };
    case 'OPEN_ADD_SECTION_MODAL':
      return { ...state, modals: { ...state.modals, addSection: true } };
    case 'CLOSE_ADD_SECTION_MODAL':
      return { ...state, modals: { ...state.modals, addSection: false } };
    case 'SELECT_SECTION':
      return { ...state, selectedSection: action.sectionId };
    case 'ADD_FIELD':
      // Complex state update logic
      return state;
    default:
      return state;
  }
}

export const templateEditorAtom = atomWithReducer(initialState, reducer);

// Utility function to get initial state (for resets)
export function getInitialTemplateEditorState(): TemplateEditorState {
  return initialState;
}
```

**Usage in Components**:
```typescript
import { useAtom } from 'jotai';
import { templateEditorAtom } from '../atoms/template-editor.atom';

export function EditTemplateStepV2() {
  const [state, dispatch] = useAtom(templateEditorAtom);

  const handleOpenAddSection = () => {
    dispatch({ type: 'OPEN_ADD_SECTION_MODAL' });
  };

  return (
    <div>
      <Button onClick={handleOpenAddSection}>Add Section</Button>

      <Dialog open={state.modals.addSection}>
        <DialogContent>...</DialogContent>
      </Dialog>
    </div>
  );
}
```

---

### Layer 3: Server State (TanStack Query)

**Use for**: ALL server/canister data fetching and mutations.

**Query Pattern**:
```typescript
// features/templates/api/templates.queries.ts
import { useQuery } from '@tanstack/react-query';
import { TemplateService } from './templates.service';

// Query keys factory
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: string) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Query hook
export const useTemplates = (filters?: TemplateFilters) => {
  return useQuery({
    queryKey: templateKeys.list(JSON.stringify(filters)),
    queryFn: () => TemplateService.fetchTemplates(filters),
  });
};

export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => TemplateService.fetchTemplate(id),
    enabled: !!id,
  });
};
```

**Mutation Pattern**:
```typescript
// features/templates/api/templates.queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateService } from './templates.service';

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateInput) =>
      TemplateService.createTemplate(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateInput }) =>
      TemplateService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific template and list
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
};
```

---

## Form Handling with TanStack Form

### DO NOT sync form state to atoms unless persisting drafts

**✅ GOOD PATTERN - Form manages its own state**:
```typescript
import { useForm } from '@tanstack/react-form';
import { useAtom } from 'jotai';
import { campaignCreatorAtom } from '../atoms/campaign-creator.atom';

function CreateCampaignForm() {
  const [, dispatch] = useAtom(campaignCreatorAtom);
  const navigate = useNavigate();
  const createMutation = useCreateCampaign();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
    },
    onSubmit: async ({ value }) => {
      // Only update atom on submission
      dispatch({ type: 'SUBMIT_CAMPAIGN', value });
      await createMutation.mutateAsync(value);
      navigate('/campaigns');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            value.length === 0 ? 'Required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label>Title</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <Button type="submit" disabled={!form.state.isValid}>
        Submit
      </Button>
    </form>
  );
}
```

**❌ ANTI-PATTERN - Do NOT do this**:
```typescript
// DO NOT sync form validation state via useEffect
useEffect(() => {
  dispatch({ type: 'SET_FORM_STATE', value: form.state });
}, [form.state.isValid]); // ❌ Causes double renders and complexity
```

**Form Validators** (`shared/utils/form/validators/`):
```typescript
// shared/utils/form/validators/is-valid-principal.ts
export function isValidPrincipal(value: string): string | undefined {
  try {
    Principal.fromText(value);
    return undefined;
  } catch {
    return 'Invalid principal ID';
  }
}

// shared/utils/form/validators/is-amount-greater-than-zero.ts
export function isAmountGreaterThanZero(value: string): string | undefined {
  const amount = parseFloat(value);
  if (isNaN(amount) || amount <= 0) {
    return 'Amount must be greater than 0';
  }
  return undefined;
}
```

---

## Multi-Step Dialog Pattern

**Use case**: Workflows with multiple steps (create campaign, mint certificate, edit template).

**Pattern**:
```typescript
// Atom with step state
interface WorkflowState {
  step: 'idle' | 'select' | 'configure' | 'review' | 'submitting' | 'success';
  data: FormData;
}

const workflowAtom = atomWithReducer(initialState, reducer);

// Component with step-based dialogs
function WorkflowComponent() {
  const [state, dispatch] = useAtom(workflowAtom);

  return (
    <>
      {/* Step 1 */}
      <Dialog open={state.step === 'select'}>
        <DialogContent>
          <SelectStep />
          <Button onClick={() => dispatch({ type: 'GO_TO_CONFIGURE' })}>
            Next
          </Button>
        </DialogContent>
      </Dialog>

      {/* Step 2 */}
      <Dialog open={state.step === 'configure'}>
        <DialogContent>
          <ConfigureStep />
          <Button onClick={() => dispatch({ type: 'GO_TO_REVIEW' })}>
            Next
          </Button>
        </DialogContent>
      </Dialog>

      {/* Step 3 */}
      <Dialog open={state.step === 'review'}>
        <DialogContent>
          <ReviewStep />
          <Button onClick={() => dispatch({ type: 'SUBMIT' })}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={state.step === 'success'}>
        <DialogContent>
          <SuccessMessage />
          <Button onClick={() => dispatch({ type: 'RESET' })}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## Service Layer Integration

**Never call IC canister methods directly from components.** Always use the service layer.

**Flow**: `Component → Hook (TanStack Query/Mutation) → Service Layer → Actor (Candid) → IC Canister`

**Service Layer** (`features/[feature]/api/[feature].service.ts`):
```typescript
import { Actor } from '@dfinity/agent';
import { idlFactory } from '@services/origyn_nft/idlFactory';
import { getAuthenticatedAgent } from '@/features/auth';

export class NFTService {
  private static async getActor() {
    const agent = await getAuthenticatedAgent();
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: import.meta.env.VITE_ORIGYN_NFT_CANISTER_ID,
    });
  }

  static async fetchNFTs(): Promise<NFT[]> {
    const actor = await this.getActor();
    const result = await actor.get_nfts();
    return result.map(transformNFT); // Transform to app types
  }

  static async mintNFT(data: MintNFTInput): Promise<string> {
    const actor = await this.getActor();
    const result = await actor.mint_nft(data);
    if ('Ok' in result) {
      return result.Ok;
    }
    throw new Error(result.Err);
  }
}
```

**Query Hooks** (`features/[feature]/api/[feature].queries.ts`):
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { NFTService } from './nft.service';

export const nftKeys = {
  all: ['nfts'] as const,
  lists: () => [...nftKeys.all, 'list'] as const,
  list: (filters: string) => [...nftKeys.lists(), filters] as const,
};

export const useNFTs = () => {
  return useQuery({
    queryKey: nftKeys.lists(),
    queryFn: () => NFTService.fetchNFTs(),
  });
};

export const useMintNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MintNFTInput) => NFTService.mintNFT(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nftKeys.lists() });
    },
  });
};
```

---

## Component Extraction Guidelines

### When to Extract a Sub-Component

**Extract only if**:
1. **JSX exceeds 300 lines** - Component becomes unreadable
2. **Component is reused** - Used in multiple places
3. **Distinct, isolated responsibility** - Clear separation of concerns

**DO NOT extract if**:
- Component is only used once
- Logic is tightly coupled to parent
- Extraction would require excessive prop drilling
- Component is < 300 lines and readable

### Example: Template Editor

**Before** (hypothetical, for illustration):
```typescript
// 578 lines, complex JSX with many modals
export function EditTemplateStepV2() {
  const [state, dispatch] = useAtom(templateEditorAtom);

  return (
    <div>
      {/* 200 lines of section rendering */}
      {/* 150 lines of field editor modal */}
      {/* 100 lines of language modal */}
      {/* 100 lines of preview */}
    </div>
  );
}
```

**After** (if extraction is needed):
```typescript
// Main component - 150 lines
export function EditTemplateStepV2() {
  const [state, dispatch] = useAtom(templateEditorAtom);

  return (
    <div>
      <SectionList sections={state.sections} />
      <FieldEditorDialog />
      <LanguageDialog />
      <TemplatePreview />
    </div>
  );
}

// Extracted only if reused elsewhere or JSX was unreadable
function FieldEditorDialog() {
  const [state, dispatch] = useAtom(templateEditorAtom); // Can use atom directly

  return (
    <Dialog open={state.modals.editField}>
      {/* 150 lines of field editing logic */}
    </Dialog>
  );
}
```

**Key Point**: Feature components can use atoms directly. No forced prop drilling.

---

## Feature Structure Checklist

For each feature, ensure:

- [ ] Has `atoms/` folder with Jotai atoms
- [ ] Has `api/` folder with service + queries
- [ ] Has `components/` with feature components
- [ ] Has single `types/` file (or organized by domain)
- [ ] Has standardized `index.ts` export
- [ ] Complex workflows use atomWithReducer
- [ ] Forms use TanStack Form (state managed by form)
- [ ] No useState for cross-component state
- [ ] No direct canister calls (use service layer)
- [ ] Components extracted only when JSX > 300 lines or reused

---

## Quick Reference

### State Management Decision Tree

```
Is this state?
├─ UI-only (hover, focus, local toggle)?
│  └─ Use useState
├─ Crosses component boundaries?
│  ├─ Server data (canister)?
│  │  └─ Use TanStack Query
│  └─ Feature/workflow state?
│     └─ Use Jotai atom/atomWithReducer
└─ Form data?
   └─ Use TanStack Form (only update atom on submit)
```

### Component Type Decision Tree

```
What component am I creating?
├─ Reusable across any feature?
│  └─ Generic UI Component (no atoms)
├─ Feature-specific?
│  └─ Feature Component (can use atoms)
└─ Route entry point?
   └─ Route Component (TanStack Router)
```

### Import Path Decision Tree

```
What am I importing?
├─ UI primitive (Button, Dialog)?
│  └─ @/components/ui/[component]
├─ Feature component?
│  └─ @/features/[feature]/components/[component]
├─ Service/hook?
│  └─ @/features/[feature]/api/[service]
├─ Canister service?
│  └─ @services/[canister]
└─ Shared utility?
   └─ @shared/utils/[utility]
```

---

## Common Patterns

### Loading States
```typescript
const { data, isLoading, error } = useTemplates();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

return <TemplateGrid templates={data} />;
```

### Optimistic Updates
```typescript
const updateMutation = useUpdateTemplate();

const handleUpdate = async (id: string, data: UpdateInput) => {
  await updateMutation.mutateAsync(
    { id, data },
    {
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: templateKeys.detail(id) });

        // Snapshot previous value
        const previous = queryClient.getQueryData(templateKeys.detail(id));

        // Optimistically update
        queryClient.setQueryData(templateKeys.detail(id), (old) => ({
          ...old,
          ...variables.data,
        }));

        return { previous };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previous) {
          queryClient.setQueryData(templateKeys.detail(id), context.previous);
        }
      },
    }
  );
};
```

### Conditional Queries
```typescript
const { data: template } = useTemplate(templateId, {
  enabled: !!templateId, // Only fetch if templateId exists
});
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Call Canisters Directly
```typescript
// ❌ BAD
const actor = Actor.createActor(idlFactory, { agent, canisterId });
const result = await actor.mint_nft(data);
```

### ❌ Don't: Sync Form State to Atoms via useEffect
```typescript
// ❌ BAD
useEffect(() => {
  dispatch({ type: 'SET_FORM_VALID', isValid: form.state.isValid });
}, [form.state.isValid]);
```

### ❌ Don't: Extract Components Prematurely
```typescript
// ❌ BAD - Only used once, <100 lines
function ButtonGroup() {
  return (
    <div className="flex gap-2">
      <Button>Save</Button>
      <Button>Cancel</Button>
    </div>
  );
}
```

### ❌ Don't: Prop Drill Through Feature Components
```typescript
// ❌ BAD - Prop drilling when atom is available
function Parent() {
  const [state] = useAtom(editorAtom);
  return <Child selectedSection={state.selectedSection} />;
}

function Child({ selectedSection }) {
  // Use prop instead of atom
}

// ✅ GOOD - Use atom directly
function Child() {
  const [state] = useAtom(editorAtom);
  // Access state.selectedSection directly
}
```

### ❌ Don't: Use useState for Cross-Component State
```typescript
// ❌ BAD
const [template, setTemplate] = useState(null);
// Pass through props to child components

// ✅ GOOD
const [template, setTemplate] = useAtom(templateAtom);
// Children can access directly
```

---

## Resources

- [Jotai Documentation](https://jotai.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TanStack Form Documentation](https://tanstack.com/form/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Folder Structure 2025](https://www.robinwieruch.de/react-folder-structure/)
- [State Management in 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)

---

## Version History

- **v1.0** (2025-12-16) - Initial creation based on Phase 4 of frontend reorganization plan
