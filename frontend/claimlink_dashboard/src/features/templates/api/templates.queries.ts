/**
 * Template Query Hooks
 *
 * React Query hooks for template data fetching via ClaimLink backend.
 * Uses TemplateService for data access abstraction.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { TemplateService } from './templates.service';
import type { Template } from '../types/template.types';

/**
 * Query key factory for templates
 */
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  myTemplates: (ownerId?: string) =>
    [...templateKeys.all, 'my', ownerId] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
  byCategory: (category: string) =>
    [...templateKeys.all, 'category', category] as const,
};

interface UseMyTemplatesOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Fetch templates owned by the current user
 *
 * This is the main hook for fetching user's templates from the backend.
 */
export const useMyTemplates = (options?: UseMyTemplatesOptions) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();
  const { offset, limit, enabled = true } = options || {};

  return useQuery({
    queryKey: templateKeys.myTemplates(principalId),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      return await TemplateService.getTemplatesByOwner(
        unauthenticatedAgent,
        Principal.fromText(principalId),
        { offset, limit }
      );
    },
    enabled: enabled && isConnected && !!unauthenticatedAgent && !!principalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

interface UseTemplateOptions {
  templateId: string;
  enabled?: boolean;
}

/**
 * Fetch a single template by ID
 *
 * Requires authentication as templates are owned by users.
 */
export const useTemplate = (options: UseTemplateOptions) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();
  const { templateId, enabled = true } = options;

  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      return await TemplateService.getTemplateById(
        unauthenticatedAgent,
        Principal.fromText(principalId),
        templateId
      );
    },
    enabled:
      enabled &&
      isConnected &&
      !!unauthenticatedAgent &&
      !!principalId &&
      !!templateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

interface UseTemplatesByCategoryOptions {
  category: 'manual' | 'ai' | 'existing' | 'preset';
  enabled?: boolean;
}

/**
 * Fetch templates by category
 */
export const useTemplatesByCategory = (options: UseTemplatesByCategoryOptions) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();
  const { category, enabled = true } = options;

  return useQuery({
    queryKey: templateKeys.byCategory(category),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      return await TemplateService.getTemplatesByCategory(
        unauthenticatedAgent,
        Principal.fromText(principalId),
        category
      );
    },
    enabled: enabled && isConnected && !!unauthenticatedAgent && !!principalId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

interface UseCreateTemplateOptions {
  onSuccess?: (templateId: bigint) => void;
  onError?: (error: Error) => void;
}

/**
 * Create a new template
 *
 * Mutation hook for saving templates to the backend.
 */
export const useCreateTemplate = (options?: UseCreateTemplateOptions) => {
  const { authenticatedAgent, isConnected } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Template) => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      return await TemplateService.createTemplate(authenticatedAgent, template);
    },
    onSuccess: (templateId) => {
      // Invalidate template queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: templateKeys.all });

      if (options?.onSuccess) {
        options.onSuccess(templateId);
      }
    },
    onError: (error: Error) => {
      console.error('Failed to create template:', error);

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Fetch free templates (non-premium)
 */
export const useFreeTemplates = () => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: [...templateKeys.all, 'free'],
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      return await TemplateService.getFreeTemplates(
        unauthenticatedAgent,
        Principal.fromText(principalId)
      );
    },
    enabled: isConnected && !!unauthenticatedAgent && !!principalId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetch premium templates
 */
export const usePremiumTemplates = () => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: [...templateKeys.all, 'premium'],
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      return await TemplateService.getPremiumTemplates(
        unauthenticatedAgent,
        Principal.fromText(principalId)
      );
    },
    enabled: isConnected && !!unauthenticatedAgent && !!principalId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};
