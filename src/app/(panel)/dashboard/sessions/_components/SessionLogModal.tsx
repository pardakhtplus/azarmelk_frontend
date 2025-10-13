"use client";

import Modal from "@/components/modules/Modal";
import { useSessionLogList } from "@/services/queries/admin/session/useSessionlogList";
import { createPortal } from "react-dom";

interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  sessionId: string;
}

export default function SessionLogModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionId,
}: SessionLogModalProps) {
  const { sessionLogList } = useSessionLogList(sessionId);

  if (!isOpen) return null;

  // Function to render description parts with formatting
  const renderDescription = (
    description: {
      text: string;
      bold: boolean;
      firstName?: boolean;
      lastName?: boolean;
    }[],
    createdBy?: {
      firstName?: string;
      lastName?: string;
    },
  ) => {
    return description.map((part, index) => {
      let className = "";
      if (part.bold) className += "font-bold ";

      return (
        <span key={index} className={className}>
          {part.firstName
            ? createdBy?.firstName
            : part.lastName
              ? createdBy?.lastName
              : part.text}
        </span>
      );
    });
  };

  return createPortal(
    <Modal
      doNotHiddenOverflow
      isOpen={isOpen}
      title={`تاریخچه تغییرات جلسه ${sessionTitle}`}
      classNames={{
        background: "z-50 !py-0 sm:!py-4 sm:!px-4 !px-0",
        box: "sm:!max-w-2xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg !max-h-none",
        header: "sticky top-0 bg-white sm:bg-transparent sm:static",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="flex h-full flex-col">
        {/* Logs list */}
        <div className="flex-1 overflow-auto p-5">
          {sessionLogList.isLoading ? (
            <div className="flex justify-center py-8">در حال بارگذاری...</div>
          ) : sessionLogList.data?.data &&
            sessionLogList.data.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {sessionLogList.data.data.map((log) => (
                <div key={log.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-700">
                        {log.createdBy?.firstName} {log.createdBy?.lastName}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(log.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Log description */}
                  <p className="text-sm">
                    {renderDescription(log.description, log.createdBy)}
                  </p>

                  {/* Note if exists */}
                  {log.note.text && (
                    <div className="mt-5 rounded-md bg-gray-100 p-3">
                      <p className="mb-1 text-xs text-gray-500">یادداشت:</p>
                      <p className="text-sm">{log.note.text}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        <span className="text-gray-600">
                          {log.note.createdBy?.firstName}{" "}
                          {log.note.createdBy?.lastName}
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(log.note.createdAt).toLocaleDateString(
                            "fa-IR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-500">
              تاریخچه‌ای وجود ندارد
            </div>
          )}
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
