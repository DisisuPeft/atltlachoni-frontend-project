"use client";
import { useInscripcionPrograma } from "@/hooks";
import { useGetCampaniasQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import Select from "@/app/ui/components/select";
import { ChangeEvent, useState, useEffect } from "react";
import CourseEnrollment from "../inscripcion";

interface Props {
  estudianteId: string;
}

export default function StepEstudiante({ estudianteId }: Props) {
  const { steps, setSteps } = useInscripcionPrograma(estudianteId);
  const [campania, setCampania] = useState<string | undefined>(undefined);
  const { data: campanias } = useGetCampaniasQuery();

  useEffect(() => {
    if (campania) {
      setSteps((prev) => prev + 1);
    }
  }, [campania]);

  return (
    <div className="flex flex-col justify-center px-1">
      <h1 className="text-center text-4xl font-bold mt-4">
        Proceso de inscripcion
      </h1>
      <div className="flex justify-center p-6">
        {steps === 1 && (
          <div>
            <h1 className="text-start text-2xl mt-4">
              Seleccionar la campaña a la que se inscribira el alumno
            </h1>
            <Select
              options={campanias ?? []}
              valueKey="id"
              labelKey="nombre"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setCampania(e.target.value);
              }}
            />
          </div>
        )}
        {steps === 2 && (
          <CourseEnrollment estudianteId={estudianteId} campania={campania} />
        )}
      </div>
    </div>
  );
}
