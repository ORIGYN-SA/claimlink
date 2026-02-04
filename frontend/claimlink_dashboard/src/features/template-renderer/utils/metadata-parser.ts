/**
 * Metadata Parser Utility
 *
 * Parses raw ICRC3 NFT metadata into ParsedOrigynMetadata structure.
 * Handles extraction of templates, fields, and library items from __apps.
 */

import type { ICRC3Value } from '@canisters/origyn_nft';
import type {
  ParsedOrigynMetadata,
  TemplateContainer,
  TemplateNode,
  MetadataFieldValue,
  FileReference,
  LibraryItem,
} from '../types';
import { DEFAULT_TEMPLATE_VERSION, TEMPLATE_VERSION_KEY } from '../version';

/**
 * Extract a primitive value from ICRC3Value
 */
function extractPrimitive(value: ICRC3Value): string | number | bigint | Uint8Array | undefined {
  if ('Text' in value) return value.Text;
  if ('Int' in value) return value.Int;
  if ('Nat' in value) return value.Nat;
  if ('Blob' in value) return new Uint8Array(value.Blob);
  return undefined;
}

/**
 * Recursively extract a value from ICRC3Value
 */
function extractValue(value: ICRC3Value): unknown {
  if ('Text' in value) return value.Text;
  if ('Int' in value) return Number(value.Int);
  if ('Nat' in value) return Number(value.Nat);
  if ('Blob' in value) return new Uint8Array(value.Blob);
  if ('Array' in value) return value.Array.map(extractValue);
  if ('Map' in value) {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of value.Map) {
      obj[key] = extractValue(val);
    }
    return obj;
  }
  return undefined;
}

/**
 * Find a value in an ICRC3 Map by key
 */
function findInMap(map: Array<[string, ICRC3Value]>, key: string): ICRC3Value | undefined {
  const entry = map.find(([k]) => k === key);
  return entry?.[1];
}

/**
 * Extract template nodes from ICRC3 value
 */
function extractTemplateNodes(value: ICRC3Value): TemplateNode[] | undefined {
  if ('Array' in value) {
    return extractValue(value) as TemplateNode[];
  }
  return undefined;
}

/**
 * Extract templates from public.metadata.template app
 */
function extractTemplates(appData: ICRC3Value): TemplateContainer {
  const templates: TemplateContainer = {};

  if ('Map' in appData) {
    const templateMap = appData.Map;

    // Extract template (experience view)
    const templateVal = findInMap(templateMap, 'template');
    if (templateVal) {
      templates.template = extractTemplateNodes(templateVal);
    }

    // Extract certificateTemplate
    const certTemplateVal = findInMap(templateMap, 'certificateTemplate');
    if (certTemplateVal) {
      templates.certificateTemplate = extractTemplateNodes(certTemplateVal);
    }

    // Extract userViewTemplate
    const userViewVal = findInMap(templateMap, 'userViewTemplate');
    if (userViewVal) {
      templates.userViewTemplate = extractTemplateNodes(userViewVal);
    }

    // Extract formTemplate
    const formVal = findInMap(templateMap, 'formTemplate');
    if (formVal) {
      templates.formTemplate = extractValue(formVal) as TemplateContainer['formTemplate'];
    }

    // Extract languages
    const langVal = findInMap(templateMap, 'languages');
    if (langVal) {
      templates.languages = extractValue(langVal) as TemplateContainer['languages'];
    }
  }

  return templates;
}

/**
 * Extract metadata fields from public.metadata app
 */
function extractMetadataFields(
  appData: ICRC3Value
): Record<string, MetadataFieldValue | FileReference[] | string> {
  const fields: Record<string, MetadataFieldValue | FileReference[] | string> = {};

  if ('Map' in appData) {
    for (const [key, val] of appData.Map) {
      const extracted = extractValue(val);

      // Handle different field types
      if (typeof extracted === 'string') {
        fields[key] = extracted;
      } else if (typeof extracted === 'number') {
        fields[key] = extracted.toString();
      } else if (Array.isArray(extracted)) {
        // Check if it's a FileReference array
        const isFileRefArray = extracted.every(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            'id' in item &&
            'path' in item
        );
        if (isFileRefArray) {
          fields[key] = extracted as FileReference[];
        } else {
          fields[key] = { content: extracted as unknown as string };
        }
      } else if (typeof extracted === 'object' && extracted !== null) {
        // Could be LocalizedContent or MetadataFieldValue
        if ('content' in extracted) {
          fields[key] = extracted as MetadataFieldValue;
        } else {
          // Treat as LocalizedContent
          fields[key] = {
            language: true,
            content: extracted as Record<string, string>,
          };
        }
      }
    }
  }

  return fields;
}

/**
 * Parse __apps array to extract metadata and templates
 */
function parseApps(
  appsValue: ICRC3Value
): {
  metadata: Record<string, MetadataFieldValue | FileReference[] | string>;
  templates: TemplateContainer;
} {
  let metadata: Record<string, MetadataFieldValue | FileReference[] | string> = {};
  let templates: TemplateContainer = {};

  if ('Array' in appsValue) {
    for (const appVal of appsValue.Array) {
      if ('Map' in appVal) {
        const appIdVal = findInMap(appVal.Map, 'app_id');
        const dataVal = findInMap(appVal.Map, 'data');

        if (appIdVal && 'Text' in appIdVal && dataVal) {
          const appId = appIdVal.Text;

          if (appId === 'public.metadata') {
            metadata = extractMetadataFields(dataVal);
          } else if (appId === 'public.metadata.template') {
            templates = extractTemplates(dataVal);
          }
        }
      }
    }
  }

  return { metadata, templates };
}

/**
 * Parse library items from metadata
 */
function parseLibrary(
  metadata: Array<[string, ICRC3Value]>
): LibraryItem[] {
  const libraryVal = metadata.find(([k]) => k === 'library')?.[1];

  if (!libraryVal || !('Array' in libraryVal)) {
    return [];
  }

  return libraryVal.Array.map((item) => {
    if ('Map' in item) {
      const lib: Partial<LibraryItem> = {};
      for (const [key, val] of item.Map) {
        const extracted = extractPrimitive(val);
        if (extracted !== undefined) {
          (lib as Record<string, unknown>)[key] = extracted;
        }
      }
      return lib as LibraryItem;
    }
    return {} as LibraryItem;
  }).filter((lib) => lib.library_id);
}

/**
 * Parse raw ICRC3 metadata into ParsedOrigynMetadata structure
 *
 * @param rawMetadata - Raw metadata from icrc7_token_metadata
 * @param canisterId - The canister ID containing this token
 * @param tokenId - The token ID
 * @returns ParsedOrigynMetadata ready for use with TemplateRenderer
 */
export function parseOrigynMetadata(
  rawMetadata: Array<[string, ICRC3Value]>,
  canisterId: string,
  tokenId: string
): ParsedOrigynMetadata {
  // Find __apps in raw metadata
  const appsEntry = rawMetadata.find(([k]) => k === '__apps')?.[1];

  // Parse apps structure
  const { metadata, templates } = appsEntry
    ? parseApps(appsEntry)
    : { metadata: {}, templates: {} };

  // Also extract top-level fields (for backward compat with simple metadata)
  for (const [key, val] of rawMetadata) {
    if (key !== '__apps' && key !== 'library' && !(key in metadata)) {
      const extracted = extractValue(val);
      if (typeof extracted === 'string') {
        metadata[key] = extracted;
      } else if (typeof extracted === 'number') {
        metadata[key] = extracted.toString();
      }
    }
  }

  // Parse library
  const library = parseLibrary(rawMetadata);

  // Extract template version
  const versionEntry = rawMetadata.find(([k]) => k === TEMPLATE_VERSION_KEY)?.[1];
  const templateVersion =
    versionEntry && 'Text' in versionEntry
      ? versionEntry.Text
      : DEFAULT_TEMPLATE_VERSION;

  return {
    metadata,
    templates,
    library,
    tokenId,
    canisterId,
    templateVersion,
  };
}

/**
 * Extract a simple field value from parsed metadata
 */
export function getMetadataFieldValue(
  parsedMetadata: ParsedOrigynMetadata,
  fieldName: string,
  language: string = 'en'
): string | undefined {
  const field = parsedMetadata.metadata[fieldName];

  if (!field) return undefined;

  // Simple string
  if (typeof field === 'string') {
    return field;
  }

  // MetadataFieldValue with content
  if (typeof field === 'object' && 'content' in field) {
    const content = field.content;

    // LocalizedContent
    if (typeof content === 'object' && !('date' in content)) {
      return content[language] || content['en'] || Object.values(content)[0];
    }

    // DateContent
    if (typeof content === 'object' && 'date' in content) {
      return new Date(content.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // String content
    if (typeof content === 'string') {
      return content;
    }
  }

  return undefined;
}

/**
 * Check if parsed metadata has template views
 */
export function hasTemplateViews(parsedMetadata: ParsedOrigynMetadata): boolean {
  return Boolean(
    parsedMetadata.templates.certificateTemplate ||
    parsedMetadata.templates.template ||
    parsedMetadata.templates.userViewTemplate
  );
}
