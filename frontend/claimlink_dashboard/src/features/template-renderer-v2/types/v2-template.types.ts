/**
 * V2 Template Types
 *
 * Schema + Layout + Data model for the v2 template rendering system.
 * A single V2TemplateDocument contains field definitions (schema) and
 * view layout trees. Each token stores one copy of this document plus
 * flat data values — no 4x template duplication.
 */

import type { TemplateLanguageConfig, LocalizedContent, FileReference } from '../../template-renderer/types';

// Re-export for convenience
export type { LocalizedContent, FileReference };

// ============================================================================
// Field Types (Schema)
// ============================================================================

/** Supported field data types */
export type V2FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'textarea'
  | 'image'
  | 'images'
  | 'video'
  | 'document'
  | 'badge'
  | 'readonly';

/** Semantic roles that fields can play */
export type V2FieldSemantic =
  | 'title'
  | 'description'
  | 'companyLogo'
  | 'companyName'
  | 'stamp'
  | 'sectionTitle'
  | 'certificationDate'
  | 'gallery';

/** Field size for display */
export type V2FieldSize = 'sm' | 'md' | 'lg';

/** Validation rules for a field */
export interface V2FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

/** A single field definition in the schema */
export interface V2FieldDefinition {
  id: string;
  type: V2FieldType;
  label: LocalizedContent;
  required?: boolean;
  size?: V2FieldSize;
  immutable?: boolean;
  validation?: V2FieldValidation;
  maxFiles?: number;
  placeholder?: LocalizedContent;
  semantic?: V2FieldSemantic;
}

// ============================================================================
// Layout Node Types
// ============================================================================

/** All supported v2 layout node types (10 total) */
export type V2LayoutNodeType =
  | 'field'
  | 'group'
  | 'columns'
  | 'text'
  | 'asset'
  | 'separator'
  | 'section'
  | 'gallery'
  | 'video'
  | 'attachments';

/** Text style options for text nodes */
export type V2TextStyle = 'heading' | 'subheading' | 'body' | 'caption';

/** Base interface for all layout nodes */
export interface V2BaseLayoutNode {
  id: string;
  type: V2LayoutNodeType;
  className?: string;
}

// --- Leaf Nodes ---

/** Renders field label + value */
export interface V2FieldLayoutNode extends V2BaseLayoutNode {
  type: 'field';
  fieldId: string;
  showLabel?: boolean;
  size?: V2FieldSize;
}

/** Static text (heading, subheading, body, caption) */
export interface V2TextNode extends V2BaseLayoutNode {
  type: 'text';
  content: LocalizedContent;
  textStyle?: V2TextStyle;
}

/** Static collection-level image (logo, watermark) */
export interface V2AssetNode extends V2BaseLayoutNode {
  type: 'asset';
  libId: string;
}

/** Horizontal divider */
export interface V2SeparatorNode extends V2BaseLayoutNode {
  type: 'separator';
}

/** Image gallery/carousel bound to a field */
export interface V2GalleryNode extends V2BaseLayoutNode {
  type: 'gallery';
  fieldId: string;
}

/** Video player bound to a field */
export interface V2VideoNode extends V2BaseLayoutNode {
  type: 'video';
  fieldId: string;
}

/** File download list bound to a field */
export interface V2AttachmentsNode extends V2BaseLayoutNode {
  type: 'attachments';
  fieldId: string;
}

// --- Container Nodes ---

/** Vertical flex-column stack */
export interface V2GroupNode extends V2BaseLayoutNode {
  type: 'group';
  children: V2LayoutNode[];
  title?: LocalizedContent;
  gap?: number;
}

/** CSS grid columns */
export interface V2ColumnsNode extends V2BaseLayoutNode {
  type: 'columns';
  columns: number;
  smColumns?: number;
  children: V2LayoutNode[];
}

/** Collapsible accordion with title */
export interface V2SectionNode extends V2BaseLayoutNode {
  type: 'section';
  title: LocalizedContent;
  children: V2LayoutNode[];
}

// --- Union ---

/** Union type for all v2 layout nodes */
export type V2LayoutNode =
  | V2FieldLayoutNode
  | V2TextNode
  | V2AssetNode
  | V2SeparatorNode
  | V2GalleryNode
  | V2VideoNode
  | V2AttachmentsNode
  | V2GroupNode
  | V2ColumnsNode
  | V2SectionNode;

// ============================================================================
// View & Frame Types
// ============================================================================

/** Frame types supported by views */
export type V2FrameType = 'certificate' | 'information' | 'plain';

/** Certificate frame configuration */
export interface V2CertificateFrameConfig {
  background?: {
    type: 'standard' | 'custom';
    dataUri?: string;
    mediaType?: 'image' | 'video';
  };
  companyLogoField?: string;
  stampField?: string;
  showOrigynBranding?: boolean;
  showTokenId?: boolean;
}

/** Information frame configuration */
export interface V2InformationFrameConfig {
  companyNameField?: string;
  certificateTitleField?: string;
  dateField?: string;
  sectionTitleField?: string;
  galleryField?: string;
}

/** A single view definition (one tab) */
export interface V2ViewDefinition {
  id: string;
  label: LocalizedContent;
  frameType: V2FrameType;
  frame?: V2CertificateFrameConfig | V2InformationFrameConfig;
  content: V2LayoutNode[];
}

// ============================================================================
// Template Document
// ============================================================================

/** Complete v2 template document — one per collection/token */
export interface V2TemplateDocument {
  version: '2.0.0';
  schema: {
    fields: V2FieldDefinition[];
  };
  views: V2ViewDefinition[];
  languages: TemplateLanguageConfig[];
  searchIndexField?: string;
}

// ============================================================================
// Data Types (per-token)
// ============================================================================

/** Flat data values for a single token */
export type V2TokenData = Record<string, unknown>;

// ============================================================================
// Render Context Types
// ============================================================================

/** Data source for v2 rendering */
export type V2RenderDataSource =
  | {
      type: 'preview';
      formData: Record<string, unknown>;
      files: Map<string, File | File[]>;
      showPlaceholders?: boolean;
    }
  | {
      type: 'onchain';
      tokenData: V2TokenData;
      showPlaceholders?: boolean;
    };

/** Context provided to all v2 template components */
export interface V2TemplateRenderContext {
  templateDocument: V2TemplateDocument;
  dataSource: V2RenderDataSource;
  canisterId: string;
  tokenId?: string;
  collectionId?: string;
  language: string;
  activeViewId: string;
  showPlaceholders: boolean;
  resolveAssetUrl: (path: string, isCollectionAsset?: boolean) => string;
  getFieldValue: (fieldId: string) => string | null;
  getImageUrl: (fieldId: string) => string | null;
  getFileArray: (fieldId: string) => FileReference[];
  getDateValue: (fieldId: string) => Date | null;
  getLocalizedText: (content: LocalizedContent | undefined) => string;
  getFieldDefinition: (fieldId: string) => V2FieldDefinition | undefined;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isV2FieldLayoutNode(node: V2LayoutNode): node is V2FieldLayoutNode {
  return node.type === 'field';
}

export function isV2GroupNode(node: V2LayoutNode): node is V2GroupNode {
  return node.type === 'group';
}

export function isV2ColumnsNode(node: V2LayoutNode): node is V2ColumnsNode {
  return node.type === 'columns';
}

export function isV2TextNode(node: V2LayoutNode): node is V2TextNode {
  return node.type === 'text';
}

export function isV2AssetNode(node: V2LayoutNode): node is V2AssetNode {
  return node.type === 'asset';
}

export function isV2SeparatorNode(node: V2LayoutNode): node is V2SeparatorNode {
  return node.type === 'separator';
}

export function isV2SectionNode(node: V2LayoutNode): node is V2SectionNode {
  return node.type === 'section';
}

export function isV2GalleryNode(node: V2LayoutNode): node is V2GalleryNode {
  return node.type === 'gallery';
}

export function isV2VideoNode(node: V2LayoutNode): node is V2VideoNode {
  return node.type === 'video';
}

export function isV2AttachmentsNode(node: V2LayoutNode): node is V2AttachmentsNode {
  return node.type === 'attachments';
}

/** Check if a node is a container (has children) */
export function isV2ContainerNode(
  node: V2LayoutNode
): node is V2GroupNode | V2ColumnsNode | V2SectionNode {
  return node.type === 'group' || node.type === 'columns' || node.type === 'section';
}
