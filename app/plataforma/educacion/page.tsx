"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import MainEducationDash from "@/app/components/plataforma/education";
import DocenteMaterialesView from "@/app/components/plataforma/docente-materiales-view";
import DocenteActividadesView from "@/app/components/plataforma/docente-actividades-view";
import DocenteEvaluacionesView from "@/app/components/plataforma/docente-evaluaciones-view";
import { FolderOpen, ClipboardList, ClipboardCheck } from "lucide-react";

type DocenteTab = "materiales" | "actividades" | "evaluaciones";

function DocenteEducacionView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const programaRef = searchParams.get("programa") ?? undefined;
  const tab: DocenteTab = requestedTab === "actividades" || requestedTab === "evaluaciones" ? requestedTab : "materiales";

  const selectTab = (nextTab: DocenteTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`/plataforma/educacion?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <div className="border-b border-gray-200 px-6">
        <div className="flex max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => selectTab("materiales")}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "materiales"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Materiales
          </button>
          <button
            type="button"
            onClick={() => selectTab("actividades")}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "actividades"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Actividades
          </button>
          <button
            type="button"
            onClick={() => selectTab("evaluaciones")}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "evaluaciones"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Evaluaciones
          </button>
        </div>
      </div>

      {tab === "materiales" ? (
        <DocenteMaterialesView key={`materiales-${programaRef ?? ""}`} programaInicial={programaRef} />
      ) : tab === "actividades" ? (
        <DocenteActividadesView key={`actividades-${programaRef ?? ""}`} programaInicial={programaRef} />
      ) : (
        <DocenteEvaluacionesView key={`evaluaciones-${programaRef ?? ""}`} programaInicial={programaRef} />
      )}
    </div>
  );
}

export default function EducacionPage() {
  const { data: user } = useRetrieveUserQuery();
  const esDocente = user?.roles_list?.some((r) => r.nombre === "Docente") ?? false;

  if (!user) return null;

  return esDocente ? <DocenteEducacionView /> : <MainEducationDash />;
}
