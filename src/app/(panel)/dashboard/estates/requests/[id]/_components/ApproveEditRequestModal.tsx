"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import { getFieldPersianName } from "@/components/modules/estate/ConditionalField";
import Modal from "@/components/modules/Modal";
import { formatNumber } from "@/lib/utils";
import { REQUEST_STATUS } from "@/types/admin/estate/enum";
import {
  type TEditRequestInfo,
  type TRequest,
} from "@/types/admin/estate/types";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface ApproveEditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TRequest;
  onApprove: (
    requestId: string,
    editData?: TEditRequestInfo,
    statusData?: { status: REQUEST_STATUS; note?: string },
  ) => Promise<boolean>;
  isLoading?: boolean;
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

  // Handle file arrays
  if (fieldName === "files" && Array.isArray(value)) {
    return value.length > 0 ? `${value.length} فایل` : "بدون فایل";
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
};

export default function ApproveEditRequestModal({
  isOpen,
  onClose,
  request,
  onApprove,
  isLoading = false,
}: ApproveEditRequestModalProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [note, setNote] = useState("");
  const [showAllChanges, setShowAllChanges] = useState(false);
  const INITIAL_CHANGES_COUNT = 3; // Number of changes to show initially

  // Initialize selected fields when modal opens
  useEffect(() => {
    if (isOpen && request.change) {
      const initialSelection: Record<string, boolean> = {};

      // Flatten nested properties structure if present
      const flattenRequestChange = (change: Record<string, any>): string[] => {
        const flattened: string[] = [];

        Object.entries(change).forEach(([key, value]) => {
          if (key === "properties" && value) {
            // Properties are handled as a single group
            flattened.push("properties");
          } else if (key === "ویژگی‌ها" && value && typeof value === "object") {
            // Legacy format - properties are handled as a single group
            flattened.push("properties");
          } else {
            flattened.push(key);
          }
        });

        return flattened;
      };

      const flatFields = flattenRequestChange(request.change);
      flatFields.forEach((fieldName) => {
        initialSelection[fieldName] = true; // All fields selected by default
      });
      setSelectedFields(initialSelection);
    }
  }, [isOpen, request.change]);

  const handleFieldToggle = (fieldName: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleApprove = async () => {
    if (!request.change) return;

    const selectedChanges: Record<string, any> = {};
    let hasSelectedFields = false;

    // Build the changes object with only selected fields
    // Need to handle both flat and nested structure
    const buildSelectedChanges = (change: Record<string, any>) => {
      Object.entries(change).forEach(([key, value]) => {
        if (key === "properties" && value) {
          // Handle properties field - if properties group is selected, include all
          if (selectedFields["properties"]) {
            selectedChanges[key] = value;
            hasSelectedFields = true;
          }
        } else if (key === "ویژگی‌ها" && value && typeof value === "object") {
          // Handle nested properties structure (legacy format)
          if (selectedFields["properties"]) {
            selectedChanges[key] = value;
            hasSelectedFields = true;
          }
        } else {
          // Handle regular fields
          if (selectedFields[key]) {
            selectedChanges[key] = value;
            hasSelectedFields = true;
          }
        }
      });
    };

    buildSelectedChanges(request.change);

    if (!hasSelectedFields) {
      toast.error("حداقل یک فیلد باید انتخاب شود");
      return;
    }

    // Check if all fields are selected
    const checkAllFieldsSelected = (change: Record<string, any>): boolean => {
      const flatFields: string[] = [];

      Object.entries(change).forEach(([key, value]) => {
        if (key === "properties" && value) {
          // Properties are handled as a single group
          flatFields.push("properties");
        } else if (key === "ویژگی‌ها" && value && typeof value === "object") {
          // Legacy format - properties are handled as a single group
          flatFields.push("properties");
        } else {
          flatFields.push(key);
        }
      });

      return flatFields.every((fieldName) => selectedFields[fieldName]);
    };

    const allFieldsSelected = checkAllFieldsSelected(request.change);

    if (allFieldsSelected) {
      // All fields selected, just approve the request
      const success = await onApprove(request.id, undefined, {
        status: REQUEST_STATUS.APPROVED,
        note: note || "درخواست تایید شد",
      });

      if (success) {
        onClose();
        setNote("");
      }
    } else {
      // Some fields deselected, update the request first then approve
      const success = await onApprove(
        request.id,
        {
          title: request.title,
          description: request.description,
          estateStatus: request.estateStatus,
          status: REQUEST_STATUS.APPROVED,
          changes: selectedChanges,
        },
        {
          status: REQUEST_STATUS.APPROVED,
          note: note || "درخواست با تغییرات انتخابی تایید شد",
        },
      );

      if (success) {
        onClose();
        setNote("");
      }
    }
  };

  const resetForm = () => {
    setSelectedFields({});
    setNote("");
    setShowAllChanges(false);
  };

  if (!request.change) return null;

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpen}
          title="تایید درخواست ویرایش"
          classNames={{
            background: "z-[60] !py-0 !px-4",
            box: "!max-w-4xl !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
            header: "!py-4",
          }}
          onCloseModal={() => {
            resetForm();
            onClose();
          }}
          onClickOutside={() => {
            resetForm();
            onClose();
          }}>
          <div className="space-y-6 px-6 pb-7 pt-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                لطفاً فیلدهایی که می‌خواهید در این درخواست اعمال شوند را انتخاب
                کنید:
              </p>
            </div>

            <div className="max-h-96 space-y-4 overflow-y-auto">
              {(() => {
                // Helper function to check if a value has actual changes
                const hasActualChanges = (
                  oldValue: any,
                  newValue: any,
                ): boolean => {
                  // Handle null/undefined
                  if (oldValue === newValue) return false;
                  if (!oldValue && !newValue) return false;
                  if (String(oldValue) === String(newValue)) return false;

                  // Handle undefined to empty array conversion (no actual change)
                  if (
                    (oldValue === undefined || oldValue === null) &&
                    Array.isArray(newValue) &&
                    newValue.length === 0
                  ) {
                    return false;
                  }
                  if (
                    (newValue === undefined || newValue === null) &&
                    Array.isArray(oldValue) &&
                    oldValue.length === 0
                  ) {
                    return false;
                  }

                  // Handle arrays
                  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                    if (oldValue.length === 0 && newValue.length === 0)
                      return false;
                    return (
                      JSON.stringify(oldValue.sort()) !==
                      JSON.stringify(newValue.sort())
                    );
                  }

                  // Handle objects (for structured properties)
                  if (
                    typeof oldValue === "object" &&
                    typeof newValue === "object"
                  ) {
                    if (
                      oldValue &&
                      newValue &&
                      "values" in oldValue &&
                      "values" in newValue
                    ) {
                      const oldValues = Array.isArray(oldValue.values)
                        ? oldValue.values
                        : [];
                      const newValues = Array.isArray(newValue.values)
                        ? newValue.values
                        : [];
                      if (oldValues.length === 0 && newValues.length === 0)
                        return false;
                      return (
                        JSON.stringify(oldValues.sort()) !==
                        JSON.stringify(newValues.sort())
                      );
                    }
                  }

                  // Handle undefined/null to structured object with empty values (no actual change)
                  if (
                    (oldValue === undefined || oldValue === null) &&
                    newValue &&
                    typeof newValue === "object" &&
                    "values" in newValue &&
                    Array.isArray(newValue.values) &&
                    newValue.values.length === 0
                  ) {
                    return false;
                  }

                  // Handle other types
                  return String(oldValue || "") !== String(newValue || "");
                };

                // Flatten and filter changes
                const flattenRequestChange = (
                  change: Record<string, any>,
                ): Array<[string, any]> => {
                  const flattened: Array<[string, any]> = [];
                  const propertiesChanges: Array<[string, any]> = [];

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
                            propertiesChanges.push([
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
                      // Legacy format
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
                            propertiesChanges.push([
                              `properties.${propKey}`,
                              propValue,
                            ]);
                          }
                        },
                      );
                    } else {
                      // Handle regular fields
                      const originalValue =
                        request.estate?.[key as keyof typeof request.estate];
                      if (hasActualChanges(originalValue, value)) {
                        flattened.push([key, value]);
                      }
                    }
                  });

                  // Add properties as a single group if there are any property changes
                  if (propertiesChanges.length > 0) {
                    flattened.push(["properties", propertiesChanges]);
                  }

                  return flattened;
                };

                const flatChanges = flattenRequestChange(request.change);

                return flatChanges
                  .slice(0, showAllChanges ? undefined : INITIAL_CHANGES_COUNT)
                  .map(([fieldName, newValue]) => {
                    // Special handling for properties group
                    if (fieldName === "properties" && Array.isArray(newValue)) {
                      const propertiesChanges = newValue as Array<
                        [string, any]
                      >;
                      const isSelected = selectedFields["properties"] || false;

                      return (
                        <div
                          key="properties"
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${
                            isSelected
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          onClick={() => handleFieldToggle("properties")}>
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                                isSelected
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300 bg-white"
                              }`}>
                              {isSelected && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                امکانات
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {propertiesChanges.length} تغییر در امکانات
                              </p>
                              <div className="mt-3 space-y-2">
                                {propertiesChanges
                                  .slice(0, 3)
                                  .map(([propFieldName, propValue]) => {
                                    // Access original property value from request.estate.properties
                                    const propertyKey = propFieldName.replace(
                                      "properties.",
                                      "",
                                    );
                                    const originalValue =
                                      request.estate?.properties?.[
                                        propertyKey as keyof typeof request.estate.properties
                                      ];

                                    // Get display name
                                    let displayName =
                                      getFieldPersianName(propFieldName);
                                    if (
                                      propFieldName.startsWith("properties.") &&
                                      propValue &&
                                      typeof propValue === "object" &&
                                      "mainTitle" in propValue &&
                                      "title" in propValue
                                    ) {
                                      if (
                                        propValue.title &&
                                        propValue.title !== propValue.mainTitle
                                      ) {
                                        displayName = `${propValue.mainTitle}/${propValue.title}`;
                                      } else {
                                        displayName = propValue.mainTitle;
                                      }
                                    }

                                    return (
                                      <div
                                        key={propFieldName}
                                        className="flex items-center gap-2 text-xs">
                                        <span className="font-medium text-gray-700">
                                          {displayName}:
                                        </span>
                                        <span className="text-red-500">
                                          {formatFieldValue(
                                            propFieldName,
                                            originalValue,
                                          )}
                                        </span>
                                        <span className="text-gray-400">←</span>
                                        <span className="text-green-600">
                                          {formatFieldValue(
                                            propFieldName,
                                            propValue,
                                          )}
                                        </span>
                                      </div>
                                    );
                                  })}
                                {propertiesChanges.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    و {propertiesChanges.length - 3} تغییر
                                    دیگر...
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Handle regular fields
                    const originalValue =
                      request.estate?.[
                        fieldName as keyof typeof request.estate
                      ];
                    const persianName = getFieldPersianName(fieldName);

                    const formattedOldValue = formatFieldValue(
                      fieldName,
                      originalValue,
                    );
                    const formattedNewValue = formatFieldValue(
                      fieldName,
                      newValue,
                    );
                    const isSelected = selectedFields[fieldName] || false;

                    // Special handling for files
                    if (fieldName === "files") {
                      const oldFiles = Array.isArray(originalValue)
                        ? originalValue
                        : [];
                      const newFiles = Array.isArray(newValue) ? newValue : [];

                      return (
                        <div
                          key={fieldName}
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${
                            isSelected
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          onClick={() => handleFieldToggle(fieldName)}>
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                                isSelected
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300 bg-white"
                              }`}>
                              {isSelected && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {persianName}
                              </p>
                              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <p className="mb-2 text-xs text-gray-500">
                                    فایل‌های قبلی:
                                  </p>
                                  <div className="space-y-1">
                                    {oldFiles.length > 0 ? (
                                      oldFiles.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-1 text-sm">
                                            <span className="text-red-600">
                                              📎
                                            </span>
                                            <a
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="truncate text-xs text-red-600 hover:underline">
                                              {file.file_name ||
                                                `فایل ${index + 1}`}
                                            </a>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <p className="text-xs text-red-600">
                                        بدون فایل
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-2 text-xs text-gray-500">
                                    فایل‌های جدید:
                                  </p>
                                  <div className="space-y-1">
                                    {newFiles.length > 0 ? (
                                      newFiles.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-1 text-sm">
                                            <span className="text-green-600">
                                              📎
                                            </span>
                                            <a
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="truncate text-xs text-green-600 hover:underline">
                                              {file.file_name ||
                                                `فایل ${index + 1}`}
                                            </a>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <p className="text-xs text-green-600">
                                        بدون فایل
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={fieldName}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          isSelected
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                        onClick={() => handleFieldToggle(fieldName)}>
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                              isSelected
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300 bg-white"
                            }`}>
                            {isSelected && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {persianName}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                  مقدار قبلی:
                                </p>
                                <p className="text-sm font-medium text-red-600">
                                  {formattedOldValue}
                                </p>
                              </div>
                              <ArrowLeft className="h-4 w-4 flex-shrink-0 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                  مقدار جدید:
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                  {formattedNewValue}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
              })()}

              {(() => {
                // Calculate total count of flattened changes for the show more/less button
                const flattenRequestChange = (
                  change: Record<string, any>,
                ): number => {
                  let count = 0;
                  Object.entries(change).forEach(([key, value]) => {
                    if (key === "properties" && value) {
                      // Properties count as 1 group
                      count += 1;
                    } else if (
                      key === "ویژگی‌ها" &&
                      value &&
                      typeof value === "object"
                    ) {
                      // Legacy format - properties count as 1 group
                      count += 1;
                    } else {
                      count += 1;
                    }
                  });
                  return count;
                };

                const totalChanges = flattenRequestChange(request.change);
                return totalChanges > INITIAL_CHANGES_COUNT;
              })() && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAllChanges(!showAllChanges)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
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
                                // Properties count as 1 group
                                count += 1;
                              } else if (
                                key === "ویژگی‌ها" &&
                                value &&
                                typeof value === "object"
                              ) {
                                // Legacy format - properties count as 1 group
                                count += 1;
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                یادداشت تایید (اختیاری)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none"
                placeholder="یادداشت خود را در مورد این تایید وارد کنید..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
            <Button
              type="button"
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-green-600 !px-7 hover:bg-green-700 sm:!px-10"
              onClick={handleApprove}>
              تایید درخواست
            </Button>
            <BorderedButton
              disabled={isLoading}
              type="button"
              className="!px-6 sm:!px-10"
              onClick={() => {
                resetForm();
                onClose();
              }}>
              لغو
            </BorderedButton>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
