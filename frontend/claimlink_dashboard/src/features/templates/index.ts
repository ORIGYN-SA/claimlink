// ============================================================================
// Pages (Entry Points)
// ============================================================================

export { TemplatesPage } from './pages/templates-page'
export { NewTemplatePage } from './pages/new-template-page'
export { EditTemplatePage } from './pages/edit-template-page'

// ============================================================================
// Components
// ============================================================================

export { TemplateCard } from './components/template-card'
export { TemplateSectionCard } from './components/template-section-card'
export { TemplateItemRow } from './components/template-item-row'

// Creation workflow components
export {
  ChooseTemplateStep,
  ChooseBackgroundStep,
  UploadBackgroundStep,
  EditTemplateStepV2,
  PreviewDeployStep,
  Stepper,
} from './components/create'

// ============================================================================
// API Layer
// ============================================================================

export { TemplateService } from './api/templates.service'
export {
  templateKeys,
  useMyTemplates,
  useTemplate,
  useTemplatesByCategory,
  useCreateTemplate,
  useFreeTemplates,
  usePremiumTemplates,
} from './api/templates.queries'

// ============================================================================
// Utilities
// ============================================================================

// Serialization (supports both legacy and tree formats)
export {
  serializeTemplateForOrigyn,
  deserializeTemplateFromOrigyn,
  hasTemplateStructure,
  TEMPLATE_STRUCTURE_KEY,
  // New tree format utilities
  serializeTreeForOrigyn,
  deserializeTreeFromOrigyn,
  hasTemplateTree,
  TEMPLATE_TREE_KEY,
  deserializeTemplate,
  hasTemplate,
} from './utils/template-serializer'

// Tree manipulation utilities
export {
  findNodeById,
  findNodesByType,
  addNode,
  removeNode,
  updateNode,
  moveNode,
  reorderChildren,
  getNodeChildren,
  setNodeChildren,
  createRootNode,
  getRootNode,
  updateRootNode,
  createSectionNode,
  getSectionNodes,
  getAllFieldIds,
  extractFormFields,
  generateNodeId,
  toLocalizedContent,
  getLocalizedText,
} from './utils/template-tree-utils'

// Compatibility layer (works with both formats)
export {
  getTemplateFormat,
  hasTreeFormat,
  hasStructureFormat,
  convertStructureToTree,
  getUnifiedSections,
  getUnifiedLanguages,
  getUnifiedSearchIndexField,
  ensureTreeFormat,
  migrateToTreeFormat,
} from './utils/template-compat'

// Simple mode constraints
export {
  SIMPLE_MODE_SECTIONS,
  SIMPLE_MODE_NODE_TYPES,
  isValidSimpleModeTemplate,
  getSimpleModeWarnings,
  createSimpleModeTemplate,
  addFieldToSection,
  removeFieldFromSection,
  reorderFieldsInSection,
} from './utils/simple-mode-constraints'

// Validation
export {
  validateTemplateForDisplay,
  SEMANTIC_FIELD_PRESETS,
  getSemanticPresetForFieldId,
} from './utils/template-validation'

// ============================================================================
// Types
// ============================================================================

export type {
  Template,
  CreateTemplateInput,
  TemplateCardProps,
  TemplateFilters,
  PaginationState,
  BackendTemplate,
  TemplateJsonPayload,
  // Re-export TemplateNode from origyn-template.types
  TemplateNode,
} from './types/template.types'

// Legacy types (still used during migration)
export type {
  TemplateStructure,
  TemplateSection,
  TemplateItem,
  TemplateItemType,
  TitleItem,
  InputItem,
  BadgeItem,
  ImageItem,
  TemplateLanguage,
  CertificateFormData,
  ValidationResult,
} from './types/template.types'

// Compatibility layer types
export type {
  UnifiedSection,
  UnifiedItem,
  TemplateFormat,
} from './utils/template-compat'

export type {
  FormField,
  NodeSearchResult,
} from './utils/template-tree-utils'

export {
  transformBackendTemplate,
  serializeTemplateToJson,
} from './types/template.types'
