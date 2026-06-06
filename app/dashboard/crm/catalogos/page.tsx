import CatalogosView from "@/app/components/crm/catalogos/catalogos-view";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catálogos</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Fuentes, estatus, etapas y tipos de interacción configurados en el sistema
        </p>
      </div>

      <CatalogosView />
    </div>
  );
}