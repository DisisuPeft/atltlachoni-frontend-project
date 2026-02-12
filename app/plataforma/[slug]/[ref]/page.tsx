import CursoVista from "@/app/components/plataforma/curso-view";

export default async function Page({
  params,
}: {
  params: Promise<{ ref: string; slug: string }>;
}) {
  const { ref, slug } = await params;
  return (
    <div className="space-y-6 mt-12">
      <CursoVista id={ref} tipo={slug} />
    </div>
  );
}
