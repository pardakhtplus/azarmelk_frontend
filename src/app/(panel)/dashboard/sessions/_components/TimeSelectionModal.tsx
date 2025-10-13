"use client";

import Button from "@/components/modules/buttons/Button";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { createPortal } from "react-dom";

interface TimeSelectionModalProps {
  isOpen: boolean;
  title: string;
  customTime: { hour: number; minute: number };
  setCustomTime: (time: { hour: number; minute: number }) => void;
  isTimeOverlappingWithStatic: (hour: number, minute: number) => boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
}

const TimeSelectionModal = ({
  isOpen,
  title,
  customTime,
  setCustomTime,
  isTimeOverlappingWithStatic,
  onClose,
  onConfirm,
  confirmButtonText,
}: TimeSelectionModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <Modal
      isOpen={isOpen}
      title={title}
      classNames={{
        background: "z-50",
        box: "sm:!max-w-md !h-fit !max-h-none",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="p-5">
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium">
            انتخاب ساعت و دقیقه شروع جلسه
          </label>

          {/* Selected time display */}
          <div className="mb-5 flex items-center justify-center">
            <div className="flex items-center justify-center rounded-md bg-gray-100 px-6 py-4">
              <Clock className="ml-2 size-5 text-gray-500" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-gray-700">
                {customTime.hour.toString().padStart(2, "0")}:
                {customTime.minute.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Time selector - Hour */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-600">ساعت</p>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <button
                  key={hour}
                  type="button"
                  disabled={isTimeOverlappingWithStatic(
                    hour,
                    customTime.minute,
                  )}
                  onClick={() => setCustomTime({ ...customTime, hour })}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md border text-sm transition-all hover:bg-gray-50",
                    customTime.hour === hour
                      ? "border-primary-blue bg-blue-50 font-medium text-primary-blue"
                      : "border-gray-300",
                    isTimeOverlappingWithStatic(hour, customTime.minute) &&
                      "cursor-not-allowed opacity-50",
                  )}>
                  {hour.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* Time selector - Minute */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">دقیقه</p>
            <div className="grid grid-cols-6 gap-2">
              {[0, 10, 20, 30, 40, 50].map((minute) => (
                <button
                  key={minute}
                  type="button"
                  disabled={isTimeOverlappingWithStatic(
                    customTime.hour,
                    minute,
                  )}
                  onClick={() => setCustomTime({ ...customTime, minute })}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md border text-sm transition-all hover:bg-gray-50",
                    customTime.minute === minute
                      ? "border-primary-blue bg-blue-50 font-medium text-primary-blue"
                      : "border-gray-300",
                    isTimeOverlappingWithStatic(customTime.hour, minute) &&
                      "cursor-not-allowed opacity-50",
                  )}>
                  {minute.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {isTimeOverlappingWithStatic(customTime.hour, customTime.minute) && (
            <div className="mt-4 flex items-center justify-center">
              <p className="rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-500">
                این ساعت با ساعت‌های ثابت تداخل دارد
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            className="!px-10"
            onClick={onConfirm}
            disabled={isTimeOverlappingWithStatic(
              customTime.hour,
              customTime.minute,
            )}>
            {confirmButtonText}
          </Button>
          <BorderedButton type="button" className="!px-10" onClick={onClose}>
            لغو
          </BorderedButton>
        </div>
      </div>
    </Modal>,
    document.body,
  );
};

export default TimeSelectionModal;
