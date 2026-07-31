import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/dash/nav-bar";
import DashboardShell from "../components/dash/dashboard-shell";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  return (
    <RequireAuth allowedRoles={["Administrador", "Vendedor", "Tutor", "Guest"]}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <DashboardShell>{children}</DashboardShell>
        </div>
      </div>
    </RequireAuth>
  );
}
