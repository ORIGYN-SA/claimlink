/**
 * Template Renderer Feature
 *
 * Dynamic template rendering system for ORIGYN NFT certificates.
 *
 * Exports:
 * - Atoms: Jotai state management (NEW - migrated from Context)
 * - Components: TemplateRenderer, TemplateBlock, individual nodes
 * - Hooks: useTemplateContext, useFieldValue, useFileArray, etc.
 * - Utils: URL resolution, date formatting, template conversion
 * - Types: All ORIGYN template types
 */

// Atoms (NEW - Jotai state management)
export * from './atoms';

// Components
export {
  TemplateRenderer,
  CertificateTemplateRenderer,
  ExperienceTemplateRenderer,
  UserViewTemplateRenderer,
  VersionedTemplateRenderer,
  TemplateBlock,
  type TemplateRendererProps,
  type VersionedTemplateRendererProps,
} from './components';

// Version
export {
  CURRENT_TEMPLATE_VERSION,
  DEFAULT_TEMPLATE_VERSION,
  TEMPLATE_VERSION_KEY,
  getRendererForVersion,
  hasRendererForVersion,
  getRegisteredVersions,
  type TemplateVersion,
  type VersionedRendererEntry,
} from './version';

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
  getNonRawUrl,
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
