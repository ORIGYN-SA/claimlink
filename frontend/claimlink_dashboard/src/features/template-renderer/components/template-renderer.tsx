/**
 * Template Renderer Component
 *
 * Main entry point for rendering ORIGYN templates.
 * Wraps content with context provider and handles both preview and on-chain modes.
 */

import type { TemplateNode, RenderDataSource, TemplateVariant } from '../types';
import { TemplateContextProvider } from '../context/template-context';
import { TemplateBlock } from './template-block';
import { cn } from '@/lib/utils';

export interface TemplateRendererProps {
  /** Template nodes to render */
  template: TemplateNode[];
  /** Data source - either preview (local form data) or on-chain (canister metadata) */
  dataSource: RenderDataSource;
  /** Canister ID for URL resolution */
  canisterId: string;
  /** Token ID for URL resolution (required for on-chain mode) */
  tokenId?: string;
  /** Collection ID for B2B storage */
  collectionId?: string;
  /** Language code for localized content (default: 'en') */
  language?: string;
  /** Rendering variant for context-specific styling */
  variant?: TemplateVariant;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Template Renderer - renders ORIGYN templates with full context support
 *
 * @example
 * // Preview mode (during minting)
 * <TemplateRenderer
 *   template={certificateTemplate}
 *   dataSource={{ type: 'preview', formData: myFormData, files: myFiles }}
 *   canisterId="abc123"
 *   language="en"
 * />
 *
 * @example
 * // On-chain mode (viewing minted certificate)
 * <TemplateRenderer
 *   template={metadata.templates.certificateTemplate}
 *   dataSource={{ type: 'onchain', metadata: parsedMetadata }}
 *   canisterId="abc123"
 *   tokenId="token456"
 *   language="it"
 * />
 */
export function TemplateRenderer({
  template,
  dataSource,
  canisterId,
  tokenId,
  collectionId,
  language = 'en',
  variant = 'default',
  className,
}: TemplateRendererProps) {
  // Validate required props
  if (!template || !Array.isArray(template)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('TemplateRenderer: template prop is required and must be an array');
    }
    return null;
  }

  if (!canisterId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('TemplateRenderer: canisterId prop is required');
    }
    return null;
  }

  return (
    <TemplateContextProvider
      dataSource={dataSource}
      canisterId={canisterId}
      tokenId={tokenId}
      collectionId={collectionId}
      language={language}
      variant={variant}
    >
      <div className={cn('bg-transparent px-2 w-full h-full box-border', className)}>
        <TemplateBlock nodes={template} />
      </div>
    </TemplateContextProvider>
  );
}

/**
 * Certificate Template Renderer - convenience wrapper for certificate view
 * Uses 'certificate' variant for formal certificate styling
 */
export function CertificateTemplateRenderer(
  props: Omit<TemplateRendererProps, 'className' | 'variant'>
) {
  return (
    <TemplateRenderer
      {...props}
      variant="certificate"
      className="certificate-template"
    />
  );
}

/**
 * Experience Template Renderer - convenience wrapper for experience/full page view
 * Uses 'information' variant for dark background styling
 */
export function ExperienceTemplateRenderer(
  props: Omit<TemplateRendererProps, 'className' | 'variant'>
) {
  return (
    <TemplateRenderer
      {...props}
      variant="information"
      className="experience-template"
    />
  );
}

/**
 * User View Template Renderer - convenience wrapper for simplified user view
 */
export function UserViewTemplateRenderer(
  props: Omit<TemplateRendererProps, 'className' | 'variant'>
) {
  return (
    <TemplateRenderer
      {...props}
      variant="default"
      className="user-view-template"
    />
  );
}
