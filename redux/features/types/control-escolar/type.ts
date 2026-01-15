import { BaseModel } from "../base-interface";
import { UserFormData } from "@/hooks/users/user-create-form";

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

export interface EstudiantePerfilForm extends BaseModel {
  status: number;

  user: UserFormData;
  nivel_educativo: number | null;
  institucion: number | null;
  estado_pais: number | null;
  ciudad: number | null;

  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}

export const InitalUserValues: UserFormData = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  genero: 0,
  edad: 0,
  fecha_nacimiento: "",
  telefono: "",
  email: "",
  status: null,
  roles: [],
  password: "",
};

export const estudiantePerfilInitialValues: EstudiantePerfilForm = {
  status: 0,

  user: InitalUserValues,
  nivel_educativo: null,
  institucion: null,
  estado_pais: null,
  ciudad: null,

  especialidad: "",
  matricula: "",
  fecha_ingreso: null,
};

export interface User {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number | null;
}

export interface EstudiantePerfil extends BaseModel {
  status: number;

  user: User;
  nivel_educativo: number | null;
  institucion: number | null;
  estado_pais: number | null;
  ciudad: number | null;

  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}
