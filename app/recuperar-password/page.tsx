import { Suspense } from "react";
import PasswordResetForm from "@/app/components/form/password-reset-form";

export default function RecuperarPasswordPage() {
  return (
    <Suspense>
      <PasswordResetForm mode="recuperar" />
    </Suspense>
  );
}