/**
 * Certificates Query Hooks
 *
 * React Query hooks for certificate data fetching.
 * Uses CertificatesService for data access abstraction.
 */

import { useQuery } from '@tanstack/react-query';
import {
  CertificatesService,
  type CertificateFilters,
} from './certificates.service';

/**
 * Query key factory for certificates
 */
export const certificatesKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificatesKeys.all, 'list'] as const,
  list: (filters?: CertificateFilters) =>
    [...certificatesKeys.lists(), filters] as const,
  detail: (id: string) => [...certificatesKeys.all, 'detail', id] as const,
  byCollection: (collectionId: string) =>
    [...certificatesKeys.all, 'collection', collectionId] as const,
  stats: () => [...certificatesKeys.all, 'stats'] as const,
};

/**
 * Fetch all certificates with optional filters
 */
export const useCertificates = (filters?: CertificateFilters) => {
  return useQuery({
    queryKey: certificatesKeys.list(filters),
    queryFn: () => CertificatesService.getCertificates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch a single certificate by ID
 */
export const useCertificate = (certificateId: string) => {
  return useQuery({
    queryKey: certificatesKeys.detail(certificateId),
    queryFn: () => CertificatesService.getCertificateById(certificateId),
    enabled: !!certificateId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch certificates by collection
 */
export const useCertificatesByCollection = (collectionId: string) => {
  return useQuery({
    queryKey: certificatesKeys.byCollection(collectionId),
    queryFn: () => CertificatesService.getCertificatesByCollection(collectionId),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch certificate statistics
 */
export const useCertificateStats = () => {
  return useQuery({
    queryKey: certificatesKeys.stats(),
    queryFn: () => CertificatesService.getCertificateStats(),
    staleTime: 5 * 60 * 1000,
  });
};
