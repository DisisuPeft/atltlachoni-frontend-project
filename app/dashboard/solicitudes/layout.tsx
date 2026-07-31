import RequireAuth from "@/app/utils/auth/require-auth";

interface Children {
  children: React.ReactNode;
}

export default function Layout({ children }: Children) {
  return (
    <RequireAuth allowedRoles={["Administrador", "Vendedor", "Tutor", "Guest"]}>
      <main className="p-4 sm:p-6">{children}</main>
    </RequireAuth>
  );
}