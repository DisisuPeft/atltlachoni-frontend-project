export type LeadFormValues = {
  nombre: string;
  nombre_completo: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
  interesado_en?: number;
  estatus?: number;
  pipeline?: number;
  etapa?: number;
  fuente?: number;
  vendedor_asignado?: number;
  empresa?: number;
  institucion?: number;
  campania?: number;
};

export interface FiltrosFechas {
  fecha_inicio: string;
  fecha_fin: string;
}

export interface EstatusInterface {
  id: number;
  nombre: string;
}

export interface FuentesInterface {
  id: number;
  nombre: string;
}

export interface EtapasInterface {
  id: number;
  nombre: string;
}
