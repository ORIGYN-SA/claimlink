/**
 * Versioned Template Renderer
 *
 * Wrapper that resolves the correct renderer for the token's template version.
 * If an explicit `version` prop is provided it takes precedence; otherwise
 * the version is extracted from the on-chain metadata (via
 * `dataSource.metadata.templateVersion`). Tokens without a version field
 * default to '1.0.0' and render identically to today.
 *
 * Each version can define its own props shape. The dispatcher passes all
 * props through — the versioned renderer is responsible for interpreting them.
 */

import { DEFAULT_TEMPLATE_VERSION } from '../version/template-version';
import { getRendererForVersion } from '../version/renderer-registry';

export interface VersionedTemplateRendererProps {
  /** Explicit version override. When omitted the version is read from metadata. */
  version?: string;
  /**
   * Data source for the renderer. Shape depends on the version:
   * - v1: { type: 'onchain', metadata: ParsedOrigynMetadata, ... }
   * - v2+: defined by the versioned renderer
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource?: any;
  /** All other props are forwarded to the versioned renderer as-is. */
  [key: string]: unknown;
}

export function VersionedTemplateRenderer({
  version,
  dataSource,
  ...rest
}: VersionedTemplateRendererProps) {
  let resolvedVersion = version;

  if (!resolvedVersion) {
    if (dataSource?.type === 'onchain' && dataSource.metadata?.templateVersion) {
      resolvedVersion = dataSource.metadata.templateVersion;
    } else {
      resolvedVersion = DEFAULT_TEMPLATE_VERSION;
    }
  }

  const { Renderer } = getRendererForVersion(resolvedVersion);

  return <Renderer dataSource={dataSource} {...rest} />;
}
