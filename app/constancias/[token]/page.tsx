"use client";

import { useParams } from "next/navigation";
import { useGetConstanciaPublicaQuery } from "@/redux/features/control-escolar/ponenciasApiSlice";
import { Award, CheckCircle, AlertCircle, Loader2, MapPin, Calendar, User, Mic } from "lucide-react";
import Image from "next/image";

function formatFecha(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatEmitida(isoStr: string) {
  try {
    return new Date(isoStr).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

export default function VerificacionConstanciaPage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";

  const { data, isLoading, isError } = useGetConstanciaPublicaQuery(token, {
    skip: !token,
  });

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
        <span className="text-sm text-gray-500">Verificación de constancia</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Verificando constancia…</p>
            </div>
          )}

          {/* Error / not found */}
          {isError && !isLoading && (
            <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Constancia no encontrada</p>
                <p className="text-sm text-gray-500 mt-1">
                  El token no corresponde a ninguna constancia válida o expiró.
                </p>
              </div>
              <p className="text-xs text-gray-300 font-mono break-all">{token}</p>
            </div>
          )}

          {/* Success */}
          {data && !isLoading && (
            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Top strip */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Constancia verificada</p>
                  <p className="text-green-100 text-xs">Documento auténtico emitido por CINFA</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Award icon centered */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Award className="w-7 h-7 text-indigo-500" />
                  </div>
                </div>

                {/* Participant */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Participante
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{data.participante}</p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <DataRow icon={<Mic className="w-4 h-4 text-indigo-400" />} label="Ponencia" value={data.ponencia} />
                  <DataRow icon={<Award className="w-4 h-4 text-indigo-400" />} label="Tipo" value={data.tipo} capitalize />
                  <DataRow
                    icon={<Calendar className="w-4 h-4 text-indigo-400" />}
                    label="Fecha del evento"
                    value={formatFecha(data.fecha_evento)}
                  />
                  <DataRow icon={<User className="w-4 h-4 text-indigo-400" />} label="Ponente" value={data.ponente} />
                  <DataRow icon={<MapPin className="w-4 h-4 text-indigo-400" />} label="Lugar" value={data.lugar} />
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 text-center">
                    Emitida el {formatEmitida(data.emitida_en)}
                  </p>
                  <p className="text-xs text-gray-300 font-mono text-center mt-1 break-all">
                    {data.token}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DataRow({
  icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className={`text-sm text-gray-800 font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}