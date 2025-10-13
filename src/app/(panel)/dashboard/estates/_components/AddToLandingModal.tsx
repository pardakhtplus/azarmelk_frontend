"use client";

import Button from "@/components/modules/buttons/Button";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import useEditLanding from "@/services/mutations/admin/landing/useEditLanding";
import { useLanding } from "@/services/queries/admin/landing/useLanding";
import { useLandingList } from "@/services/queries/admin/landing/useLandingList";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

interface AddToLandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateId: string;
}

export default function AddToLandingModal({
  isOpen,
  onClose,
  estateId,
}: AddToLandingModalProps) {
  const [selectedLandingId, setSelectedLandingId] = useState<string>("");
  const queryClient = useQueryClient();

  const { editLanding } = useEditLanding();

  // Fetch landing list
  const { landingList } = useLandingList({
    page: 1,
    limit: 100, // Get all landings
  });

  // Fetch selected landing details
  const { landing } = useLanding(selectedLandingId);

  const addToLandingHandler = async () => {
    if (!selectedLandingId) {
      toast.error("لطفا یک لندینگ انتخاب کنید");
      return false;
    }

    // Wait for landing data to be fetched
    const landingData = landing.data?.data;
    if (!landingData) {
      toast.error("خطا در دریافت اطلاعات لندینگ");
      return false;
    }

    // Check if estate is already in the landing
    const existingEstateIds = landingData.estates?.map((e) => e.id) || [];
    if (existingEstateIds.includes(estateId)) {
      toast.error("این فایل قبلاً به این لندینگ اضافه شده است");
      return false;
    }

    // Add current estate to existing estates
    const updatedEstateIds = [
      ...existingEstateIds.map((id) => ({ id })),
      { id: estateId },
    ];

    const res = await editLanding.mutateAsync({
      id: selectedLandingId,
      data: {
        title: landingData.title,
        description: landingData.description || "",
        slug: landingData.slug,
        estateIds: updatedEstateIds,
        landingId: landingData.id,
      },
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["landingList"] });
    queryClient.invalidateQueries({ queryKey: ["landing", selectedLandingId] });

    return true;
  };

  const handleSubmit = async () => {
    const success = await addToLandingHandler();
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedLandingId("");
    onClose();
  };

  return createPortal(
    <Modal
      isOpen={isOpen}
      title="افزودن به لندینگ"
      classNames={{
        background: "z-50 !py-0 !px-4",
        box: "!max-w-lg !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
        header: "!py-4",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}>
      <div className="px-6 pb-7 pt-6">
        <div className="mb-4">
          <p className="mb-3 text-sm text-gray-600">
            لندینگ مورد نظر را انتخاب کنید:
          </p>

          {landingList.isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-md bg-gray-200"
                />
              ))}
            </div>
          ) : landingList.data?.data?.length ? (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {landingList.data.data.map((landing) => (
                <button
                  key={landing.id}
                  onClick={() => setSelectedLandingId(landing.id)}
                  className={cn(
                    "w-full rounded-md border p-3 text-right transition-colors",
                    selectedLandingId === landing.id
                      ? "border-primary-blue bg-primary-blue/5"
                      : "border-gray-200 hover:bg-gray-50",
                  )}>
                  <div className="font-medium">{landing.title}</div>
                  <div className="text-sm text-gray-500">
                    {landing._count.estates} فایل
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              لندینگی موجود نیست
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
        <Button
          type="button"
          isLoading={editLanding.isPending}
          disabled={!selectedLandingId || editLanding.isPending}
          className="!px-7 sm:!px-10"
          onClick={handleSubmit}>
          {editLanding.isPending ? "در حال انجام..." : "افزودن"}
        </Button>
        <BorderedButton
          disabled={editLanding.isPending}
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
