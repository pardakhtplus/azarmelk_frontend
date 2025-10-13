import Button from "@/components/modules/buttons/Button";
import Loader from "@/components/modules/Loader";
import Modal from "@/components/modules/Modal";
import NotificationModal from "@/components/modules/NotificationModal";
import { formatDateForTehranDisplay } from "@/lib/timezone-utils";
import { cn } from "@/lib/utils";
import useMutateReminder from "@/services/mutations/admin/reminder/useMutateReminder";
import { useReminderList } from "@/services/queries/admin/reminder/useReminderList";
import {
  REMINDER_TYPE,
  type TReminder,
} from "@/types/admin/estate/reminder.types";
import {
  BellIcon,
  CalendarIcon,
  EditIcon,
  MessageSquareIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import ReminderFormModal from "./ReminderFormModal";
import { REMINDER_CONTENT } from "./sectionUtils";

interface ReminderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  contentType: REMINDER_CONTENT;
}

export default function ReminderListModal({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentType,
}: ReminderListModalProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<TReminder | null>(
    null,
  );

  // Fetch reminders from API
  const { reminderList } = useReminderList({
    enabled: isOpen && !!contentId,
    params: {
      estateId: contentType === REMINDER_CONTENT.ESTATE ? contentId : undefined,
      mettingId:
        contentType === REMINDER_CONTENT.MEETING ? contentId : undefined,
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

  const getReminderTypeText = (types: REMINDER_TYPE[]) => {
    return types
      .map((type) => {
        switch (type) {
          case REMINDER_TYPE.SMS:
            return "پیامک";
          case REMINDER_TYPE.NOTIFICATION:
            return "اعلان";
          default:
            return type;
        }
      })
      .join("، ");
  };

  const getReminderTypeBadgeColor = (types: REMINDER_TYPE[]) => {
    if (
      types.includes(REMINDER_TYPE.SMS) &&
      types.includes(REMINDER_TYPE.NOTIFICATION)
    ) {
      return "bg-blue-100 text-blue-800";
    } else if (types.includes(REMINDER_TYPE.SMS)) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-purple-100 text-purple-800";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpen}
          title="یادآورها"
          classNames={{
            background: "z-[60] !py-0 sm:!py-2 !px-0 sm:!px-4",
            box: "!max-w-3xl !max-h-none sm:!max-h-[100%] rounded-none sm:rounded-xl overflow-x-hidden !h-full sm:!h-fit",
            header: "!py-4",
          }}
          onCloseModal={onClose}
          onClickOutside={onClose}>
          <div className="relative w-full">
            {/* Content */}
            <div className="overflow-y-auto p-6">
              <div className="mb-6">
                <Button
                  variant="blue"
                  onClick={() => setIsFormModalOpen(true)}
                  className="w-full rounded-lg">
                  <PlusIcon className="size-4" />
                  <span>افزودن یادآور</span>
                </Button>
              </div>

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
                  <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="mx-auto flex items-center gap-2 rounded-lg bg-primary-blue px-6 py-3 text-white transition-colors hover:bg-primary-blue/90">
                    <PlusIcon className="size-4" />
                    <span>افزودن یادآور</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-gray-900">
                            {reminder.title}
                          </h3>
                          <p className="mb-2 text-sm text-gray-600">
                            {reminder.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="size-4" />
                              <span>{formatDate(reminder.reminderDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquareIcon className="size-4" />
                              <span>{getReminderTypeText(reminder.type)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs font-medium",
                              getReminderTypeBadgeColor(reminder.type),
                            )}>
                            {getReminderTypeText(reminder.type)}
                          </span>
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
                        </div>
                      </div>
                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-sm text-gray-700">
                          {reminder.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>,
        document.body,
      )}

      {/* Form Modal */}
      <ReminderFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleAddReminder}
        contentId={contentId}
        contentTitle={contentTitle}
        editingReminder={editingReminder}
        contentType={contentType}
      />
    </>
  );
}
