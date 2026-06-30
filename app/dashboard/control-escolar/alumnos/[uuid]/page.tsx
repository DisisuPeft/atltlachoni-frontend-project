import EstudianteEditPage from "@/app/components/control-escolar/alumnos/alumnos-edit-form";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { uuid } = await params;
  const { ref } = await searchParams;

  return <EstudianteEditPage uuid={uuid} initialRef={ref} />;
}
