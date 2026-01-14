import { BaseModel } from "../base-interface";

export interface SubmoduloEducativoForm extends BaseModel {
  titulo: string;
  descripcion?: string | null;
  orden?: number;
  path_class?: string | null;
}

export interface ModuloEducativoForm extends BaseModel {
  nombre: string;
  horas_teoricas: number;
  horas_practicas: number;
  horas_totales: number;
  creditos: number;

  submodulos: SubmoduloEducativoForm[];
}

export interface ProgramaEducativoForm extends BaseModel {
  nombre: string;
  descripcion?: string | null;

  tipo?: number | null;
  institucion?: number | null;
  modalidad?: number | null;

  duracion_horas?: number | null;
  duracion_meses?: number | null;

  fecha_inicio?: string | null;
  fecha_fin?: string | null;

  horario?: string | null;

  costo_inscripcion?: number | null;
  costo_mensualidad?: number | null;
  costo_documentacion?: number | null;

  instructor?: number[];

  imagen_url?: string | null;
  banner_url?: string | null;

  modulos: ModuloEducativoForm[];
}

export const programaInicial: ProgramaEducativoForm = {
  nombre: "",
  descripcion: "",
  tipo: null,
  institucion: null,
  modalidad: null,

  duracion_horas: null,
  duracion_meses: null,

  fecha_inicio: null,
  fecha_fin: null,

  horario: "",
  costo_inscripcion: null,
  costo_mensualidad: null,
  costo_documentacion: null,

  instructor: [],

  imagen_url: "",
  banner_url: "",

  modulos: [
    {
      nombre: "",
      horas_teoricas: 0,
      horas_practicas: 0,
      horas_totales: 0,
      creditos: 0,
      submodulos: [
        {
          titulo: "",
          descripcion: "",
          orden: 1,
        },
      ],
    },
  ],
};

export interface TipoProgramaGenerico extends BaseModel {
  nombre: string;
}

export interface ModalidadesGenerico extends BaseModel {
  name: string;
}
