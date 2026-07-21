"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useSolicitarRecuperacionMutation,
  useResetearPasswordMutation,
} from "@/redux/features/auth/authApiSlice";
import { Loader2, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";

const inputClass =
  "w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] border-gray-300 transition-all";

function parseDetail(detail: unknown): string {
  if (Array.isArray(detail)) return detail.join(" ");
  if (typeof detail === "string") return detail;
  return "Ocurrió un error inesperado.";
}

interface Props {
  mode: "recuperar" | "activar";
}

export default function PasswordResetForm({ mode }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const hasLink = !!(uid && token);

  // Step 1 — email
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [solicitarRecuperacion, { isLoading: isSending }] = useSolicitarRecuperacionMutation();

  // Step 2 — new password
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [resetearPassword, { isLoading: isResetting }] = useResetearPasswordMutation();

  const [error, setError] = useState("");

  const handleSolicitarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await solicitarRecuperacion({ email }).unwrap();
      setEmailSent(true);
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
      setError(parseDetail(detail) || "No se pudo enviar el correo.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    try {
      await resetearPassword({ uid: uid!, token: token!, password }).unwrap();
      setDone(true);
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
      setError(parseDetail(detail) || "El enlace es inválido o ya expiró.");
    }
  };

  // ── Estado: contraseña cambiada exitosamente ─────────────────────────
  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "activar" ? "Cuenta activada" : "Contraseña actualizada"}
        </h2>
        <p className="text-sm text-gray-600">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all"
          style={{ background: "linear-gradient(135deg, #0f1f65 0%, #699cdb 100%)" }}
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  // ── Paso 2: nueva contraseña (link con uid+token) ─────────────────────
  if (hasLink) {
    return (
      <>
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #0f1f65 0%, #699cdb 100%)" }}
          >
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === "activar" ? "Activa tu cuenta" : "Nueva contraseña"}
          </h1>
          <p className="text-sm text-gray-600">
            {mode === "activar"
              ? "Establece una contraseña para comenzar a usar tu cuenta."
              : "Elige una contraseña segura para continuar."}
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isResetting}
            className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #0f1f65 0%, #699cdb 100%)" }}
          >
            {isResetting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
            ) : (
              mode === "activar" ? "Activar cuenta" : "Guardar contraseña"
            )}
          </button>
        </form>
      </>
    );
  }

  // ── Paso 1: solicitar recuperación (solo en modo "recuperar") ─────────
  if (mode === "activar") {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mx-auto">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Enlace inválido</h2>
        <p className="text-sm text-gray-600">
          Este enlace de activación no es válido o ya fue usado. Contacta a tu tutora para recibir un nuevo correo de activación.
        </p>
      </div>
    );
  }

  // ── Paso 1: formulario de email ───────────────────────────────────────
  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Revisa tu correo</h2>
        <p className="text-sm text-gray-600">
          Si <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
        </p>
        <p className="text-xs text-gray-400">El enlace expira en 24 horas.</p>
        <button
          onClick={() => router.push("/login")}
          className="text-sm font-medium text-[#0056D2] hover:underline"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #0f1f65 0%, #699cdb 100%)" }}
        >
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm text-gray-600">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSolicitarSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #0f1f65 0%, #699cdb 100%)" }}
        >
          {isSending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
          ) : (
            "Enviar enlace"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          <a href="/login" className="font-medium text-[#0056D2] hover:underline">
            Volver al inicio de sesión
          </a>
        </p>
      </form>
    </>
  );
}