/**
 * Certificate Minting Query Hooks
 *
 * React Query hooks for certificate minting operations.
 * Uses CertificateService for data access abstraction.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CertificateService,
  type MintCertificateRequest,
  type TransferCertificateRequest,
} from './certificate.service';

/**
 * Query key factory for certificate minting
 */
export const certificateMintKeys = {
  all: ['certificate-minting'] as const,
  price: (collectionId: string, templateId: string) =>
    [...certificateMintKeys.all, 'price', collectionId, templateId] as const,
  validation: (templateId: string, formData: Record<string, unknown>) =>
    [
      ...certificateMintKeys.all,
      'validation',
      templateId,
      JSON.stringify(formData),
    ] as const,
};

/**
 * Get minting price estimate
 */
export const useMintingPrice = (collectionId: string, templateId: string) => {
  return useQuery({
    queryKey: certificateMintKeys.price(collectionId, templateId),
    queryFn: () => CertificateService.getMintingPrice(collectionId, templateId),
    enabled: !!collectionId && !!templateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Validate certificate form data
 */
export const useValidateCertificateData = (
  templateId: string,
  formData: Record<string, unknown>,
  enabled = true
) => {
  return useQuery({
    queryKey: certificateMintKeys.validation(templateId, formData),
    queryFn: () =>
      CertificateService.validateCertificateData(templateId, formData),
    enabled: enabled && !!templateId,
    staleTime: 0, // Don't cache validation results
  });
};

/**
 * Mint a new certificate
 */
export const useMintCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MintCertificateRequest) =>
      CertificateService.mintCertificate(request),
    onSuccess: () => {
      // Invalidate certificates list to refetch
      queryClient.invalidateQueries({
        queryKey: ['certificates'],
      });
    },
  });
};

/**
 * Transfer certificate ownership
 */
export const useTransferCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TransferCertificateRequest) =>
      CertificateService.transferCertificate(request),
    onSuccess: (_, variables) => {
      // Invalidate certificate detail to refetch
      queryClient.invalidateQueries({
        queryKey: ['certificates', 'detail', variables.certificateId],
      });
      // Invalidate certificates list
      queryClient.invalidateQueries({
        queryKey: ['certificates'],
      });
    },
  });
};
