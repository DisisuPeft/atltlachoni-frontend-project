import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/plataforma/nav-bar";
import PlataformaEducativa from "../components/plataforma/menu";
import BottomNav from "../components/plataforma/bottom-nav";

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
          <main id="plataforma-main" className="flex-1 overflow-auto md:ml-64 pb-16 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </RequireAuth>
  );
}