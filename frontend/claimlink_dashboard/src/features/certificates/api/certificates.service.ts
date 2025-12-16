/**
 * Certificates Service Layer
 *
 * Abstracts certificate data access for easy backend swap.
 * Currently uses mock data from shared/data/certificates.ts.
 * TODO: Replace with ClaimLink backend API when ready.
 */

import type { Certificate } from '../types/certificate.types';
import { mockCertificates } from '@/shared/data/certificates';

export interface CertificateFilters {
  status?: string;
  collectionId?: string;
  search?: string;
}

export class CertificatesService {
  /**
   * Get all certificates
   */
  static async getCertificates(
    filters?: CertificateFilters
  ): Promise<Certificate[]> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_certificates(filters);

    let certificates = [...mockCertificates];

    // Apply filters
    if (filters?.status) {
      certificates = certificates.filter((cert) => cert.status === filters.status);
    }
    if (filters?.collectionId) {
      certificates = certificates.filter(
        (cert) => cert.id === filters.collectionId
      );
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      certificates = certificates.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchLower) ||
          cert.collectionName.toLowerCase().includes(searchLower)
      );
    }

    return Promise.resolve(certificates);
  }

  /**
   * Get a certificate by its ID
   */
  static async getCertificateById(id: string): Promise<Certificate | undefined> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_certificate(id);

    const certificate = mockCertificates.find((cert) => cert.id === id);
    return Promise.resolve(certificate);
  }

  /**
   * Get certificates by collection ID
   */
  static async getCertificatesByCollection(
    _collectionId: string
  ): Promise<Certificate[]> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_certificates_by_collection(collectionId);

    // Mock implementation - filter by collection name (in real app, would use collectionId)
    return Promise.resolve(mockCertificates);
  }

  /**
   * Get certificate statistics
   */
  static async getCertificateStats(): Promise<{
    total: number;
    minted: number;
    transferred: number;
    waiting: number;
  }> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_certificate_stats();

    const certificates = mockCertificates;
    return Promise.resolve({
      total: certificates.length,
      minted: certificates.filter((c) => c.status === 'Minted').length,
      transferred: certificates.filter((c) => c.status === 'Transferred').length,
      waiting: certificates.filter((c) => c.status === 'Waiting').length,
    });
  }
}
