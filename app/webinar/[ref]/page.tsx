"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  useGetPonenciaRegistroQuery,
  useRegistrarParticipantePublicoMutation,
} from "@/redux/features/control-escolar/ponenciasApiSlice";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Mic,
  Mail,
  User,
  Phone,
} from "lucide-react";

const TIPO_LABELS: Record<string, string> = {
  webinar: "Webinar",
  masterclass: "Masterclass",
  conferencia: "Conferencia",
  taller: "Taller",
};

function formatFecha(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RegistroWebinarPage() {
  const params = useParams();
  const ref = typeof params.ref === "string" ? params.ref : "";

  const {
    data: ponencia,
    isLoading,
    isError,
    error: registroError,
  } = useGetPonenciaRegistroQuery(ref, { skip: !ref });

  const [registrar, { isLoading: registrando }] =
    useRegistrarParticipantePublicoMutation();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState<{
    nombre_completo: string;
    email: string;
  } | null>(null);

  const notFound = (registroError as { status?: number })?.status === 404;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim() || !email.trim()) {
      setFormError("Nombre y correo electrónico son obligatorios.");
      return;
    }
    setFormError(null);
    try {
      const result = await registrar({
        ref,
        nombre_completo: nombreCompleto.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
      }).unwrap();
      setRegistrado({
        nombre_completo: result.nombre_completo,
        email: result.email,
      });
    } catch (err) {
      const e = err as { status?: number; data?: { detail?: string } };
      if (e.status === 429) {
        setFormError(
          "Se alcanzó el límite de registros por ahora. Intenta de nuevo más tarde.",
        );
      } else {
        setFormError(
          e.data?.detail ?? "No se pudo completar el registro. Intenta de nuevo.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center gap-3 px-8 py-4 border-b border-gray-100 bg-white">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center">
          <Image
            src="/assets/logos/Logo CINFA-01.webp"
            alt="CINFA"
            width={36}
            height={36}
          />
        </div>
        <span className="text-lg font-bold text-gray-900">CINFA</span>
        <span className="text-gray-300 mx-1">·</span>
        <span className="text-sm text-gray-500">Registro al evento</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Cargando evento…</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {notFound ? "Evento no encontrado" : "No se pudo cargar el evento"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {notFound
                    ? "La liga de registro no corresponde a ningún evento válido."
                    : "Intenta de nuevo más tarde."}
                </p>
              </div>
            </div>
          )}

          {ponencia && !isLoading && !isError && (
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Top strip */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
                <div className="flex items-center gap-2 mb-1">
                  <Mic className="w-4 h-4 text-indigo-200" />
                  <span className="text-indigo-200 text-xs font-medium uppercase tracking-wide">
                    {TIPO_LABELS[ponencia.tipo] ?? ponencia.tipo}
                  </span>
                </div>
                <h1 className="text-white font-bold text-lg leading-snug">
                  {ponencia.titulo}
                </h1>
                {ponencia.fecha_evento && (
                  <div className="flex items-center gap-1.5 mt-2 text-indigo-100 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatFecha(ponencia.fecha_evento)}
                  </div>
                )}
              </div>

              <div className="p-6">
                {registrado ? (
                  <div className="flex flex-col items-center gap-3 text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    </div>
                    <p className="font-semibold text-gray-800">
                      ¡Registro exitoso!
                    </p>
                    <p className="text-sm text-gray-500">
                      {registrado.nombre_completo}, tu lugar quedó confirmado.
                      Te enviaremos tu constancia a{" "}
                      <span className="font-medium text-gray-700">
                        {registrado.email}
                      </span>{" "}
                      una vez concluido el evento.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <p className="text-sm text-gray-500 mb-1">
                      Regístrate para asegurar tu lugar y recibir tu
                      constancia.
                    </p>

                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="Teléfono (opcional)"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0056D2] bg-white"
                      />
                    </div>

                    {formError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={registrando}
                      className="w-full h-10 flex items-center justify-center gap-2 bg-[#0056D2] text-white text-sm font-semibold rounded-lg hover:bg-[#004BB5] disabled:opacity-50 transition-colors"
                    >
                      {registrando && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Registrarme
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
