"use client";

import Modal from "@/components/modules/Modal";
import { dateType } from "@/lib/utils";
import useSessionCreateDate from "@/services/mutations/admin/session/useSessionCreateDate";
import { useSessionDateList } from "@/services/queries/admin/session/useSessionDateList";
import { useSessionList } from "@/services/queries/admin/session/useSessionList";
import { type TSessionDateListResponse } from "@/types/admin/session/type";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { createPortal } from "react-dom";
import CustomTimeActions from "./CustomTimeActions";
import EmptySessionsView from "./EmptySessionsView";
import MutateSession from "./mutateSession/MutateSession";
import RoomTabs from "./RoomTabs";
import TimeSelectionModal from "./TimeSelectionModal";
import TimeSlotItem from "./TimeSlotItem";
import { type CustomTimeSlot, rooms, staticSessionTimes } from "./types";
import { useSessionCreatedList } from "@/services/queries/admin/session/useSessionCreatedList";

export default function SessionList({
  isOpenModal,
  setIsOpenModal,
  day,
  isFutureDate,
  canManageSession,
  canCreateSession,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  day: DateObject;
  isFutureDate: boolean;
  canManageSession: boolean;
  canCreateSession: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const [openedRoom, setOpenedRoom] = useState<number>(rooms[0].room);
  const [mutateSessionData, setMutateSessionData] = useState<{
    isOpen: boolean;
    startSession: DateObject | null;
  }>({
    isOpen: false,
    startSession: null,
  });
  // const [isCustomTimeModalOpen, setIsCustomTimeModalOpen] = useState(false);
  const [isCustomTimeSlotModalOpen, setIsCustomTimeSlotModalOpen] =
    useState(false);
  const [customTime, setCustomTime] = useState<{
    hour: number;
    minute: number;
  }>({
    hour: 8,
    minute: 0,
  });

  const queryClient = useQueryClient();

  // Convert day to the format expected by the API
  const formattedDay = new DateObject(day)
    .convert(gregorian, gregorian_en)
    .toUTC()
    .format(dateType);

  // Fetch session list data
  const { sessionList: adminSessionList } = useSessionList({
    day: formattedDay,
    room: openedRoom,
    enabled: canManageSession,
  });
  const { sessionCreatedList: userSessionCreatedList } = useSessionCreatedList({
    day: formattedDay,
    room: openedRoom,
    enabled: canCreateSession && !canManageSession,
  });

  const sessionList = canManageSession
    ? adminSessionList.data?.data
    : userSessionCreatedList.data?.data;

  // Fetch custom time slots data
  const { sessionDateList } = useSessionDateList({
    day: formattedDay,
  });

  // Mutations for custom time slots
  const { createSessionDate } = useSessionCreateDate();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to convert session time to DateObject
  const convertToDateObject = (
    startTime: number,
    startMinute: number = 0,
  ): DateObject => {
    // Clone the day to avoid modifying the original
    const sessionDate = new DateObject({
      calendar: persian,
      locale: persian_fa,
      year: day.year,
      month: day.month.number,
      day: day.day,
      hour: startTime,
      minute: startMinute,
      second: 0,
      millisecond: 0,
    });

    return sessionDate;
  };

  // Find all sessions for a given time slot
  const findSessionsForTimeSlot = (startTime: number, startMinute: number) => {
    if (!sessionList || sessionList.sessions.length === 0) {
      return [];
    }

    // Find all sessions that match this time slot
    return sessionList.sessions.filter((session) => {
      const sessionStartHour = new Date(session.startSession).getHours();
      const sessionStartMinute = new Date(session.startSession).getMinutes();
      return (
        sessionStartHour === startTime && sessionStartMinute === startMinute
      );
    });
  };

  // Check if a time is within any of the static session times
  const isTimeOverlappingWithStatic = (
    hour: number,
    minute: number = 0,
  ): boolean => {
    const timeInHours = hour + minute / 60;
    return staticSessionTimes.some(
      (slot) => timeInHours >= slot.startTime && timeInHours < slot.endTime,
    );
  };

  // Handle creating a custom time slot
  const handleCreateCustomTimeSlot = async () => {
    if (isTimeOverlappingWithStatic(customTime.hour, customTime.minute)) {
      alert("زمان انتخابی با ساعت‌های ثابت تداخل دارد");
      return;
    }

    // Convert to Gregorian for API
    const gregorianDate = new DateObject(day)
      .convert(gregorian, gregorian_en)
      .set("hour", customTime.hour)
      .set("minute", customTime.minute)
      .set("second", 0)
      .set("millisecond", 0);

    // Format title for the custom time slot
    const title = `ساعت ${customTime.hour}:${customTime.minute.toString().padStart(2, "0")} تا ${customTime.hour + 2}:${customTime.minute.toString().padStart(2, "0")}`;

    // Call API to create custom time slot
    const res = await createSessionDate.mutateAsync({
      title: title,
      date: gregorianDate.toUTC().format(dateType),
    });

    if (!res) return;

    queryClient.invalidateQueries({
      queryKey: ["sessionDateList"],
    });

    setIsCustomTimeSlotModalOpen(false);
  };

  // Handle adding a new session
  const handleAddSession = (sessionDate: DateObject) => {
    setMutateSessionData({
      isOpen: true,
      startSession: sessionDate,
    });
  };

  if (!isClient) return null;

  // Get custom time slots from API
  const customTimeSlots: CustomTimeSlot[] =
    (sessionDateList?.data as TSessionDateListResponse | null)?.data?.map(
      (date) => ({
        id: date.id,
        title: "",
        startTime: new DateObject({
          date: new Date(date.date),
          calendar: persian,
          locale: persian_fa,
        }).hour,
        startMinute: new DateObject({
          date: new Date(date.date),
          calendar: persian,
          locale: persian_fa,
        }).minute,
      }),
    ) || [];

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title={`جلسات روز ${day.format("D")} ${day.format("MMMM")}`}
          classNames={{
            background: "z-50 !py-0 sm:!px-4 !px-0",
            box: "sm:!max-w-xl sm:!max-h-[98%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-fit flex flex-col justify-between sm:rounded-xl",
            header: "border-none sticky top-0 bg-background z-[1]",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          {/* Room Tabs */}
          <RoomTabs
            openedRoom={openedRoom}
            setOpenedRoom={setOpenedRoom}
            statistics={sessionList?.statistics}
          />

          <div className="space-y-5 px-5 py-7">
            {!isFutureDate && !sessionList?.sessions.length ? (
              <EmptySessionsView />
            ) : (
              <>
                {/* Time Slots */}
                {staticSessionTimes.map((timeSlot) => {
                  const sessionDate = convertToDateObject(
                    timeSlot.startTime,
                    timeSlot.startMinute,
                  );
                  const existingSessions = findSessionsForTimeSlot(
                    timeSlot.startTime,
                    timeSlot.startMinute ?? 0,
                  );

                  const isPastSlot =
                    sessionDate.toDate().getTime() < new Date().getTime();
                  if (isPastSlot && existingSessions.length === 0) return null;

                  if (!isFutureDate && existingSessions.length === 0)
                    return null;

                  return (
                    <TimeSlotItem
                      key={timeSlot.id}
                      timeSlot={timeSlot}
                      sessionDate={sessionDate}
                      existingSessions={existingSessions}
                      openedRoom={openedRoom}
                      isFutureDate={isFutureDate}
                      onAddSession={handleAddSession}
                      customTimeSlots={customTimeSlots}
                      canManageSession={canManageSession}
                    />
                  );
                })}

                {customTimeSlots.length ? (
                  <div className="mt-6 space-y-3 border-t border-primary-border pt-4">
                    <p className="mb-4 text-sm font-medium">ساعت های سفارشی</p>

                    {customTimeSlots.map((timeSlot) => {
                      const sessionDate = convertToDateObject(
                        timeSlot.startTime,
                        timeSlot.startMinute ?? 0,
                      );
                      const existingSessions = findSessionsForTimeSlot(
                        timeSlot.startTime,
                        timeSlot.startMinute ?? 0,
                      );

                      const isPastSlot =
                        sessionDate.toDate().getTime() < new Date().getTime();
                      if (isPastSlot && existingSessions.length === 0)
                        return null;

                      if (!isFutureDate && existingSessions.length === 0)
                        return null;

                      return (
                        <TimeSlotItem
                          key={timeSlot.id}
                          timeSlot={timeSlot}
                          sessionDate={sessionDate}
                          existingSessions={existingSessions}
                          openedRoom={openedRoom}
                          isFutureDate={isFutureDate}
                          onAddSession={handleAddSession}
                          customTimeSlots={customTimeSlots}
                          canManageSession={canManageSession}
                        />
                      );
                    })}
                  </div>
                ) : null}

                {/* Custom Time Sessions Section */}
                {/* <CustomSessionsSection
                  customSessions={findCustomTimeSessions()}
                  openedRoom={openedRoom}
                  sessionDate={day}
                /> */}

                {/* Custom Time Actions */}
                {isFutureDate && canManageSession && (
                  <CustomTimeActions
                    // onOpenCustomTimeModal={() => setIsCustomTimeModalOpen(true)}
                    onOpenCustomTimeSlotModal={() =>
                      setIsCustomTimeSlotModalOpen(true)
                    }
                  />
                )}
              </>
            )}
          </div>
        </Modal>,
        document.body,
      )}

      {/* Custom time selection modal */}
      {/* <TimeSelectionModal
        isOpen={isCustomTimeModalOpen}
        title="انتخاب ساعت سفارشی"
        customTime={customTime}
        setCustomTime={setCustomTime}
        isTimeOverlappingWithStatic={isTimeOverlappingWithStatic}
        onClose={() => setIsCustomTimeModalOpen(false)}
        onConfirm={handleCreateCustomSession}
        confirmButtonText="ایجاد جلسه"
      /> */}

      {/* Custom time slot creation modal */}
      <TimeSelectionModal
        isOpen={isCustomTimeSlotModalOpen}
        title="ساخت ساعت سفارشی برای جلسه"
        customTime={customTime}
        setCustomTime={setCustomTime}
        isTimeOverlappingWithStatic={isTimeOverlappingWithStatic}
        onClose={() => setIsCustomTimeSlotModalOpen(false)}
        onConfirm={handleCreateCustomTimeSlot}
        confirmButtonText="ایجاد ساعت سفارشی"
      />

      {mutateSessionData.isOpen && mutateSessionData.startSession && (
        <MutateSession
          isOpenModal={mutateSessionData.isOpen}
          room={openedRoom}
          setIsOpenModal={() => {
            setMutateSessionData({
              isOpen: false,
              startSession: null,
            });
          }}
          startSession={mutateSessionData.startSession}
        />
      )}
    </>
  );
}
