// ─── Catálogos ───────────────────────────────────────────────────────

export interface NivelTemperatura {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  color: string;
  puntuacion: number;
  descripcion: string;
  orden: number;
}

export interface Etapa {
  id: number;
  nombre: string;
  orden: number;
  pipeline: number;
  pipeline_nombre: string;
}

export interface Pipeline {
  id: number;
  nombre: string;
  orden: number;
  etapas: Etapa[];
}

export interface TipoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  descripcion: string;
  requiere_duracion: boolean;
  requiere_telefono: boolean;
  permite_archivos: boolean;
  orden: number;
}

export interface EstadoInteraccion {
  id: number;
  nombre: string;
  codigo: string;
  color: string;
  es_final: boolean;
  orden: number;
}

export interface TipoSeguimiento {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  tipo_interaccion_default?: number;
  orden: number;
}

// ─── Lead ────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  uuid: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
  correo: string;
  telefono: string;
  contacto_alterno?: string;
  fuente: number;
  fuente_nombre?: string;
  etapa: number;
  etapa_nombre?: string;
  etapa_orden?: number;
  estatus: number;
  estatus_nombre?: string;
  vendedor_asignado?: number;
  vendedor_nombre?: string;
  campania?: number;
  campania_nombre?: string;
  programa_objetivo?: number;
  programa_nombre?: string;
  temperatura_actual?: NivelTemperatura;
  status: number;
  created_at: string;
  updated_at: string;
  notas?: string;
  instituto?: number;
}

export interface LeadQueryParams {
  empresa?: number;
  etapa?: number;
  estatus?: number;
  vendedor?: number;
  fuente?: number;
  page?: number;
  search?: string;
}

// ─── Interacciones ───────────────────────────────────────────────────

export interface InteraccionLead {
  id: number;
  lead: number;
  tipo: number;
  tipo_detail?: TipoInteraccion;
  estado: number;
  estado_detail?: EstadoInteraccion;
  asunto: string;
  contenido: string;
  fecha_interaccion: string;
  duracion_minutos?: number;
  usuario: string;
  numero_telefono?: string;
  mensaje_enviado: boolean;
  mensaje_recibido: boolean;
  url_externa?: string;
  proximo_paso?: string;
  temperatura_post?: number;
  temperatura_post_detail?: NivelTemperatura;
}

export interface InteraccionForm {
  lead: number;
  tipo: number;
  estado: number;
  asunto: string;
  contenido: string;
  duracion_minutos?: number;
  numero_telefono?: string;
  temperatura_post?: number;
  proximo_paso?: string;
}

// ─── Seguimientos ────────────────────────────────────────────────────

export interface SeguimientoProgramado {
  id: number;
  lead: number;
  tipo: number;
  tipo_detail?: TipoSeguimiento;
  fecha_programada: string;
  descripcion: string;
  responsable: number;
  responsable_nombre?: string;
  completado: boolean;
  fecha_completado?: string;
}

export interface SeguimientoForm {
  lead: number;
  tipo: number;
  fecha_programada: string;
  descripcion: string;
  responsable?: number;
}

// ─── Historial ───────────────────────────────────────────────────────

export interface HistorialEtapa {
  id: number;
  lead: number;
  etapa: number;
  etapa_nombre?: string;
  fecha_entrada: string;
  fecha_salida?: string;
}