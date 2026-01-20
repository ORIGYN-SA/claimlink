/**
 * Template JSON Utilities
 *
 * Utilities for the Code Editor - parsing, validating, exporting,
 * and manipulating template JSON.
 */

import type { TemplateStructure, TemplateSection, TemplateItem, TemplateLanguage } from '../types/template.types';

// ============================================================================
// Types
// ============================================================================

export interface ValidationError {
  path: string;
  message: string;
  line?: number;
}

export interface ParseResult {
  valid: boolean;
  data?: TemplateStructure;
  errors: ValidationError[];
}

// ============================================================================
// JSON Parsing & Validation
// ============================================================================

/**
 * Parse and validate template JSON string
 */
export function parseTemplateJson(json: string): ParseResult {
  const errors: ValidationError[] = [];

  // Try to parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    const error = e as SyntaxError;
    // Try to extract line number from error message
    const match = error.message.match(/position (\d+)/);
    const position = match ? parseInt(match[1], 10) : undefined;
    const line = position ? getLineFromPosition(json, position) : undefined;

    return {
      valid: false,
      errors: [{
        path: 'root',
        message: `Invalid JSON: ${error.message}`,
        line,
      }],
    };
  }

  // Validate structure
  const structureErrors = validateTemplateStructure(parsed);
  errors.push(...structureErrors);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: parsed as TemplateStructure,
    errors: [],
  };
}

/**
 * Validate that an object conforms to TemplateStructure
 */
export function validateTemplateStructure(obj: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!obj || typeof obj !== 'object') {
    errors.push({ path: 'root', message: 'Template must be an object' });
    return errors;
  }

  const template = obj as Record<string, unknown>;

  // Validate sections
  if (!template.sections) {
    errors.push({ path: 'sections', message: 'Missing required field: sections' });
  } else if (!Array.isArray(template.sections)) {
    errors.push({ path: 'sections', message: 'sections must be an array' });
  } else {
    template.sections.forEach((section, index) => {
      const sectionErrors = validateSection(section, index);
      errors.push(...sectionErrors);
    });
  }

  // Validate languages
  if (!template.languages) {
    errors.push({ path: 'languages', message: 'Missing required field: languages' });
  } else if (!Array.isArray(template.languages)) {
    errors.push({ path: 'languages', message: 'languages must be an array' });
  } else if (template.languages.length === 0) {
    errors.push({ path: 'languages', message: 'At least one language is required' });
  } else {
    template.languages.forEach((lang, index) => {
      const langErrors = validateLanguage(lang, index);
      errors.push(...langErrors);
    });

    // Check for default language
    const languages = template.languages as TemplateLanguage[];
    const hasDefault = languages.some((l) => l.isDefault);
    if (!hasDefault) {
      errors.push({ path: 'languages', message: 'At least one language must be marked as default' });
    }
  }

  return errors;
}

/**
 * Validate a single section
 */
function validateSection(section: unknown, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `sections[${index}]`;

  if (!section || typeof section !== 'object') {
    errors.push({ path, message: 'Section must be an object' });
    return errors;
  }

  const s = section as Record<string, unknown>;

  if (!s.id || typeof s.id !== 'string') {
    errors.push({ path: `${path}.id`, message: 'Section must have a string id' });
  }

  if (!s.name || typeof s.name !== 'string') {
    errors.push({ path: `${path}.name`, message: 'Section must have a string name' });
  } else if (s.name !== 'Certificate' && s.name !== 'Information') {
    errors.push({ path: `${path}.name`, message: 'Section name must be "Certificate" or "Information"' });
  }

  if (typeof s.order !== 'number') {
    errors.push({ path: `${path}.order`, message: 'Section must have a numeric order' });
  }

  if (!Array.isArray(s.items)) {
    errors.push({ path: `${path}.items`, message: 'Section must have an items array' });
  } else {
    s.items.forEach((item, itemIndex) => {
      const itemErrors = validateItem(item, index, itemIndex);
      errors.push(...itemErrors);
    });
  }

  return errors;
}

/**
 * Validate a single item
 */
function validateItem(item: unknown, sectionIndex: number, itemIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `sections[${sectionIndex}].items[${itemIndex}]`;

  if (!item || typeof item !== 'object') {
    errors.push({ path, message: 'Item must be an object' });
    return errors;
  }

  const i = item as Record<string, unknown>;

  if (!i.id || typeof i.id !== 'string') {
    errors.push({ path: `${path}.id`, message: 'Item must have a string id' });
  }

  if (!i.type || typeof i.type !== 'string') {
    errors.push({ path: `${path}.type`, message: 'Item must have a string type' });
  } else {
    const validTypes = ['title', 'input', 'badge', 'image', 'video'];
    if (!validTypes.includes(i.type as string)) {
      errors.push({ path: `${path}.type`, message: `Invalid item type: ${i.type}. Must be one of: ${validTypes.join(', ')}` });
    }
  }

  if (!i.label || typeof i.label !== 'string') {
    errors.push({ path: `${path}.label`, message: 'Item must have a string label' });
  }

  if (typeof i.order !== 'number') {
    errors.push({ path: `${path}.order`, message: 'Item must have a numeric order' });
  }

  // Type-specific validation
  if (i.type === 'input') {
    const validInputTypes = ['text', 'number', 'textarea', 'email', 'url'];
    if (!i.inputType || !validInputTypes.includes(i.inputType as string)) {
      errors.push({ path: `${path}.inputType`, message: `Input item must have inputType: ${validInputTypes.join(', ')}` });
    }
  }

  return errors;
}

/**
 * Validate a single language
 */
function validateLanguage(lang: unknown, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `languages[${index}]`;

  if (!lang || typeof lang !== 'object') {
    errors.push({ path, message: 'Language must be an object' });
    return errors;
  }

  const l = lang as Record<string, unknown>;

  if (!l.id || typeof l.id !== 'string') {
    errors.push({ path: `${path}.id`, message: 'Language must have a string id' });
  }

  if (!l.code || typeof l.code !== 'string') {
    errors.push({ path: `${path}.code`, message: 'Language must have a string code' });
  }

  if (!l.name || typeof l.name !== 'string') {
    errors.push({ path: `${path}.name`, message: 'Language must have a string name' });
  }

  return errors;
}

/**
 * Get line number from character position in string
 */
function getLineFromPosition(str: string, position: number): number {
  const lines = str.substring(0, position).split('\n');
  return lines.length;
}

// ============================================================================
// Export Helpers
// ============================================================================

/**
 * Download template as JSON file
 */
export function downloadTemplateJson(template: TemplateStructure, filename: string = 'template.json'): void {
  const json = JSON.stringify(template, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy JSON string to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate a unique ID for a new node/item
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique section ID
 */
export function generateSectionId(name: string): string {
  return `section_${name.toLowerCase()}_${generateId()}`;
}

/**
 * Generate a unique item ID
 */
export function generateItemId(type: string): string {
  return `${type}_${generateId()}`;
}

// ============================================================================
// Template Manipulation
// ============================================================================

/**
 * Create a blank template structure
 */
export function createBlankTemplate(): TemplateStructure {
  return {
    sections: [
      {
        id: 'section_certificate',
        name: 'Certificate',
        order: 1,
        collapsible: false,
        description: 'Essential certification information',
        items: [
          {
            id: 'name',
            type: 'input',
            label: 'Certificate Name',
            order: 1,
            required: true,
            inputType: 'text',
            placeholder: 'Enter certificate name',
          },
        ],
      },
      {
        id: 'section_information',
        name: 'Information',
        order: 2,
        collapsible: true,
        description: 'Additional information and details',
        items: [],
      },
    ],
    languages: [
      { id: 'en', code: 'en', name: 'English', isDefault: true },
    ],
    metadata: {
      version: '1.0.0',
      createdBy: 'user',
    },
  };
}

/**
 * Format JSON with proper indentation
 */
export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * Add a new section to a template
 */
export function addSection(
  template: TemplateStructure,
  name: 'Certificate' | 'Information',
  description?: string
): TemplateStructure {
  const maxOrder = Math.max(...template.sections.map(s => s.order), 0);
  const newSection: TemplateSection = {
    id: generateSectionId(name),
    name,
    order: maxOrder + 1,
    collapsible: name === 'Information',
    description,
    items: [],
  };

  return {
    ...template,
    sections: [...template.sections, newSection],
  };
}

/**
 * Add a new item to a section
 */
export function addItemToSection(
  template: TemplateStructure,
  sectionId: string,
  item: Omit<TemplateItem, 'id' | 'order'>
): TemplateStructure {
  return {
    ...template,
    sections: template.sections.map(section => {
      if (section.id !== sectionId) return section;

      const maxOrder = Math.max(...section.items.map(i => i.order), 0);
      const newItem: TemplateItem = {
        ...item,
        id: generateItemId(item.type),
        order: maxOrder + 1,
      } as TemplateItem;

      return {
        ...section,
        items: [...section.items, newItem],
      };
    }),
  };
}

/**
 * Add a new language to a template
 */
export function addLanguage(
  template: TemplateStructure,
  code: string,
  name: string,
  isDefault: boolean = false
): TemplateStructure {
  const newLang: TemplateLanguage = {
    id: code,
    code,
    name,
    isDefault,
  };

  // If setting as default, unset other defaults
  const languages = isDefault
    ? template.languages.map(l => ({ ...l, isDefault: false }))
    : template.languages;

  return {
    ...template,
    languages: [...languages, newLang],
  };
}
