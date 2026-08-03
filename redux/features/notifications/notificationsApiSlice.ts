import { apiSlice } from "@/redux/services/apiSlice";
import { Notification } from "../types/notifications/type";
import { PaginatedResponse } from "../types/paginated";

const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      { leido?: boolean; page?: number } | void
    >({
      query: (params = {}) => {
        const { leido, page = 1 } = params as {
          leido?: boolean;
          page?: number;
        };
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (leido !== undefined) qs.set("leido", String(leido));
        return `/notifications/?${qs.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Notifications" as const,
                id,
              })),
              { type: "Notifications" as const, id: "LIST" },
            ]
          : [{ type: "Notifications" as const, id: "LIST" }],
    }),
    getUnreadNotificationsCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count/",
      providesTags: [{ type: "Notifications", id: "UNREAD_COUNT" }],
    }),
    markNotificationRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/leido/`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationReadMutation,
} = notificationsApiSlice;
