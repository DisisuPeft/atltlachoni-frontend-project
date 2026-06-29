import { apiSlice } from "@/redux/services/apiSlice";
import {
  Departamento,
  DepartamentoFormData,
  UsuarioDepartamento,
} from "../types/catalagos/cat";
import { PaginatedResponse } from "../types/paginated";

const departamentoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartamentos: builder.query<PaginatedResponse<Departamento>, { instituto?: number } | void>({
      query: (params) => {
        const qs = params?.instituto ? `?instituto=${params.instituto}` : "";
        return `/catalogos/departamentos/${qs}`;
      },
      providesTags: ["Departamentos"],
    }),
    getDepartamento: builder.query<Departamento, number>({
      query: (id) => `/catalogos/departamentos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Departamentos", id }],
    }),
    addDepartamento: builder.mutation<Departamento, DepartamentoFormData>({
      query: (formData) => ({
        url: "/catalogos/departamentos/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Departamentos"],
    }),
    editDepartamento: builder.mutation<
      Departamento,
      { id: number; formData: Partial<DepartamentoFormData> }
    >({
      query: ({ id, formData }) => ({
        url: `/catalogos/departamentos/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Departamentos",
        { type: "Departamentos", id },
      ],
    }),
    deleteDepartamento: builder.mutation<void, number>({
      query: (id) => ({
        url: `/catalogos/departamentos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departamentos"],
    }),
    getUsuariosDepartamento: builder.query<
      UsuarioDepartamento[],
      { id: number; role?: number }
    >({
      query: ({ id, role }) => {
        const qs = role ? `?role=${role}` : "";
        return `/catalogos/departamentos/${id}/usuarios/${qs}`;
      },
      providesTags: ["UsuariosDepartamento"],
    }),
    asignarUsuarios: builder.mutation<string, { id: number; usuarios: string[] }>({
      query: ({ id, usuarios }) => ({
        url: `/catalogos/departamentos/${id}/asignar/`,
        method: "POST",
        body: { usuarios },
      }),
      invalidatesTags: ["UsuariosDepartamento", "Departamentos"],
    }),
    quitarUsuarios: builder.mutation<string, { id: number; usuarios: string[] }>({
      query: ({ id, usuarios }) => ({
        url: `/catalogos/departamentos/${id}/quitar/`,
        method: "POST",
        body: { usuarios },
      }),
      invalidatesTags: ["UsuariosDepartamento", "Departamentos"],
    }),
  }),
});

export const {
  useGetDepartamentosQuery,
  useGetDepartamentoQuery,
  useAddDepartamentoMutation,
  useEditDepartamentoMutation,
  useDeleteDepartamentoMutation,
  useGetUsuariosDepartamentoQuery,
  useAsignarUsuariosMutation,
  useQuitarUsuariosMutation,
} = departamentoApiSlice;