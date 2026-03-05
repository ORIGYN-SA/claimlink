/**
 * Template Service Layer
 *
 * Handles all template-related operations via the ClaimLink backend canister.
 * Templates are stored in the backend as JSON strings and linked to collections.
 */

import type { Agent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import { idlFactory } from '@canisters/claimlink';
import type {
  _SERVICE,
  Result_1,
  Result_4,
} from '@canisters/claimlink';
import type {
  Template,
  TemplateStructure,
} from '../types/template.types';
import {
  transformBackendTemplate,
  serializeTemplateToJson,
} from '../types/template.types';
import { createCanisterActor, getCanisterId } from '@/shared/canister';

/**
 * Create a ClaimLink canister actor
 */
function createActor(agent: Agent): _SERVICE {
  return createCanisterActor<_SERVICE>(
    agent,
    getCanisterId('claimlink'),
    idlFactory
  );
}

/**
 * Format create template error to user-friendly message
 */
function formatCreateTemplateError(
  error: { JsonError: string } | { LimitExceeded: { max_templates: bigint } }
): string {
  if ('JsonError' in error) {
    return `Invalid template format: ${error.JsonError}`;
  }
  if ('LimitExceeded' in error) {
    return `Template limit reached. Maximum ${error.LimitExceeded.max_templates} templates allowed.`;
  }
  return 'Unknown error creating template';
}

/**
 * Format get templates error to user-friendly message
 */
function formatGetTemplatesError(
  error: { UnauthorizedCall: null }
): string {
  if ('UnauthorizedCall' in error) {
    return 'Unauthorized to access templates';
  }
  return 'Unknown error fetching templates';
}

export class TemplateService {
  /**
   * Create a new template
   *
   * @param agent - Authenticated IC agent
   * @param template - Template data to create
   * @returns The created template ID (bigint)
   * @throws Error if creation fails
   */
  static async createTemplate(
    agent: Agent,
    template: Template
  ): Promise<bigint> {
    const actor = createActor(agent);
    const templateJson = serializeTemplateToJson(template);

    const result: Result_1 = await actor.create_template({
      template_json: templateJson,
    });

    if ('Err' in result) {
      throw new Error(formatCreateTemplateError(result.Err));
    }

    return result.Ok;
  }

  /**
   * Get templates owned by a specific principal
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param owner - Principal ID of template owner
   * @param pagination - Optional pagination parameters
   * @returns Templates and total count
   */
  static async getTemplatesByOwner(
    agent: Agent,
    owner: Principal,
    pagination?: { offset?: number; limit?: number }
  ): Promise<{ templates: Template[]; totalCount: number }> {
    const actor = createActor(agent);

    const result: Result_4 = await actor.get_templates_by_owner({
      owner,
      pagination: {
        offset: pagination?.offset !== undefined ? [BigInt(pagination.offset)] : [],
        limit: pagination?.limit !== undefined ? [BigInt(pagination.limit)] : [],
      },
    });

    if ('Err' in result) {
      throw new Error(formatGetTemplatesError(result.Err));
    }

    const { templates, total_count } = result.Ok;

    return {
      templates: templates.map(transformBackendTemplate),
      totalCount: Number(total_count),
    };
  }

  /**
   * Get a template by its ID
   *
   * Fetches all templates owned by the user and finds the one with matching ID.
   * Note: The backend doesn't have a direct get_template_by_id endpoint yet.
   *
   * @param agent - IC agent
   * @param owner - Template owner's principal
   * @param templateId - Template ID to find
   * @returns Template if found, undefined otherwise
   */
  static async getTemplateById(
    agent: Agent,
    owner: Principal,
    templateId: string
  ): Promise<Template | undefined> {
    const { templates } = await this.getTemplatesByOwner(agent, owner, {
      limit: 100, // Get all templates for now
    });

    return templates.find((t) => t.id === templateId);
  }

  /**
   * Get just the template structure for a given template
   *
   * @param agent - IC agent
   * @param owner - Template owner's principal
   * @param templateId - Template ID
   * @returns TemplateStructure if found
   */
  static async getTemplateStructure(
    agent: Agent,
    owner: Principal,
    templateId: string
  ): Promise<TemplateStructure | undefined> {
    const template = await this.getTemplateById(agent, owner, templateId);
    return template?.structure;
  }

  /**
   * Get templates filtered by category
   *
   * @param agent - IC agent
   * @param owner - Template owner's principal
   * @param category - Category to filter by
   * @returns Filtered templates
   */
  static async getTemplatesByCategory(
    agent: Agent,
    owner: Principal,
    category: 'manual' | 'ai' | 'existing' | 'preset'
  ): Promise<Template[]> {
    const { templates } = await this.getTemplatesByOwner(agent, owner, {
      limit: 100,
    });
    return templates.filter((t) => t.category === category);
  }

  /**
   * Get free templates (non-premium)
   *
   * @param agent - IC agent
   * @param owner - Template owner's principal
   * @returns Non-premium templates
   */
  static async getFreeTemplates(
    agent: Agent,
    owner: Principal
  ): Promise<Template[]> {
    const { templates } = await this.getTemplatesByOwner(agent, owner, {
      limit: 100,
    });
    return templates.filter((t) => !t.metadata?.premium);
  }

  /**
   * Get premium templates
   *
   * @param agent - IC agent
   * @param owner - Template owner's principal
   * @returns Premium templates only
   */
  static async getPremiumTemplates(
    agent: Agent,
    owner: Principal
  ): Promise<Template[]> {
    const { templates } = await this.getTemplatesByOwner(agent, owner, {
      limit: 100,
    });
    return templates.filter((t) => t.metadata?.premium);
  }
}
