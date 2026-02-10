/**
 * Versioned Template Renderer
 *
 * Wrapper that resolves the correct renderer for the token's template version.
 * If an explicit `version` prop is provided it takes precedence; otherwise
 * the version is extracted from the on-chain metadata (via
 * `dataSource.metadata.templateVersion`). Tokens without a version field
 * default to '1.0.0' and render identically to today.
 */

import { DEFAULT_TEMPLATE_VERSION } from '../version/template-version';
import { getRendererForVersion } from '../version/renderer-registry';
import type { TemplateRendererProps } from './template-renderer';

export interface VersionedTemplateRendererProps extends TemplateRendererProps {
  /** Explicit version override. When omitted the version is read from metadata. */
  version?: string;
}

export function VersionedTemplateRenderer({
  version,
  dataSource,
  ...rest
}: VersionedTemplateRendererProps) {
  let resolvedVersion = version;

  if (!resolvedVersion) {
    if (dataSource.type === 'onchain' && dataSource.metadata.templateVersion) {
      resolvedVersion = dataSource.metadata.templateVersion;
    } else {
      resolvedVersion = DEFAULT_TEMPLATE_VERSION;
    }
  }

  const { Renderer } = getRendererForVersion(resolvedVersion);

  return <Renderer dataSource={dataSource} {...rest} />;
}
