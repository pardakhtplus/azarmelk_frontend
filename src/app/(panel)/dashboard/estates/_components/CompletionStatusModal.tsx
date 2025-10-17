"use client";

import {
  calculateEstateCompletionPercentage,
  getIncompleteFields,
} from "@/components/modules/estate/EstateUtils";
import Modal from "@/components/modules/Modal";
import type { DealType, MainCategory, PropertyType } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useEstate } from "@/services/queries/admin/estate/useEstate";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  estateId: string;
  estateTitle?: string;
};

export default function CompletionStatusModal({
  isOpen,
  onClose,
  estateId,
  estateTitle,
}: TProps) {
  const [isClient, setIsClient] = useState(false);
  const { estate } = useEstate({ id: estateId, enable: isOpen });

  useEffect(() => setIsClient(true), []);

  const formData = estate.data;
  const isLoading = estate.isLoading;

  const categoryTypes = formData?.data
    ? {
        dealType: formData.data.category.dealType as DealType,
        mainCategory: formData.data.category.mainCategory as MainCategory,
        propertyType: formData.data.category.propertyType as PropertyType,
      }
    : undefined;

  console.log(categoryTypes, "categoryTypes");

  console.log(formData, "formData?.data");

  const completionPercentage =
    formData?.data && categoryTypes
      ? calculateEstateCompletionPercentage(formData.data, categoryTypes)
      : 0;

  const incompleteFields =
    formData?.data && categoryTypes
      ? getIncompleteFields(formData.data, categoryTypes)
      : [];

  console.log(incompleteFields, "incompleteFields");

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isClient) return null;

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpen}
          title={`وضعیت تکمیل ${estateTitle || ""}`}
          classNames={{
            background: "z-[60] !py-0 !px-4",
            box: "!max-w-lg !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
            header: "!py-4",
          }}
          onCloseModal={onClose}
          onClickOutside={onClose}>
          <div className="px-6 pb-7 pt-6">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : formData?.data && categoryTypes ? (
              <div className="rounded-lg bg-neutral-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">درصد تکمیل:</span>
                  <span
                    className={cn(
                      "text-xl font-bold",
                      getCompletionColor(completionPercentage),
                    )}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="mb-3 h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      completionPercentage >= 80
                        ? "bg-green-600"
                        : completionPercentage >= 50
                          ? "bg-yellow-600"
                          : "bg-red-600",
                    )}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {incompleteFields.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      فیلدهای ناقص:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {incompleteFields.map((field, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          {field.persianName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                اطلاعات فایل در دسترس نیست
              </div>
            )}
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
