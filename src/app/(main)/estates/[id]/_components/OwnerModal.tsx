"use client";

import { ILocationDotLight, IPhone, IUser } from "@/components/Icons";
import Modal from "@/components/modules/Modal";

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
}

interface OwnerModalProps {
  isOpen: boolean;
  owner: Owner | null;
  onClose: () => void;
}

export default function OwnerModal({
  isOpen,
  owner,
  onClose,
}: OwnerModalProps) {
  if (!owner) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="اطلاعات مالک"
      onCloseModal={onClose}
      onClickOutside={onClose}
      classNames={{
        box: "max-w-md !h-fit !max-h-none",
      }}>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* نام و نام خانوادگی */}
          <div className="flex items-center gap-3">
            <IUser className="size-5 text-text-300" />
            <div>
              <p className="text-sm text-text-300">نام و نام خانوادگی</p>
              <p className="font-medium">
                {owner.firstName} {owner.lastName}
              </p>
            </div>
          </div>

          {/* شماره تماس */}
          <div className="flex items-center gap-3">
            <IPhone className="size-5 text-text-300" />
            <div>
              <p className="mb-0.5 text-sm text-text-300">شماره تماس</p>
              <p className="font-medium" dir="ltr">
                {owner.phoneNumber}
              </p>
            </div>
          </div>

          {/* سمت */}

          <div className="flex items-center gap-3">
            <ILocationDotLight className="size-5 text-text-300" />
            <div>
              <p className="text-sm text-text-300">سمت</p>
              <p className="font-medium">{owner.position || "مالک"}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
