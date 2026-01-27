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

export interface ProgramaEducativo extends BaseModel {
  nombre: string;
  descripcion?: string | null;
  ref: string | null;
  tipo_nombre: string | null;
  institucion_nombre?: string | null;
  modalidad?: string | null;

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

  modulos_obj: ModuloEducativoForm[];
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
  modulos_obj?: ModuloEducativoForm[];
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

export interface ProgramaSimple extends BaseModel {
  nombre: string;
}

export interface TipoProgramaGenerico extends BaseModel {
  nombre: string;
}

export interface ModalidadesGenerico extends BaseModel {
  name: string;
}

export interface UserStudentData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number;
}

export interface EstudiantePerfilForm extends BaseModel {
  user: UserStudentData;
  user_obj?: UserStudentData;
  nivel_educativo: number | null;
  institucion: number | null;
  estado_pais: string | null;
  ciudad: string | null;
  status: number;
  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}

export const InitalUserValues: UserStudentData = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  genero: 0,
  edad: 0,
  fecha_nacimiento: "",
  telefono: "",
  email: "",
  status: 0,
  // roles: [],
};

export const estudiantePerfilInitialValues: EstudiantePerfilForm = {
  user: InitalUserValues,
  nivel_educativo: null,
  institucion: null,
  estado_pais: null,
  ciudad: null,
  status: 0,
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
  nivel_educativo_nombre: number | null;
  institucion_nombre: number | null;
  estado_pais_nombre: number | null;
  ciudad_nombre: number | null;
  user_nombre: string;
  user_genero: string;
  ref: string;
  especialidad: string;
  matricula: string;
  fecha_ingreso: string | null;
}
/**Campanias */
export type CampaniaFormFields = {
  nombre: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  programa: string | null;
  costo_asignado: number | null;
  // empresa: string | null;
  instituto: string | null;
  status: number;
};

export const initialCampaniaFormValues: CampaniaFormFields = {
  nombre: "",
  descripcion: "",
  fecha_inicio: null,
  fecha_fin: null,
  programa: null,
  costo_asignado: null,
  instituto: null,
  status: 1,
};

export interface Campania {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  costo_asignado: string;
  institucion_nombre: string;
  programa_nombre: string;
  status: number;
}

export interface CampaniaPrograma {
  id: number;
  nombre: string;
}
/**Campanias */
export type Pago = {
  id: string;
  estudiante: string;
  inscripcion: number;
  monto: string | null;
  referencia: string | null;
  periodo: string | null;
  notas: string | null;
  tipo_pago: number | null;
  tipo_pago_r: string | null;
  fecha_pago: string | null;
  fecha_vencimiento: string | null;
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  estado: "pendiente" | "completado" | "parcial" | "vencido" | "cancelado";
  numero_pago: string | null;
  concepto: string | null;
};

export interface PagoFormData {
  tipo_pago: string[];
  monto: number;
  fecha_vencimiento?: string | null;
  metodo_pago?: string;
  notas?: string;
  concepto: string;
  tiene_precio_custom: boolean;
  precios_custom: {
    costo_inscripcion: number | undefined;
    costo_mensualidad: number | undefined;
    costo_documentacion: number | undefined;
  };
  razon_precio_custom: string;
  campania: string | null;
}

export interface TipoPago {
  id: number;
  nombre: string;
}

export const InitalPagoForm = {
  tipo_pago: [],
  monto: 0,
  fecha_vencimiento: "",
  metodo_pago: "",
  notas: "",
  concepto: "",
  tiene_precio_custom: false,
  precios_custom: {
    costo_inscripcion: 0,
    costo_mensualidad: 0,
    costo_documentacion: 0,
  },
  razon_precio_custom: "",
  campania: null,
};
