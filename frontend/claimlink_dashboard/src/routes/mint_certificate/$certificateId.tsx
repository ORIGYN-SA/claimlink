import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout';
import { CertificateDetailPage } from '@/features/certificates';
import { useNFT } from '@/features/nfts/api/nfts.queries';
import { useNftTransactionHistory } from '@services/origyn_nft/hooks/useNftTransactionHistory';

export const Route = createFileRoute('/mint_certificate/$certificateId')({
  component: CertificateDetailRoute,
});

function CertificateDetailRoute() {
  const { certificateId } = Route.useParams();

  // Parse certificateId as "collectionId:tokenId"
  // For now, we'll use the entire certificateId as the tokenId
  // and get the collection from the first NFT collection
  // TODO: Update to proper format when minting flow is updated
  const [collectionId, tokenId] = certificateId.includes(':')
    ? certificateId.split(':')
    : ['', certificateId];

  console.log('[CertificateDetailRoute] Params:', {
    certificateId,
    collectionId,
    tokenId,
  });

  // Fetch NFT data (returns { nft, parsedMetadata })
  const { data: nftData, isLoading: isLoadingNft, isError: isNftError } = useNFT(
    collectionId,
    tokenId
  );

  // Fetch transaction history
  const {
    data: historyData,
    isLoading: isLoadingHistory
  } = useNftTransactionHistory(collectionId, tokenId);

  // Show loading state
  if (isLoadingNft || isLoadingHistory) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-[#69737c]">Loading certificate...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle certificate not found
  if (isNftError || !nftData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-semibold text-[#222526] mb-2">
              Certificate not found
            </h2>
            <div className="space-y-2">
              <p className="text-[#69737c]">
                The certificate with ID "{certificateId}" could not be found.
              </p>
              {!certificateId.includes(':') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    ⚠️ Invalid URL format
                  </p>
                  <p className="text-sm text-yellow-700">
                    This page requires both the collection ID and token ID.
                    <br />
                    <span className="font-mono bg-yellow-100 px-1 rounded mt-1 inline-block">
                      Format: /mint_certificate/collectionId:tokenId
                    </span>
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    💡 Navigate to this page from the Collections page instead.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { nft, parsedMetadata } = nftData;

  // Convert NFT to Certificate format
  const certificate = {
    ...nft,
    certifiedBy: 'ORIGYN' as const,
  };

  console.log('[CertificateDetailRoute] Loaded certificate:', certificate);
  console.log('[CertificateDetailRoute] Parsed metadata:', {
    hasTemplates: !!parsedMetadata?.templates?.certificateTemplate,
    metadataFields: Object.keys(parsedMetadata?.metadata || {}),
  });

  return (
    <DashboardLayout>
      <CertificateDetailPage
        certificate={certificate}
        parsedMetadata={parsedMetadata}
        eventsData={historyData?.eventsData}
        ledgerData={historyData?.ledgerData}
      />
    </DashboardLayout>
  );
}
