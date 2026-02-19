import AsideCurso from "@/app/components/plataforma/aside-left-curso";
import CursoVista from "@/app/components/plataforma/curso-view";

export default async function Page({
  params,
}: {
  params: Promise<{ ref: string; slug: string }>;
}) {
  const { ref, slug } = await params;
  return (
    <div className="">
      <AsideCurso id={ref} slug={slug} />
      <CursoVista id={ref} tipo={slug} />
    </div>
  );
}
