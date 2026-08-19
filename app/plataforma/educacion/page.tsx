"use client";

import { useState } from "react";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import MainEducationDash from "@/app/components/plataforma/education";
import DocenteMaterialesView from "@/app/components/plataforma/docente-materiales-view";
import DocenteActividadesView from "@/app/components/plataforma/docente-actividades-view";
import { FolderOpen, ClipboardList } from "lucide-react";

type DocenteTab = "materiales" | "actividades";

function DocenteEducacionView() {
  const [tab, setTab] = useState<DocenteTab>("materiales");

  return (
    <div>
      <div className="border-b border-gray-200 px-6">
        <div className="flex max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setTab("materiales")}
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
            onClick={() => setTab("actividades")}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "actividades"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Actividades
          </button>
        </div>
      </div>

      {tab === "materiales" ? <DocenteMaterialesView /> : <DocenteActividadesView />}
    </div>
  );
}

export default function EducacionPage() {
  const { data: user } = useRetrieveUserQuery();
  const esDocente = user?.roles_list?.some((r) => r.nombre === "Docente") ?? false;

  if (!user) return null;

  return esDocente ? <DocenteEducacionView /> : <MainEducationDash />;
}
