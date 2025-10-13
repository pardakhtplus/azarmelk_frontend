"use client";

import { IPhone } from "@/components/Icons";
import Modal from "@/components/modules/Modal";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import { useGetAdvisorContactLogs } from "@/services/queries/client/estate/useGetAdvisorContactLogs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ContactHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function ContactHistoryModal({
  isOpen,
  onClose,
  userId,
  userName,
}: ContactHistoryModalProps) {
  const { getAdvisorContactLogs } = useGetAdvisorContactLogs({
    userId,
  });

  const [isClient, setIsClient] = useState(false);
  const isLoading = getAdvisorContactLogs.isLoading;
  const error = getAdvisorContactLogs.error;
  const contactLogs = getAdvisorContactLogs.data?.data;

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return createPortal(
    <Modal
      isOpen={isOpen}
      title={`تاریخچه تماس‌های ${userName}`}
      classNames={{
        background: "z-[60] !py-0 !px-4",
        box: "!max-w-4xl !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
        header: "!py-4",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}>
      <div className="px-6 pb-7 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent" />
              <p className="mt-2 text-sm text-gray-500">در حال بارگذاری...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">{error.message}</p>
            </div>
          </div>
        ) : contactLogs?.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                تاریخچه تماس‌ها خالی است
              </h3>
              <p className="text-sm text-gray-500">
                این کاربر تا کنون با مشاوران هیچ ملکی تماس نگرفته است.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                تعداد کل تماس‌ها:{" "}
                <span className="font-medium text-gray-900">
                  {contactLogs?.length}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              {contactLogs?.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-blue/10">
                          <IPhone className="size-5 text-primary-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            تماس با مشاور ملک
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString(
                              "fa-IR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            ملک:
                          </span>
                          <Link
                            href={`/estates/${log.estate.id}`}
                            className="text-sm text-primary-blue underline hover:text-primary-blue/80">
                            {log.estate.title || `ملک ${log.estate.estateCode}`}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            کد ملک:
                          </span>
                          <span className="text-sm text-gray-600">
                            {log.estate.estateCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            مشاور:
                          </span>
                          <span className="text-sm text-gray-600">
                            {log.estate.adviser?.firstName}{" "}
                            {log.estate.adviser?.lastName} /{" "}
                            {log.estate.adviser?.phoneNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            کاربر:
                          </span>
                          <span className="text-sm text-gray-600">
                            {log.createdBy.firstName} {log.createdBy.lastName} /{" "}
                            {log.createdBy.phoneNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
        <BorderedButton
          disabled={isLoading}
          type="button"
          className="!px-6 sm:!px-10"
          onClick={handleClose}>
          بستن
        </BorderedButton>
      </div>
    </Modal>,
    document.body,
  );
}
