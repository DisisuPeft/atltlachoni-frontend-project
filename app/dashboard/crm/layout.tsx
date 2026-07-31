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
      <div className="min-h-full bg-[#f8fafc]">
        <Sidebar />
        <main className="min-h-full pt-14 md:ml-72 md:pt-0">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
