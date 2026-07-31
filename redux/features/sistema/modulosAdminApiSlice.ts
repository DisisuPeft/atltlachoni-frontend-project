import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";

export interface PermisoDetail {
  id: number;
  name: string;
  codename: string;
  content_type__app_label: string;
}

export interface PestaniaAdminDetail {
  id: number;
  nombre: string;
  href: string;
  orden: number;
  permisos_ids: number[];
}

export interface ModuloAdmin {
  id: number;
  uuid: string;
  nombre: string;
  href: string;
  orden: number;
  status: number;
  pestanias: PestaniaAdminDetail[];
  permisos_ids: number[];
  permisos_detail: PermisoDetail[];
}

export interface PestaniaBody {
  id?: number;
  nombre: string;
  href: string;
  orden: number;
  permisos_ids: number[];
}

export interface ModuloBody {
  nombre: string;
  href: string;
  orden: number;
  status?: number;
  permisos_ids?: number[];
  pestanias: PestaniaBody[];
}

const modulosAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModulosAdmin: builder.query<PaginatedResponse<ModuloAdmin>, void>({
      query: () => `/sistema/modulos/`,
    }),
    createModulo: builder.mutation<ModuloAdmin, ModuloBody>({
      query: (body) => ({
        url: `/sistema/modulos/`,
        method: "POST",
        body,
      }),
    }),
    updateModulo: builder.mutation<
      ModuloAdmin,
      { id: number; body: Partial<ModuloBody> & { pestanias: PestaniaBody[] } }
    >({
      query: ({ id, body }) => ({
        url: `/sistema/modulos/${id}/`,
        method: "PATCH",
        body,
      }),
    }),
    deleteModulo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sistema/modulos/${id}/`,
        method: "DELETE",
      }),
    }),
    getModuloPermisos: builder.query<PermisoDetail[], number>({
      query: (id) => `/sistema/modulos/${id}/permisos/`,
    }),
    asignarPermisosModulo: builder.mutation<
      void,
      { id: number; permisos: number[] }
    >({
      query: ({ id, permisos }) => ({
        url: `/sistema/modulos/${id}/permisos/asignar/`,
        method: "POST",
        body: { permisos },
      }),
    }),
    quitarPermisosModulo: builder.mutation<
      void,
      { id: number; permisos: number[] }
    >({
      query: ({ id, permisos }) => ({
        url: `/sistema/modulos/${id}/permisos/quitar/`,
        method: "POST",
        body: { permisos },
      }),
    }),
    asignarPermisosPestania: builder.mutation<
      void,
      { pestaniaId: number; permisos_ids: number[] }
    >({
      query: ({ pestaniaId, permisos_ids }) => ({
        url: `/sistema/pestanias-admin/${pestaniaId}/permisos/asignar/`,
        method: "POST",
        body: { permisos_ids },
      }),
    }),
  }),
});

export const {
  useGetModulosAdminQuery,
  useCreateModuloMutation,
  useUpdateModuloMutation,
  useDeleteModuloMutation,
  useGetModuloPermisosQuery,
  useAsignarPermisosModuloMutation,
  useQuitarPermisosModuloMutation,
  useAsignarPermisosPestaniaMutation,
} = modulosAdminApiSlice;