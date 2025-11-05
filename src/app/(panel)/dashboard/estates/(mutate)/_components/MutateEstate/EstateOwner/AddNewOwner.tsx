"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import useMutateOwner from "@/services/mutations/admin/owner/useMutateOwner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  type UseFormClearErrors,
  type UseFieldArrayReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { type mutateEstateSchema } from "../MutateEstate";
import useUserMutateOwner from "@/services/mutations/client/dashboard/owner/useUserMutateOwner";

const formSchema = z.object({
  firstName: z.string({ message: "نام را وارد کنید!" }).optional(),
  lastName: z
    .string({ message: "نام خانوادگی را وارد کنید!" })
    .min(1, { message: "نام خانوادگی را وارد کنید!" }),
  phoneNumber: z
    .string({ message: "شماره شخص را وارد کنید!" })
    .min(1, { message: "شماره شخص را وارد کنید!" })
    .regex(/^09\d{9}$/, { message: "شماره همراه معتبر نیست!" }),
  position: z
    .string({ message: "سمت را وارد کنید!" })
    .optional()
    .default("مالک"),
  fixPhoneNumber: z.string().optional().or(z.literal("")),
});

export default function AddNewOwner({
  closeCheckModal,
  isOpenNewOwnerModal,
  setIsOpenNewOwnerModal,
  ownerPhone,
  owners,
  clearErrors,
  isUserPanel,
  existingUser,
}: {
  closeCheckModal?: () => void;
  isOpenNewOwnerModal: boolean;
  setIsOpenNewOwnerModal: (value: boolean) => void;
  ownerPhone: string;
  owners: UseFieldArrayReturn<z.infer<typeof mutateEstateSchema>, "owners">;
  clearErrors: UseFormClearErrors<z.infer<typeof mutateEstateSchema>>;
  isUserPanel?: boolean;
  existingUser?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    position?: string;
    fixPhoneNumber?: string;
  };
}) {
  const [isClient, setIsClient] = useState(false);

  const { mutateOwner: adminMutateOwner } = useMutateOwner();

  const { userMutateOwner } = useUserMutateOwner();

  const mutateOwner = isUserPanel ? userMutateOwner : adminMutateOwner;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: existingUser?.firstName || "",
      lastName: existingUser?.lastName || "",
      phoneNumber: ownerPhone,
      position: existingUser?.position || "مالک",
      fixPhoneNumber: existingUser?.fixPhoneNumber || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // For user panel, only allow adding fixPhoneNumber if it doesn't exist
    if (
      isUserPanel &&
      existingUser &&
      existingUser.fixPhoneNumber &&
      data.fixPhoneNumber !== existingUser.fixPhoneNumber
    ) {
      // Don't allow editing existing fixPhoneNumber in user panel
      data.fixPhoneNumber = existingUser.fixPhoneNumber;
    }

    const res = await mutateOwner.mutateAsync({
      id: existingUser?.id, // Pass ID for edit mode
      data: {
        firstName: data.firstName || "",
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        position: data.position || "مالک",
        fixPhoneNumber: data.fixPhoneNumber || undefined,
      },
    });

    if (!res) {
      return;
    }

    owners.append({
      ownerId: existingUser?.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      position: data.position || "مالک",
      fixPhoneNumber: data.fixPhoneNumber || undefined,
    });

    closeCheckModal?.();
    reset();
    setIsOpenNewOwnerModal(false);
    clearErrors("owners");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpenNewOwnerModal}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          title={existingUser ? "ویرایش اطلاعات مالک" : "افزودن شخص جدید"}
          classNames={{
            background: "z-50 !py-0 sm:!px-4 !px-0",
            box: "sm:!max-w-3xl sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
          }}
          onCloseModal={() => {
            setIsOpenNewOwnerModal(false);
            reset({ position: "مالک" });
          }}
          onClickOutside={() => {
            setIsOpenNewOwnerModal(false);
            reset({ position: "مالک" });
          }}>
          <div className="px-6 py-7">
            {/* Phone number display (read-only) */}
            <div className="mb-6 rounded-lg border border-primary-border/70 px-4 py-3">
              <label className="text-sm font-medium text-text-200">
                شماره همراه
              </label>
              <p className="dir-ltr mt-1 text-lg font-semibold text-gray-900">
                {ownerPhone}
              </p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-text-300">
                  نام
                </label>
                <BorderedInput
                  name="firstName"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.firstName}
                  placeholder="نام مالک را وارد کنید"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-text-300">
                  نام خانوادگی
                </label>
                <BorderedInput
                  name="lastName"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.lastName}
                  placeholder="نام خانوادگی مالک را وارد کنید"
                />
              </div>
            </div>

            <div className="mt-2">
              <div className="w-full">
                <label
                  htmlFor="position"
                  className="text-sm font-medium text-text-300">
                  سمت
                </label>
                <BorderedInput
                  name="position"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.position}
                  placeholder="سمت (پیش‌فرض: مالک)"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full">
                <label
                  htmlFor="fixPhoneNumber"
                  className="text-sm font-medium text-text-300">
                  شماره ثابت
                  {isUserPanel && existingUser?.fixPhoneNumber && (
                    <span className="mr-2 text-xs text-amber-500">
                      (قابل ویرایش نیست)
                    </span>
                  )}
                </label>
                <BorderedInput
                  name="fixPhoneNumber"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.fixPhoneNumber}
                  placeholder="02112345678"
                  className="text-left"
                  dir="ltr"
                  disabled={
                    isUserPanel && existingUser?.fixPhoneNumber ? true : false
                  }
                />
              </div>
            </div>
            <div className="mt-8 flex justify-start gap-x-3 border-t border-gray-200 pt-6">
              <Button
                className="min-w-[120px]"
                isLoading={mutateOwner.isPending}>
                {existingUser ? "ویرایش مالک" : "ثبت مالک"}
              </Button>
              <BorderedButton
                onClick={() => {
                  setIsOpenNewOwnerModal(false);
                  reset({ position: "مالک" });
                }}>
                لغو
              </BorderedButton>
            </div>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
