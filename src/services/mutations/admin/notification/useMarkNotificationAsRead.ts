import { useMutation, useQueryClient } from "@tanstack/react-query";
import useReadNotification from "@/services/mutations/admin/notification/useReadNotification";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { readNotification } = useReadNotification();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Call backend API to mark as read
      const result = await readNotification.mutateAsync({
        id: [notificationId],
      });
      return { success: true, notificationId, result };
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch updated notification data
      queryClient.invalidateQueries({ queryKey: ["notificationList"] });
      queryClient.invalidateQueries({ queryKey: ["notificationListInfinite"] });
      console.log(`Notification ${data.notificationId} marked as read`);
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });

  return {
    markAsReadMutation,
  };
}
