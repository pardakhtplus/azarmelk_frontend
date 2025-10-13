import { api } from "@/services/axios-client";
import {
  type TNotificationListResponse,
  type TGetNotificationListParams,
} from "@/types/admin/notification/types";
import { useQuery } from "@tanstack/react-query";

export function useNotificationList(params?: TGetNotificationListParams) {
  const notificationList = useQuery({
    queryKey: ["notificationList", params],
    queryFn: async () => {
      try {
        const res = await api.admin.notification.getList(params);

        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const data = res.data as {
            message: string;
            details: string;
          };
          console.log(data);
          return null;
        }

        const data = res.data as TNotificationListResponse;

        return data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });

  return {
    notificationList,
  };
}
