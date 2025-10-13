"use client";

import { SESSION_STATUS } from "@/types/admin/session/enum";
import { PlusIcon, Trash2 } from "lucide-react";
import type DateObject from "react-date-object";
import SessionItem from "./SessionItem";
import { type CustomTimeSlot } from "./types";
import NotificationModal from "@/components/modules/NotificationModal";
import useSessionDeleteDate from "@/services/mutations/admin/session/useSessionDeleteDate";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface TimeSlotItemProps {
  timeSlot:
    | CustomTimeSlot
    | {
        id: string;
        title: string;
        startTime: number;
        endTime: number;
        startMinute?: number;
      };
  sessionDate: DateObject;
  existingSessions: any[];
  openedRoom: number;
  isFutureDate: boolean;
  onAddSession: (date: DateObject) => void;
  customTimeSlots: CustomTimeSlot[];
  canManageSession: boolean;
}

const TimeSlotItem = ({
  timeSlot,
  sessionDate,
  existingSessions,
  openedRoom,
  isFutureDate,
  onAddSession,
  customTimeSlots,
  canManageSession,
}: TimeSlotItemProps) => {
  const isCustomTimeSlot = customTimeSlots.some(
    (slot) => slot.id === timeSlot.id,
  );

  const { deleteSessionDate } = useSessionDeleteDate();

  const queryClient = useQueryClient();

  return (
    <div className={cn()}>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm">
          {isCustomTimeSlot
            ? `ساعت ${String(timeSlot.startTime).padStart(2, "0")}:${String(
                timeSlot.startMinute ?? 0,
              ).padStart(2, "0")}`
            : timeSlot.title}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {/* Display existing sessions if any */}
        {existingSessions.map((session) => {
          const sessionWithRoom = {
            ...session,
            room: openedRoom,
            startTime: timeSlot.startTime,
            id: session.id,
          };

          return (
            <SessionItem
              key={session.id}
              session={sessionWithRoom}
              startSessionDate={sessionDate}
              timeTitle={timeSlot.title || ""}
              canManageSession={canManageSession}
            />
          );
        })}

        {/* Add button for creating new session */}
        {!existingSessions.filter(
          (session) =>
            session.status === SESSION_STATUS.CONFIRMED ||
            session.status === SESSION_STATUS.PENDING,
        ).length && isFutureDate ? (
          <button
            className="flex h-12 w-full items-center justify-center gap-x-1.5 rounded-lg bg-neutral-100 py-2.5"
            onClick={() => onAddSession(sessionDate)}>
            <PlusIcon className="size-7" strokeWidth={1} />
            <span>افزودن جلسه جدید</span>
          </button>
        ) : null}
        {isCustomTimeSlot && isFutureDate && !existingSessions.length && (
          <NotificationModal
            title="حذف"
            description="آیا از حذف این تایم مطمئن هستید؟"
            className="-mt-1 flex h-12 w-full items-center justify-center gap-x-1.5 rounded-lg border-primary-red/50 bg-primary-red/10 py-2.5 text-primary-red"
            aria-label="Delete"
            onSubmit={async () => {
              const res = await deleteSessionDate.mutateAsync({
                id: timeSlot.id,
              });

              if (!res) return false;

              queryClient.invalidateQueries({
                queryKey: ["sessionDateList"],
              });

              return true;
            }}>
            <Trash2 className="size-4" strokeWidth={1.5} />
            <span>حذف ساعت</span>
          </NotificationModal>
        )}
      </div>
    </div>
  );
};

export default TimeSlotItem;
