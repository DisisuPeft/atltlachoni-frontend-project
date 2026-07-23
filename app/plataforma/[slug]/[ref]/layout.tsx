import RequireAuth from "@/app/utils/auth/require-auth";

interface Children {
  children: React.ReactNode;
  params: Promise<{ ref: string; slug: string }>;
}

export default async function Layout({ children }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      {children}
    </RequireAuth>
  );
}