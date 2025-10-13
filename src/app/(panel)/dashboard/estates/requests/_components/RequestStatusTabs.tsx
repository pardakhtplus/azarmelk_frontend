"use client";

import { REQUEST_STATUS } from "@/types/admin/estate/enum";
import { cn } from "@/lib/utils";

interface RequestStatusTabsProps {
  activeTab: REQUEST_STATUS;
  onTabChange: (status: REQUEST_STATUS) => void;
  requestCounts: {
    pending: number;
    approved: number;
    rejected: number;
    cancel: number;
  };
}

export default function RequestStatusTabs({
  activeTab,
  onTabChange,
  // requestCounts,
}: RequestStatusTabsProps) {
  return (
    <div className="mb-5 mt-8">
      <div className="border-b border-gray-200">
        <nav
          className="no-scrollbar flex space-x-3 overflow-x-auto sm:space-x-8 rtl:space-x-reverse"
          aria-label="Tabs">
          <button
            onClick={() => onTabChange(REQUEST_STATUS.PENDING)}
            className={cn(
              "whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === REQUEST_STATUS.PENDING
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}>
            در انتظار
            {/* <span
              className={cn(
                "mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                activeTab === REQUEST_STATUS.PENDING
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600",
              )}>
              {requestCounts.pending}
            </span> */}
          </button>

          <button
            onClick={() => onTabChange(REQUEST_STATUS.APPROVED)}
            className={cn(
              "whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === REQUEST_STATUS.APPROVED
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}>
            تایید شده
            {/* <span
              className={cn(
                "mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                activeTab === REQUEST_STATUS.APPROVED
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-green-700",
              )}>
              {requestCounts.approved}
            </span> */}
          </button>

          <button
            onClick={() => onTabChange(REQUEST_STATUS.REJECT)}
            className={cn(
              "whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === REQUEST_STATUS.REJECT
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}>
            رد شده
            {/* <span
              className={cn(
                "mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                activeTab === REQUEST_STATUS.REJECTED
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600",
              )}>
              {requestCounts.rejected}
            </span> */}
          </button>

          <button
            onClick={() => onTabChange(REQUEST_STATUS.CANCEL)}
            className={cn(
              "whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium transition-colors duration-200",
              activeTab === REQUEST_STATUS.CANCEL
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}>
            لغو شده
            {/* <span
              className={cn(
                "mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                activeTab === REQUEST_STATUS.CANCEL
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600",
              )}>
              {requestCounts.cancel}
            </span> */}
          </button>
        </nav>
      </div>
    </div>
  );
}
