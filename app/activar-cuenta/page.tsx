import { Suspense } from "react";
import PasswordResetForm from "@/app/components/form/password-reset-form";

export default function ActivarCuentaPage() {
  return (
    <Suspense>
      <PasswordResetForm mode="activar" />
    </Suspense>
  );
}