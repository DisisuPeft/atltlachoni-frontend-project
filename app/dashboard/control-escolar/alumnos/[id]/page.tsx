import EstudianteDetallePage from "@/app/components/control-escolar/alumnos/alumnos-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>id</div>;
}
