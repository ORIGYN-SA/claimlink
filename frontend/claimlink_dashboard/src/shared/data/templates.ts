// Template data type - unified for all use cases
export interface Template {
  id: string
  name: string
  description: string
  category: 'manual' | 'ai' | 'existing' | 'preset'
  certificateCount?: number
  createdAt?: Date
  updatedAt?: Date
  thumbnail?: string
  metadata?: Record<string, any>
}

// Mock templates data - shared across the application
export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Classic Certificate Template",
    description: "Traditional certificate design with elegant typography",
    category: "existing",
    certificateCount: 12,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "classic", premium: false }
  },
  {
    id: "2",
    name: "Modern Minimalist Template",
    description: "Clean and modern certificate design",
    category: "existing",
    certificateCount: 8,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "modern", premium: false }
  },
  {
    id: "3",
    name: "Artistic Frame Template",
    description: "Certificate with artistic decorative elements",
    category: "existing",
    certificateCount: 15,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-25'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "artistic", premium: true, price: 9.99 }
  },
  {
    id: "4",
    name: "Corporate Professional Template",
    description: "Professional certificate for corporate use",
    category: "existing",
    certificateCount: 22,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-28'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "corporate", premium: false }
  },
  {
    id: "5",
    name: "Vintage Style Template",
    description: "Classic vintage certificate design",
    category: "existing",
    certificateCount: 6,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-22'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "vintage", premium: true, price: 14.99 }
  },
  {
    id: "6",
    name: "Digital Tech Template",
    description: "Modern tech-inspired certificate design",
    category: "existing",
    certificateCount: 9,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-26'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "tech", premium: false }
  },
  {
    id: "7",
    name: "Award Certificate Template",
    description: "Special award certificate design",
    category: "existing",
    certificateCount: 18,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-27'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "award", premium: true, price: 19.99 }
  },
  {
    id: "8",
    name: "Educational Standard Template",
    description: "Standard educational certificate",
    category: "existing",
    certificateCount: 11,
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-29'),
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    metadata: { style: "education", premium: false }
  },
];

// Helper functions for working with templates
export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: 'manual' | 'ai' | 'existing'): Template[] => {
  return mockTemplates.filter((template) => template.category === category);
};

export const getFreeTemplates = (): Template[] => {
  return mockTemplates.filter((template) => !template.metadata?.premium);
};

export const getPremiumTemplates = (): Template[] => {
  return mockTemplates.filter((template) => template.metadata?.premium);
};

// Template options for the choose template page
export const templateOptions: Template[] = [
  {
    id: "art",
    name: "Art",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "diamond",
    name: "Diamond",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "gold",
    name: "Gold",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "watches",
    name: "Watches",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "cars",
    name: "Cars",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "spirit",
    name: "Spirit",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "luxury_good",
    name: "Luxury good",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  },
  {
    id: "made_in",
    name: "Made in",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=76&h=76&fit=crop",
    category: "preset"
  }
];

// Manual template option
export const manualTemplateOption: Template = {
  id: "code_it",
  name: "Code it",
  description: "Create manually your template with your developers",
  category: "manual"
};
