import LeadsTable from "@/app/components/crm/leads/leads-table";
import ButtonLink from "@/app/components/control-escolar/link-button";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Lista completa de prospectos con filtros y búsqueda
          </p>
        </div>
        <ButtonLink path="/dashboard/crm/nuevo-lead" title="+ Nuevo Lead" />
      </div>

      <LeadsTable />
    </div>
  );
}