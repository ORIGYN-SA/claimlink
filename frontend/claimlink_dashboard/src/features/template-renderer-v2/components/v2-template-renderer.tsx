/**
 * V2 Template Renderer
 *
 * Main entry point for the v2 rendering system.
 * Wraps content in V2TemplateContextProvider and renders via V2ViewRenderer.
 * Registered as '2.0.0' in the renderer registry.
 */

import type { V2TemplateDocument, V2RenderDataSource } from '../types';
import { V2TemplateContextProvider } from '../context/v2-template-context';
import { V2ViewRenderer } from './v2-view-renderer';

export interface V2TemplateRendererProps {
  templateDocument: V2TemplateDocument;
  dataSource: V2RenderDataSource;
  canisterId: string;
  tokenId?: string;
  collectionId?: string;
  language?: string;
  activeViewId?: string;
  className?: string;
}

export function V2TemplateRenderer({
  templateDocument,
  dataSource,
  canisterId,
  tokenId,
  collectionId,
  language = 'en',
  activeViewId,
  className,
}: V2TemplateRendererProps) {
  if (!templateDocument) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('V2TemplateRenderer: templateDocument prop is required');
    }
    return null;
  }

  if (!canisterId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('V2TemplateRenderer: canisterId prop is required');
    }
    return null;
  }

  return (
    <V2TemplateContextProvider
      templateDocument={templateDocument}
      dataSource={dataSource}
      canisterId={canisterId}
      tokenId={tokenId}
      collectionId={collectionId}
      language={language}
      activeViewId={activeViewId}
    >
      <div className={className}>
        <V2ViewRenderer />
      </div>
    </V2TemplateContextProvider>
  );
}
