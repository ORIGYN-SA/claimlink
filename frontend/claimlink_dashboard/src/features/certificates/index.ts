// ============================================================================
// Components
// ============================================================================

// Certificate Detail Components
export { CertificateDetailPage } from './components/certificate-detail-page';
export { CertificateDetailActions } from './components/certificate-detail-actions';
export { CertificateTabs } from './components/certificate-tabs';
export { CertificateLaunchpad } from './components/certificate-launchpad';

// Certificate Display Components
export { CertificateViewer, type TemplateData } from './components/certificate-viewer';
export { CertificateDisplay } from './components/certificate-display';
export { CertificateFrame } from './components/certificate-frame';
export { InformationFrame } from './components/information-frame';

// Certificate Information Components
export { CertificateInformation } from './components/certificate-information';
export { CertificateMetadataRow } from './components/certificate-metadata-row';
export { CertificateGallery } from './components/certificate-gallery';

// Certificate Events Components
export { CertificateEvents } from './components/certificate-events';
export { CertificateEventRow } from './components/certificate-event-row';

// Certificate Ledger Components
export { CertificateLedger } from './components/certificate-ledger';
export { CertificateLedgerTable } from './components/certificate-ledger-table';
export { CertificateLedgerRow } from './components/certificate-ledger-row';
export { CertificateLedgerPagination } from './components/certificate-ledger-pagination';

// ============================================================================
// API Layer
// ============================================================================

export { CertificatesService } from './api/certificates.service';
export type { CertificateFilters } from './api/certificates.service';

export {
  certificatesKeys,
  useCertificates,
  useCertificate,
  useCertificatesByCollection,
  useCertificateStats,
} from './api/certificates.queries';

// ============================================================================
// Types
// ============================================================================

export type {
  Certificate,
  CertificateStatus,
  CertificateGridProps
} from './types/certificate.types';

export type { CertificateTab } from './components/certificate-tabs';
export type { CertificateInformationData } from './components/certificate-information';
export type { CertificateEventsData, CertificateEvent } from './components/certificate-events';
export type { CertificateLedgerData, LedgerTransaction, LedgerTransactionType } from './components/certificate-ledger';
