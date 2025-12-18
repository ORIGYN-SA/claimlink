/**
 * Certificates API Layer
 * Exports service, query hooks, and transformers
 */

export { CertificatesService } from './certificates.service';

export {
  certificatesKeys,
  useCollectionCertificates,
  useCertificate,
  useCertificateTransactionHistory,
  useMintCertificate,
  useMintCertificateWithTemplate,
  useUploadCertificateImage,
  type CertificateWithParsedMetadata,
} from './certificates.queries';

export * from './transformers';
