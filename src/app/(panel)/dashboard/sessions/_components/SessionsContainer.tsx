"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import { generateCalendarDays } from "./calendarUtils";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";

/**
 * Main container component for the Sessions page
 * Displays a Persian calendar with dynamic rows based on the month structure
 * The calendar shows days from previous and next months to fill complete weeks only
 */
export default function SessionsContainer() {
  // Create a DateObject with Persian calendar and locale
  const [currentDate, setCurrentDate] = useState(
    new DateObject({ calendar: persian, locale: persian_fa }),
  );
  const [calendarDays, setCalendarDays] = useState<DateObject[]>([]);

  // Generate calendar days whenever the current date changes
  useEffect(() => {
    const days = generateCalendarDays(currentDate);
    setCalendarDays(days);
  }, [currentDate]);

  /**
   * Handle month selection from the DatePicker
   */
  const handleMonthChange = (date: DateObject) => {
    setCurrentDate(date);
  };

  /**
   * Navigate to the previous month
   * Handles year transitions when going from Farvardin to Esfand
   */
  const goToPreviousMonth = () => {
    let year = currentDate.year;
    let month = currentDate.month.number;

    // Handle year transition when going from January to December
    if (month === 1) {
      year = year - 1;
      month = 12;
    } else {
      month = month - 1;
    }

    // Create a new DateObject with the updated year and month
    setCurrentDate(
      new DateObject({
        calendar: persian,
        locale: persian_fa,
        year: year,
        month: month,
        day: 1,
      }),
    );
  };

  /**
   * Navigate to the next month
   * Handles year transitions when going from Esfand to Farvardin
   */
  const goToNextMonth = () => {
    let year = currentDate.year;
    let month = currentDate.month.number;

    // Handle year transition when going from December to January
    if (month === 12) {
      year = year + 1;
      month = 1;
    } else {
      month = month + 1;
    }

    // Create a new DateObject with the updated year and month
    setCurrentDate(
      new DateObject({
        calendar: persian,
        locale: persian_fa,
        year: year,
        month: month,
        day: 1,
      }),
    );
  };

  const { userInfo } = useUserInfo();

  const canManageSession =
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_SESSION) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER);

  const canCreateSession =
    canManageSession ||
    userInfo?.data?.data.accessPerms.includes(Permissions.CREATE_SESSION);

  const canSeeSession =
    canManageSession ||
    userInfo?.data?.data.accessPerms.includes(Permissions.GET_SESSION);

  // Return null if the SESSIONS feature is not enabled
  if (!isFeatureEnabled(FeatureFlag.SESSIONS)) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-full">
      <PanelBodyHeader title="جلسات" />

      <div className="max-w-full overflow-x-auto pb-4">
        <div>
          {/* Calendar Header with navigation buttons */}
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onMonthChange={handleMonthChange}
          />

          {/* Calendar Grid with days - dynamically adjusts rows based on month structure */}
          <CalendarGrid
            calendarDays={calendarDays}
            currentDate={currentDate}
            canManageSession={canManageSession ?? false}
            canCreateSession={canCreateSession ?? false}
            canSeeSession={canSeeSession ?? false}
          />
        </div>
      </div>
    </div>
  );
}
