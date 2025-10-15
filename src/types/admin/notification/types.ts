export interface TNotification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  updatedAt: string;
  read: boolean;
  meetingId?: string;
  estateId?: string;
}

export interface TNotificationListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: TNotification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface TGetNotificationListParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}
