import ButtonLink from "@/app/components/control-escolar/link-button";
import ProgramasView from "@/app/components/control-escolar/programas/programas-view";

export default function ProgramasPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programas Educativos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona y visualiza todos los programas académicos
          </p>
        </div>
        <ButtonLink
          path="/dashboard/control-escolar/programas/new"
          title="+ Nuevo programa"
        />
      </div>
      <ProgramasView />
    </div>
  );
}
