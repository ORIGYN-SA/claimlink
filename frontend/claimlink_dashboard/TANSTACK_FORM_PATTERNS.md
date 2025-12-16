# TanStack Form Patterns & Best Practices

## Overview

This document outlines the patterns and best practices for using TanStack Form in the ClaimLink dashboard, established during Phase 3 of the frontend reorganization plan.

## Core Principles

### 1. Form State vs UI State

**Form State** (managed by TanStack Form):
- Form field values (name, description, price, etc.)
- Field validation state
- Form submission state

**UI State** (managed by local useState or Jotai atoms):
- Image previews
- File upload progress
- Modal open/closed states
- Dynamic array inputs (like attributes)
- Workflow steps

### 2. When to Use TanStack Form

✅ **Use TanStack Form for:**
- Traditional form inputs (text, number, textarea, select)
- Fields requiring validation
- Forms with submit workflows
- Fields that should be validated on change/blur

❌ **Don't use TanStack Form for:**
- UI-only state (hover, focus, modals)
- Image preview URLs
- File objects
- Complex nested state better suited for atomWithReducer
- Temporary UI feedback

## Basic Pattern

### Simple Form Example

Reference implementation: `src/features/mint-nft/components/mint-nft-form.tsx`

```typescript
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

export function MyForm() {
  // UI-only state
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // TanStack Form for actual form fields
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      // Handle submission
      await createItem(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Form fields */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim().length === 0) {
              return 'Name is required';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label>Name *</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Submit button with form state */}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
```

## Validation Patterns

### 1. Using Built-in Validators

```typescript
<form.Field
  name="amount"
  validators={{
    onChange: ({ value }) => {
      // Required validation
      if (!value || value.trim() === '') {
        return 'Amount is required';
      }

      // Type validation
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }

      // Range validation
      if (numValue <= 0) {
        return 'Amount must be greater than zero';
      }

      return undefined;
    },
  }}
>
  {(field) => (
    <div>
      <input
        type="text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-red-500">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
</form.Field>
```

### 2. Using Shared Validators

Import validators from `shared/utils/form/validators`:

```typescript
import { isAmountGreaterThanZero, isValidPrincipal } from '@/shared/utils/form';

<form.Field
  name="principalId"
  validators={{
    onChange: ({ value }) => isValidPrincipal(value),
    onBlur: ({ value }) => isValidPrincipal(value),
  }}
>
  {(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-red-500">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
</form.Field>
```

### 3. Async Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      if (!value) return 'Username is required';

      // Check if username is available
      const isAvailable = await checkUsernameAvailability(value);
      if (!isAvailable) {
        return 'Username is already taken';
      }

      return undefined;
    },
  }}
  asyncDebounceMs={500} // Debounce async validation
>
  {(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span>Checking...</span>}
      {field.state.meta.errors.length > 0 && (
        <p className="text-red-500">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
</form.Field>
```

## Input Utilities Integration

Use input sanitization helpers from `shared/utils/form/input`:

```typescript
import { preventNonPositiveNumeric, sanitizeNumeric } from '@/shared/utils/form';

<form.Field name="price">
  {(field) => (
    <input
      type="text"
      value={field.state.value}
      onKeyDown={preventNonPositiveNumeric} // Prevent non-numeric keys
      onChange={(e) => {
        const sanitized = sanitizeNumeric(e.target.value, true, false);
        field.handleChange(sanitized);
      }}
    />
  )}
</form.Field>
```

## Advanced Patterns

### 1. Multi-Step Forms with Jotai Atoms

Combine TanStack Form with Jotai for workflow state:

```typescript
import { useForm } from '@tanstack/react-form';
import { useAtom } from 'jotai';
import { workflowAtom } from '../atoms/workflow.atom';

export function MultiStepForm() {
  const [workflow, dispatch] = useAtom(workflowAtom);

  const form = useForm({
    defaultValues: {
      step1Field: '',
      step2Field: '',
    },
    onSubmit: async ({ value }) => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      try {
        await submitData(value);
        dispatch({ type: 'GO_TO_SUCCESS' });
      } finally {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      }
    },
  });

  return (
    <div>
      {workflow.currentStep === 'step1' && (
        <Step1Fields form={form} />
      )}
      {workflow.currentStep === 'step2' && (
        <Step2Fields form={form} />
      )}
    </div>
  );
}
```

### 2. Form Persistence

Save form state to atom for persistence across page navigation:

```typescript
import { useForm } from '@tanstack/react-form';
import { useAtom } from 'jotai';
import { draftAtom } from '../atoms/draft.atom';

export function PersistentForm() {
  const [draft] = useAtom(draftAtom);

  const form = useForm({
    defaultValues: draft.formData, // Load from atom
    onSubmit: async ({ value }) => {
      // Clear draft on successful submission
      dispatch({ type: 'CLEAR_DRAFT' });
      await submitData(value);
    },
  });

  // Save draft on field changes (with debounce)
  form.useStore((state) => {
    // Debounce and save to atom
    saveDraft(state.values);
  });

  return <form>...</form>;
}
```

### 3. Dynamic Field Arrays

For dynamic arrays (like attributes), use local state:

```typescript
export function FormWithAttributes() {
  const [attributes, setAttributes] = useState<Array<{ key: string; value: string }>>([]);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      // Convert attributes array to object
      const attributesObj = attributes.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      await submitData({
        ...value,
        attributes: attributesObj,
      });
    },
  });

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Regular form fields */}
      <form.Field name="name">...</form.Field>

      {/* Dynamic attributes (not in TanStack Form) */}
      <div>
        <button type="button" onClick={addAttribute}>
          Add Attribute
        </button>
        {attributes.map((attr, index) => (
          <div key={index}>
            <input
              value={attr.key}
              onChange={(e) => {
                const updated = [...attributes];
                updated[index].key = e.target.value;
                setAttributes(updated);
              }}
            />
            <input
              value={attr.value}
              onChange={(e) => {
                const updated = [...attributes];
                updated[index].value = e.target.value;
                setAttributes(updated);
              }}
            />
          </div>
        ))}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Anti-Patterns to Avoid

### ❌ Don't Sync Form State to Atoms via useEffect

```typescript
// ❌ BAD - Causes double renders and performance issues
useEffect(() => {
  dispatch({ type: 'SET_FORM_STATE', formState: form.state });
}, [form.state.isValid]);
```

Instead, only update atoms on specific events (submission, step changes, etc.).

### ❌ Don't Put UI State in Form

```typescript
// ❌ BAD - Image preview doesn't belong in form state
const form = useForm({
  defaultValues: {
    name: '',
    imagePreview: null, // ❌ UI-only concern
  },
});

// ✅ GOOD - Use local state for UI concerns
const [imagePreview, setImagePreview] = useState<string | null>(null);
const form = useForm({
  defaultValues: {
    name: '',
  },
});
```

### ❌ Don't Create Form Fields for Non-Input Data

```typescript
// ❌ BAD - Loading state doesn't belong in form
<form.Field name="isLoading">...</form.Field>

// ✅ GOOD - Use atoms or local state
const [state, dispatch] = useAtom(workflowAtom);
if (state.isLoading) {
  return <LoadingSpinner />;
}
```

## Testing Forms

### Unit Testing Validators

```typescript
import { isAmountGreaterThanZero } from '@/shared/utils/form';

describe('isAmountGreaterThanZero', () => {
  it('returns error for empty value', () => {
    expect(isAmountGreaterThanZero('')).toBe('Amount is required');
  });

  it('returns error for zero', () => {
    expect(isAmountGreaterThanZero('0')).toBe('Amount must be greater than zero');
  });

  it('returns undefined for valid amount', () => {
    expect(isAmountGreaterThanZero('10')).toBeUndefined();
  });
});
```

### Integration Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MintNFTForm } from './mint-nft-form';

describe('MintNFTForm', () => {
  it('shows validation error for empty name', async () => {
    render(<MintNFTForm collectionCanisterId="abc123" />);

    const submitButton = screen.getByRole('button', { name: /mint nft/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('NFT name is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const { getByLabelText, getByRole } = render(
      <MintNFTForm collectionCanisterId="abc123" />
    );

    fireEvent.change(getByLabelText(/nft name/i), {
      target: { value: 'My NFT' },
    });
    fireEvent.change(getByLabelText(/description/i), {
      target: { value: 'A great NFT' },
    });

    const submitButton = getByRole('button', { name: /mint nft/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMintNft).toHaveBeenCalledWith({
        name: 'My NFT',
        description: 'A great NFT',
      });
    });
  });
});
```

## Migration Checklist

When migrating an existing form to TanStack Form:

- [ ] Identify form fields vs UI state
- [ ] Keep image previews, file objects in local state
- [ ] Keep workflow/step state in Jotai atoms (if applicable)
- [ ] Move form field values to TanStack Form
- [ ] Add field-level validation
- [ ] Replace form submit handler with `form.handleSubmit()`
- [ ] Use `form.Subscribe` for submit button state
- [ ] Test form validation
- [ ] Test form submission
- [ ] Remove old form state management code
- [ ] Add JSDoc comments explaining the pattern

## Resources

- [TanStack Form Documentation](https://tanstack.com/form/latest)
- [Form Validators](../src/shared/utils/form/validators/)
- [Input Utilities](../src/shared/utils/form/input/)
- [Reference Implementation](../src/features/mint-nft/components/mint-nft-form.tsx)

## Support

For questions or issues with form patterns:
1. Check this documentation
2. Review the reference implementation in `mint-nft-form.tsx`
3. Check the migration plan at `~/.claude/plans/parallel-rolling-bumblebee.md`
