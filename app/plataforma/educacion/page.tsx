"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import MainEducationDash from "@/app/components/plataforma/education";
import DocenteMaterialesView from "@/app/components/plataforma/docente-materiales-view";

export default function EducacionPage() {
  const { data: user } = useRetrieveUserQuery();
  const esDocente = user?.roles_list?.some((r) => r.nombre === "Docente") ?? false;

  if (!user) return null;

  return esDocente ? <DocenteMaterialesView /> : <MainEducationDash />;
}