/**
 * QR Code Service
 *
 * Handles QR code generation, URL formatting, and download functionality
 * for certificate verification.
 */

export interface QRCodeOptions {
  size?: number;           // QR size in pixels (default: 256)
  level?: 'L' | 'M' | 'Q' | 'H';  // Error correction level
  includeMargin?: boolean; // Margin around QR (default: true)
}

export class QRCodeService {
  /**
   * Generate QR code URL for public certificate page
   * Format: https://<canister>.icp0.io/certificate/<collectionId>:<tokenId>
   *
   * @param collectionId - Collection canister ID
   * @param tokenId - Token ID within collection
   * @returns Public certificate URL for QR code
   */
  static getCertificateVerificationUrl(
    collectionId: string,
    tokenId: string
  ): string {
    const isProd = import.meta.env.MODE === 'production';
    const frontendCanisterId = import.meta.env.VITE_CANISTER_ID_CLAIMLINK_FRONTEND;

    if (isProd && frontendCanisterId) {
      return `https://${frontendCanisterId}.icp0.io/certificate/${collectionId}:${tokenId}`;
    }

    // Development: Use localhost
    return `http://localhost:5173/certificate/${collectionId}:${tokenId}`;
  }

  /**
   * Download QR code canvas as PNG file
   *
   * @param canvasElement - HTMLCanvasElement containing the QR code
   * @param filename - Desired filename for download
   */
  static async downloadQRCode(
    canvasElement: HTMLCanvasElement,
    filename: string = 'certificate-qr.png'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      canvasElement.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate QR code image'));
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      });
    });
  }

  /**
   * Generate sanitized filename for QR code download
   * Format: qr-{certificateTitle}-{timestamp}.png
   *
   * @param certificateTitle - Certificate title to include in filename
   * @returns Sanitized filename
   */
  static generateFilename(certificateTitle: string): string {
    const sanitized = certificateTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const timestamp = new Date().getTime();
    return `qr-${sanitized}-${timestamp}.png`;
  }
}
