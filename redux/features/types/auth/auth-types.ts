export type Permission = {
  id: number;
  name: string;
};

export type Role = {
  id: number;
  nombre: string;
  permission: Permission[];
};

export type Genero = {
  id: number;
  nombre: string;
};
export type nivEdu = {
  id: number;
  name: string;
};
export type Profile = {
  nombre: string;
  apellidoP: string;
  apellidoM: string | null;
  edad: number | null;
  fechaNacimiento: string | null;
  genero: {
    id: number;
    name: string;
  }; // Puedes definir un tipo específico si conoces la estructura
  nivEdu: {
    id: number;
    name: string;
  }; // Igual aquí
  telefono: string | null;
  user: number;
};

export interface Modulos {
  bgColor: string;
  href: string;
  icon: string;
  nombre: string;
  uuid: string;
}

export interface Pestanias {
  href: string;
  icon: string;
  nombre: string;
  uuid: string;
  id: number;
}

export type DepartamentoInfo = {
  id: number;
  nombre: string;
  instituto: {
    id: number;
    nombre: string;
  };
} | null;

export type User = {
  uuid: string;
  nombre_completo: string;
  email: string;
  roles_list: { id: number; nombre: string; nivel_acceso: number }[];
  permisos: string[];
  modulos_accesibles: Modulos[];
  departamento_info: DepartamentoInfo;
};

//3 meses de venta

export type UserVerifyResponse = {
  roles: Role[];
  superuser: boolean;
};
