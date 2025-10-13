import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationStorage } from "@/lib/notificationStorage";

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  const markAllAsReadMutation = useMutation({
    mutationFn: async (notificationIds?: string[]) => {
      if (notificationIds && notificationIds.length > 0) {
        // Mark specific notifications as read
        NotificationStorage.markAllAsRead(notificationIds);
      } else {
        // If no IDs provided, we need to get all current notifications and mark them as read
        // This would typically involve getting all notification IDs from the current query data
        const queryData = queryClient.getQueryData([
          "notificationListInfinite",
        ]) as any;

        if (queryData?.pages) {
          const allNotificationIds: string[] = [];
          queryData.pages.forEach((page: any) => {
            if (page?.data?.notifications) {
              page.data.notifications.forEach((notification: any) => {
                allNotificationIds.push(notification.id);
              });
            }
          });

          if (allNotificationIds.length > 0) {
            NotificationStorage.markAllAsRead(allNotificationIds);
          }
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      // No need to invalidate queries - we're using local storage
      console.log("All notifications marked as read");
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });

  return {
    markAllAsReadMutation,
  };
}
