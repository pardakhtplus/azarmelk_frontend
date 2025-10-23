import { IClockRotateLeft, INote } from "@/components/Icons";
import CustomImage from "@/components/modules/CustomImage";
import NotificationModal from "@/components/modules/NotificationModal";
import ReminderListModal from "@/components/modules/reminder/ReminderListModal";
import { REMINDER_CONTENT } from "@/components/modules/reminder/sectionUtils";
import { cn } from "@/lib/utils";
import useEditSessionStatus from "@/services/mutations/admin/session/useEditSessionStatus";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { SESSION_STATUS } from "@/types/admin/session/enum";
import { type TSession } from "@/types/admin/session/type";
import { useQueryClient } from "@tanstack/react-query";
import {
  BanIcon,
  BellIcon,
  CheckIcon,
  ClockIcon,
  MoreVertical,
  PlusIcon,
  SquarePenIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type DateObject from "react-date-object";
import { useOnClickOutside } from "usehooks-ts";
import MutateSession from "./mutateSession/MutateSession";
import NoteListModal from "./NoteListModal";
import SessionLogModal from "./SessionLogModal";

// Extended session type to include custom properties
type ExtendedSession = TSession & {
  customTime?: boolean;
  timeDisplay?: string;
};

interface SessionItemProps {
  session: ExtendedSession;
  startSessionDate: DateObject;
  timeTitle: string;
  canManageSession: boolean;
  canSeeSession: boolean;
  canCreateSession: boolean;
}

export default function SessionItem({
  session,
  startSessionDate,
  canManageSession,
  canCreateSession,
  canSeeSession,
}: SessionItemProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isOpenNoteListModal, setIsOpenNoteListModal] = useState(false);
  const [isOpenLogModal, setIsOpenLogModal] = useState(false);
  const menuRef = useRef<any>(null);
  const { editSessionStatus } = useEditSessionStatus();
  const { userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  // Check if this is an empty slot or has a session
  const hasSession = !!session.status;

  // Get background color based on session status
  const getStatusStyles = () => {
    if (!session.status) return "";

    switch (session.status) {
      case SESSION_STATUS.CONFIRMED:
        return "bg-primary-green/10";
      case SESSION_STATUS.PENDING:
        return "bg-amber-500/10";
      case SESSION_STATUS.REJECTED:
        return "bg-red-500/10";
      case SESSION_STATUS.CANCELED:
        return "bg-neutral-200";
      default:
        return "bg-neutral-100";
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!session.status) return null;

    switch (session.status) {
      case SESSION_STATUS.CONFIRMED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-primary-green/20 px-2 py-1">
            <CheckIcon className="size-3.5 text-primary-green" />
            <span className="text-xs text-primary-green">تایید شده</span>
          </div>
        );
      case SESSION_STATUS.PENDING:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-amber-500/20 px-2 py-1">
            <ClockIcon className="size-3.5 text-amber-600" />
            <span className="text-xs text-amber-600">در انتظار تایید</span>
          </div>
        );
      case SESSION_STATUS.REJECTED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-red-500/20 px-2 py-1">
            <XIcon className="size-3.5 text-red-600" />
            <span className="text-xs text-red-600">رد شده</span>
          </div>
        );
      case SESSION_STATUS.CANCELED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-neutral-100 px-2 py-1">
            <BanIcon className="size-3.5 text-neutral-600" />
            <span className="text-xs text-neutral-600">لغو شده</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle session actions
  const handleEdit = () => {
    setShowActionMenu(false);
    setIsOpenModal(true);
  };

  useOnClickOutside(menuRef, () => setShowActionMenu(false));

  // If this is a create button (no session)
  if (!hasSession) {
    return (
      <button
        className="flex w-full items-center justify-center rounded-lg bg-neutral-100 py-2.5"
        onClick={() => setIsOpenModal(true)}>
        <PlusIcon className="size-7" strokeWidth={1} />
        {isOpenModal && (
          <MutateSession
            isOpenModal={isOpenModal}
            room={session.room}
            setIsOpenModal={setIsOpenModal}
            startSession={startSessionDate}
          />
        )}
      </button>
    );
  }

  return (
    <>
      <Link
        href={`/dashboard/sessions/${session.id}`}
        target="_blank"
        className={cn("rounded-lg p-4", getStatusStyles())}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <p className="font-medium">{session.title || "جلسه بدون عنوان"}</p>

            <StatusBadge />
          </div>

          <div className="relative">
            <button
              className={cn(
                "flex size-7 items-center justify-center rounded-full hover:bg-gray-100",
                showActionMenu && "bg-gray-100",
              )}
              onClick={() => setShowActionMenu(!showActionMenu)}
              title="گزینه‌های بیشتر">
              <MoreVertical className="size-5 text-gray-800" />
            </button>

            <div
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "visible absolute -bottom-7 left-full z-10 mt-1 w-44 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 opacity-100 shadow-lg transition-all",
                showActionMenu || "invisible opacity-0",
              )}>
              {canSeeSession ? (
                <>
                  <button
                    className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100"
                    onClick={() => setIsOpenNoteListModal(true)}>
                    <INote className="size-[18px]" />
                    <span>یادداشت ها</span>
                  </button>
                </>
              ) : null}
              <button
                className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100"
                onClick={() => {
                  setIsRemindersOpen(true);
                }}>
                <BellIcon className="size-[18px]" />
                <span>یادآورها</span>
              </button>
              {canManageSession ? (
                <>
                  <button
                    className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100"
                    onClick={() => setIsOpenLogModal(true)}>
                    <IClockRotateLeft className="size-[18px]" />
                    <span>تاریخچه تغییرات</span>
                  </button>
                </>
              ) : null}
              {canManageSession &&
              !(session.status === SESSION_STATUS.PENDING) ? (
                <button
                  className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100"
                  onClick={handleEdit}>
                  <SquarePenIcon className="size-[18px]" />
                  <span>ویرایش جلسه</span>
                </button>
              ) : null}
              {session.status === SESSION_STATUS.PENDING && (
                <>
                  {canManageSession ||
                  (session.creator.id === userInfo?.data?.data.id &&
                    canCreateSession) ? (
                    <button
                      className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100"
                      onClick={handleEdit}>
                      <SquarePenIcon className="size-[18px]" />
                      <span>ویرایش جلسه</span>
                    </button>
                  ) : null}
                  {canManageSession ? (
                    <>
                      <NotificationModal
                        onSubmit={async (note) => {
                          const res = await editSessionStatus.mutateAsync({
                            id: session.id,
                            status: SESSION_STATUS.CONFIRMED,
                            note: note,
                          });

                          if (!res) return false;

                          queryClient.invalidateQueries({
                            queryKey: ["sessionList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCountList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCreatedList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCountCreatedList"],
                          });

                          return true;
                        }}
                        title="تایید جلسه"
                        description={`آیا از تایید کردن جلسه "${session.title}" مطمئن هستید؟`}
                        className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                        isHaveNote
                        noteTitle="یادداشت"
                        actionName="تایید جلسه"
                        actionClassName="bg-primary-green">
                        <CheckIcon className="size-[18px]" />
                        <span>تایید جلسه</span>
                      </NotificationModal>

                      <NotificationModal
                        onSubmit={async (note) => {
                          const res = await editSessionStatus.mutateAsync({
                            id: session.id,
                            status: SESSION_STATUS.REJECTED,
                            note: note,
                          });

                          if (!res) return false;

                          queryClient.invalidateQueries({
                            queryKey: ["sessionList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCountList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCreatedList"],
                          });

                          queryClient.invalidateQueries({
                            queryKey: ["sessionCountCreatedList"],
                          });

                          return true;
                        }}
                        title="رد جلسه"
                        description={`آیا از رد کردن جلسه "${session.title}" مطمئن هستید؟`}
                        className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm text-primary-red transition-colors hover:bg-primary-red/10"
                        isHaveNote
                        noteTitle="یادداشت"
                        actionName="رد جلسه">
                        <XIcon className="size-[18px]" />
                        <span>رد جلسه</span>
                      </NotificationModal>
                    </>
                  ) : null}
                </>
              )}

              {session.status === SESSION_STATUS.CONFIRMED && (
                <NotificationModal
                  onSubmit={async (note) => {
                    const res = await editSessionStatus.mutateAsync({
                      id: session.id,
                      status: SESSION_STATUS.CANCELED,
                      note: note,
                    });

                    if (!res) return false;

                    queryClient.invalidateQueries({
                      queryKey: ["sessionList"],
                    });

                    queryClient.invalidateQueries({
                      queryKey: ["sessionCountList"],
                    });

                    queryClient.invalidateQueries({
                      queryKey: ["sessionCreatedList"],
                    });

                    queryClient.invalidateQueries({
                      queryKey: ["sessionCountCreatedList"],
                    });

                    return true;
                  }}
                  title="لغو جلسه"
                  description={`آیا از لغو کردن جلسه "${session.title}" مطمئن هستید؟`}
                  className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-right text-sm text-primary-red transition-colors hover:bg-primary-red/10"
                  isHaveNote
                  noteTitle="یادداشت"
                  actionName="لغو جلسه">
                  <BanIcon className="size-[18px]" />
                  <span>لغو جلسه</span>
                </NotificationModal>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-full space-y-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-x-2">
                <div className="relative size-7 overflow-hidden rounded-full bg-primary-blue">
                  {session.creator?.avatar?.url ? (
                    <CustomImage
                      className="object-cover"
                      src={session.creator.avatar?.url || ""}
                      alt={
                        session.creator.firstName +
                          " " +
                          session.creator.lastName || ""
                      }
                      fill
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      {session.creator?.firstName?.[0] || ""}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {session.creator
                    ? session.creator.firstName + " " + session.creator.lastName
                    : "بدون کاربر"}
                </span>
              </div>
              <div className="flex">
                {session.users && session.users.length > 0
                  ? session.users.map((userItem, index) => (
                      <div
                        key={userItem.user.id}
                        className={cn(
                          "size-7 overflow-hidden rounded-full border border-white bg-primary-blue",
                          index !== session.users?.length - 1 && "-ml-2",
                        )}
                        title={
                          userItem.user.firstName + " " + userItem.user.lastName
                        }>
                        {userItem.user?.avatar ? (
                          <CustomImage
                            className="object-cover"
                            src={userItem.user.avatar.url}
                            alt={
                              userItem.user.firstName +
                                " " +
                                userItem.user.lastName || ""
                            }
                            fill
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-white">
                            {userItem.user?.firstName?.[0] || ""}
                          </div>
                        )}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
        {session.customTime && (
          <div className="mt-3 flex w-fit items-center gap-x-1 rounded-full bg-blue-200 px-3 py-1.5">
            <ClockIcon className="size-3.5 text-blue-600" />
            <span className="-mb-[3px] text-sm text-blue-600">
              {session.timeDisplay}
            </span>
          </div>
        )}
      </Link>

      {isOpenModal && (
        <MutateSession
          isOpenModal={isOpenModal}
          room={session.room}
          defaultSessionId={session.id}
          isEditing
          setIsOpenModal={setIsOpenModal}
          startSession={startSessionDate}
        />
      )}

      {isOpenNoteListModal && (
        <NoteListModal
          isOpen={isOpenNoteListModal}
          onClose={() => setIsOpenNoteListModal(false)}
          sessionTitle={session.title}
          sessionId={session.id}
          canCreateSession={canCreateSession}
        />
      )}

      {isOpenLogModal && (
        <SessionLogModal
          isOpen={isOpenLogModal}
          onClose={() => setIsOpenLogModal(false)}
          sessionTitle={session.title}
          sessionId={session.id}
        />
      )}

      {isRemindersOpen && (
        <ReminderListModal
          isOpen={isRemindersOpen}
          onClose={() => setIsRemindersOpen(false)}
          contentTitle={session.title}
          contentId={session.id}
          contentType={REMINDER_CONTENT.MEETING}
        />
      )}
    </>
  );
}
