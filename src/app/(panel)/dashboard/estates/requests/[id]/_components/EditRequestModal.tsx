"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import TextArea from "@/components/modules/inputs/TextArea";
import Modal from "@/components/modules/Modal";
import {
  type TEditRequestInfo,
  type TRequest,
} from "@/types/admin/estate/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TRequest;
  onSave: (requestId: string, data: TEditRequestInfo) => Promise<boolean>;
  canEdit?: boolean;
}

export default function EditRequestModal({
  isOpen,
  onClose,
  request,
  onSave,
  canEdit = true,
}: EditRequestModalProps) {
  const [formData, setFormData] = useState({
    title: request.title || "",
    description: request.description || "",
    estateStatus: request.estateStatus,
    contractEndTime: request.contractEndTime || "",
  });

  // Reset form data when modal opens/closes or request changes
  useEffect(() => {
    if (isOpen) {
      // Reset to original values when modal opens
      setFormData({
        title: request.title || "",
        description: request.description || "",
        estateStatus: request.estateStatus,
        contractEndTime: request.contractEndTime || "",
      });
    } else {
      // Reset to original values when modal closes to ensure clean state
      setFormData({
        title: request.title || "",
        description: request.description || "",
        estateStatus: request.estateStatus,
        contractEndTime: request.contractEndTime || "",
      });
    }
  }, [
    isOpen,
    request.title,
    request.description,
    request.estateStatus,
    request.contractEndTime,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setFormData({
      title: request.title || "",
      description: request.description || "",
      estateStatus: request.estateStatus,
      contractEndTime: request.contractEndTime || "",
    });
  };

  const handleSubmit = async (_: any) => {
    // Basic validation
    if (!formData.title.trim() && !formData.description.trim()) {
      toast.error("حداقل یکی از فیلدهای عنوان یا توضیحات باید پر شود");
      return;
    }

    // Validate title length
    if (formData.title.length > 100) {
      toast.error("عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد");
      return;
    }

    // Validate description length
    if (formData.description.length > 500) {
      toast.error("توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد");
      return;
    }

    // Validate contract end time
    if (
      formData.contractEndTime &&
      new Date(formData.contractEndTime) <= new Date()
    ) {
      toast.error("تاریخ پایان قرارداد باید در آینده باشد");
      return;
    }

    setIsLoading(true);

    try {
      const editData: TEditRequestInfo = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        estateStatus: formData.estateStatus,
        status: request.status,
        changes: request.change,
        ...(request.file ? { file: request.file } : {}),
        ...(formData.contractEndTime
          ? { contractEndTime: formData.contractEndTime }
          : {}),
      };

      const success = await onSave(request.id, editData);
      if (success) {
        toast.success("درخواست با موفقیت ویرایش شد");
        onClose();
      } else {
        toast.error("خطا در ویرایش درخواست");
      }
    } catch (error) {
      console.error("Error editing request:", error);
      toast.error("خطا در ویرایش درخواست");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Check if request can be edited (only PENDING requests can be edited)
  if (request.status !== "PENDING") {
    return (
      <Modal
        isOpen={isOpen}
        title="عدم امکان ویرایش"
        onCloseModal={onClose}
        onClickOutside={onClose}
        classNames={{
          background: "z-50",
          box: "max-w-md",
        }}>
        <div className="p-6 text-center">
          <p className="mb-6 text-gray-600">
            فقط درخواست‌های در انتظار قابل ویرایش هستند.
          </p>
          <Button onClick={onClose} className="w-full">
            بستن
          </Button>
        </div>
      </Modal>
    );
  }

  if (!canEdit) {
    return (
      <Modal
        isOpen={isOpen}
        title="عدم دسترسی"
        onCloseModal={onClose}
        onClickOutside={onClose}
        classNames={{
          background: "z-50",
          box: "max-w-md",
        }}>
        <div className="p-6 text-center">
          <p className="mb-6 text-gray-600">
            شما مجوز ویرایش این درخواست را ندارید.
          </p>
          <Button onClick={onClose} className="w-full">
            بستن
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      title="ویرایش درخواست"
      onCloseModal={onClose}
      onClickOutside={onClose}
      onSubmit={handleSubmit}
      classNames={{
        background: "z-50 !py-0 !px-4",
        box: "!max-w-2xl !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
        header: "!py-4",
      }}>
      <div className="space-y-8 p-6">
        {/* Note about required fields */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            <strong>نکته:</strong> فیلدهای علامت‌دار با{" "}
            <span className="text-red-500">*</span> الزامی هستند. حداقل یکی از
            فیلدهای عنوان یا توضیحات باید پر شود.
          </p>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            عنوان درخواست <span className="text-red-500">*</span>
          </label>
          <BorderedInput
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="عنوان درخواست را وارد کنید"
            className="w-full transition-all focus:scale-[1.02]"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              عنوان کوتاه و واضح برای درخواست
            </p>
            <p
              className={`text-xs ${
                formData.title.length > 90
                  ? formData.title.length > 100
                    ? "text-red-500"
                    : "text-yellow-500"
                  : "text-gray-400"
              }`}>
              {formData.title.length}/100
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            توضیحات درخواست <span className="text-red-500">*</span>
          </label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="توضیحات درخواست را وارد کنید"
            rows={4}
            className="w-full transition-all focus:scale-[1.02]"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">توضیحات کامل و دقیق درخواست</p>
            <p
              className={`text-xs ${
                formData.description.length > 450
                  ? formData.description.length > 500
                    ? "text-red-500"
                    : "text-yellow-500"
                  : "text-gray-400"
              }`}>
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Contract End Time */}
        {/* <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            تاریخ پایان قرارداد
          </label>
          <input
            type="datetime-local"
            value={formData.contractEndTime}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contractEndTime: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-gray-500">
            این فیلد اختیاری است. در صورت خالی بودن، قرارداد بدون تاریخ پایان در
            نظر گرفته می‌شود.
          </p>
        </div> */}

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="flex-1">
            {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
          <BorderedButton
            type="button"
            onClick={handleReset}
            className="flex-1"
            variant="blue">
            بازنشانی
          </BorderedButton>
          <BorderedButton type="button" onClick={onClose} className="flex-1">
            انصراف
          </BorderedButton>
        </div>
      </div>
    </Modal>
  );
}
