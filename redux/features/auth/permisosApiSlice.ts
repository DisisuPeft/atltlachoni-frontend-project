import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";

export interface ContentTypeDetail {
  id: number;
  app_label: string;
  model: string;
}

export interface Pestania {
  id: number;
  nombre: string;
  href: string;
}

export interface Permiso {
  id: number;
  name: string;
  codename: string;
  content_type: number;
  content_type_detail: ContentTypeDetail;
  asignado: boolean;
  pestanias: Pestania[];
}

const permisosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermisos: builder.query<
      PaginatedResponse<Permiso>,
      { app?: string; model?: string; q?: string; page?: number; role?: number }
    >({
      query: ({ app = "", model = "", q = "", page = 1, role }) => {
        const params = new URLSearchParams({ app, model, q, page: String(page) });
        if (role) params.set("role", String(role));
        return `/sistema/permisos/?${params}`;
      },
    }),
    asignarPermisos: builder.mutation<void, { roleId: number; permisos: number[] }>({
      query: ({ roleId, permisos }) => ({
        url: `/sistema/roles/${roleId}/permisos/asignar/`,
        method: "POST",
        body: { permisos },
      }),
    }),
    quitarPermisos: builder.mutation<void, { roleId: number; permisos: number[] }>({
      query: ({ roleId, permisos }) => ({
        url: `/sistema/roles/${roleId}/permisos/quitar/`,
        method: "POST",
        body: { permisos },
      }),
    }),
  }),
});

export const {
  useGetPermisosQuery,
  useAsignarPermisosMutation,
  useQuitarPermisosMutation,
} = permisosApiSlice;
