/**
 * Renderer Registry
 *
 * Maps template versions to their corresponding renderer components.
 * When a new template format is introduced, register a new renderer here
 * so existing tokens continue to render with their original renderer.
 */

import { TemplateRenderer } from '../components/template-renderer';
import {
  DEFAULT_TEMPLATE_VERSION,
  type TemplateVersion,
  type VersionedRendererEntry,
} from './template-version';

const registry: Record<TemplateVersion, VersionedRendererEntry> = {
  '1.0.0': {
    Renderer: TemplateRenderer,
    label: 'v1.0.0',
  },
};

/**
 * Get the renderer entry for a given template version.
 * Falls back to DEFAULT_TEMPLATE_VERSION with a console warning
 * if the requested version is not registered.
 */
export function getRendererForVersion(version?: string): VersionedRendererEntry {
  const v = version ?? DEFAULT_TEMPLATE_VERSION;

  if (registry[v]) {
    return registry[v];
  }

  console.warn(
    `[template-renderer] No renderer registered for version "${v}". ` +
    `Falling back to "${DEFAULT_TEMPLATE_VERSION}".`
  );
  return registry[DEFAULT_TEMPLATE_VERSION];
}

/** Check whether a renderer is registered for the given version. */
export function hasRendererForVersion(version: string): boolean {
  return version in registry;
}

/** List all registered template versions. */
export function getRegisteredVersions(): TemplateVersion[] {
  return Object.keys(registry);
}
