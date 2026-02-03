export {
  CURRENT_TEMPLATE_VERSION,
  DEFAULT_TEMPLATE_VERSION,
  TEMPLATE_VERSION_KEY,
  type TemplateVersion,
  type VersionedRendererEntry,
} from './template-version';

export {
  getRendererForVersion,
  hasRendererForVersion,
  getRegisteredVersions,
} from './renderer-registry';
