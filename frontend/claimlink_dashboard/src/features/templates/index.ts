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
  useTemplates,
  useTemplate,
  useTemplatesByCategory,
  useFreeTemplates,
  usePremiumTemplates,
} from './api/templates.queries'

/**
 * @deprecated Use `useCollectionTemplate` and `useSetCollectionTemplate` from '@/features/collections' instead.
 * The collections hooks fetch/store templates in on-chain collection metadata.
 */
export {
  useCollectionTemplate as useCollectionTemplateLegacy,
  useSetCollectionTemplate as useSetCollectionTemplateLegacy,
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

export type { CreateTemplateInput, TemplateCardProps, TemplateFilters, PaginationState } from './types/template.types'
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
