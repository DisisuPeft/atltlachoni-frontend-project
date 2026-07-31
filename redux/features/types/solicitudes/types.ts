export interface AreaResponsable {
  id: number;
  nombre: string;
  status: number;
}

export interface TipoSolicitud {
  id: number;
  nombre: string;
  descripcion: string;
  area_responsable: number | null;
  area_responsable_nombre: string | null;
  status: number;
}

export interface SolicitudArchivo {
  id: number;
  original_name: string;
  mime_type: string;
  size: number;
  size_formatted: string;
  file_type: string;
  download_url: string;
  created_at: string;
}

export type EstadoSolicitud = "nuevo" | "seguimiento" | "resuelto";

export interface Solicitud {
  uuid: string;
  tipo: number;
  tipo_nombre: string;
  area_responsable_nombre: string | null;
  titulo: string;
  descripcion: string;
  estado: EstadoSolicitud;
  reglas: Record<string, unknown>;
  solicitante_nombre: string;
  archivos: SolicitudArchivo[];
  created_at: string;
}