import { apiSlice } from "@/redux/services/apiSlice";
import { PaginatedResponse } from "../types/paginated";
import {
  AreaResponsable,
  EstadoSolicitud,
  Solicitud,
  TipoSolicitud,
} from "../types/solicitudes/types";

const solicitudesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAreasResponsables: builder.query<PaginatedResponse<AreaResponsable>, void>({
      query: () => "/catalogos/areas-responsables/",
      providesTags: ["AreasResponsables"],
    }),
    getTiposSolicitud: builder.query<PaginatedResponse<TipoSolicitud>, void>({
      query: () => "/catalogos/tipos-solicitud/",
      providesTags: ["TiposSolicitud"],
    }),
    getSolicitudes: builder.query<
      PaginatedResponse<Solicitud>,
      { page?: number; search?: string; estado?: string } | void
    >({
      query: (params = {}) => {
        const { page = 1, search, estado } = params as {
          page?: number;
          search?: string;
          estado?: string;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (search) qs.set("search", search);
        if (estado && estado !== "todos") qs.set("estado", estado);
        return `/solicitudes/?${qs.toString()}`;
      },
      providesTags: ["Solicitudes"],
    }),
    getSolicitud: builder.query<Solicitud, string>({
      query: (uuid) => `/solicitudes/${uuid}/`,
    }),
    createSolicitud: builder.mutation<Solicitud, FormData>({
      query: (formData) => ({
        url: "/solicitudes/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Solicitudes"],
    }),
    cambiarEstadoSolicitud: builder.mutation<
      Solicitud,
      { uuid: string; estado: EstadoSolicitud }
    >({
      query: ({ uuid, estado }) => ({
        url: `/solicitudes/${uuid}/cambiar-estado/`,
        method: "POST",
        body: { estado },
      }),
      invalidatesTags: ["Solicitudes"],
    }),
    deleteSolicitud: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/solicitudes/${uuid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Solicitudes"],
    }),
  }),
});

export const {
  useGetAreasResponsablesQuery,
  useGetTiposSolicitudQuery,
  useGetSolicitudesQuery,
  useGetSolicitudQuery,
  useCreateSolicitudMutation,
  useCambiarEstadoSolicitudMutation,
  useDeleteSolicitudMutation,
} = solicitudesApiSlice;