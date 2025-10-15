import { IInfoCircle } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, PlusIcon } from "lucide-react";
import { useState } from "react";
import { type DateObject } from "react-multi-date-picker";
import {
  isCurrentMonth,
  isFutureDate,
  isHoliday,
  isToday,
} from "./calendarUtils";
import SessionList from "./SessionList";

interface DayCellProps {
  day: DateObject;
  currentDate: DateObject;
  confirmedCount: number;
  pendingCount: number;
  rejectedCount: number;
  canceledCount: number;
  canManageSession: boolean;
  canCreateSession: boolean;
  canSeeSession: boolean;
}

export default function DayCell({
  day,
  currentDate,
  confirmedCount,
  pendingCount,
  rejectedCount,
  canceledCount,
  canManageSession,
  canCreateSession,
  canSeeSession,
}: DayCellProps) {
  const dayIsToday = isToday(day);
  const dayIsCurrentMonth = isCurrentMonth(day, currentDate);
  const holidayInfo = isHoliday(day);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // Add a flag for past days in the current month
  const dayIsPast = dayIsCurrentMonth && !isFutureDate(day) && !dayIsToday;

  return (
    <>
      <div
        className={cn(
          "relative flex aspect-square w-full cursor-pointer items-center justify-center border-b border-l border-primary-border sm:aspect-[10/8]",
          !dayIsCurrentMonth && "cursor-not-allowed bg-neutral-100",
          dayIsPast && "bg-neutral-100/70",
          holidayInfo.isHoliday && dayIsCurrentMonth && "bg-red-50",
          dayIsToday && "border border-primary-blue",
        )}
        style={
          !dayIsCurrentMonth
            ? {
                backgroundImage:
                  "repeating-linear-gradient(135deg, #f0f0f0 0 10px, #ffffff 10px 20px)",
              }
            : undefined
        }
        onClick={() => {
          if (dayIsCurrentMonth && (canCreateSession || canSeeSession)) {
            setIsOpenModal(true);
          }
        }}>
        <p
          className={cn(
            "absolute bottom-1 right-1.5 text-xs sm:bottom-1 sm:right-2 sm:text-sm md:bottom-1.5 md:right-2 md:text-base",
            dayIsToday
              ? "flex size-7 items-center justify-center rounded-full bg-primary-blue/90 font-medium text-white"
              : holidayInfo.isHoliday && dayIsCurrentMonth
                ? "font-medium text-red-500"
                : "text-primary-border",
            dayIsPast && "text-neutral-400",
            !dayIsCurrentMonth && "opacity-80",
          )}>
          <span className="-mb-0.5">{day.format("D")}</span>
        </p>

        {/* Show plus icon when future; hide calendar for past days */}
        {dayIsCurrentMonth && isFutureDate(day) && canCreateSession ? (
          <PlusIcon
            className="size-1/2 text-primary-border sm:size-8 md:size-2/5"
            strokeWidth={1.3}
          />
        ) : dayIsCurrentMonth && !dayIsPast && canManageSession ? (
          <CalendarIcon
            className="size-1/3 text-primary-border sm:size-8 md:size-2/6"
            strokeWidth={1.3}
          />
        ) : null}

        <div className="absolute left-0 right-0 top-0 flex w-full items-center justify-between gap-x-1.5 px-1.5 pt-2 sm:h-6 sm:px-2 sm:pt-3">
          <div className="flex items-center gap-x-1.5">
            {dayIsCurrentMonth && pendingCount > 0 && (
              <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 sm:right-2 sm:top-2 sm:h-6 sm:min-w-6">
                <div className="flex items-center gap-0.5">
                  <Clock className="size-3 text-white" />
                  <p className="font-mono text-xs text-white sm:text-sm">
                    {pendingCount}
                  </p>
                </div>
              </div>
            )}
            {dayIsCurrentMonth &&
              confirmedCount + rejectedCount + canceledCount > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-300 px-1.5 py-0.5 sm:left-2 sm:top-2 sm:h-6 sm:min-w-6">
                  <p className="font-mono text-xs sm:text-sm">
                    {confirmedCount + rejectedCount + canceledCount}
                  </p>
                </div>
              )}
          </div>
          {holidayInfo.isHoliday && dayIsCurrentMonth && (
            <div
              className={cn(
                "group size-fit text-primary-red/90 sm:left-2 sm:top-2",
              )}>
              <IInfoCircle className="size-3 opacity-80 transition-all group-hover:opacity-100 sm:size-4 md:size-5" />
              <div className="invisible absolute left-0 top-0 h-full w-fit opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="absolute left-0 top-[calc(100%+4px)] min-w-24 rounded-md bg-white px-2 py-1 shadow-md">
                  <p className="text-xs text-primary-red sm:text-sm">
                    {holidayInfo.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpenModal ? (
        <SessionList
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          day={day}
          isFutureDate={isFutureDate(day)}
          canManageSession={canManageSession}
          canCreateSession={canCreateSession}
          canSeeSession={canSeeSession}
        />
      ) : null}
    </>
  );
}
