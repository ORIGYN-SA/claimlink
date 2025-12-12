/**
 * Template Query Hooks
 *
 * React Query hooks for template data fetching.
 * Uses TemplateService for data access abstraction.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateService } from './templates.service';

/**
 * Query key factory for templates
 */
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
  byCollection: (collectionId: string) =>
    [...templateKeys.all, 'collection', collectionId] as const,
  byCategory: (category: string) =>
    [...templateKeys.all, 'category', category] as const,
};

/**
 * Fetch all templates
 */
export const useTemplates = () => {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => TemplateService.getTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes - templates rarely change
  });
};

/**
 * Fetch a single template by ID
 */
export const useTemplate = (templateId: string) => {
  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => TemplateService.getTemplateById(templateId),
    enabled: !!templateId,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch the template associated with a collection
 */
export const useCollectionTemplate = (collectionId: string) => {
  return useQuery({
    queryKey: templateKeys.byCollection(collectionId),
    queryFn: () => TemplateService.getTemplateByCollectionId(collectionId),
    enabled: !!collectionId,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch templates by category
 */
export const useTemplatesByCategory = (
  category: 'manual' | 'ai' | 'existing' | 'preset'
) => {
  return useQuery({
    queryKey: templateKeys.byCategory(category),
    queryFn: () => TemplateService.getTemplatesByCategory(category),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch free templates
 */
export const useFreeTemplates = () => {
  return useQuery({
    queryKey: [...templateKeys.all, 'free'],
    queryFn: () => TemplateService.getFreeTemplates(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch premium templates
 */
export const usePremiumTemplates = () => {
  return useQuery({
    queryKey: [...templateKeys.all, 'premium'],
    queryFn: () => TemplateService.getPremiumTemplates(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Associate a template with a collection
 */
export const useSetCollectionTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      templateId,
    }: {
      collectionId: string;
      templateId: string;
    }) => TemplateService.setCollectionTemplate(collectionId, templateId),
    onSuccess: (_, { collectionId }) => {
      // Invalidate the collection template query
      queryClient.invalidateQueries({
        queryKey: templateKeys.byCollection(collectionId),
      });
    },
  });
};
