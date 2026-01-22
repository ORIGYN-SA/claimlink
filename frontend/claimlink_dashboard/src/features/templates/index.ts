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

export {
  serializeTemplateForOrigyn,
  deserializeTemplateFromOrigyn,
  hasTemplateStructure,
  TEMPLATE_STRUCTURE_KEY,
} from './utils/template-serializer'

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
} from './types/template.types'
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

export {
  transformBackendTemplate,
  serializeTemplateToJson,
} from './types/template.types'
