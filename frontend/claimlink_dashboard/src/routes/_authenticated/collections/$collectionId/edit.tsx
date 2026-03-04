/**
 * DISABLED: Collection editing has been removed.
 * Collections are immutable after creation.
 * To make changes, create a new collection.
 *
 * Re-enable by uncommenting the code below if editing is needed in the future.
 */

// import { createFileRoute } from "@tanstack/react-router";
// import { DashboardLayout } from "@/components/layout";
// import { EditCollectionPage } from "@/features/collections";

// export const Route = createFileRoute(
//   "/_authenticated/collections/$collectionId/edit"
// )({
//   component: EditCollectionRoute,
// });

// function EditCollectionRoute() {
//   const { collectionId } = Route.useParams();

//   return (
//     <DashboardLayout>
//       <EditCollectionPage collectionId={collectionId} />
//     </DashboardLayout>
//   );
// }

import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId/edit"
)({
  component: () => <Navigate to="/collections" />,
});
