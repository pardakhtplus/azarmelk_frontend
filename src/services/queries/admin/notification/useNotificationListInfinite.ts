import { api } from "@/services/axios-client";
import {
  type TNotificationListResponse,
  type TGetNotificationListParams,
} from "@/types/admin/notification/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useNotificationListInfinite(
  params?: Omit<TGetNotificationListParams, "page">,
) {
  const notificationListInfinite = useInfiniteQuery({
    queryKey: ["notificationListInfinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await api.admin.notification.getList({
          ...params,
          page: pageParam,
          limit: params?.limit || 20,
        });

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
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.pagination) return undefined;

      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  return {
    notificationListInfinite,
  };
}
