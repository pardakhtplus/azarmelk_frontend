import { useMutation, useQueryClient } from "@tanstack/react-query";
import useReadNotification from "@/services/mutations/admin/notification/useReadNotification";

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { readNotification } = useReadNotification();

  const markAllAsReadMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      if (notificationIds.length === 0) {
        return { success: true };
      }

      // Call backend API to mark all notifications as read
      const result = await readNotification.mutateAsync({
        id: notificationIds,
      });
      return { success: true, result };
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated notification data
      queryClient.invalidateQueries({ queryKey: ["notificationList"] });
      queryClient.invalidateQueries({ queryKey: ["notificationListInfinite"] });
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
