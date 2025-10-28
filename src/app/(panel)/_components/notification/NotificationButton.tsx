"use client";

import React from "react";
import { IBell } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { useNotificationListInfinite } from "@/services/queries/admin/notification/useNotificationListInfinite";

interface NotificationButtonProps {
  onClick: () => void;
  isMinimized?: boolean;
  isOpen?: boolean;
  className?: string;
  ref?: React.RefObject<HTMLButtonElement>;
}

const NotificationButton = React.forwardRef<
  HTMLButtonElement,
  NotificationButtonProps
>(({ onClick, isMinimized = false, isOpen = false, className }, ref) => {
  const { notificationListInfinite } = useNotificationListInfinite({
    limit: 10,
  });

  // Get all notifications from all pages and calculate unread count from backend data
  const notifications = React.useMemo(() => {
    const allPages = notificationListInfinite.data?.pages || [];
    return allPages.flatMap((page) => page?.data?.notifications || []);
  }, [notificationListInfinite.data?.pages]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <button
      ref={ref}
      className={cn(
        "flex size-12 items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-200 hover:border-blue-200 hover:from-blue-100 hover:to-indigo-100 lg:h-12 lg:w-full lg:gap-x-2 lg:px-4",
        isMinimized &&
          "items-center justify-center !gap-x-0 border-none bg-transparent !px-0",
        isOpen && !isMinimized && "ring-2 ring-blue-300 ring-offset-2",
        className,
      )}
      onClick={onClick}
      aria-label="اعلان ها"
      title="اعلان ها">
      <div
        className={cn(
          "flex items-center gap-x-2 max-lg:!size-full",
          isMinimized && "justify-center gap-x-0",
        )}>
        <div className="relative max-lg:!flex max-lg:!size-full max-lg:!items-center max-lg:!justify-center">
          <IBell
            className={cn(
              "size-5 text-gray-700 transition-all duration-200 group-hover:text-black",
              isMinimized && "size-6",
              isOpen && "scale-110",
            )}
          />
          {unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
              <span className="text-[10px]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex w-full items-center justify-between transition-all duration-300 max-lg:!hidden",
            isMinimized ? "w-0 opacity-0" : "w-auto opacity-100",
          )}>
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            اعلان ها
          </p>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 max-lg:!hidden",
          isMinimized ? "w-0 opacity-0" : "w-auto opacity-100",
        )}>
        {unreadCount > 0 && (
          <>
            <div className="size-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs text-gray-500">{unreadCount} جدید</span>
          </>
        )}
      </div>
    </button>
  );
});

NotificationButton.displayName = "NotificationButton";

export default NotificationButton;
