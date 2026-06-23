import RequireAuth from "@/app/utils/auth/require-auth";
import AsideRigthCurso from "@/app/components/plataforma/aside-rigth-curso";
interface Children {
  children: React.ReactNode;
  params: Promise<{ ref: string; slug: string }>;
}
export default async function Layout({ children, params }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  const { ref, slug } = await params;
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white">
        <header className="bg-white border-b border-gray-200"></header>
        <div className="flex">
          <main className="flex-1 min-w-0 border-r border-gray-200">
            {children}
          </main>
          <AsideRigthCurso id={ref} slug={slug} />
        </div>
      </div>
    </RequireAuth>
  );
}
