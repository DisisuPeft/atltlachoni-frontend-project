import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/dash/nav-bar";
import PlataformaEducativa from "../components/plataforma/menu";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white">
        {/* Navbar */}
        <Navbar />
        <PlataformaEducativa />
        <main className="ml-64 p-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
