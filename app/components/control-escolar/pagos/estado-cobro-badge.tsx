import type { EstadoCobro } from "@/redux/features/types/control-escolar/type";

const ESTILOS: Record<EstadoCobro, string> = {
  Liquidado: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Al corriente": "bg-blue-50 text-blue-700 ring-blue-200",
  "Próximo a vencer": "bg-amber-50 text-amber-700 ring-amber-200",
  Vencido: "bg-red-50 text-red-700 ring-red-200",
  "Fecha pendiente": "bg-gray-50 text-gray-600 ring-gray-200",
  "Sin cobro": "bg-gray-50 text-gray-500 ring-gray-200",
  "Estatus por actualizar": "bg-purple-50 text-purple-700 ring-purple-200",
};

/** Muestra el `estado_cobro` que calcula el backend, sin reinterpretarlo. */
export default function EstadoCobroBadge({ estado }: { estado: string }) {
  const cls =
    ESTILOS[estado as EstadoCobro] ?? "bg-gray-50 text-gray-600 ring-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap ${cls}`}
    >
      {estado}
    </span>
  );
}
