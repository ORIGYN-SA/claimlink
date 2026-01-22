import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { EditTemplatePage } from "@/features/templates";

export const Route = createFileRoute("/_authenticated/templates/$templateId")({
  component: TemplateDetailRoute,
  loader: async ({ params }) => {
    return { templateId: params.templateId };
  },
  errorComponent: ({ error }) => (
    <div>Error loading template: {error.message}</div>
  ),
});

function TemplateDetailRoute() {
  const { templateId } = Route.useParams();

  return (
    <DashboardLayout>
      <EditTemplatePage templateId={templateId} />
    </DashboardLayout>
  );
}
