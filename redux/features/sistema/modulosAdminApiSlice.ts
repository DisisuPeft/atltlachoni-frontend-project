import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";

export interface PestaniaAdminDetail {
  id: number;
  nombre: string;
  href: string;
  orden: number;
  permisos_ids: number[];
}

export interface ModuloAdmin {
  id: number;
  nombre: string;
  href: string;
  orden: number;
  pestanias: PestaniaAdminDetail[];
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
    updateModulo: builder.mutation<ModuloAdmin, { id: number; body: Partial<ModuloBody> & { pestanias: PestaniaBody[] } }>({
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
  useAsignarPermisosPestaniaMutation,
} = modulosAdminApiSlice;