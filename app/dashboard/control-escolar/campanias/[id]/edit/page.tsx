import CampaniaEditView from "@/app/components/control-escolar/campanias/campania-edit-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaniaEditView id={Number(id)} />;
}
