/**
 * Certificates API Layer
 * Exports service and query hooks
 */

export { CertificatesService } from './certificates.service';
export type { CertificateFilters } from './certificates.service';

export {
  certificatesKeys,
  useCertificates,
  useCertificate,
  useCertificatesByCollection,
  useCertificateStats,
} from './certificates.queries';
