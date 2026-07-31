import KanbanBoard from "@/app/components/crm/kanban/kanban-board";
import CrmPageHeader from "@/app/components/crm/crm-page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <CrmPageHeader
        eyebrow="Pipeline"
        title="Tablero de oportunidades"
        description="Una vista clara para detectar bloqueos, distribuir el trabajo y mover cada oportunidad a su siguiente paso."
        action={{ href: "/dashboard/crm/nuevo-lead", label: "Nuevo lead" }}
      />

      <KanbanBoard />
    </div>
  );
}
