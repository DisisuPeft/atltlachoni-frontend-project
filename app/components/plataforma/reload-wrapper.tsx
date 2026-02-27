"use client";
import { useProgramaEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { redirect } from "next/navigation";
import Loading from "../common/loading";

interface Props {
  id: string;
  tipo: string;
}

export default function RelocationWrapper({ id, tipo }: Props) {
  const { data: programas, isLoading } = useProgramaEstudianteQuery(id);

  if (isLoading || !programas) return <Loading />;

  const primerModulo = programas.modulos_obj[0];

  if (!primerModulo) return <div>No hay módulos disponibles</div>;

  redirect(`/plataforma/${tipo}/${id}/modulo/${primerModulo.id}`);
}
