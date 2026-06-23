import ExamenesView from "@/app/components/plataforma/examenes-view";

interface Props {
  params: Promise<{ ref: string; slug: string }>;
}

export default async function ExamenesPage({ params }: Props) {
  const { ref } = await params;
  return <ExamenesView programaId={ref} />;
}