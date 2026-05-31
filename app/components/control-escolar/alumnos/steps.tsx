"use client";

import { useState } from "react";
import { useGetCampaniasQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import CourseEnrollment from "../inscripcion";
import { Megaphone } from "lucide-react";

interface Props {
  estudianteId: string;
  onClose: (value: boolean) => void;
}

export default function StepEstudiante({ estudianteId, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [campania, setCampania] = useState<string | undefined>(undefined);
  const { data: campanias } = useGetCampaniasQuery(estudianteId);

  const handleSelectCampania = (id: string) => {
    setCampania(id);
    setStep(2);
  };

  if (step === 2 && campania) {
    return (
      <CourseEnrollment
        estudianteId={estudianteId}
        campania={campania}
        setClose={onClose}
      />
    );
  }

  return (
    <div className="p-6 space-y-4 min-w-[420px]">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-4 h-4 text-[#0056D2]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Seleccionar campaña</h3>
          <p className="text-xs text-gray-400">Elige la campaña a la que se inscribirá el alumno</p>
        </div>
      </div>

      <div className="space-y-2">
        {!campanias?.length ? (
          <p className="text-sm text-gray-400 text-center py-6">Sin campañas disponibles</p>
        ) : (
          campanias.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCampania(String(c.id))}
              className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:border-[#0056D2] hover:bg-[#F0F6FF]/50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-3.5 h-3.5 text-[#0056D2]" />
              </div>
              <span className="text-sm font-medium text-gray-800">{c.nombre}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}