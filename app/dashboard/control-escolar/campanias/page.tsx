import CreateCampanias from "@/app/components/control-escolar/campanias/campania-form";
import CampaniasView from "@/app/components/control-escolar/campanias/campanias-view";

export default function ProgramasPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona y visualiza todas las campañas del centro educativo
          </p>
        </div>
        <CreateCampanias />
      </div>
      <CampaniasView />
    </div>
  );
}
