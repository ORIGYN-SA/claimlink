import { createFileRoute } from '@tanstack/react-router';
import { PublicCertificatePage } from '@/features/certificates/components/public-certificate-page';

export const Route = createFileRoute('/certificate/$certificateId')({
  component: CertificateRoute,
  loader: ({ params }) => {
    // Parse certificateId format: "collectionId:tokenId"
    const [collectionId, tokenId] = params.certificateId.split(':');

    if (!collectionId || !tokenId) {
      throw new Error('Invalid certificate ID format. Expected format: collectionId:tokenId');
    }

    return { collectionId, tokenId };
  },
});

function CertificateRoute() {
  const { collectionId, tokenId } = Route.useLoaderData();

  return <PublicCertificatePage collectionId={collectionId} tokenId={tokenId} />;
}
