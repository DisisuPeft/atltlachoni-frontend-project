import NewLeadForm from "@/app/components/crm/leads/new-lead-form";
import CrmPageHeader from "@/app/components/crm/crm-page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <CrmPageHeader
        title="Nuevo lead"
        description="Captura únicamente la información necesaria para que el equipo pueda dar el siguiente paso."
        backHref="/dashboard/crm/leads"
      />
      <NewLeadForm />
    </div>
  );
}
