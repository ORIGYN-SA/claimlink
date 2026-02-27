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
   * - v2: { type: 'onchain', tokenData: V2TokenData, ... } or preview
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource?: any;
  /**
   * V2 template document. When provided with version='2.0.0', the v2 renderer
   * receives this as the `templateDocument` prop.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateDocument?: any;
  /** All other props are forwarded to the versioned renderer as-is. */
  [key: string]: unknown;
}

export function VersionedTemplateRenderer({
  version,
  dataSource,
  templateDocument,
  ...rest
}: VersionedTemplateRendererProps) {
  let resolvedVersion = version;

  if (!resolvedVersion) {
    // V2: check templateDocument.version
    if (templateDocument?.version) {
      resolvedVersion = templateDocument.version;
    }
    // V1: check dataSource.metadata.templateVersion
    else if (dataSource?.type === 'onchain' && dataSource.metadata?.templateVersion) {
      resolvedVersion = dataSource.metadata.templateVersion;
    } else {
      resolvedVersion = DEFAULT_TEMPLATE_VERSION;
    }
  }

  const { Renderer } = getRendererForVersion(resolvedVersion);

  return <Renderer dataSource={dataSource} templateDocument={templateDocument} {...rest} />;
}
