"use client";

import { IBell, ICheck } from "@/components/Icons";
import { NotificationStorage } from "@/lib/notificationStorage";
import { cn } from "@/lib/utils";
import { useMarkAllNotificationsAsRead } from "@/services/mutations/client/notification/useMarkAllNotificationsAsRead";
import { useMarkNotificationAsRead } from "@/services/mutations/client/notification/useMarkNotificationAsRead";
import { useNotificationListInfinite } from "@/services/queries/admin/notification/useNotificationListInfinite";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { SOCKET_CONFIG, SOCKET_EVENTS } from "@/services/socket";
import { type TNotification } from "@/types/admin/notification/types";
import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useMediaQuery } from "usehooks-ts";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  triggerRefMobile: React.RefObject<HTMLButtonElement | null>;
  className?: string;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  triggerRef,
  triggerRefMobile,
  className,
}: NotificationCenterProps) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [, setSocket] = useState<Socket | null>(null);
  const [localNotifications, setLocalNotifications] = useState<TNotification[]>(
    [],
  );
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { userInfo } = useUserInfo();

  // Listen for localStorage changes to update the UI
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("NotificationCenter: Storage changed, refreshing...");
      setRefreshCounter((prev) => {
        console.log(
          "NotificationCenter: Updating refreshCounter from",
          prev,
          "to",
          prev + 1,
        );
        return prev + 1;
      });
    };

    // Listen for custom storage events
    window.addEventListener("notificationStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener(
        "notificationStorageChange",
        handleStorageChange,
      );
    };
  }, []);
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from API with infinite scrolling
  const { notificationListInfinite } = useNotificationListInfinite({
    limit: 10,
  });

  // Mutation hooks for marking as read
  const { markAsReadMutation } = useMarkNotificationAsRead();
  const { markAllAsReadMutation } = useMarkAllNotificationsAsRead();

  // Initialize socket connection
  useEffect(() => {
    if (typeof window !== "undefined" && userInfo.data?.data.id) {
      const socketInstance = io(SOCKET_CONFIG.url, {
        transports: SOCKET_CONFIG.transports as any,
        autoConnect: SOCKET_CONFIG.autoConnect,
      });

      socketInstance.on("connect", () => {
        console.log("Connected to notification socket");
      });

      // 1. اول باید join کنید
      socketInstance.emit("join", userInfo.data.data.id);

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from notification socket");
      });

      socketInstance.on(
        SOCKET_EVENTS.NOTIFICATION,
        (notification: TNotification) => {
          console.log("New notification received:", notification);

          // Add to local state for immediate UI update
          setLocalNotifications((prev) => [notification, ...prev]);

          // Invalidate and refetch the notification list
          queryClient.invalidateQueries({ queryKey: ["notificationList"] });
          queryClient.invalidateQueries({
            queryKey: ["notificationListInfinite"],
          });
        },
      );

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [queryClient, userInfo.data?.data.id]);

  // Cleanup old notification states from localStorage periodically
  useEffect(() => {
    // Clean up old states on component mount
    NotificationStorage.clearOldStates(30); // Keep states for 30 days

    // Set up periodic cleanup (every hour)
    const cleanupInterval = setInterval(
      () => {
        NotificationStorage.clearOldStates(30);
      },
      60 * 60 * 1000,
    ); // 1 hour

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  // Combine API notifications with local notifications and apply local storage read states
  const notifications = React.useMemo(() => {
    console.log(
      "NotificationCenter: useMemo recalculating notifications, refreshCounter:",
      refreshCounter,
    );
    const allPages = notificationListInfinite.data?.pages || [];
    const apiNotifications = allPages.flatMap(
      (page) => page?.data?.notifications || [],
    );

    // Merge local notifications with API notifications, avoiding duplicates
    const combined = [...localNotifications];

    apiNotifications.forEach((apiNotif) => {
      if (!combined.find((localNotif) => localNotif.id === apiNotif.id)) {
        combined.push(apiNotif);
      }
    });

    // Apply local storage read states and sort by creation date (newest first)
    const result = combined
      .map((notification) => ({
        ...notification,
        isRead: NotificationStorage.isRead(notification.id),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    console.log(
      "NotificationCenter: Processed notifications:",
      result.map((n) => ({ id: n.id, title: n.title, isRead: n.isRead })),
    );
    return result;
  }, [
    notificationListInfinite.data?.pages,
    localNotifications,
    refreshCounter,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        triggerRefMobile.current &&
        !triggerRefMobile.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef, triggerRefMobile]);

  // Update position when dropdown opens
  useEffect(() => {
    if (
      isOpen &&
      dropdownRef.current &&
      triggerRef.current &&
      triggerRefMobile.current
    ) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;

      let left = rect.left;
      const dropdownWidth = 320; // w-80 = 320px

      // Check if dropdown would go off-screen on the right
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 20; // 20px margin from right edge
      }

      dropdown.style.left = `${left}px`;
      dropdown.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    }
  }, [isOpen, triggerRef, triggerRefMobile]);

  // Handle window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (
        isOpen &&
        dropdownRef.current &&
        triggerRef.current &&
        triggerRefMobile.current
      ) {
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdown = dropdownRef.current;

        let left = rect.left;
        const dropdownWidth = 320;

        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 20;
        }

        dropdown.style.left = `${left}px`;
        dropdown.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      }
    };

    const handleScroll = () => {
      if (
        isOpen &&
        dropdownRef.current &&
        triggerRef.current &&
        triggerRefMobile.current
      ) {
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdown = dropdownRef.current;

        let left = rect.left;
        const dropdownWidth = 320;

        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 20;
        }

        dropdown.style.left = `${left}px`;
        dropdown.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, triggerRef, triggerRefMobile]);

  const markAsRead = async (id: string) => {
    try {
      console.log("NotificationCenter: Marking notification as read:", id);
      // Call mutation to mark as read (which handles local storage and dispatches event)
      await markAsReadMutation.mutateAsync(id);
      console.log("NotificationCenter: Successfully marked as read:", id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Get all current notification IDs
      const allNotificationIds = notifications.map((n) => n.id);

      // Call mutation to mark all as read (which handles local storage and dispatches event)
      await markAllAsReadMutation.mutateAsync(allNotificationIds);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Load more when user scrolls to bottom
    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      notificationListInfinite.hasNextPage &&
      !notificationListInfinite.isFetchingNextPage
    ) {
      notificationListInfinite.fetchNextPage();
    }
  };

  const getNotificationIcon = (type: TNotification["type"]) => {
    switch (type) {
      case "success":
        return <div className="size-2 rounded-full bg-green-500" />;
      case "warning":
        return <div className="size-2 rounded-full bg-yellow-500" />;
      case "error":
        return <div className="size-2 rounded-full bg-red-500" />;
      default:
        return <div className="size-2 rounded-full bg-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "همین الان";
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ساعت پیش`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} روز پیش`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "visible absolute grid h-96 w-80 grid-rows-[auto_1fr] rounded-xl border border-gray-200 bg-white opacity-100 shadow-2xl transition-all duration-200 lg:fixed lg:h-[calc(100vh-40px)] lg:max-h-none",
        !isOpen && "invisible opacity-0",
        className,
      )}
      style={{
        zIndex: 1000,
        right:
          triggerRef.current && isLg
            ? window.innerWidth -
              triggerRef.current.getBoundingClientRect().right +
              triggerRef.current.getBoundingClientRect().width +
              20
            : triggerRefMobile.current
              ? undefined
              : undefined,
        left:
          triggerRefMobile.current && !isLg
            ? Number(triggerRefMobile.current?.getBoundingClientRect().left) + 2
            : undefined,
        bottom: 20,
        top: isLg ? 20 : 70,
      }}>
      {/* Header */}
      <div className="h-fit border-b border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IBell className="size-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">اعلان ها</h3>
            {unreadCount > 0 && (
              <span className="flex size-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="rounded-md bg-neutral-100 p-1" onClick={onClose}>
            <XIcon className="size-5" />
          </button>
        </div>
        {unreadCount > 0 && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={markAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50">
              {markAllAsReadMutation.isPending
                ? "در حال علامت‌گذاری..."
                : "همه را خوانده علامت‌گذاری کن"}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="h-full overflow-y-auto" onScroll={handleScroll}>
        {notificationListInfinite.isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <IBell className="mb-3 size-12 text-gray-300" />
            <p className="text-gray-500">هیچ اعلانی ندارید</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 transition-colors hover:bg-gray-50",
                  !notification.isRead && "bg-blue-50/50",
                )}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <p
                        className={cn(
                          "line-clamp-1 text-sm font-medium text-gray-900",
                          !notification.isRead && "font-semibold",
                        )}>
                        {notification.title}
                      </p>
                      <div className="ml-2 flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {notification.description}
                    </p>
                    {!notification.isRead && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => markAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50">
                          <ICheck className="size-3" />
                          {markAsReadMutation.isPending ? "..." : "خوانده شد"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator for infinite scroll */}
            {notificationListInfinite.isFetchingNextPage && (
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
                <span className="mr-2 text-sm text-gray-500">
                  در حال بارگذاری...
                </span>
              </div>
            )}

            {/* End of list indicator */}
            {!notificationListInfinite.hasNextPage &&
              notifications.length > 0 && (
                <div className="flex items-center justify-center p-4">
                  <span className="text-xs text-gray-400">
                    پایان لیست اعلان‌ها
                  </span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
