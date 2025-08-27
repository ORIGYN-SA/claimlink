export interface Template {
  id: string
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing'
  certificateCount?: number
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
  metadata?: Record<string, any>
}

export interface CreateTemplateInput {
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing'
  metadata?: Record<string, any>
}

export interface TemplateCardProps {
  template?: Template
  variant: 'create-manual' | 'create-ai' | 'create-existing' | 'template'
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
