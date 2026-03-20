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


export class TemplateService {
  /**
   * Create a new template
   *
   * @param agent - Authenticated IC agent
   * @param template - Template data to create
   * @returns The created template ID (bigint)
   * @throws Error if creation fails
   */
  /**
   * Maximum template_json size that fits safely within the IC 2MB ingress limit.
   * Leaves room for Candid encoding, IC envelope, and NFID delegation chain.
   */
  private static readonly MAX_TEMPLATE_JSON_BYTES = 1.5 * 1024 * 1024;

  static async createTemplate(
    agent: Agent,
    template: Template
  ): Promise<bigint> {
    const actor = createActor(agent);
    const templateJson = serializeTemplateToJson(template);

    // Pre-flight size check — IC ingress messages are limited to 2MB.
    // The template_json is the dominant payload; catch oversized templates
    // before they hit the replica and produce an opaque Candid decoding error.
    const jsonByteSize = new TextEncoder().encode(templateJson).byteLength;
    if (jsonByteSize > TemplateService.MAX_TEMPLATE_JSON_BYTES) {
      const sizeMB = (jsonByteSize / (1024 * 1024)).toFixed(2);
      throw new Error(
        `Template is too large (${sizeMB}MB). The Internet Computer limits messages to 2MB. ` +
        `Try using a smaller background image or reducing template complexity.`
      );
    }

    const result: Result_1 = await actor.create_template({
      template_json: templateJson,
    });

    if ('Err' in result) {
      throw new Error(formatCreateTemplateError(result.Err));
    }

    return result.Ok;
  }

  /**
   * Get template IDs owned by a specific principal
   *
   * Lightweight call that returns only IDs, avoiding the IC 3MB reply limit.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param owner - Principal ID of template owner
   * @returns Template IDs and total count
   */
  static async getTemplateIdsByOwner(
    agent: Agent,
    owner: Principal
  ): Promise<{ templateIds: bigint[]; totalCount: number }> {
    const actor = createActor(agent);

    const result = await actor.get_template_ids_by_owner({ owner });

    return {
      templateIds: result.template_ids,
      totalCount: Number(result.total_count),
    };
  }

  /**
   * Get a template by its ID
   *
   * Uses the dedicated get_template_by_id query for efficient single-template fetching.
   *
   * @param agent - IC agent
   * @param templateId - Template ID to find
   * @returns Template if found, undefined otherwise
   */
  static async getTemplateById(
    agent: Agent,
    templateId: string
  ): Promise<Template | undefined> {
    const actor = createActor(agent);

    const result: Result_4 = await actor.get_template_by_id({
      template_id: BigInt(templateId),
    });

    if ('Err' in result) {
      if ('TemplateNotFound' in result.Err) {
        return undefined;
      }
      throw new Error('Failed to fetch template');
    }

    return transformBackendTemplate(result.Ok);
  }

  /**
   * Get all templates owned by a specific principal
   *
   * Uses a scatter-gather pattern: fetches lightweight IDs first,
   * then fetches each template individually in parallel.
   * This avoids the IC 3MB reply limit when templates contain large
   * base64 background images.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param owner - Principal ID of template owner
   * @returns Templates and total count
   */
  static async getTemplatesByOwner(
    agent: Agent,
    owner: Principal,
    pagination?: { offset?: number; limit?: number }
  ): Promise<{ templates: Template[]; totalCount: number }> {
    // Step 1: Fetch lightweight IDs
    const { templateIds, totalCount } = await this.getTemplateIdsByOwner(agent, owner);

    if (templateIds.length === 0) {
      return { templates: [], totalCount: 0 };
    }

    // Apply client-side pagination to IDs
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? templateIds.length;
    const paginatedIds = templateIds.slice(offset, offset + limit);

    // Step 2: Fetch each template individually in parallel
    const templatePromises = paginatedIds.map((id) =>
      this.getTemplateById(agent, id.toString())
    );
    const results = await Promise.all(templatePromises);

    // Filter out any undefined (deleted/missing templates)
    const templates = results.filter((t): t is Template => t !== undefined);

    return { templates, totalCount };
  }

  /**
   * Get just the template structure for a given template
   *
   * @param agent - IC agent
   * @param templateId - Template ID
   * @returns TemplateStructure if found
   */
  static async getTemplateStructure(
    agent: Agent,
    templateId: string
  ): Promise<TemplateStructure | undefined> {
    const template = await this.getTemplateById(agent, templateId);
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
