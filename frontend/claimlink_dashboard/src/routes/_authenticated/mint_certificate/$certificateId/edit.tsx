/**
 * DISABLED: Certificate editing has been removed.
 * Certificates are immutable after minting - only events can be added.
 * To make changes, mint a new certificate.
 *
 * Re-enable by uncommenting the code below if editing is needed in the future.
 */

// import { createFileRoute } from '@tanstack/react-router';
// import { DashboardLayout } from '@/components/layout/dashboard-layout';
// import { CreateCertificatePageV2 } from '@/features/certificates/components/create/create-certificate-page-v2';

// export const Route = createFileRoute(
//   '/_authenticated/mint_certificate/$certificateId/edit'
// )({
//   component: EditCertificateRoute,
// });

// function EditCertificateRoute() {
//   const { certificateId } = Route.useParams();

//   return (
//     <DashboardLayout>
//       <CreateCertificatePageV2
//         mode="edit"
//         certificateId={certificateId}
//       />
//     </DashboardLayout>
//   );
// }

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/mint_certificate/$certificateId/edit'
)({
  component: () => <Navigate to="/mint_certificate" />,
});
