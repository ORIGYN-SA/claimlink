// ============================================================================
// Components
// ============================================================================

export { TemplatesPage } from './components/templates-page'
export { TemplateCard } from './components/template-card'
export { NewTemplatePage } from './components/new-template-page'
export { EditTemplatePage } from './components/edit-template-page'
export { ChooseTemplateStep } from './components/choose-template-step'
export { EditTemplateStepV2 } from './components/edit-template-step-v2'
export { TemplateSectionCard } from './components/template-section-card'
export { TemplateItemRow } from './components/template-item-row'
export { PreviewDeployStep } from './components/preview-deploy-step'
export { Stepper } from './components/stepper'

// ============================================================================
// API Layer
// ============================================================================

export { TemplateService } from './api/templates.service'
export {
  templateKeys,
  useTemplates,
  useTemplate,
  useCollectionTemplate,
  useTemplatesByCategory,
  useFreeTemplates,
  usePremiumTemplates,
  useSetCollectionTemplate,
} from './api/templates.queries'

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
