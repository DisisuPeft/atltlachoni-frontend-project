import ArchivosProgramaView from "@/app/components/plataforma/archivos-programa-view";

interface Props {
  params: Promise<{ ref: string; slug: string }>;
}

export default async function ArchivosPage({ params }: Props) {
  const { ref, slug } = await params;
  return <ArchivosProgramaView programaId={ref} slug={slug} />;
}
