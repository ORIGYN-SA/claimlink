import type { Template } from "@/shared/data/templates"

export interface CreateTemplateInput {
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing' | 'preset'
  metadata?: Record<string, any>
}

export interface TemplateCardProps {
  template: Template
  onClick?: () => void
}

export interface TemplateFilters {
  category?: string
  search?: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// Re-export template structure types
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
  TemplateTranslations,
  CertificateFormData,
  ValidationResult,
  CreateItemInput,
  SectionSummary,
  TemplateSectionName,
  BaseTemplateItem,
  ItemValidation,
} from './template-structure.types';
