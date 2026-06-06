import SeguimientosView from "@/app/components/crm/seguimientos/seguimientos-view";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seguimientos</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Seguimientos programados con tus prospectos
        </p>
      </div>

      <SeguimientosView />
    </div>
  );
}