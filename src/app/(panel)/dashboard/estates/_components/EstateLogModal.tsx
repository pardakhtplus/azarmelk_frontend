"use client";

import { IArrowRight } from "@/components/Icons";
import Modal from "@/components/modules/Modal";
import { getFieldPersianName } from "@/components/modules/estate/ConditionalField";
import { cn, formatNumber } from "@/lib/utils";
import { useEstateLogList } from "@/services/queries/admin/estate/useEstateLogList";
import {
  type TEditLog,
  type TStatusChangedLog,
} from "@/types/admin/estate/types";
import { createPortal } from "react-dom";

interface EstateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateTitle: string;
  estateId: string;
}

// Helper function to format field values for display (same as RequestInfoSection)
function formatFieldValue(fieldName: string, value: any): string {
  if (value === null || value === undefined || value === "") {
    return "خالی";
  }

  // Handle file arrays
  if (fieldName === "files" && Array.isArray(value)) {
    return value.length > 0 ? `${value.length} فایل` : "بدون فایل";
  }

  // Handle property object structure (new format)
  if (
    fieldName.startsWith("properties.") &&
    value &&
    typeof value === "object" &&
    "values" in value &&
    Array.isArray(value.values)
  ) {
    // Handle special formatting for loan amount
    if (fieldName === "properties.loanAmount") {
      return value.values.length > 0
        ? value.values
            .map((v) => `${Number(v).toLocaleString("fa-IR")} تومان`)
            .join("، ")
        : "خالی";
    }

    return value.values.length > 0 ? value.values.join("، ") : "خالی";
  }

  // Handle special property fields (legacy format)
  if (
    fieldName === "properties.loanAmount" &&
    value &&
    typeof value === "string"
  ) {
    return `${Number(value).toLocaleString("fa-IR")} تومان`;
  }

  // Handle elevator count fields (both new and legacy format)
  if (
    (fieldName === "properties.passengerElevatorCount" ||
      fieldName === "properties.freightElevatorCount") &&
    value
  ) {
    // If it's the new structured format
    if (
      typeof value === "object" &&
      "values" in value &&
      Array.isArray(value.values)
    ) {
      return value.values.length > 0 ? value.values[0] : "خالی";
    }
    // If it's legacy format (string or number)
    return value.toString();
  }

  // Handle date fields (documentIssueDate, tenantExiteDate)
  if (
    (fieldName === "properties.documentIssueDate" ||
      fieldName === "properties.tenantExiteDate") &&
    value
  ) {
    // If it's already a formatted date, return as is
    if (typeof value === "string" && value.includes("/")) {
      return value;
    }
    // Otherwise, it might be an ISO date that needs formatting
    try {
      const date = new Date(value);
      return date.toLocaleDateString("fa-IR");
    } catch {
      return value.toString();
    }
  }

  // Handle array values
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join("، ") : "خالی";
  }

  // Handle price fields
  if (
    [
      "metragePrice",
      "totalPrice",
      "rahnPrice",
      "ejarePrice",
      "banaPrice",
    ].includes(fieldName)
  ) {
    return formatNumber(value.toString()) + " تومان";
  }

  // Handle boolean values
  if (typeof value === "boolean") {
    return value ? "بله" : "خیر";
  }

  // Handle numeric values
  if (typeof value === "number") {
    return value.toString();
  }

  // Handle string values
  return value.toString();
}

function valuesDiffer(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b))
    return JSON.stringify(a) !== JSON.stringify(b);
  if (typeof a === "number" || typeof b === "number")
    return Number(a) !== Number(b);
  return String(a ?? "") !== String(b ?? "");
}

export default function EstateLogModal({
  isOpen,
  onClose,
  estateTitle,
  estateId,
}: EstateLogModalProps) {
  const { estateLogList } = useEstateLogList(estateId, { enabled: isOpen });

  if (!isOpen) return null;

  const logs = estateLogList.data?.data;

  return createPortal(
    <Modal
      isOpen={isOpen}
      title={`تاریخچه تغییرات فایل ${estateTitle}`}
      classNames={{
        background: "z-50 !py-0 sm:!py-4 sm:!px-4 !px-0",
        box: "sm:!max-w-3xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg !max-h-none",
        header: "sticky top-0 bg-white sm:bg-transparent sm:static",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-5">
          {estateLogList.isLoading ? (
            <div className="flex justify-center py-8">در حال بارگذاری...</div>
          ) : estateLogList.data?.data && estateLogList.data.data.length > 0 ? (
            <div className="flex flex-col gap-3">
              {logs?.map((item, index) => {
                let statusChangedLog: TStatusChangedLog[] | null = null;
                let editLog: TEditLog | null = null;

                const isStatusChangedLog = !(item.description?.[0] as any).user;

                if (isStatusChangedLog) {
                  statusChangedLog = item.description as TStatusChangedLog[];
                } else editLog = item.description[0] as TEditLog;

                const oldData = (editLog?.changes as any)?.oldData as
                  | Record<string, unknown>
                  | undefined;
                const newData = (editLog?.changes as any)?.newData as
                  | Record<string, unknown>
                  | undefined;

                // Handle nested properties structure
                const flattenData = (
                  data: Record<string, unknown> | undefined,
                ): Record<string, unknown> => {
                  if (!data) return {};

                  const flattened: Record<string, unknown> = {};

                  Object.entries(data).forEach(([key, value]) => {
                    if (
                      key === "ویژگی‌ها" &&
                      value &&
                      typeof value === "object"
                    ) {
                      // Flatten properties from the nested structure
                      Object.entries(value as Record<string, unknown>).forEach(
                        ([propKey, propValue]) => {
                          flattened[`properties.${propKey}`] = propValue;
                        },
                      );
                    } else {
                      flattened[key] = value;
                    }
                  });

                  return flattened;
                };

                const flatOldData = flattenData(oldData);
                const flatNewData = flattenData(newData);

                const keys = Array.from(
                  new Set([
                    ...Object.keys(flatOldData || {}),
                    ...Object.keys(flatNewData || {}),
                  ]),
                );
                const diffRows = keys
                  .map((k) => ({
                    key: k,
                    from: flatOldData?.[k],
                    to: flatNewData?.[k],
                  }))
                  .filter((row) => valuesDiffer(row.from, row.to));

                return (
                  <div key={item.id} className="relative flex gap-x-3">
                    <div className="flex shrink-0 flex-col items-center gap-y-3">
                      <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary-border/80 text-sm font-bold">
                        {(estateLogList.data?.data.length || 0) - index}
                      </div>
                      <div
                        className={cn(
                          "h-full w-px border-r border-dashed border-primary-border",
                          index === logs?.length - 1 ? "hidden" : "",
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "w-full",
                        index === logs?.length - 1 ? "pb-0" : "pb-5",
                      )}>
                      <div className="mb-4 flex items-center justify-start gap-3 pt-1">
                        <div className="flex flex-col gap-1">
                          <div className="text-lg text-gray-900">
                            {isStatusChangedLog ? (
                              <>
                                {statusChangedLog?.map((log, index) => (
                                  <span
                                    key={index}
                                    className={cn(
                                      log.bold ? "font-semibold" : "",
                                    )}>
                                    {log.firstName
                                      ? item.createdBy.firstName
                                      : ""}{" "}
                                    {log.lastName
                                      ? item.createdBy.lastName
                                      : ""}{" "}
                                    {log.text}
                                  </span>
                                ))}
                              </>
                            ) : editLog?.message ? (
                              editLog?.message
                            ) : item.actionType === "CREATE" ? (
                              "فایل ساخته شد"
                            ) : (
                              "تغییراتی ثبت نشده است"
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="font-medium text-gray-600">
                              {item.createdBy.firstName}{" "}
                              {item.createdBy.lastName}
                            </span>
                            <span className="text-gray-500">|</span>
                            {new Date(item.createdAt).toLocaleDateString(
                              "fa-IR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>

                      {diffRows.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                          <div className="grid grid-cols-1 divide-y divide-gray-200">
                            {diffRows.map((row) => {
                              const fieldName = row.key as string;
                              const persianName =
                                getFieldPersianName(fieldName);

                              // Special handling for files
                              if (fieldName === "فایل‌ها") {
                                const oldFiles = Array.isArray(row.from)
                                  ? row.from
                                  : [];
                                const newFiles = Array.isArray(row.to)
                                  ? row.to
                                  : [];

                                return (
                                  <div
                                    key={fieldName}
                                    className="flex flex-col gap-3.5 p-4">
                                    <div className="text-sm font-medium text-gray-800">
                                      {persianName}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                      <div>
                                        <p className="mb-2 text-xs text-gray-500">
                                          فایل‌های قبلی:
                                        </p>
                                        <div className="space-y-2">
                                          {oldFiles.length > 0 ? (
                                            oldFiles.map(
                                              (file: any, index: number) => (
                                                <div
                                                  key={index}
                                                  className="flex items-center gap-1 text-sm">
                                                  <span className="text-red-600">
                                                    🔗
                                                  </span>
                                                  <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-red-600 hover:underline">
                                                    {file.file_name ||
                                                      `فایل ${index + 1}`}
                                                  </a>
                                                </div>
                                              ),
                                            )
                                          ) : (
                                            <p className="text-sm text-red-600">
                                              بدون فایل
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="mb-2 text-xs text-gray-500">
                                          فایل‌های جدید:
                                        </p>
                                        <div className="space-y-2">
                                          {newFiles.length > 0 ? (
                                            newFiles.map(
                                              (file: any, index: number) => (
                                                <div
                                                  key={index}
                                                  className="flex items-center gap-1 text-sm">
                                                  <span className="text-green-600">
                                                    🔗
                                                  </span>
                                                  <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-green-600 hover:underline">
                                                    {file.file_name ||
                                                      `فایل ${index + 1}`}
                                                  </a>
                                                </div>
                                              ),
                                            )
                                          ) : (
                                            <p className="text-sm text-green-600">
                                              بدون فایل
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              // Regular field handling
                              return (
                                <div
                                  key={fieldName}
                                  className="flex flex-col gap-3.5 p-4">
                                  <div className="shrink-0 text-sm font-medium text-gray-800">
                                    {persianName}
                                  </div>
                                  <div className="flex flex-1 items-center gap-3">
                                    <span className="rounded-xl bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 ring-1 ring-gray-200">
                                      {formatFieldValue(fieldName, row.from)}
                                    </span>
                                    <IArrowRight className="size-5 rotate-180 text-gray-400" />
                                    <span className="rounded-xl bg-green-50 px-2.5 py-1.5 text-sm font-medium text-green-700 ring-1 ring-green-200">
                                      {formatFieldValue(fieldName, row.to)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-500">
              تاریخی ثبت نشده است
            </div>
          )}
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
