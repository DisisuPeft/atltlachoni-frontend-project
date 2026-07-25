import RequireAuth from "@/app/utils/auth/require-auth";
// import TabsPanelWrapper from "@/app/components/dash/menu-tabs";
import Sidebar from "@/app/components/crm/side-bar";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Administrador", "Vendedor"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="w-full">
        {/* Client Component solo para las tabs */}
        <Sidebar />

        {/* El contenido sigue siendo Server Component por defecto */}
        <main className="md:ml-64 p-4 sm:p-6">{children}</main>
      </div>
    </RequireAuth>
  );
}
