import { baseApi } from "@/redux/api/baseApi";
import { INotificationsResponse } from "@/types/notifications/NotitficationsTypes";

const NotificationManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<INotificationsResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    clearAllNotifications: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/delete_all",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    clearSingleNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useClearAllNotificationsMutation,
  useClearSingleNotificationMutation,
} = NotificationManagementApi;
export default NotificationManagementApi;
