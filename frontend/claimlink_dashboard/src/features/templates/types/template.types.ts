import type { Template } from "@/shared/data/templates"

export interface CreateTemplateInput {
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing'
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
