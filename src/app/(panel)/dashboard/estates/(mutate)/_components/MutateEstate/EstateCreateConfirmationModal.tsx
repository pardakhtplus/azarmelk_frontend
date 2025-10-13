"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import {
  calculateEstateCompletionPercentage,
  getIncompleteFields,
} from "@/components/modules/estate/EstateUtils";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import TextArea from "@/components/modules/inputs/TextArea";
import Modal from "@/components/modules/Modal";
import type { DealType, MainCategory, PropertyType } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createPortal } from "react-dom";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    switchValue?: boolean,
    title?: string,
    description?: string,
  ) => void;
  isLoading?: boolean;
  title: string;
  description: string;
  actionName?: string;
  formData?: any;
  categoryTypes?: {
    dealType: DealType;
    mainCategory: MainCategory;
    propertyType: PropertyType;
  };
  isEditRequest?: boolean;
};

export default function EstateCreateConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
  actionName = "ایجاد",
  formData,
  categoryTypes,
  isEditRequest = false,
}: TProps) {
  const [switchValue, setSwitchValue] = useState(true);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const resetForm = () => {
    setSwitchValue(true);
    setTitleValue("");
    setDescriptionValue("");
  };
  const completionPercentage =
    formData && categoryTypes
      ? calculateEstateCompletionPercentage(formData, categoryTypes)
      : 0;

  const incompleteFields =
    formData && categoryTypes
      ? getIncompleteFields(formData, categoryTypes)
      : [];

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpen}
          title={title}
          classNames={{
            background: "z-[60] !py-0 !px-4",
            box: "!max-w-lg !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
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
          <div className="px-6 pb-7 pt-6">
            <p className="mb-4 font-medium">{description}</p>

            {formData && categoryTypes && (
              <div className="mb-4 rounded-lg bg-neutral-100 p-4">
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
            )}

            {isEditRequest && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-300">
                    عنوان درخواست
                  </label>
                  <BorderedInput
                    name="requestTitle"
                    containerClassName="mt-1.5"
                    type="text"
                    value={titleValue}
                    onInput={(event) => {
                      setTitleValue(event.currentTarget.value);
                    }}
                    placeholder="عنوان درخواست را وارد کنید..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-text-300">
                    توضیحات درخواست
                  </label>
                  <TextArea
                    name="requestDescription"
                    rows={3}
                    className="mt-1.5 w-full pt-1.5"
                    value={descriptionValue}
                    onChange={(event) => {
                      setDescriptionValue(event.currentTarget.value);
                    }}
                    placeholder="توضیحات درخواست را وارد کنید..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
            <Button
              type="button"
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-primary !px-7 hover:bg-primary/90 sm:!px-10"
              onClick={() =>
                onConfirm(
                  isEditRequest ? switchValue : undefined,
                  isEditRequest ? titleValue : undefined,
                  isEditRequest ? descriptionValue : undefined,
                )
              }>
              {actionName}
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
