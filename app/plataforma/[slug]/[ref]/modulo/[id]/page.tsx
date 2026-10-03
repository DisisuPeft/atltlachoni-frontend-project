import ModuloView from "@/app/components/plataforma/modulo-view";

interface Props {
  params: Promise<{ id: number; ref: string; slug: string }>;
}

export default async function Page({ params }: Props) {
  const { id, ref, slug } = await params;

  return <ModuloView uuid={ref} moduloId={id} slug={slug} />;
}
