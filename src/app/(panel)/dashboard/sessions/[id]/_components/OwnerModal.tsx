"use client";

import Button from "@/components/modules/buttons/Button";
import Modal from "@/components/modules/Modal";

export type TOwnerPreview = {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  position?: string;
  fixPhoneNumber?: string;
};

export default function OwnerModal({
  isOpen,
  onClose,
  owner,
  canSeeOwners,
}: {
  isOpen: boolean;
  onClose: () => void;
  owner: TOwnerPreview | null;
  canSeeOwners: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onClose}
      onClickOutside={onClose}
      title="اطلاعات مالک"
      classNames={{
        background: "z-[60] !py-0 sm:!px-4 !px-0",
        box: "sm:!max-w-md sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
      }}>
      <div className="px-6 py-6">
        {canSeeOwners ? (
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-500">نام و نام خانوادگی</label>
              <p className="mt-1">
                {`${owner?.firstName || ""} ${owner?.lastName || ""}`.trim() ||
                  "-"}
              </p>
            </div>
            <div>
              <label className="text-gray-500">شماره تماس</label>
              <p className="mt-1">{owner?.phoneNumber || "-"}</p>
            </div>
            <div>
              <label className="text-gray-500">سمت</label>
              <p className="mt-1">{owner?.position || "مالک"}</p>
            </div>
            <div>
              <label className="text-gray-500">شماره ثابت</label>
              <p className="mt-1" dir="ltr">
                {owner?.fixPhoneNumber || "-"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            شما دسترسی مشاهده اطلاعات مالک را ندارید.
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-x-3 px-6 pb-6">
        <Button
          type="button"
          className="bg-neutral-800 px-4 py-2 text-xs text-white hover:bg-neutral-700"
          onClick={onClose}>
          بستن
        </Button>
      </div>
    </Modal>
  );
}
