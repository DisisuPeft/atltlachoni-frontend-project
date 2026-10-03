import type { Material } from "@/redux/features/types/control-escolar/type";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;
const API_HOST = process.env.NEXT_PUBLIC_HOST;

// ── Tipos de material para filtros ────────────────────────────────────────
// Se derivan de `file_type`, `file_extension` y `mime_type` del Material.

export type TipoMaterial = "video" | "pdf" | "documento" | "otro";
export type TipoFiltro = "todos" | TipoMaterial;

export const TIPOS_FILTRO: { key: TipoFiltro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "video", label: "Videos" },
  { key: "pdf", label: "PDF" },
  { key: "documento", label: "Documentos" },
  { key: "otro", label: "Otros" },
];

export function isPdf(m: Material) {
  return (
    m.file_extension?.toLowerCase() === "pdf" ||
    m.mime_type === "application/pdf"
  );
}

export function tipoDeMaterial(m: Material): TipoMaterial {
  if (m.file_type === "video") return "video";
  if (isPdf(m)) return "pdf";
  if (m.file_type === "document") return "documento";
  return "otro";
}

export function contarPorTipo(materiales: Material[]) {
  const counts: Record<TipoFiltro, number> = {
    todos: 0,
    video: 0,
    pdf: 0,
    documento: 0,
    otro: 0,
  };
  for (const m of materiales) {
    counts.todos++;
    counts[tipoDeMaterial(m)]++;
  }
  return counts;
}

export function filtrarPorTipo(materiales: Material[], tipo: TipoFiltro) {
  return tipo === "todos"
    ? materiales
    : materiales.filter((m) => tipoDeMaterial(m) === tipo);
}

// ── URLs (mismas que ya usaban las vistas del alumno) ──────────────────────

export function streamUrl(m: Material, programaId: string) {
  return `${UPLOAD_HOST}/api/control-escolar/materiales/${m.id}/stream/?programa=${programaId}`;
}

export function previewUrl(m: Material, programaId: string) {
  return m.preview_url
    ? `${API_HOST}${m.preview_url}?programa=${programaId}`
    : null;
}

export function downloadUrl(m: Material, programaId: string) {
  return m.download_url
    ? `${API_HOST}${m.download_url}?programa=${programaId}`
    : streamUrl(m, programaId);
}
