import { apiSlice } from "@/redux/services/apiSlice";
import { Pestanias, User, UserVerifyResponse } from "../types/auth/auth-types";
// import { SuccessMessage } from "../types/reponse";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<User, void>({
      query: () => "/user/me/",
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/sign/",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register/",
        method: "POST",
        body: data,
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        url: "/auth/verify/",
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout/",
        method: "POST",
      }),
    }),
    getPestania: builder.query<Pestanias[], string | null>({
      query: (ref) => `/sistema/pestanias/?ref=${ref}`,
    }),
    verifyUser: builder.query<UserVerifyResponse, void>({
      query: () => "/auth/roles/",
    }),
    solicitarRecuperacion: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/password/olvide/",
        method: "POST",
        body,
      }),
    }),
    resetearPassword: builder.mutation<
      { message: string },
      { uid: string; token: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/password/resetear/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useGetPestaniaQuery,
  useVerifyUserQuery,
  useSolicitarRecuperacionMutation,
  useResetearPasswordMutation,
} = authApiSlice;
