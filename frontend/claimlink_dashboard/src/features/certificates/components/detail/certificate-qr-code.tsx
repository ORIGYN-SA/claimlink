import { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export interface CertificateQRCodeProps {
  value: string;              // URL to encode
  size?: number;              // QR size (default: 256)
  level?: 'L' | 'M' | 'Q' | 'H';  // Error correction level
  showLogo?: boolean;         // Whether to show ORIGYN logo overlay
  className?: string;
}

/**
 * Certificate QR Code Component
 *
 * Renders a QR code with certificate verification URL.
 * Supports ORIGYN logo overlay for branding.
 *
 * Use ref to access canvas element for download functionality.
 *
 * @example
 * ```tsx
 * const qrRef = useRef<HTMLCanvasElement>(null);
 *
 * <CertificateQRCode
 *   ref={qrRef}
 *   value="https://example.icp0.io/verify/abc:123"
 *   size={512}
 *   showLogo={true}
 * />
 * ```
 */
export const CertificateQRCode = forwardRef<HTMLCanvasElement, CertificateQRCodeProps>(
  ({ value, size = 256, level = 'M', showLogo = true, className }, ref) => {
    return (
      <div className={className}>
        <QRCodeCanvas
          ref={ref}
          value={value}
          size={size}
          level={level}
          includeMargin={true}
          imageSettings={showLogo ? {
            src: '/origyn-logo.png',        // Logo in public/ folder
            height: size * 0.15,             // 15% of QR size (recommended ratio)
            width: size * 0.15,
            excavate: true,                  // Clears QR pixels behind logo
          } : undefined}
        />
      </div>
    );
  }
);

CertificateQRCode.displayName = 'CertificateQRCode';
