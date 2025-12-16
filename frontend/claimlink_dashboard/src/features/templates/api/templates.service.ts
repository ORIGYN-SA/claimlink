/**
 * Template Service Layer
 *
 * Abstracts template data access for easy backend swap.
 * Currently uses mock data from shared/data/templates.ts.
 * TODO: Replace with ClaimLink backend API when ready.
 */

import type { Template } from '@/shared/data/templates';
import type { TemplateStructure } from '../types/template.types';
import {
  mockTemplates,
  getTemplateById as getMockTemplateById,
} from '@/shared/data/templates';

// In-memory mapping of collection IDs to template IDs
// TODO: This will be replaced by backend storage
const collectionTemplateMap = new Map<string, string>();

export class TemplateService {
  /**
   * Get all available templates
   */
  static async getTemplates(): Promise<Template[]> {
    // TODO: Replace with backend API call
    // return await fetch('/api/templates').then(r => r.json());
    return Promise.resolve(mockTemplates);
  }

  /**
   * Get a template by its ID
   */
  static async getTemplateById(id: string): Promise<Template | undefined> {
    // TODO: Replace with backend API call
    // return await fetch(`/api/templates/${id}`).then(r => r.json());
    return Promise.resolve(getMockTemplateById(id));
  }

  /**
   * Get the template associated with a collection
   * For now, returns the first mock template as default
   */
  static async getTemplateByCollectionId(
    collectionId: string
  ): Promise<Template | undefined> {
    // Check if we have a mapping for this collection
    const templateId = collectionTemplateMap.get(collectionId);
    if (templateId) {
      return this.getTemplateById(templateId);
    }

    // TODO: Replace with backend API call
    // return await fetch(`/api/collections/${collectionId}/template`).then(r => r.json());

    // Default fallback: return first mock template
    return Promise.resolve(mockTemplates[0]);
  }

  /**
   * Get just the template structure for a given template ID
   */
  static async getTemplateStructure(
    templateId: string
  ): Promise<TemplateStructure | undefined> {
    const template = await this.getTemplateById(templateId);
    return template?.structure;
  }

  /**
   * Associate a template with a collection
   * Called when deploying a template to a collection
   */
  static async setCollectionTemplate(
    collectionId: string,
    templateId: string
  ): Promise<void> {
    // Store in memory for now
    collectionTemplateMap.set(collectionId, templateId);

    // TODO: Replace with backend API call
    // await fetch(`/api/collections/${collectionId}/template`, {
    //   method: 'POST',
    //   body: JSON.stringify({ templateId }),
    // });
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(
    category: 'manual' | 'ai' | 'existing' | 'preset'
  ): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates.filter((t) => t.category === category);
  }

  /**
   * Get free templates (non-premium)
   */
  static async getFreeTemplates(): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates.filter((t) => !t.metadata?.premium);
  }

  /**
   * Get premium templates
   */
  static async getPremiumTemplates(): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates.filter((t) => t.metadata?.premium);
  }
}
