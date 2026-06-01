import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/plataforma/nav-bar";
import PlataformaEducativa from "../components/plataforma/menu";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <PlataformaEducativa />
          <main className="flex-1 overflow-auto p-8 md:ml-64">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
