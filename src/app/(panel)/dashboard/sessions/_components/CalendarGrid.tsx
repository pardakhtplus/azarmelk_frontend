"use client";

import { cn, convertToEnglishNumbers, dateType } from "@/lib/utils";
import DateObject from "react-date-object";
import DayCell from "./DayCell";
import { useSessionCountList } from "@/services/queries/admin/session/useSessionCountList";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useSessionCountCreatedList } from "@/services/queries/admin/session/useSessionCountCreatedList";

// Days of week in Persian
const WEEKDAYS = [
  "شنبه",
  "یک شنبه",
  "دو شنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
  "جمعه",
];

// Short versions of day names for small screens
const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

interface CalendarGridProps {
  calendarDays: DateObject[];
  currentDate: DateObject;
  canManageSession: boolean;
  canCreateSession: boolean;
  canSeeSession: boolean;
}

export default function CalendarGrid({
  calendarDays,
  currentDate,
  canManageSession,
  canCreateSession,
  canSeeSession,
}: CalendarGridProps) {
  const startDate = new DateObject(currentDate)
    .toFirstOfMonth()
    .setHour(0)
    .setMinute(0)
    .setSecond(0)
    .setMillisecond(0);

  const endDate = new DateObject(currentDate)
    .toLastOfMonth()
    .setHour(23)
    .setMinute(59)
    .setSecond(59)
    .setMillisecond(999);

  const { sessionCountList: adminSessionCountList } = useSessionCountList({
    start: convertToEnglishNumbers(
      startDate.convert(gregorian, gregorian_en).toUTC().format(dateType),
    ),
    end: convertToEnglishNumbers(
      endDate.convert(gregorian, gregorian_en).toUTC().format(dateType),
    ),
    enabled: canManageSession,
  });

  const { sessionCountCreatedList: userSessionCountCreatedList } =
    useSessionCountCreatedList({
      start: convertToEnglishNumbers(
        startDate.convert(gregorian, gregorian_en).toUTC().format(dateType),
      ),
      end: convertToEnglishNumbers(
        endDate.convert(gregorian, gregorian_en).toUTC().format(dateType),
      ),
      enabled: (canCreateSession || canSeeSession) && !canManageSession,
    });

  const sessionCountList = canManageSession
    ? adminSessionCountList.data?.data
    : userSessionCountCreatedList.data?.data;

  return (
    <div className="grid grid-cols-1 overflow-x-auto">
      <div className="mt-4 grid w-full min-w-[800px] grid-cols-7 overflow-hidden border-r border-t border-primary-border">
        {/* Calendar header row with weekday names */}
        {WEEKDAYS.map((day, index) => (
          <div
            key={`weekday-${index}`}
            className={cn(
              "flex w-full items-center justify-center border-b border-l border-primary-border py-2 font-medium md:py-3",
              "text-xs sm:text-sm md:text-base",
              index === 6 && "text-red-500",
            )}>
            <span className="hidden sm:inline">{day}</span>
            <span className="inline sm:hidden">{WEEKDAYS_SHORT[index]}</span>
          </div>
        ))}

        {/* Calendar body with day cells */}
        <div className="contents">
          {calendarDays.map((day, index) => {
            const month =
              day.month.number.toString().length > 1
                ? day.month.number
                : `0${day.month.number}`;

            const count =
              sessionCountList?.[month.toString()]?.[
                day.day.toString().length > 1 ? day.day : `0${day.day}`
              ];

            return (
              <DayCell
                key={`day-${index}`}
                day={day}
                currentDate={currentDate}
                confirmedCount={count?.confirmed.count || 0}
                pendingCount={count?.pending.count || 0}
                rejectedCount={count?.rejected.count || 0}
                canceledCount={count?.canceled.count || 0}
                canManageSession={canManageSession}
                canCreateSession={canCreateSession}
                canSeeSession={canSeeSession}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
