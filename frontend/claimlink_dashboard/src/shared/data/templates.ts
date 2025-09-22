// Template data types
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  isPremium: boolean;
  price?: number;
}

// Mock templates data - shared across the application
export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Classic Certificate",
    description: "Traditional certificate design with elegant typography",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Classic",
    isPremium: false,
  },
  {
    id: "2",
    name: "Modern Minimalist",
    description: "Clean and modern certificate design",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Modern",
    isPremium: false,
  },
  {
    id: "3",
    name: "Artistic Frame",
    description: "Certificate with artistic decorative elements",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Artistic",
    isPremium: true,
    price: 9.99,
  },
  {
    id: "4",
    name: "Corporate Professional",
    description: "Professional certificate for corporate use",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Corporate",
    isPremium: false,
  },
  {
    id: "5",
    name: "Vintage Style",
    description: "Classic vintage certificate design",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Vintage",
    isPremium: true,
    price: 14.99,
  },
  {
    id: "6",
    name: "Digital Tech",
    description: "Modern tech-inspired certificate design",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Tech",
    isPremium: false,
  },
  {
    id: "7",
    name: "Award Certificate",
    description: "Special award certificate design",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Award",
    isPremium: true,
    price: 19.99,
  },
  {
    id: "8",
    name: "Educational Standard",
    description: "Standard educational certificate",
    previewImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    category: "Education",
    isPremium: false,
  },
];

// Helper functions for working with templates
export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return mockTemplates.filter((template) => template.category === category);
};

export const getFreeTemplates = (): Template[] => {
  return mockTemplates.filter((template) => !template.isPremium);
};

export const getPremiumTemplates = (): Template[] => {
  return mockTemplates.filter((template) => template.isPremium);
};
