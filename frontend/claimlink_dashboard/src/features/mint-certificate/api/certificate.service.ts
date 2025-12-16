/**
 * Certificate Minting Service Layer
 *
 * Abstracts certificate minting operations for easy backend swap.
 * Currently uses mock data from shared/data/certificates.ts.
 * TODO: Replace with ClaimLink backend API when ready.
 */

import type { Certificate } from '@/features/certificates/types/certificate.types';

export interface MintCertificateRequest {
  collectionId: string;
  _templateId: string;
  formData: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface TransferCertificateRequest {
  certificateId: string;
  recipientPrincipal: string;
}

export class CertificateService {
  /**
   * Mint a new certificate
   */
  static async mintCertificate(
    request: MintCertificateRequest
  ): Promise<Certificate> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.mint_certificate(request);

    // Mock implementation
    return Promise.resolve({
      id: `cert-${Date.now()}`,
      title: String(request.formData.title || 'Untitled Certificate'),
      collectionName: `Collection ${request.collectionId}`,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      status: 'Minted',
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  }

  /**
   * Transfer certificate ownership
   */
  static async transferCertificate(
    _request: TransferCertificateRequest
  ): Promise<void> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.transfer_certificate(request.certificateId, request.recipientPrincipal);

    // Mock implementation
    return Promise.resolve();
  }

  /**
   * Get minting price estimate
   */
  static async getMintingPrice(
    _collectionId: string,
    _templateId: string
  ): Promise<{
    basePrice: number;
    platformFee: number;
    total: number;
    currency: string;
  }> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_minting_price(collectionId, templateId);

    // Mock implementation
    return Promise.resolve({
      basePrice: 10,
      platformFee: 2,
      total: 12,
      currency: 'ICP',
    });
  }

  /**
   * Validate certificate form data against template
   */
  static async validateCertificateData(
    _templateId: string,
    formData: Record<string, unknown>
  ): Promise<{ valid: boolean; errors?: Record<string, string> }> {
    // TODO: Replace with backend validation
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.validate_certificate_data(templateId, formData);

    // Mock implementation - basic validation
    const errors: Record<string, string> = {};
    if (!formData.title) {
      errors.title = 'Title is required';
    }

    return Promise.resolve({
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    });
  }
}
