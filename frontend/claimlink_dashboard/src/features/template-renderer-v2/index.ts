/**
 * Template Renderer V2 Feature
 *
 * Schema + Layout + Data model for certificate rendering.
 * Registered as '2.0.0' in the renderer registry.
 */

// Components
export {
  V2TemplateRenderer,
  type V2TemplateRendererProps,
  V2ViewRenderer,
  V2ContentRenderer,
  V2CertificateFrame,
  V2InformationFrame,
} from './components';

// Context & Hooks
export {
  V2TemplateContextProvider,
  useV2Context,
  useV2FieldValue,
  useV2ImageUrl,
  useV2Language,
  useV2Schema,
  useV2LocalizedText,
  useV2ActiveView,
  type V2TemplateContextProviderProps,
} from './context/v2-template-context';

// Types
export type {
  V2FieldDefinition,
  V2FieldType,
  V2FieldSemantic,
  V2FieldSize,
  V2FieldValidation,
  V2LayoutNodeType,
  V2TextStyle,
  V2BaseLayoutNode,
  V2FieldLayoutNode,
  V2TextNode,
  V2AssetNode,
  V2SeparatorNode,
  V2GalleryNode,
  V2VideoNode,
  V2AttachmentsNode,
  V2GroupNode,
  V2ColumnsNode,
  V2SectionNode,
  V2LayoutNode,
  V2FrameType,
  V2CertificateFrameConfig,
  V2InformationFrameConfig,
  V2ViewDefinition,
  V2TemplateDocument,
  V2TokenData,
  V2RenderDataSource,
  V2TemplateRenderContext,
} from './types';

// Type Guards
export {
  isV2FieldLayoutNode,
  isV2GroupNode,
  isV2ColumnsNode,
  isV2TextNode,
  isV2AssetNode,
  isV2SeparatorNode,
  isV2SectionNode,
  isV2GalleryNode,
  isV2VideoNode,
  isV2AttachmentsNode,
  isV2ContainerNode,
} from './types';

// Utilities
export {
  // Schema utils
  findField,
  getFieldsByType,
  getFieldBySemantic,
  getFieldLabel,
  getLocalizedText,
  getRequiredFields,
  getViewFieldIds,
  // ICRC3 builder
  buildV2Icrc3Metadata,
  parseV2TemplateFromIcrc3,
  extractV2TokenData,
  type V2ConvertToIcrc3Options,
  // V1→V2 converter
  convertTemplateStructureToV2,
} from './utils';
