import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import TextArea from "@/components/modules/inputs/TextArea";
import Modal from "@/components/modules/Modal";
import { formatDateForTehranDisplay } from "@/lib/timezone-utils";
import { cn } from "@/lib/utils";
import useMutateReminder from "@/services/mutations/admin/reminder/useMutateReminder";
import {
  REMINDER_STATUS,
  REMINDER_TYPE,
  type TReminder,
} from "@/types/admin/estate/reminder.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CalendarModal from "../calendar/CalendarModal";
import { REMINDER_CONTENT } from "./sectionUtils";

const reminderFormSchema = z.object({
  reminderDate: z
    .string({ message: "تاریخ یادآوری الزامی است" })
    .min(1, { message: "تاریخ یادآوری الزامی است" }),
  title: z
    .string({ message: "عنوان الزامی است" })
    .min(1, { message: "عنوان الزامی است" }),
  description: z
    .string({ message: "توضیحات الزامی است" })
    .min(1, { message: "توضیحات الزامی است" }),
  type: z
    .array(z.nativeEnum(REMINDER_TYPE))
    .min(1, { message: "حداقل یک نوع یادآوری را انتخاب کنید" }),
});

type ReminderFormData = z.infer<typeof reminderFormSchema>;

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reminder: TReminder) => void;
  contentId: string;
  contentTitle: string;
  editingReminder?: TReminder | null;
  contentType: REMINDER_CONTENT;
}

export default function ReminderFormModal({
  isOpen,
  onClose,
  onSubmit,
  contentId,
  contentTitle: _estateTitle,
  contentType,
  editingReminder = null,
}: ReminderFormModalProps) {
  const [isReminderDateOpen, setIsReminderDateOpen] = useState(false);
  const { createReminder, editReminder } = useMutateReminder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      reminderDate: "",
      title: "",
      description: "",
      type: [REMINDER_TYPE.NOTIFICATION],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingReminder) {
      setValue("title", editingReminder.title);
      setValue("description", editingReminder.description);
      setValue("type", editingReminder.type);
      // Keep the reminder date as UTC for internal handling
      // The display formatting will handle the Tehran timezone conversion
      setValue("reminderDate", editingReminder.reminderDate);
    } else {
      reset({
        reminderDate: "",
        title: "",
        description: "",
        type: [REMINDER_TYPE.NOTIFICATION],
      });
    }
  }, [editingReminder, setValue, reset]);

  const onFormSubmit = async (data: ReminderFormData) => {
    try {
      if (editingReminder) {
        // Edit existing reminder
        const result = await editReminder.mutateAsync({
          id: editingReminder.id,
          ...data,
        });

        if (result) {
          // Call onSubmit callback if provided (for local state update)
          if (onSubmit) {
            const updatedReminder: TReminder = {
              ...editingReminder,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            onSubmit(updatedReminder);
          }
          handleClose();
        }
      } else {
        // Create new reminder
        const result = await createReminder.mutateAsync({
          ...data,
          ...(contentType === REMINDER_CONTENT.ESTATE
            ? { estateId: contentId }
            : { mettingId: contentId }),
        });

        if (result) {
          // Call onSubmit callback if provided (for local state update)
          if (onSubmit) {
            const newReminder: TReminder = {
              id: result.id || Date.now().toString(),
              ...data,
              ...(contentType === REMINDER_CONTENT.ESTATE
                ? { estateId: contentId }
                : { mettingId: contentId }),
              userId: "", // Will be set by backend
              status: REMINDER_STATUS.PENDING,
              estate: {} as any,
              createdAt: new Date().toISOString(),
            };
            onSubmit(newReminder);
          }
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error submitting reminder:", error);
    }
  };

  const handleClose = () => {
    reset();
    setIsReminderDateOpen(false);
    onClose();
  };

  const handleReminderDateSelect = (
    selectedDate: string,
    _endDate?: string,
  ) => {
    console.log("Selected date from calendar (UTC):", selectedDate);
    // The selectedDate is in UTC format from calendar
    // We need to store it as UTC for backend, but display it correctly
    setValue("reminderDate", selectedDate);
    setIsReminderDateOpen(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    return formatDateForTehranDisplay(dateString);
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal
      isOpen={isOpen}
      title={editingReminder ? "ویرایش یادآور" : "افزودن یادآور"}
      classNames={{
        background: "z-[60] !py-0 sm:!py-6 !px-0 sm:!px-4",
        box: "!max-w-3xl !max-h-[100%] !mb-4 rounded-none sm:rounded-xl overflow-x-hidden !h-fit",
        header: "!py-4",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}
      onSubmit={onFormSubmit}
      handleSubmit={handleSubmit}>
      <div className="relative h-full">
        {/* Form */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              عنوان یادآور
            </label>
            <BorderedInput
              type="text"
              name="title"
              register={register}
              error={errors.title}
              placeholder="عنوان یادآور را وارد کنید"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              توضیحات
            </label>
            <TextArea
              name="description"
              register={register}
              error={errors.description}
              placeholder="توضیحات یادآور را وارد کنید"
              rows={3}
            />
          </div>

          {/* Reminder Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              تاریخ ارسال یادآور
            </label>
            <button
              type="button"
              onClick={() => setIsReminderDateOpen(true)}
              className={cn(
                "group relative w-full rounded-xl border-2 bg-white px-4 py-3 text-right transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                errors.reminderDate
                  ? "border-red-300 hover:border-red-400"
                  : watch("reminderDate")
                    ? "border-blue-200"
                    : "border-gray-200",
              )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg transition-colors",
                      watch("reminderDate")
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400",
                    )}>
                    <svg
                      className="size-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    {watch("reminderDate") ? (
                      <>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatDateForDisplay(watch("reminderDate"))}
                        </div>
                        <div className="text-xs text-gray-500">
                          تاریخ و ساعت ارسال یادآور
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-500">
                          انتخاب تاریخ ارسال یادآور
                        </div>
                        <div className="text-xs text-gray-400">
                          روی این دکمه کلیک کنید
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    watch("reminderDate") ? "text-blue-500" : "text-gray-400",
                  )}>
                  <CalendarIcon className="size-5" />
                </div>
              </div>
            </button>
            {errors.reminderDate && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.reminderDate.message}
              </p>
            )}
          </div>

          {/* Type Selection
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              نوع یادآوری
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={cn(
                  "group relative flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5",
                  watch("type").includes(REMINDER_TYPE.SMS)
                    ? "!border-primary !bg-primary !text-white shadow-lg shadow-primary/25"
                    : null,
                )}
                onClick={() => {
                  const types = [...watch("type")];
                  const hasSelected = types.includes(REMINDER_TYPE.SMS);

                  if (hasSelected) {
                    const newTypes = types.filter(
                      (type) => type !== REMINDER_TYPE.SMS,
                    );
                    setValue("type", newTypes);
                  } else {
                    const newTypes = [...types, REMINDER_TYPE.SMS];
                    setValue("type", newTypes);
                  }
                }}>
                <MessageSquareIcon className="size-4" />
                <span>پیامک</span>
                {watch("type").includes(REMINDER_TYPE.SMS) && (
                  <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-primary">
                    <CheckIcon className="size-3" />
                  </div>
                )}
              </button>
              <button
                type="button"
                className={cn(
                  "group relative flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5",
                  watch("type").includes(REMINDER_TYPE.NOTIFICATION)
                    ? "!border-primary !bg-primary !text-white shadow-lg shadow-primary/25"
                    : null,
                )}
                onClick={() => {
                  const types = [...watch("type")];
                  const hasSelected = types.includes(
                    REMINDER_TYPE.NOTIFICATION,
                  );

                  if (hasSelected) {
                    const newTypes = types.filter(
                      (type) => type !== REMINDER_TYPE.NOTIFICATION,
                    );
                    setValue("type", newTypes);
                  } else {
                    const newTypes = [...types, REMINDER_TYPE.NOTIFICATION];
                    setValue("type", newTypes);
                  }
                }}>
                <BellIcon className="size-4" />
                <span>اعلان</span>
                {watch("type").includes(REMINDER_TYPE.NOTIFICATION) && (
                  <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-primary">
                    <CheckIcon className="size-3" />
                  </div>
                )}
              </button>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div> */}
        </div>
        {/* Submit Buttons */}
        <div className="mt-4 flex items-center justify-end gap-x-4 border-t border-primary-border px-6 pb-4 pt-4">
          <BorderedButton type="button" onClick={handleClose}>
            انصراف
          </BorderedButton>
          <Button
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
            disabled={createReminder.isPending || editReminder.isPending}>
            {createReminder.isPending || editReminder.isPending
              ? "در حال پردازش..."
              : editingReminder
                ? "ویرایش یادآور"
                : "افزودن یادآور"}
          </Button>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isReminderDateOpen}
        onClose={() => setIsReminderDateOpen(false)}
        onDateSelect={handleReminderDateSelect}
        initialDate={watch("reminderDate")}
        isRangeMode={false}
        showTimePicker={true}
      />
    </Modal>,
    document.body,
  );
}
