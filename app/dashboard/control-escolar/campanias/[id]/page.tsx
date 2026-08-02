import CampaniaDetailView from "@/app/components/control-escolar/campanias/campania-detail-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaniaDetailView id={Number(id)} />;
}
