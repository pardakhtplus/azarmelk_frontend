"use client";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import SessionItem from "./SessionItem";
import { type ExtendedSession } from "./types";

interface CustomSessionsSectionProps {
  customSessions: any[];
  openedRoom: number;
  sessionDate: DateObject;
  canManageSession: boolean
}

const CustomSessionsSection = ({
  customSessions,
  openedRoom,
  canManageSession
}: CustomSessionsSectionProps) => {
  if (customSessions.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-medium">جلسات با ساعت سفارشی</h3>
        {!customSessions.length && (
          <p className="text-xs text-gray-500">
            هیچ جلسه ای با ساعت سفارشی وجود ندارد
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {customSessions.map((session) => {
          const sessionDate = new DateObject({
            date: new Date(session.startSession),
            calendar: persian,
            locale: persian_fa,
          });

          const hours = sessionDate.hour;
          const minutes = sessionDate.minute;
          const timeTitle = `ساعت ${hours}:${minutes.toString().padStart(2, "0")}`;

          const sessionWithRoom: ExtendedSession = {
            ...session,
            room: openedRoom,
            startTime: hours,
            endTime: hours + 2, // Assume 2 hour sessions like the static ones
            id: session.id,
            customTime: true, // Flag to indicate this is a custom time session
            timeDisplay: `${hours}:${minutes.toString().padStart(2, "0")}`, // Time to display in the card
          };

          return (
            <SessionItem
              canManageSession={canManageSession}
              key={session.id}
              session={sessionWithRoom}
              startSessionDate={sessionDate}
              timeTitle={timeTitle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CustomSessionsSection;
