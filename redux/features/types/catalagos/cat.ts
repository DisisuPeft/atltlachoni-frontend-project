import { BaseModel } from "../base-interface";

export interface Instituciones extends BaseModel {
  nombre: string;
  empresa: string;
}

export interface Departamento {
  id: number;
  nombre: string;
  icono: string;
  jefe_departamento: number | null;
  jefe_nombre: string | null;
  instituto: number;
  instituto_nombre: string;
  total_usuarios: number;
}

export interface DepartamentoFormData {
  nombre: string;
  icono: string;
  jefe_departamento: number | null;
  instituto: number;
}

export interface UsuarioDepartamento {
  uuid: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  status: number;
  roles_list: { id: number; nombre: string; nivel_acceso: number }[];
}

export interface NivelEducativo {
  id: number;
  nombre: string;
}

export interface EstadoRepublica {
  id: number;
  name: string;
}

export interface Localidad {
  id: number;
  name: string;
}

export interface MetodoPago {
  id: string;
  nombre: string;
}
