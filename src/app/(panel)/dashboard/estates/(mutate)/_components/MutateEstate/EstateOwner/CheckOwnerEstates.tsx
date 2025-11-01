"use client";

import CustomImage from "@/components/modules/CustomImage";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useOwnerEstateList } from "@/services/queries/admin/owner/useOwnerEstateList";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { useUserOwnerEstateList } from "@/services/queries/client/dashboard/owner/useUserOwnerEstateList";
import { ImageOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  type UseFieldArrayReturn,
  type UseFormClearErrors,
} from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import { type mutateEstateSchema } from "../MutateEstate";
import AddNewOwner from "./AddNewOwner";
import Link from "next/link";

// The actual component
export default function CheckOwnerEstates({
  children,
  className,
  owners,
  categoryId,
  clearErrors,
  isUserPanel,
}: {
  children: React.ReactNode;
  className?: string;
  owners: UseFieldArrayReturn<z.infer<typeof mutateEstateSchema>, "owners">;
  categoryId?: string;
  clearErrors: UseFormClearErrors<z.infer<typeof mutateEstateSchema>>;
  isUserPanel?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isOpenNewOwnerModal, setIsOpenNewOwnerModal] = useState(false);
  const [isCheckingOwner, setIsCheckingOwner] = useState(false);
  const { userInfo } = useUserInfo();

  const canManageUsers =
    userInfo?.data?.data.accessPerms.includes(Permissions.EDIT_USERS) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER);

  // Query to check if owner exists and get their estates
  const { ownerEstateList } = useOwnerEstateList({
    phoneNumber: ownerPhone,
    categoryId: categoryId || "",
    enabled: isCheckingOwner && ownerPhone.length === 11 && !!categoryId,
  });

  const { userOwnerEstateList } = useUserOwnerEstateList({
    phoneNumber: ownerPhone,
    categoryId: categoryId || "",
    enabled: isCheckingOwner && ownerPhone.length === 11 && !!categoryId,
  });

  // Extract the actual data from the query response
  const ownerData = isUserPanel
    ? userOwnerEstateList?.data
    : ownerEstateList?.data;
  const isLoading = isUserPanel
    ? userOwnerEstateList?.isLoading
    : ownerEstateList?.isLoading;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset checking state when phone changes
  useEffect(() => {
    setIsCheckingOwner(false);
  }, [ownerPhone]);

  useEffect(() => {
    if (!isOpenModal) {
      setOwnerPhone("");
      setIsCheckingOwner(false);
    }
  }, [isOpenModal]);

  const handleCheckOwner = () => {
    if (ownerPhone.length !== 11) {
      toast.error("شماره باید ۱۱ رقم باشد!");
      return;
    }
    if (!categoryId) {
      toast.error("لطفا ابتدا منطقه را انتخاب کنید!");
      return;
    }
    setIsCheckingOwner(true);
  };

  const handleConfirmOwner = () => {
    if (ownerData?.user) {
      // Add existing owner to the form
      owners.append({
        ownerId: ownerData.user.id,
        firstName: ownerData.user.firstName,
        lastName: ownerData.user.lastName,
        phoneNumber: ownerData.user.phoneNumber,
        position: ownerData.user.position || "مالک",
        fixPhoneNumber: ownerData.user.fixPhoneNumber,
      });
      setIsOpenModal(false);
      setOwnerPhone("");
      setIsCheckingOwner(false);
      toast.success("مالک با موفقیت اضافه شد!");
      clearErrors("owners");
    }
  };

  const handleAddNewOwner = () => {
    setIsOpenNewOwnerModal(true);
  };

  if (!isClient) return null;

  return (
    <>
      <button
        type="button"
        className={cn(className)}
        onClick={() => setIsOpenModal(true)}>
        {children}
      </button>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title="افزودن شخص جدید"
          classNames={{
            background: "z-50 !py-0 !px-0 sm:!px-4",
            box: "sm:!max-w-2xl max-h-full sm:!max-h-[95%] overflow-x-hidden !max-w-none !h-fit flex flex-col justify-between rounded-none sm:rounded-xl",
            header: "sticky top-0 z-10 bg-white",
          }}
          onCloseModal={() => {
            setIsOpenModal(false);
            setOwnerPhone("");
            setIsCheckingOwner(false);
          }}
          onClickOutside={() => {
            setIsOpenModal(false);
            setOwnerPhone("");
            setIsCheckingOwner(false);
          }}>
          <div className="px-6 py-7">
            <div className="">
              <label htmlFor="" className="text-sm">
                شماره شخص را وارد کنید{" "}
              </label>
              <BorderedInput
                name="title"
                type="number"
                containerClassName="mt-2"
                className="text-left"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                dir="ltr"
                placeholder="09123456789"
              />
            </div>

            {/* Show loading state while checking */}
            {isCheckingOwner && isLoading && (
              <div className="mt-7 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-2 text-sm text-gray-600">در حال بررسی...</p>
              </div>
            )}

            {/* Show owner estates if they exist */}
            {isCheckingOwner && !isLoading && (
              <div className="mt-7">
                {ownerData?.user ? (
                  <>
                    <div className="mb-4 rounded-lg bg-blue-50 p-4">
                      <p className="text-center text-lg font-medium text-blue-800">
                        کاربر با شماره {ownerPhone} یافت شد!
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-center gap-x-2">
                          <span className="text-sm font-medium text-blue-700">
                            نام:
                          </span>
                          <span className="text-sm text-blue-600">
                            {ownerData.user.firstName} {ownerData.user.lastName}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                          <span className="text-sm font-medium text-blue-700">
                            سمت:
                          </span>
                          <span className="text-sm text-blue-600">
                            {ownerData.user.position || "مالک"}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                          <span className="text-sm font-medium text-blue-700">
                            شماره ثابت:
                          </span>
                          <span className="text-sm text-blue-600">
                            {ownerData.user.fixPhoneNumber || (
                              <span className="font-medium text-amber-600">
                                ندارد
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {ownerData.estates && ownerData.estates.length > 0 ? (
                      <>
                        <p className="mb-4 text-center text-lg text-amber-600">
                          ⚠️ این مالک قبلاً در این دسته‌بندی فایل‌هایی دارد!
                        </p>
                        <div className="flex flex-col gap-y-4">
                          {ownerData.estates.map((estate) => (
                            <Link
                              href={`/estates/${estate.id}`}
                              target="_blank"
                              key={estate.id}
                              className="flex h-36 gap-x-5 rounded-xl border border-primary-border p-3">
                              <div className="relative aspect-[16/11] h-full overflow-hidden rounded-lg">
                                {estate.posterFile?.url ? (
                                  <CustomImage
                                    src={estate.posterFile?.url}
                                    alt="estate-owner-check"
                                    width={400}
                                    height={300}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="flex size-full items-center justify-center bg-gray-100">
                                    <ImageOffIcon className="size-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-y-2 pt-2">
                                <p className="font-semibold">{estate.title}</p>
                                <p className="text-sm text-text-200">
                                  کد: {estate.estateCode}
                                </p>
                                <p className="text-xs text-gray-500">
                                  تاریخ:{" "}
                                  {new Date(
                                    estate.createdAt,
                                  ).toLocaleDateString("fa-IR")}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <p className="mt-4 text-center text-sm text-amber-600">
                          لطفاً از عدم تکرار فایل اطمینان حاصل کنید
                        </p>
                      </>
                    ) : (
                      <p className="text-center text-lg text-green-600">
                        این کاربر در این دسته‌بندی فایلی ندارد
                      </p>
                    )}

                    <div className="mt-6 flex justify-center gap-x-4">
                      <Button
                        type="button"
                        className="w-full max-w-xs"
                        onClick={handleConfirmOwner}>
                        تایید و اضافه کردن
                      </Button>
                      {isUserPanel || !canManageUsers ? null : (
                        <BorderedButton
                          type="button"
                          className="w-full max-w-xs"
                          onClick={() => {
                            setIsOpenNewOwnerModal(true);
                          }}>
                          ویرایش اطلاعات
                        </BorderedButton>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-7 text-center">
                    <p className="text-lg text-gray-600">
                      مالکی با این شماره یافت نشد
                    </p>
                    <div className="mt-6 flex justify-center gap-x-4">
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleAddNewOwner}>
                        ایجاد مالک جدید
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show initial action buttons when not checking */}
            {!isCheckingOwner && (
              <div className="flex justify-center gap-x-4 pt-7">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleCheckOwner}>
                  بررسی مالک
                </Button>
                <BorderedButton
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setIsOpenModal(false);
                    setOwnerPhone("");
                  }}>
                  لغو
                </BorderedButton>
              </div>
            )}
          </div>
        </Modal>,
        document.body,
      )}
      <AddNewOwner
        ownerPhone={ownerPhone}
        closeCheckModal={() => setIsOpenModal(false)}
        isOpenNewOwnerModal={isOpenNewOwnerModal}
        setIsOpenNewOwnerModal={setIsOpenNewOwnerModal}
        owners={owners}
        clearErrors={clearErrors}
        existingUser={ownerData?.user}
        isUserPanel={isUserPanel}
      />
    </>
  );
}
