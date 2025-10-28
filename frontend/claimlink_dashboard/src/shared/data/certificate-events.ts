import type { CertificateEventsData } from "@/features/certificates";

export const mockCertificateEvents: CertificateEventsData = {
  events: [
    {
      date: "12.01.2025",
      description: "Certificate minted and issued to original owner",
      attachmentUrl: "https://example.com/attachments/mint-certificate.pdf",
    },
    {
      date: "12.01.2025",
      description: "Artwork exhibited at Modern Art Gallery, London",
      attachmentUrl: "https://example.com/attachments/exhibition-details.pdf",
    },
    {
      date: "12.01.2025",
      description: "Professional restoration completed by certified conservator",
      attachmentUrl: "https://example.com/attachments/restoration-report.pdf",
    },
    {
      date: "12.01.2025",
      description: "Ownership transferred to new collector",
      attachmentUrl: "https://example.com/attachments/transfer-document.pdf",
    },
  ],
};

