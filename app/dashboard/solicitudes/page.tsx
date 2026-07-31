import SolicitudForm from "@/app/components/solicitudes/solicitud-form";
import SolicitudesView from "@/app/components/solicitudes/solicitudes-view";
import { Suspense } from "react";

export default function SolicitudesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona y da seguimiento a las solicitudes del equipo
          </p>
        </div>
        <SolicitudForm />
      </div>

      <Suspense>
        <SolicitudesView />
      </Suspense>
    </div>
  );
}