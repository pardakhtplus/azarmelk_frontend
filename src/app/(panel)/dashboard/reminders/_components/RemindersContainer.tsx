"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import NotificationModal from "@/components/modules/NotificationModal";
import Pagination from "@/components/modules/Pagination";
import ReminderFormModal from "@/components/modules/reminder/ReminderFormModal";
import { REMINDER_CONTENT } from "@/components/modules/reminder/sectionUtils";
import { formatDateForTehranDisplay } from "@/lib/timezone-utils";
import { cn } from "@/lib/utils";
import useMutateReminder from "@/services/mutations/admin/reminder/useMutateReminder";
import { useReminderList } from "@/services/queries/admin/reminder/useReminderList";
import {
  type TReminder,
  REMINDER_STATUS,
} from "@/types/admin/estate/reminder.types";
import {
  BellIcon,
  EditIcon,
  Loader,
  MessageSquareIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RemindersContainer() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<TReminder | null>(
    null,
  );

  const searchParams = useSearchParams();

  // Fetch reminders from API
  const { reminderList } = useReminderList({
    enabled: true,
    params: {
      page: 1,
      limit: 10,
    },
  });

  const { deleteReminder } = useMutateReminder();

  const reminders = reminderList.data?.data?.reminders || [];

  const handleAddReminder = (_reminderData: TReminder) => {
    // This function is called after successful API operations
    // The query will be invalidated and refetched automatically
    setIsFormModalOpen(false);
    setEditingReminder(null);
  };

  const handleEditReminder = (reminder: TReminder) => {
    setEditingReminder(reminder);
    setIsFormModalOpen(true);
  };

  // delete handled via NotificationModal onSubmit

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingReminder(null);
  };

  const formatDate = (dateString: string) => {
    return formatDateForTehranDisplay(dateString);
  };

  return (
    <>
      <PanelBodyHeader
        title="یادآور ها"
        breadcrumb={
          <>
            <Link
              href="/dashboard"
              className="text-gray-500 transition-colors hover:text-primary">
              داشبورد
            </Link>
            <span className="text-gray-300"> / </span>
            <span className="font-medium text-gray-900">یادآور ها</span>
          </>
        }
      />
      <div className="pt-10">
        {reminderList.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : reminderList.error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">خطا در بارگذاری یادآورها</p>
            <button
              onClick={() => reminderList.refetch()}
              className="mt-2 text-blue-500 hover:text-blue-600">
              تلاش مجدد
            </button>
          </div>
        ) : reminders.length === 0 ? (
          <div className="py-12 text-center">
            <BellIcon className="mx-auto mb-4 size-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              هیچ یادآوری وجود ندارد
            </h3>
            <p className="mb-6 text-gray-500">
              برای شروع، اولین یادآور خود را اضافه کنید
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={cn(
                  "rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md",
                  reminder.status === REMINDER_STATUS.SENT && "opacity-70",
                )}>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {reminder.title}
                    </h3>
                    <p className="mb-1.5 text-sm text-gray-600">
                      {reminder.description}
                    </p>

                    <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquareIcon className="size-4" />
                        <span>
                          {" "}
                          تاریخ ارسال یادآور :{" "}
                          {formatDate(reminder.reminderDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {reminder.status === REMINDER_STATUS.PENDING && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditReminder(reminder)}
                          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="ویرایش یادآور">
                          <EditIcon className="size-4" />
                        </button>
                        <NotificationModal
                          colorVariant="red"
                          actionName="حذف"
                          actionClassName="bg-red"
                          title="حذف یادآور"
                          onSubmit={async () => {
                            const res = await deleteReminder.mutateAsync(
                              reminder.id,
                            );
                            if (!res) return false;
                            return true;
                          }}
                          description={`آیا می‌خواهید یادآور "${reminder.title}" حذف شود؟`}
                          className="flex !size-8 items-center justify-center rounded-full !border-none !bg-transparent !p-0 !py-0 text-gray-500 transition-colors hover:!bg-red/10 hover:text-red-600">
                          <TrashIcon className="size-4" />
                        </NotificationModal>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination
        pageInfo={{
          currentPage: Number(searchParams.get("page") || "1"),
          totalPages: reminderList.data?.data?.pagination?.totalPages || 1,
        }}
      />

      {/* Form Modal */}
      <ReminderFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleAddReminder}
        contentId={
          editingReminder?.estateId || editingReminder?.mettingId || ""
        }
        contentTitle=""
        editingReminder={editingReminder}
        contentType={
          editingReminder?.estateId
            ? REMINDER_CONTENT.ESTATE
            : REMINDER_CONTENT.MEETING
        }
      />
    </>
  );
}
