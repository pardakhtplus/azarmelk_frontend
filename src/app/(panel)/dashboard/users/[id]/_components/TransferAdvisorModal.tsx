"use client";

import CustomImage from "@/components/modules/CustomImage";
import Modal from "@/components/modules/Modal";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import useEditAdviserEstates from "@/services/mutations/admin/estate/useEditAdviserEstates";
import { useState } from "react";
import { createPortal } from "react-dom";
import AdvisorSelector from "./AdvisorSelector";

type TAdvisor = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
  };
  _count: {
    createdEstates: number;
  };
};

interface TransferAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdvisor: TAdvisor;
  onSuccess?: () => void;
}

export default function TransferAdvisorModal({
  isOpen,
  onClose,
  currentAdvisor,
  onSuccess,
}: TransferAdvisorModalProps) {
  const [selectedAdvisor, setSelectedAdvisor] = useState<
    TAdvisor | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const { editAdviserEstates } = useEditAdviserEstates();

  const handleTransfer = async () => {
    if (!selectedAdvisor) return;

    setIsLoading(true);
    try {
      const result = await editAdviserEstates.mutateAsync({
        oldAdviserId: currentAdvisor.id,
        newAdviserId: selectedAdvisor.id,
      });

      if (result) {
        onClose();
        setSelectedAdvisor(undefined);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedAdvisor(undefined);
    }
  };

  return createPortal(
    <Modal
      isOpen={isOpen}
      title="انتقال املاک مشاور"
      classNames={{
        background: "z-[60] !py-0 !px-4",
        box: "!max-w-2xl !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
        header: "!py-4",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}>
      <div className="px-6 pb-7 pt-6">
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            انتقال املاک از:
          </h3>
          <div className="flex items-center gap-3 rounded-lg bg-neutral-100/80 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200">
              {currentAdvisor.avatar?.url ? (
                <CustomImage
                  src={currentAdvisor.avatar.url}
                  alt={`${currentAdvisor.firstName} ${currentAdvisor.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                  width={60}
                  height={60}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                  <span className="text-sm font-medium text-gray-600">
                    {currentAdvisor.firstName[0]}
                    {currentAdvisor.lastName[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-base font-medium text-gray-900">
                {currentAdvisor.firstName} {currentAdvisor.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {currentAdvisor.phoneNumber}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            انتقال به مشاور جدید:
          </h3>
          <AdvisorSelector
            value={selectedAdvisor}
            onChange={setSelectedAdvisor}
            exclude={currentAdvisor.id}
            placeholder="انتخاب مشاور جدید..."
          />
        </div>

        {selectedAdvisor && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">هشدار</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    با انجام این عملیات، تمامی املاک مربوط به &quot;
                    {currentAdvisor.firstName} {currentAdvisor.lastName}
                    &quot; به &quot;{selectedAdvisor.firstName}{" "}
                    {selectedAdvisor.lastName}&quot; منتقل خواهد شد. این عملیات
                    غیرقابل برگشت است.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
        <Button
          type="button"
          isLoading={isLoading}
          disabled={isLoading || !selectedAdvisor}
          action="SUBMIT"
          className="bg-blue-600 !px-7 hover:bg-blue-700 sm:!px-10"
          onClick={handleTransfer}>
          انتقال املاک
        </Button>
        <BorderedButton
          disabled={isLoading}
          type="button"
          className="!px-6 sm:!px-10"
          onClick={handleClose}>
          لغو
        </BorderedButton>
      </div>
    </Modal>,
    document.body,
  );
}
