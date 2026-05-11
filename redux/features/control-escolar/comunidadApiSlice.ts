import { apiSlice } from "@/redux/services/apiSlice";
import {
  EnlaceClase,
  EnlaceClaseBody,
  Comentario,
  ComentarioSimple,
} from "../types/control-escolar/type";
import { PaginatedResponse } from "../types/paginated";

const comunidadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMisClases: builder.query<EnlaceClase[], void>({
      query: () => "/control-escolar/comunidad/enlaces-clase/mis_clases/",
    }),
    getEnlacesClase: builder.query<
      PaginatedResponse<EnlaceClase>,
      { programa?: string; plataforma?: number }
    >({
      query: ({ programa, plataforma } = {}) => {
        const params = new URLSearchParams();
        if (programa) params.set("programa", programa);
        if (plataforma) params.set("plataforma", String(plataforma));
        return `/control-escolar/comunidad/enlaces-clase/?${params}`;
      },
    }),
    createEnlaceClase: builder.mutation<EnlaceClase, EnlaceClaseBody>({
      query: (body) => ({
        url: "/control-escolar/comunidad/enlaces-clase/",
        method: "POST",
        body,
      }),
    }),
    updateEnlaceClase: builder.mutation<
      EnlaceClase,
      { id: number } & Partial<EnlaceClaseBody>
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/comunidad/enlaces-clase/${id}/`,
        method: "PATCH",
        body,
      }),
    }),
    deleteEnlaceClase: builder.mutation<void, number>({
      query: (id) => ({
        url: `/control-escolar/comunidad/enlaces-clase/${id}/`,
        method: "DELETE",
      }),
    }),
    getComentarios: builder.query<
      PaginatedResponse<Comentario>,
      { diplomado?: string; modulo?: number }
    >({
      query: ({ diplomado, modulo } = {}) => {
        const params = new URLSearchParams();
        if (diplomado) params.append("diplomado", diplomado);
        if (modulo) params.append("modulo", String(modulo));
        return `/control-escolar/comunidad/comentarios/?${params.toString()}`;
      },
    }),
    createComentario: builder.mutation<
      Comentario,
      { comentario: string; diplomado?: string; modulo?: number }
    >({
      query: (body) => ({
        url: "/control-escolar/comunidad/comentarios/",
        method: "POST",
        body,
      }),
    }),
    responderComentario: builder.mutation<
      ComentarioSimple,
      { id: number; comentario: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/control-escolar/comunidad/comentarios/${id}/responder/`,
        method: "POST",
        body,
      }),
    }),
    marcarComentarioVisto: builder.mutation<void, { comentario: number }>({
      query: (body) => ({
        url: "/control-escolar/comunidad/comentarios-vistos/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMisClasesQuery,
  useGetEnlacesClaseQuery,
  useCreateEnlaceClaseMutation,
  useUpdateEnlaceClaseMutation,
  useDeleteEnlaceClaseMutation,
  useGetComentariosQuery,
  useCreateComentarioMutation,
  useResponderComentarioMutation,
  useMarcarComentarioVistoMutation,
} = comunidadApiSlice;
