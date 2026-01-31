/**
 * ORIGYN Template Types
 *
 * Type definitions for the ORIGYN NFT metadata template format.
 * These types define the structure of templates stored on-chain in the __apps array.
 *
 * Template Structure Reference:
 * - __apps[0]: { app_id: 'public.metadata', data: { ...field values } }
 * - __apps[1]: { app_id: 'public.metadata.template', data: { template, userViewTemplate, certificateTemplate, formTemplate } }
 */

// ============================================================================
// Template Node Types
// ============================================================================

/**
 * All supported template node types from the ORIGYN system
 */
export type TemplateNodeType =
  | 'columns'
  | 'elements'
  | 'title'
  | 'subTitle'
  | 'text'
  | 'valueField'
  | 'field'
  | 'image'
  | 'multiImage'
  | 'collectionImage'
  | 'mainImage'
  | 'gallery'
  | 'video'
  | 'attachments'
  | 'filesAttachments'
  | 'separator'
  | 'section'
  | 'history'
  | 'certificate';

// ============================================================================
// Content Types
// ============================================================================

/**
 * Multi-language content object
 * Keys are language codes (e.g., 'en', 'it', 'fr')
 */
export interface LocalizedContent {
  [languageCode: string]: string;
}

/**
 * Date content stored as timestamp
 */
export interface DateContent {
  date: number; // Epoch timestamp in milliseconds
}

/**
 * Metadata field value structure stored in public.metadata
 */
export interface MetadataFieldValue {
  language?: string | boolean;
  content: LocalizedContent | DateContent | string;
}

/**
 * File reference in metadata (for images, videos, attachments)
 */
export interface FileReference {
  id: string;
  path: string;
}

// ============================================================================
// Base Node Interface
// ============================================================================

/**
 * Base interface for all template nodes
 */
export interface BaseTemplateNode {
  id?: string;
  type: TemplateNodeType;
  className?: string;
}

// ============================================================================
// Layout Nodes
// ============================================================================

/**
 * Grid columns layout container
 */
export interface ColumnsNode extends BaseTemplateNode {
  type: 'columns';
  columns: {
    columns: string; // Number of columns as string (e.g., "1", "2", "3")
    smColumns?: string; // Columns for small screens
  };
  content: TemplateNode[];
}

/**
 * Flex column container for vertical stacking
 */
export interface ElementsNode extends BaseTemplateNode {
  type: 'elements';
  content: TemplateNode[];
}

/**
 * Root node - the top-level container for a template tree.
 * Contains template-wide configuration in addition to child nodes.
 *
 * This is the single source of truth for template data.
 * The root node is always an 'elements' type with id='root'.
 */
export interface RootNode extends BaseTemplateNode {
  type: 'elements';
  id: 'root';
  /** Child nodes in the template tree */
  content: TemplateNode[];
  /** Background configuration for certificate rendering */
  background?: TemplateBackground;
  /** Supported languages for multi-language content */
  languages?: TemplateLanguageConfig[];
  /** Field ID to use for search indexing */
  searchIndexField?: string;
}

/**
 * Background configuration for certificate rendering.
 * Supports standard gradient or custom image/video backgrounds.
 * Custom backgrounds are stored as base64 data URIs (max ~1.5MB).
 */
export interface TemplateBackground {
  type: 'standard' | 'custom';
  /** Base64 data URI for custom backgrounds (max ~1.5MB) */
  dataUri?: string;
  /** Media type for custom backgrounds */
  mediaType?: 'image' | 'video';
}

/**
 * Collapsible section with accordion behavior
 */
export interface SectionNode extends BaseTemplateNode {
  type: 'section';
  title: LocalizedContent;
  content: TemplateNode[];
}

// ============================================================================
// Text Nodes
// ============================================================================

/**
 * Title/heading element
 */
export interface TitleNode extends BaseTemplateNode {
  type: 'title';
  title: LocalizedContent;
}

/**
 * Subtitle element
 */
export interface SubTitleNode extends BaseTemplateNode {
  type: 'subTitle';
  title: LocalizedContent;
}

/**
 * Static text element
 */
export interface TextNode extends BaseTemplateNode {
  type: 'text';
  text: LocalizedContent;
}

/**
 * Dynamic value field - displays data from metadata
 * Looks up field names in the data object and joins with ", "
 */
export interface ValueFieldNode extends BaseTemplateNode {
  type: 'valueField';
  fields: string[]; // Field names to look up in metadata
  preText?: string; // Optional prefix text
}

/**
 * Label + value pair field
 * Displays title on left, value on right
 */
export interface FieldNode extends BaseTemplateNode {
  type: 'field';
  title: LocalizedContent;
  fields: string[]; // Field names to look up in metadata
}

// ============================================================================
// Media Nodes
// ============================================================================

/**
 * Single image from token library
 */
export interface ImageNode extends BaseTemplateNode {
  type: 'image';
  field: string; // Field name pointing to file array
}

/**
 * Main/hero image display
 */
export interface MainImageNode extends BaseTemplateNode {
  type: 'mainImage';
  pointer: string; // Field name pointing to file array
}

/**
 * Multiple images in a grid
 */
export interface MultiImageNode extends BaseTemplateNode {
  type: 'multiImage';
  field?: string;
  pointer?: string;
}

/**
 * Static image from collection library (not token-specific)
 */
export interface CollectionImageNode extends BaseTemplateNode {
  type: 'collectionImage';
  libId: string; // Library asset ID (e.g., "certificatelogo.png")
  fields?: string[];
}

/**
 * Image gallery/carousel
 */
export interface GalleryNode extends BaseTemplateNode {
  type: 'gallery';
  pointer: string; // Field name pointing to files-media array
  field?: string;
  isStatic?: boolean; // If true, use libs instead of pointer
  libs?: string[]; // Static library IDs for isStatic=true
}

/**
 * Video player
 */
export interface VideoNode extends BaseTemplateNode {
  type: 'video';
  field: string; // Field name pointing to video file
  pointer?: string;
  isCanister?: boolean; // If true, use libId for collection-level video
  libId?: string;
  fields?: string[];
}

/**
 * File attachments/downloads list
 */
export interface AttachmentsNode extends BaseTemplateNode {
  type: 'attachments' | 'filesAttachments';
  pointer: string; // Field name pointing to attachments array
}

// ============================================================================
// Special Nodes
// ============================================================================

/**
 * Horizontal separator/divider
 */
export interface SeparatorNode extends BaseTemplateNode {
  type: 'separator';
}

/**
 * History/timeline display
 */
export interface HistoryNode extends BaseTemplateNode {
  type: 'history';
  field: string;
}

/**
 * Certificate component (placeholder for embedded certificate view)
 */
export interface CertificateNode extends BaseTemplateNode {
  type: 'certificate';
}

// ============================================================================
// Union Type
// ============================================================================

/**
 * Union type for all template nodes
 */
export type TemplateNode =
  | RootNode
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
  | HistoryNode
  | CertificateNode;

// ============================================================================
// ORIGYN Metadata Container Types
// ============================================================================

/**
 * Single __apps entry structure
 */
export interface OrigynAppEntry {
  app_id: string;
  read: string;
  write?: {
    type: string;
    list: string[];
  };
  permissions?: {
    type: string;
    list: string[];
  };
  data: Record<string, unknown>;
}

/**
 * Template container from public.metadata.template
 */
export interface TemplateContainer {
  template?: TemplateNode[]; // Experience page
  userViewTemplate?: TemplateNode[]; // Simple user view
  certificateTemplate?: TemplateNode[]; // Formal certificate
  formTemplate?: FormTemplateCategory[]; // Form definition
  languages?: TemplateLanguageConfig[];
  searchField?: string;
}

/**
 * Language configuration in template
 */
export interface TemplateLanguageConfig {
  key: string; // Language code (e.g., 'en', 'it')
  name: string; // Display name (e.g., 'English', 'Italian')
}

/**
 * Form template category (for generating minting forms)
 */
export interface FormTemplateCategory {
  name: string;
  title: LocalizedContent;
  subTitle: LocalizedContent;
  type: 'category';
  fields: FormFieldDefinition[];
}

/**
 * Form field definition within a category
 */
export interface FormFieldDefinition {
  name: string;
  label: LocalizedContent;
  inputType: 'text' | 'date' | 'images' | 'files';
  type: string;
  pointer?: string;
  immutable?: string;
}

/**
 * Library item from NFT metadata
 */
export interface LibraryItem {
  library_id: string;
  title: string;
  filename: string;
  location_type: 'canister' | 'collection';
  location: string;
  content_type: string;
  content_hash: string;
  created_at: string;
  size: number;
  sort: string;
  read: string;
}

// ============================================================================
// Parsed Metadata Types
// ============================================================================

/**
 * Fully parsed ORIGYN NFT metadata
 */
export interface ParsedOrigynMetadata {
  /** Metadata fields from public.metadata */
  metadata: Record<string, MetadataFieldValue | FileReference[] | string>;
  /** Template definitions from public.metadata.template */
  templates: TemplateContainer;
  /** Library items */
  library: LibraryItem[];
  /** Token ID */
  tokenId: string;
  /** Canister ID */
  canisterId: string;
  /** Collection ID (for B2B storage) */
  collectionId?: string;
}

// ============================================================================
// Render Context Types
// ============================================================================

/**
 * Template rendering variant - controls visual styling
 * - 'default': Standard template rendering
 * - 'certificate': Certificate view styling (centered, formal typography, dark text)
 * - 'custom-certificate': Custom background certificate (centered, formal typography, light text)
 * - 'information': Information tab styling (dark background, light text)
 */
export type TemplateVariant = 'default' | 'certificate' | 'custom-certificate' | 'information';

/**
 * Data source for rendering - either preview (local) or on-chain
 */
export type RenderDataSource =
  | {
      type: 'preview';
      formData: Record<string, unknown>;
      files: Map<string, File | File[]>;
      showPlaceholders?: boolean;
    }
  | {
      type: 'onchain';
      metadata: ParsedOrigynMetadata;
      showPlaceholders?: boolean;
    };

/**
 * Context provided to all template components during rendering
 */
export interface TemplateRenderContext {
  /** Data source (preview or on-chain) */
  dataSource: RenderDataSource;
  /** Canister ID for URL resolution */
  canisterId: string;
  /** Token ID for URL resolution */
  tokenId?: string;
  /** Collection ID for B2B storage */
  collectionId?: string;
  /** Current language code */
  language: string;
  /** Rendering variant for styling */
  variant: TemplateVariant;
  /** Whether to show placeholders for missing values (preview mode) */
  showPlaceholders: boolean;
  /** Resolve asset URL for a file path */
  resolveAssetUrl: (path: string, isCollectionAsset?: boolean) => string;
  /** Get field value from metadata by field name */
  getFieldValue: (fieldName: string) => string | null;
  /** Get file array from metadata by pointer name */
  getFileArray: (pointer: string) => FileReference[];
  /** Get date value from metadata by field name */
  getDateValue: (fieldName: string) => Date | null;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isColumnsNode(node: TemplateNode): node is ColumnsNode {
  return node.type === 'columns';
}

export function isElementsNode(node: TemplateNode): node is ElementsNode {
  return node.type === 'elements';
}

export function isTitleNode(node: TemplateNode): node is TitleNode {
  return node.type === 'title';
}

export function isValueFieldNode(node: TemplateNode): node is ValueFieldNode {
  return node.type === 'valueField';
}

export function isFieldNode(node: TemplateNode): node is FieldNode {
  return node.type === 'field';
}

export function isGalleryNode(node: TemplateNode): node is GalleryNode {
  return node.type === 'gallery';
}

export function isVideoNode(node: TemplateNode): node is VideoNode {
  return node.type === 'video';
}

export function isAttachmentsNode(
  node: TemplateNode
): node is AttachmentsNode {
  return node.type === 'attachments' || node.type === 'filesAttachments';
}

export function isCollectionImageNode(
  node: TemplateNode
): node is CollectionImageNode {
  return node.type === 'collectionImage';
}

export function isImageNode(node: TemplateNode): node is ImageNode {
  return node.type === 'image';
}

export function isSeparatorNode(node: TemplateNode): node is SeparatorNode {
  return node.type === 'separator';
}

export function isSectionNode(node: TemplateNode): node is SectionNode {
  return node.type === 'section';
}

export function isRootNode(node: TemplateNode): node is RootNode {
  return node.type === 'elements' && node.id === 'root';
}

export function isHistoryNode(node: TemplateNode): node is HistoryNode {
  return node.type === 'history';
}

/**
 * Check if content is a date content object
 */
export function isDateContent(
  content: LocalizedContent | DateContent | string
): content is DateContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'date' in content &&
    typeof (content as DateContent).date === 'number'
  );
}

/**
 * Check if content is localized content
 */
export function isLocalizedContent(
  content: LocalizedContent | DateContent | string
): content is LocalizedContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    !('date' in content)
  );
}
