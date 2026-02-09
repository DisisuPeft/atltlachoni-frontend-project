export default async function Page({
  params,
}: {
  params: Promise<{ ref: string; slug: string }>;
}) {
  const { ref, slug } = await params;
  return (
    <div>
      {ref} {slug}
    </div>
  );
}
