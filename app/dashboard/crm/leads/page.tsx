import LeadsTable from "@/app/components/crm/leads/leads-table";
import CrmPageHeader from "@/app/components/crm/crm-page-header";
import ReloadButton from "@/app/components/crm/reload-button";

export default function Page() {
  return (
    <div className="space-y-6">
      <CrmPageHeader
        title="Leads"
        description="Encuentra, prioriza y gestiona prospectos sin perder el contexto de tu pipeline."
        action={{ href: "/dashboard/crm/nuevo-lead", label: "Nuevo lead" }}
        extra={<ReloadButton />}
      />

      <LeadsTable />
    </div>
  );
}
