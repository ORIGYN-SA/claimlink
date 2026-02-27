/**
 * Template Version Constants & Types
 *
 * Defines the version-stamping system for ORIGYN NFT certificate templates.
 * Every token minted carries a version in its metadata so the correct
 * renderer can be selected when viewing.
 */

import type { ComponentType } from "react";

/** Current template version stamped on newly minted tokens. */
export const CURRENT_TEMPLATE_VERSION = "1.0.0";

/** Fallback version assigned to tokens that have no version field. */
export const DEFAULT_TEMPLATE_VERSION = "1.0.0";

/** ICRC3 metadata key used to store the template version. */
export const TEMPLATE_VERSION_KEY = "claimlink.template.version";

/** A version string (semver). */
export type TemplateVersion = string;

/**
 * Registry entry mapping a version to its renderer.
 *
 * Each version can define its own props shape — the versioned dispatcher
 * passes all remaining props through, so the renderer is responsible for
 * interpreting them according to its version's data model.
 */
export interface VersionedRendererEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer: ComponentType<any>;
  label: string;
}
