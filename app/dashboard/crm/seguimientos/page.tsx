import SeguimientosView from "@/app/components/crm/seguimientos/seguimientos-view";
import CrmPageHeader from "@/app/components/crm/crm-page-header";
import ReloadButton from "@/app/components/crm/reload-button";

export default function Page() {
  return (
    <div className="space-y-6">
      <CrmPageHeader
        title="Seguimientos"
        description="Resuelve primero los compromisos pendientes y mantén cada conversación en movimiento."
        extra={<ReloadButton />}
      />

      <SeguimientosView />
    </div>
  );
}
