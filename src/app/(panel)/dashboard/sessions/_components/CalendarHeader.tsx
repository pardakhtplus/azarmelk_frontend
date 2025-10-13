"use client";

import { ICalendarWeek, IChevronLeft } from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import { useRef } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface CalendarHeaderProps {
  currentDate: DateObject;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (date: DateObject) => void;
}

/**
 * Header component for the calendar with navigation buttons and month display
 */
export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
}: CalendarHeaderProps) {
  const datePickerRef = useRef<any>(null);

  /**
   * Navigate to today's date
   */
  const goToToday = () => {
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    onMonthChange(today);
  };

  /**
   * Open the date picker when the month display is clicked
   */
  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-between gap-3 sm:mt-6 sm:flex-row sm:gap-4">
      {/* Month navigation and current month/year display */}
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-4">
        {/* Previous month button */}
        <button
          onClick={onPrevMonth}
          className="flex aspect-square h-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:h-10"
          aria-label="ماه قبل">
          <IChevronLeft className="size-4 rotate-180 sm:size-5" />
        </button>

        {/* Current month and year in Persian */}
        <div className="flex items-center">
          <button
            onClick={openDatePicker}
            className="flex h-9 max-w-[180px] items-center gap-1 overflow-hidden rounded-md border border-gray-200 bg-white px-2 py-1 text-base font-medium shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:h-10 sm:max-w-none sm:gap-2 sm:px-3 sm:py-1.5 sm:text-lg"
            aria-label="انتخاب ماه">
            <ICalendarWeek className="size-4 flex-shrink-0 opacity-70 sm:size-5" />
            <span className="truncate">{currentDate.format("MMMM YYYY")}</span>
          </button>
        </div>

        {/* Next month button */}
        <button
          onClick={onNextMonth}
          className="flex aspect-square h-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:h-10"
          aria-label="ماه بعد">
          <IChevronLeft className="size-4 sm:size-5" />
        </button>
      </div>

      {/* Today button */}
      <Button
        variant="blue"
        onClick={goToToday}
        className="mt-3 !h-9 w-full !rounded-md sm:mt-0 sm:!h-10 sm:w-auto"
        aria-label="برو به امروز">
        امروز
      </Button>
    </div>
  );
}
