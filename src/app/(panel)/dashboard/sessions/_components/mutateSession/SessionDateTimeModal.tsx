"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import Modal from "@/components/modules/Modal";
import { useSessionDateList } from "@/services/queries/admin/session/useSessionDateList";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import { createPortal } from "react-dom";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { cn, dateType } from "@/lib/utils";

interface StaticSessionTime {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
}

interface CreatedSessionTime {
  id: string;
  time: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface SessionDateTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionDate: DateObject;
  customTime: {
    hour: number;
    minute: number;
    isStaticTime: boolean;
    staticTimeId?: number;
    createdTimeId?: string;
  };
  staticSessionTimes: StaticSessionTime[];
  onUpdate: (
    date: DateObject,
    time: {
      hour: number;
      minute: number;
      isStaticTime: boolean;
      staticTimeId?: number;
      createdTimeId?: string;
    },
  ) => void;
}

export default function SessionDateTimeModal({
  isOpen,
  onClose,
  sessionDate,
  customTime,
  staticSessionTimes,
  onUpdate,
}: SessionDateTimeModalProps) {
  const [selectedDate, setSelectedDate] = useState<DateObject>(sessionDate);
  const [selectedTime, setSelectedTime] = useState({
    hour: customTime.hour,
    minute: customTime.minute,
    isStaticTime: customTime.isStaticTime,
    staticTimeId: customTime.staticTimeId,
    createdTimeId: customTime.createdTimeId,
  });
  const [dateRangeStart, setDateRangeStart] = useState<number>(0);

  // Fetch created session times for the selected date
  const { sessionDateList } = useSessionDateList({
    day: selectedDate
      ? new DateObject(selectedDate)
          .setHour(0)
          .setMinute(0)
          .setSecond(0)
          .setMillisecond(0)
          .convert(gregorian, gregorian_en)
          .toUTC()
          .format(dateType)
      : "",
  });

  const createdTimes: CreatedSessionTime[] = sessionDateList?.data?.data || [];

  // Reset selected date when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(sessionDate);
      setSelectedTime({
        hour: customTime.hour,
        minute: customTime.minute,
        isStaticTime: customTime.isStaticTime,
        staticTimeId: customTime.staticTimeId,
        createdTimeId: customTime.createdTimeId,
      });

      // Center the date range around the selected date
      setDateRangeStart(-3); // Start 3 days before the selected date
    }
  }, [isOpen, sessionDate, customTime]);

  // Check if a time is within any of the static session times
  const isTimeOverlappingWithStatic = (
    hour: number,
    minute: number = 0,
  ): boolean => {
    const timeInHours = hour + minute / 60;
    return staticSessionTimes.some(
      (slot) => timeInHours > slot.startTime && timeInHours < slot.endTime,
    );
  };

  const handleUpdate = () => {
    onUpdate(selectedDate, selectedTime);
  };

  // Navigate to previous set of dates
  const goToPreviousDates = () => {
    setDateRangeStart(dateRangeStart - 7);
  };

  // Navigate to next set of dates
  const goToNextDates = () => {
    setDateRangeStart(dateRangeStart + 7);
  };

  // Handle date selection and center the range around the selected date
  const handleDateSelect = (date: DateObject) => {
    setSelectedDate(date);
    // Reset selected time when date changes
    setSelectedTime((prev) => ({
      hour: staticSessionTimes.some((time) => time.startTime === prev.hour)
        ? prev.hour
        : staticSessionTimes[0].startTime,
      minute: 0,
      isStaticTime: false,
      staticTimeId: undefined,
      createdTimeId: undefined,
    }));
    // Optionally center the range around the new date
    // setDateRangeStart(-3); // Uncomment if you want to center after selection
  };

  // Parse time string (HH:MM) to get hour and minute
  const parseTimeString = (
    timeString: string,
  ): { hour: number; minute: number } => {
    const [hourStr, minuteStr] = timeString.split(":");
    return {
      hour: parseInt(hourStr, 10),
      minute: parseInt(minuteStr, 10),
    };
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal
      doNotHiddenOverflow
      isOpen={isOpen}
      title="ویرایش تاریخ و ساعت جلسه"
      classNames={{
        background: "z-50 !py-0 sm:!py-4 sm:!px-4 !px-0",
        box: "sm:!max-w-4xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg !h-full !max-h-none",
        header: "sticky top-0 bg-white sm:bg-transparent sm:static",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="p-5">
        {/* Display previous date and time */}
        <div className="mb-3 text-sm text-gray-600">
          <span>تاریخ و زمان قبلی: </span>
          <span>{sessionDate.format("dddd D MMMM")}</span>
          <span> ساعت </span>
          <span>
            {customTime.hour.toString().padStart(2, "0")}:
            {customTime.minute.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column - Date Picker */}
          <div className="lg:w-1/2">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium">
                انتخاب تاریخ جدید
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousDates}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={goToNextDates}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 21 }, (_, i) => {
                const date = new DateObject(sessionDate);
                date.add(dateRangeStart + i, "day");

                const isToday =
                  date.format("YYYY-MM-DD") ===
                  new DateObject().format("YYYY-MM-DD");
                const isSelected =
                  date.format("YYYY-MM-DD") ===
                  selectedDate.format("YYYY-MM-DD");
                const isPast = date < new DateObject();

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isPast && !isToday}
                    onClick={() => handleDateSelect(date)}
                    className={`flex flex-col items-center justify-center rounded-md border p-2 text-sm transition-all ${
                      isSelected
                        ? "border-primary-blue bg-blue-50 text-primary-blue"
                        : "border-gray-300 hover:bg-gray-50"
                    } ${
                      isPast && !isToday ? "cursor-not-allowed opacity-50" : ""
                    } ${isToday ? "border-primary-blue" : ""}`}>
                    <span className="text-xs font-medium">
                      {date.format("ddd")}
                    </span>
                    <span className="mt-1 text-base font-bold">
                      {date.format("D")}
                    </span>
                    <span className="mt-1 text-xs">{date.format("MMM")}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                تاریخ انتخاب شده:{" "}
                <span className="font-medium">
                  {selectedDate.format("dddd D MMMM")}
                </span>
              </p>
            </div>
          </div>

          {/* Right Column - Time Picker */}
          <div className="lg:w-1/2">
            <label className="mb-3 block text-sm font-medium">
              انتخاب ساعت جدید
            </label>

            {/* Static session times */}
            <div className="mb-4 rounded-md bg-gray-100 p-3">
              <p className="mb-2 text-sm font-medium text-gray-700">
                ساعت‌های ثابت جلسه:
              </p>
              <div className="flex flex-wrap gap-2">
                {staticSessionTimes.map((timeSlot) => (
                  <button
                    key={timeSlot.id}
                    type="button"
                    onClick={() =>
                      setSelectedTime({
                        hour: timeSlot.startTime,
                        minute: 0,
                        isStaticTime: true,
                        staticTimeId: timeSlot.id,
                        createdTimeId: undefined,
                      })
                    }
                    className={cn(
                      `rounded-full px-3 py-1 text-xs transition-all`,
                      selectedTime.isStaticTime &&
                        selectedTime.staticTimeId === timeSlot.id
                        ? "bg-primary-blue text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200",
                      selectedTime.hour === timeSlot.startTime &&
                        "bg-primary-blue text-white",
                    )}>
                    {timeSlot.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Created session times */}
            {createdTimes.length > 0 && (
              <div className="mb-4 rounded-md bg-green-50 p-3">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  ساعت‌های سفارشی
                </p>
                <div className="flex flex-wrap gap-2">
                  {createdTimes.map((timeSlot) => {
                    const { hour, minute } = parseTimeString(timeSlot.time);
                    return (
                      <button
                        key={timeSlot.id}
                        type="button"
                        onClick={() =>
                          setSelectedTime({
                            hour,
                            minute,
                            isStaticTime: false,
                            staticTimeId: undefined,
                            createdTimeId: timeSlot.id,
                          })
                        }
                        className={cn(
                          `rounded-full px-3 py-1 text-xs transition-all`,
                          !selectedTime.isStaticTime &&
                            selectedTime.createdTimeId === timeSlot.id
                            ? "bg-primary-blue text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200",

                          selectedTime.hour === hour &&
                            "bg-primary-blue text-white",
                        )}>
                        {timeSlot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected time display */}
            {selectedTime.hour !== undefined && (
              <div className="mt-4 flex items-center justify-center">
                <div
                  className={`flex items-center rounded-md px-4 py-3 ${"bg-primary-blue text-white"}`}>
                  <Clock
                    className={`ml-2 size-5 ${"text-white"}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-xl font-bold">
                    {selectedTime.hour.toString().padStart(2, "0")}:
                    {selectedTime.minute.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Button
            type="button"
            className="!px-10"
            onClick={handleUpdate}
            disabled={
              isTimeOverlappingWithStatic(
                selectedTime.hour,
                selectedTime.minute,
              ) && !selectedTime.isStaticTime
            }>
            تایید
          </Button>
          <BorderedButton type="button" className="!px-10" onClick={onClose}>
            لغو
          </BorderedButton>
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
