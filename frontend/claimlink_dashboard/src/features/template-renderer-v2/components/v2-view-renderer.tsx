/**
 * V2 View Renderer
 *
 * Picks a view by activeViewId, wraps content in the appropriate frame.
 */

import { useV2Context } from '../context/v2-template-context';
import type { V2CertificateFrameConfig, V2InformationFrameConfig } from '../types';
import { V2CertificateFrame } from './v2-certificate-frame';
import { V2InformationFrame } from './v2-information-frame';
import { V2ContentRenderer } from './v2-content-renderer';

export function V2ViewRenderer() {
  const { templateDocument, activeViewId } = useV2Context();

  const view = templateDocument.views.find((v) => v.id === activeViewId);
  if (!view) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`V2ViewRenderer: No view found for id "${activeViewId}"`);
    }
    return null;
  }

  switch (view.frameType) {
    case 'certificate':
      return (
        <V2CertificateFrame
          config={view.frame as V2CertificateFrameConfig | undefined}
          content={view.content}
        />
      );

    case 'information':
      return (
        <V2InformationFrame
          config={view.frame as V2InformationFrameConfig | undefined}
          content={view.content}
        />
      );

    case 'plain':
      return (
        <div className="w-full">
          <V2ContentRenderer content={view.content} variant="default" />
        </div>
      );

    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`V2ViewRenderer: Unknown frame type "${view.frameType}"`);
      }
      return null;
  }
}
