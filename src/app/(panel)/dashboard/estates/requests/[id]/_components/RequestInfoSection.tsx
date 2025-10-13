"use client";

import { getFieldPersianName } from "@/components/modules/estate/ConditionalField";
import { formatNumber, isoUtcToFaJalaliDate } from "@/lib/utils";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import { type TRequest } from "@/types/admin/estate/types";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface RequestInfoSectionProps {
  request: TRequest;
  onEdit?: () => void;
  canEdit?: boolean;
}

// Helper function to format field values for display
const formatFieldValue = (fieldName: string, value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "خالی";
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

  // Handle date fields (documentIssueDate, tenantExiteDate) for new structured format
  if (
    (fieldName === "properties.documentIssueDate" ||
      fieldName === "properties.tenantExiteDate") &&
    value &&
    typeof value === "object" &&
    "values" in value &&
    Array.isArray(value.values)
  ) {
    return value.values.length > 0 ? value.values[0] : "خالی";
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

  // Handle date values
  if (value instanceof Date || fieldName === "tenantExiteDate") {
    return isoUtcToFaJalaliDate(value as string) || "";
  }

  // Handle file arrays
  if (fieldName === "files" && Array.isArray(value)) {
    return value.length > 0 ? `${value.length} فایل` : "بدون فایل";
  }

  // Handle string values
  return value.toString();
};

// Component to display individual field changes
const FieldChangeItem = ({
  fieldName,
  oldValue,
  newValue,
  isApproved = false,
}: {
  fieldName: string;
  oldValue: any;
  newValue: any;
  isApproved?: boolean;
}) => {
  // Get Persian name - for properties fields, use the structured name if available
  let persianName = getFieldPersianName(fieldName);

  // If it's a property field and the new value has structured data, use mainTitle/title
  if (
    fieldName.startsWith("properties.") &&
    newValue &&
    typeof newValue === "object" &&
    "mainTitle" in newValue &&
    "title" in newValue
  ) {
    if (newValue.title && newValue.title !== newValue.mainTitle) {
      persianName = `${newValue.mainTitle}/${newValue.title}`;
    } else {
      persianName = newValue.mainTitle;
    }
  }

  // Special handling for files
  if (fieldName === "files") {
    const oldFiles = Array.isArray(oldValue) ? oldValue : [];
    const newFiles = Array.isArray(newValue) ? newValue : [];

    // If approved, only show current files
    if (isApproved) {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-900">
            {persianName}
          </p>
          <div className="space-y-2">
            {newFiles.length > 0 ? (
              newFiles.map((file: any, index: number) => (
                <div key={index} className="flex items-center gap-1 text-sm">
                  <span className="text-blue-600">🔗</span>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-600 hover:underline">
                    {file.file_name || `فایل ${index + 1}`}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">بدون فایل</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-3 text-sm font-medium text-gray-900">{persianName}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-gray-500">فایل‌های قبلی:</p>
            <div className="space-y-2">
              {oldFiles.length > 0 ? (
                oldFiles.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-1 text-sm">
                    <span className="text-red-600">🔗</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-red-600 hover:underline">
                      {file.file_name || `فایل ${index + 1}`}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-red-600">بدون فایل</p>
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-500">فایل‌های جدید:</p>
            <div className="space-y-2">
              {newFiles.length > 0 ? (
                newFiles.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-1 text-sm">
                    <span className="-mb-0.5 text-green-600">🔗</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-green-600 hover:underline">
                      {file.file_name || `فایل ${index + 1}`}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-green-600">بدون فایل</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular field handling
  const formattedOldValue = formatFieldValue(fieldName, oldValue);
  const formattedNewValue = formatFieldValue(fieldName, newValue);

  // If approved, only show current value
  if (isApproved) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{persianName}</p>
          <div className="mt-2">
            <p className="text-sm font-medium text-blue-600">
              {formattedNewValue}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{persianName}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">مقدار قبلی:</p>
            <p className="text-sm font-medium text-red-600">
              {formattedOldValue}
            </p>
          </div>
          <ArrowLeft className="h-4 w-4 flex-shrink-0 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">مقدار جدید:</p>
            <p className="text-sm font-medium text-green-600">
              {formattedNewValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RequestInfoSection({
  request,
  onEdit,
  canEdit = false,
}: RequestInfoSectionProps) {
  const [showAllChanges, setShowAllChanges] = useState(false);
  const INITIAL_CHANGES_COUNT = 3; // Number of changes to show initially
  const isApproved = request.status === REQUEST_STATUS.APPROVED;
  return (
    <div className="rounded-xl bg-neutral-50 p-3 !pt-4 sm:p-6 sm:!pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          اطلاعات درخواست
        </h3>
        {canEdit && onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            <Edit className="h-4 w-4" />
            ویرایش
          </button>
        )}
      </div>

      <div className="space-y-2 sm:space-y-4">
        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            عنوان درخواست
          </label>
          <p className="font-semibold text-gray-900 sm:text-lg">
            {request.title || "بدون عنوان"}
          </p>
        </div>

        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            توضیحات درخواست
          </label>
          <p className="leading-relaxed text-gray-700">
            {request.description || "توضیحی برای این درخواست وجود ندارد."}
          </p>
        </div>

        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            یادداشت بررسی کننده
          </label>
          <p className="leading-relaxed text-gray-700">
            {request.note || "یادداشتی وجود ندارد."}
          </p>
        </div>

        {request.type === REQUEST_TYPE.EDIT && request.change && (
          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-3 block text-sm font-medium text-gray-500">
              {isApproved ? "تغییرات اعمال شده" : "تغییرات درخواستی"}
            </label>
            <div className="space-y-3">
              {(() => {
                // Flatten nested properties structure if present
                const flattenRequestChange = (
                  change: Record<string, any>,
                ): Array<[string, any]> => {
                  const flattened: Array<[string, any]> = [];

                  Object.entries(change).forEach(([key, value]) => {
                    if (key === "properties" && value) {
                      // Handle properties field - it comes as JSON string, need to parse it
                      let parsedProperties;
                      try {
                        parsedProperties =
                          typeof value === "string" ? JSON.parse(value) : value;
                      } catch {
                        parsedProperties = value;
                      }

                      if (
                        parsedProperties &&
                        typeof parsedProperties === "object"
                      ) {
                        Object.entries(
                          parsedProperties as Record<string, unknown>,
                        ).forEach(([propKey, propValue]) => {
                          // Only include property changes that actually changed
                          const originalValue =
                            request.estate?.properties?.[
                              propKey as keyof typeof request.estate.properties
                            ];

                          // Simple comparison for properties
                          const hasChanged =
                            JSON.stringify(originalValue) !==
                            JSON.stringify(propValue);

                          if (hasChanged) {
                            flattened.push([
                              `properties.${propKey}`,
                              propValue,
                            ]);
                          }
                        });
                      }
                    } else if (
                      key === "ویژگی‌ها" &&
                      value &&
                      typeof value === "object"
                    ) {
                      // Flatten properties from the nested structure (legacy format)
                      Object.entries(value as Record<string, unknown>).forEach(
                        ([propKey, propValue]) => {
                          // Only include property changes that actually changed (legacy format)
                          const originalValue =
                            request.estate?.properties?.[
                              propKey as keyof typeof request.estate.properties
                            ];

                          // Simple comparison for properties
                          const hasChanged =
                            JSON.stringify(originalValue) !==
                            JSON.stringify(propValue);

                          if (hasChanged) {
                            flattened.push([
                              `properties.${propKey}`,
                              propValue,
                            ]);
                          }
                        },
                      );
                    } else {
                      flattened.push([key, value]);
                    }
                  });

                  return flattened;
                };

                const flatChanges = flattenRequestChange(request.change);

                return flatChanges
                  .slice(0, showAllChanges ? undefined : INITIAL_CHANGES_COUNT)
                  .map(([fieldName, newValue]) => {
                    // Get the original value from the estate data
                    let originalValue;
                    if (fieldName.startsWith("properties.")) {
                      const propertyKey = fieldName.replace("properties.", "");
                      originalValue =
                        request.estate?.properties?.[
                          propertyKey as keyof typeof request.estate.properties
                        ];
                    } else {
                      originalValue =
                        request.estate?.[
                          fieldName as keyof typeof request.estate
                        ];
                    }

                    return (
                      <FieldChangeItem
                        key={fieldName}
                        fieldName={fieldName}
                        oldValue={originalValue}
                        newValue={newValue}
                        isApproved={isApproved}
                      />
                    );
                  });
              })()}
            </div>

            {(() => {
              // Calculate total count of flattened changes for the show more/less button
              const flattenRequestChange = (
                change: Record<string, any>,
              ): number => {
                let count = 0;
                Object.entries(change).forEach(([key, value]) => {
                  if (key === "properties" && value) {
                    // Handle properties field - it comes as JSON string, need to parse it
                    let parsedProperties;
                    try {
                      parsedProperties =
                        typeof value === "string" ? JSON.parse(value) : value;
                    } catch {
                      parsedProperties = value;
                    }

                    if (
                      parsedProperties &&
                      typeof parsedProperties === "object"
                    ) {
                      // Only count properties that actually changed
                      let changedPropsCount = 0;
                      Object.entries(
                        parsedProperties as Record<string, unknown>,
                      ).forEach(([propKey, propValue]) => {
                        const originalValue =
                          request.estate?.properties?.[
                            propKey as keyof typeof request.estate.properties
                          ];
                        const hasChanged =
                          JSON.stringify(originalValue) !==
                          JSON.stringify(propValue);
                        if (hasChanged) {
                          changedPropsCount++;
                        }
                      });
                      count += changedPropsCount;
                    }
                  } else if (
                    key === "ویژگی‌ها" &&
                    value &&
                    typeof value === "object"
                  ) {
                    // Only count properties that actually changed (legacy format)
                    let changedPropsCount = 0;
                    Object.entries(value as Record<string, unknown>).forEach(
                      ([propKey, propValue]) => {
                        const originalValue =
                          request.estate?.properties?.[
                            propKey as keyof typeof request.estate.properties
                          ];
                        const hasChanged =
                          JSON.stringify(originalValue) !==
                          JSON.stringify(propValue);
                        if (hasChanged) {
                          changedPropsCount++;
                        }
                      },
                    );
                    count += changedPropsCount;
                  } else {
                    count += 1;
                  }
                });
                return count;
              };

              const totalChanges = flattenRequestChange(request.change);
              return totalChanges > INITIAL_CHANGES_COUNT;
            })() && (
              <div className="mt-4 flex w-full justify-center">
                <button
                  onClick={() => setShowAllChanges(!showAllChanges)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
                  {showAllChanges ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      نمایش کمتر
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      مشاهده همه (
                      {(() => {
                        const flattenRequestChange = (
                          change: Record<string, any>,
                        ): number => {
                          let count = 0;
                          Object.entries(change).forEach(([key, value]) => {
                            if (key === "properties" && value) {
                              // Handle properties field - it comes as JSON string, need to parse it
                              let parsedProperties;
                              try {
                                parsedProperties =
                                  typeof value === "string"
                                    ? JSON.parse(value)
                                    : value;
                              } catch {
                                parsedProperties = value;
                              }

                              if (
                                parsedProperties &&
                                typeof parsedProperties === "object"
                              ) {
                                // Only count properties that actually changed
                                let changedPropsCount = 0;
                                Object.entries(
                                  parsedProperties as Record<string, unknown>,
                                ).forEach(([propKey, propValue]) => {
                                  const originalValue =
                                    request.estate?.properties?.[
                                      propKey as keyof typeof request.estate.properties
                                    ];
                                  const hasChanged =
                                    JSON.stringify(originalValue) !==
                                    JSON.stringify(propValue);
                                  if (hasChanged) {
                                    changedPropsCount++;
                                  }
                                });
                                count += changedPropsCount;
                              }
                            } else if (
                              key === "ویژگی‌ها" &&
                              value &&
                              typeof value === "object"
                            ) {
                              // Only count properties that actually changed (legacy format)
                              let changedPropsCount = 0;
                              Object.entries(
                                value as Record<string, unknown>,
                              ).forEach(([propKey, propValue]) => {
                                const originalValue =
                                  request.estate?.properties?.[
                                    propKey as keyof typeof request.estate.properties
                                  ];
                                const hasChanged =
                                  JSON.stringify(originalValue) !==
                                  JSON.stringify(propValue);
                                if (hasChanged) {
                                  changedPropsCount++;
                                }
                              });
                              count += changedPropsCount;
                            } else {
                              count += 1;
                            }
                          });
                          return count;
                        };
                        return (
                          flattenRequestChange(request.change) -
                          INITIAL_CHANGES_COUNT
                        );
                      })()}{" "}
                      تغییر دیگر)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              تاریخ ایجاد
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="font-medium text-gray-900">
                {new Date(request.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              آخرین بروزرسانی
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="font-medium text-gray-900">
                {new Date(request.updateAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        </div>

        {/* {request.contractEndTime && (
          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              تاریخ پایان قرارداد
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="font-medium text-gray-900">
                {new Date(request.contractEndTime).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
