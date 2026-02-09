export interface Programa {
  nombre: string;
  ref: string;
  tipo: string;
  imagen_url: string | null;
  banner_url: string | null;
}

export interface InscriptionDetail {
  countCursos: number;
  programasInscritos: Programa[];
  completados: number;
}
