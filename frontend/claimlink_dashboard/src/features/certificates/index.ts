// ============================================================================
// Pages (Entry Points)
// ============================================================================

export { CertificateDetailPage } from './pages/certificate-detail-page';
export { MintCertificatePage } from './pages/mint-certificate-page';
export { PublicCertificatePage } from './pages/public-certificate-page';

// ============================================================================
// Components
// ============================================================================

// Action Components
export { CertificateDetailActions } from './components/certificate-detail-actions';
export { CertificateLaunchpad } from './components/certificate-launchpad';

// Certificate Display Components
export { CertificateViewer, type TemplateData } from './components/certificate-viewer';
export { CertificateDisplay } from './components/certificate-display';
export { CertificateFrame } from './components/certificate-frame';
export { InformationFrame } from './components/information-frame';

// Detail view components
export {
  CertificateTabs,
  CertificateInformation,
  CertificateMetadataRow,
  CertificateGallery,
  CertificateEvents,
  CertificateEventRow,
  CertificateLedger,
  CertificateLedgerTable,
  CertificateLedgerRow,
  CertificateLedgerPagination,
  CertificateQRCode,
} from './components/detail';

// ============================================================================
// API Layer
// ============================================================================

export { CertificatesService } from './api/certificates.service';

export {
  certificatesKeys,
  useCollectionCertificates,
  useCertificate,
  useCertificateTransactionHistory,
  useMintCertificate,
  useMintCertificateWithTemplate,
  useTransferCertificate,
  useUpdateCertificateWithTemplate,
  useUploadCertificateImage,
  type CertificateWithParsedMetadata,
} from './api/certificates.queries';

export * from './api/transformers';

// ============================================================================
// Types
// ============================================================================

export type {
  Certificate,
  CertificateStatus,
  CertificateGridProps
} from './types/certificate.types';

export type { CertificateTab } from './components/detail/certificate-tabs';
export type { CertificateInformationData } from './components/detail/certificate-information';
export type { CertificateEventsData, CertificateEvent } from './components/detail/certificate-events';
export type { CertificateLedgerData, LedgerTransaction, LedgerTransactionType } from './components/detail/certificate-ledger';
