"use client";

import { useState } from "react";
import TabClases from "./tab-class";
import {
  IconPlayCircle,
  IconDocument,
  IconClipboard,
  IconChat,
  IconArrowLeft,
  IconStar,
  IconUsers,
  IconClock,
} from "./iconst";
import Image from "next/image";
import Link from "next/link";
import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";

interface Props {
  id: string;
  tipo: string;
}

export default function CursoVista({ id, tipo }: Props) {
  const { data: programa } = useProgramaEstudianteQuery(id);
  const [tabActiva, setTabActiva] = useState<
    "clases" | "materiales" | "actividades" | "foro"
  >("clases");
  const [claseActiva, setClaseActiva] = useState<number | null>(null);

  const tabs = [
    { key: "clases" as const, label: "Clases", icon: IconPlayCircle },
    { key: "materiales" as const, label: "Materiales", icon: IconDocument },
    { key: "actividades" as const, label: "Actividades", icon: IconClipboard },
    { key: "foro" as const, label: "Foro", icon: IconChat },
  ];

  return (
    <div className="space-y-6">
      {/* Header del curso */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="relative h-48 md:h-56">
          <Image
            src={"/assets/place2.jpg"}
            alt={"placeholder"}
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <Link
            href={`/plataforma/educacion`}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/25 transition-colors"
          >
            {/* <IconArrowLeft className="w-4 h-4" /> */}
            Volver
          </Link>
          <div className="absolute bottom-5 left-5 right-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {/* {cursoDetalle.titulo} */}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Image
                  src={`/assets/placeholderuser.jpg`}
                  alt={"Imagen"}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                  width={50}
                  height={50}
                />
                <span className="text-white/90 text-sm">{"Instructor"}</span>
              </div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <IconStar className="w-4 h-4 text-amber-400" />
                {/* <span>{cursoDetalle.rating}</span> */}
              </div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <IconClock className="w-4 h-4" />
                <span>{0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegacion */}
        <div className="flex border-t border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setTabActiva(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  tabActiva === tab.key
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-800 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la tab activa */}
      {tabActiva === "clases" && (
        <TabClases
          claseActiva={claseActiva}
          onSelectClase={setClaseActiva}
          tipo={tipo}
          programa={programa}
        />
      )}
      {/* {tabActiva === "materiales" && <TabMateriales />}
      {tabActiva === "actividades" && <TabActividades />}
      {tabActiva === "foro" && <TabForo />} */}
    </div>
  );
}
