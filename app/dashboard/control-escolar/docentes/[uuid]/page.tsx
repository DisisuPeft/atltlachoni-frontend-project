import DocenteEditView from "@/app/components/control-escolar/docentes/docente-edit-view";

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function DocenteDetallePage({ params }: Props) {
  const { uuid } = await params;
  return <DocenteEditView docenteRef={uuid} />;
}