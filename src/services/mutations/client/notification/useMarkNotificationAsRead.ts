import { useMutation } from "@tanstack/react-query";
import { NotificationStorage } from "@/lib/notificationStorage";

export function useMarkNotificationAsRead() {
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Mark as read in local storage only
      NotificationStorage.markAsRead(notificationId);

      // Here you would typically make an API call to mark as read on the server
      // For now, we'll just use local storage
      return { success: true, notificationId };
    },
    onSuccess: (data) => {
      // No need to invalidate queries - we're using local storage
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
