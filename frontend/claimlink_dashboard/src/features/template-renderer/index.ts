/**
 * Template Renderer Feature
 *
 * Dynamic template rendering system for ORIGYN NFT certificates.
 *
 * Exports:
 * - Components: TemplateRenderer, TemplateBlock, individual nodes
 * - Hooks: useTemplateContext, useFieldValue, useFileArray, etc.
 * - Utils: URL resolution, date formatting, template conversion
 * - Types: All ORIGYN template types
 */

// Components
export {
  TemplateRenderer,
  CertificateTemplateRenderer,
  ExperienceTemplateRenderer,
  UserViewTemplateRenderer,
  TemplateBlock,
  type TemplateRendererProps,
} from './components';

// Context and Hooks
export {
  TemplateContextProvider,
  useTemplateContext,
  useFieldValue,
  useFileArray,
  useAssetUrl,
  useTemplateLanguage,
  useLocalizedText,
  useTemplateVariant,
  type TemplateContextProviderProps,
} from './context/template-context';

// Utilities
export {
  // URL Resolution
  buildCanisterUrl,
  resolveTokenAssetUrl,
  resolveCollectionAssetUrl,
  createPreviewUrl,
  revokePreviewUrl,
  resolveAssetUrl,
  isLocalReplica,
  isBlobUrl,
  isCanisterUrl,
  getFilePath,
  // Date Formatting
  formatTimestamp,
  formatDateString,
  formatMetadataDate,
  parseDateContent,
  getRelativeTime,
  isExpired,
  isExpiringSoon,
  // Template Conversion
  convertToFormTemplate,
  convertFieldValueToOrigyn,
  convertFormDataToOrigynMetadata,
  // View Generation
  generateOrigynViews,
  generateCertificateView,
  generateUserView,
  generateExperienceView,
  type GeneratedOrigynViews,
  // Metadata Building
  buildMetadataApp,
  buildTemplateApp,
  buildOrigynApps,
  buildOrigynNftMetadata,
  serializeOrigynMetadata,
  validateOrigynMetadata,
  type BuildOrigynAppsConfig,
  type OrigynNftMetadata,
  type LibraryItemDef,
  // ICRC3 Conversion
  convertToIcrc3Metadata,
  extractIcrc3Value,
  findIcrc3Field,
  type ConvertToIcrc3Options,
  // Metadata Parsing
  parseOrigynMetadata,
  getMetadataFieldValue,
  hasTemplateViews,
} from './utils';

// Types
export type {
  // Node Types
  TemplateNodeType,
  TemplateNode,
  BaseTemplateNode,
  ColumnsNode,
  ElementsNode,
  SectionNode,
  TitleNode,
  SubTitleNode,
  TextNode,
  ValueFieldNode,
  FieldNode,
  ImageNode,
  MainImageNode,
  MultiImageNode,
  CollectionImageNode,
  GalleryNode,
  VideoNode,
  AttachmentsNode,
  SeparatorNode,
  HistoryNode,
  CertificateNode,
  // Content Types
  LocalizedContent,
  DateContent,
  MetadataFieldValue,
  FileReference,
  // Container Types
  OrigynAppEntry,
  TemplateContainer,
  TemplateLanguageConfig,
  FormTemplateCategory,
  FormFieldDefinition,
  LibraryItem,
  ParsedOrigynMetadata,
  // Render Types
  RenderDataSource,
  TemplateRenderContext,
  TemplateVariant,
} from './types';

// Type Guards
export {
  isColumnsNode,
  isElementsNode,
  isTitleNode,
  isValueFieldNode,
  isFieldNode,
  isGalleryNode,
  isVideoNode,
  isAttachmentsNode,
  isCollectionImageNode,
  isImageNode,
  isSeparatorNode,
  isSectionNode,
  isDateContent,
  isLocalizedContent,
} from './types';
