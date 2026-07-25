import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/dash/nav-bar";
import ModulosGrid from "../components/dash/modulos-card";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  return (
    <RequireAuth allowedRoles={["Administrador", "Vendedor", "Tutor"]}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <ModulosGrid />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
