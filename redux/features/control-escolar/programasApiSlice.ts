import { apiSlice } from "@/redux/services/apiSlice";

const programasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProgramas: builder.mutation({
      query: (formData) => ({
        url: "/control-escolar/programas-educativos/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateProgramasMutation } = programasApiSlice;
