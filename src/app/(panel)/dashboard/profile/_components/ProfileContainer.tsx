"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import {
  ICheck,
  IKey,
  IPenToSquare,
  IRightFromBracket,
} from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import Input from "@/components/modules/inputs/Input";
import { cn, logout } from "@/lib/utils";
import useEditUserInfo from "@/services/mutations/client/auth/useEditUserInfo";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import useUploadFiles from "@/services/mutations/admin/bucket/useUploadFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BirthDatePicker from "./BirthDatePicker";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import { XIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";

const NotificationModal = dynamic(
  () => import("@/components/modules/NotificationModal"),
  {
    ssr: false,
  },
);

const profileFormSchema = z.object({
  firstName: z
    .string({ message: "نام را وارد کنید!" })
    .min(2, { message: "نام را وارد کنید!" }),
  lastName: z
    .string({ message: "نام خانوادگی را وارد کنید!" })
    .min(2, { message: "نام خانوادگی را وارد کنید!" }),
  birthDate: z.string().optional(),
});

export default function ProfileContainer() {
  const { userInfo } = useUserInfo();
  const { editProfile } = useEditUserInfo();
  const { uploadFiles } = useUploadFiles();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Cleanup object URL when avatar file changes or component unmounts
  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(URL.createObjectURL(avatarFile));
      }
    };
  }, [avatarFile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: {
      firstName: userInfo.data?.data.firstName || "",
      lastName: userInfo.data?.data.lastName || "",
      birthDate: userInfo.data?.data.birthdate || "",
    },
  });

  const handleAvatarUpload = async (file: File) => {
    const result = await uploadFiles.mutateAsync(file);
    if (result && result.data && result.data.length > 0) {
      const uploadedFile = result.data[0];
      setAvatarFile(file);
      return uploadedFile;
    }
    return null;
  };

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    let avatarData:
      | {
          url: string;
          file_name: string;
          key: string;
          mimeType: string;
        }
      | undefined = undefined;

    // If there's a new avatar file, upload it first
    if (avatarFile) {
      const uploadedFile = await handleAvatarUpload(avatarFile);
      if (!uploadedFile) {
        toast.error("خطا در آپلود تصویر پروفایل");
        return;
      }
      avatarData = uploadedFile;
    }

    const res = await editProfile.mutateAsync({
      ...data,
      birthDate: data.birthDate || "",
      avatar: avatarData,
    });

    if (res) {
      setIsEditing(false);
      setAvatarFile(null);
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    }
  };

  return (
    <>
      <PanelBodyHeader
        isLoading={userInfo.isLoading}
        title={
          (userInfo.data?.data.firstName || "") +
          " " +
          (userInfo.data?.data.lastName || "")
        }
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link> /{" "}
            <span className="text-primary-300">
              {userInfo.data?.data.firstName || ""}{" "}
              {userInfo.data?.data.lastName || ""}
            </span>
          </>
        }>
        {isEditing ? (
          <>
            <BorderedButton
              className="max-md:!size-11 max-md:!px-0"
              onClick={() => setIsEditing(false)}>
              <span className="hidden md:block">انصراف</span>
              <XIcon className="block size-6 md:hidden" />
            </BorderedButton>
            <Button
              spinnerLoading={true}
              className="max-md:!size-11 max-md:!px-0"
              onClick={async () => {
                await handleSubmit(onSubmit)();
              }}
              isLoading={editProfile.isPending || uploadFiles.isPending}>
              <span className="hidden md:block">ثبت تغییرات</span>
              <ICheck className="size-5" />
            </Button>
          </>
        ) : (
          <>
            <NotificationModal
              variant="borderedButton"
              actionName="تغییر"
              actionClassName="bg-primary"
              title="تغییر رمز عبور"
              onSubmit={async () => {
                router.push("/auth/password");
                return true;
              }}
              description="آیا میخواهید رمز عبور خود را تغییر دهید؟"
              className="max-md:!size-11 max-md:!px-0">
              <span className="hidden md:block">رمز عبور</span>
              <IKey className="size-5" />
            </NotificationModal>
            <Button
              variant="blue"
              className="max-md:!size-11 max-md:!px-0"
              onClick={() => setIsEditing(true)}>
              <span className="hidden md:block">ویرایش</span>
              <IPenToSquare className="size-5 md:mr-0.5" />
            </Button>

            <NotificationModal
              colorVariant="red"
              title="خروج"
              description="آیا از خروج از حساب مطمئن هستید؟"
              className="max-md:!size-11 max-md:!px-0"
              aria-label="خروج"
              actionName="خروج"
              onSubmit={async () => {
                await logout();

                return true;
              }}>
              <span className="hidden md:block">خروج</span>
              <IRightFromBracket className="size-5 md:mr-0.5" />
            </NotificationModal>
          </>
        )}
      </PanelBodyHeader>

      <div className="pt-8">
        <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/10 p-4 xs:flex-row sm:gap-6 sm:p-6">
          {/* Avatar Section */}
          <div className="group relative">
            <div className="to-primary-300 relative size-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 p-1 shadow-lg sm:size-32">
              <div className="size-full overflow-hidden rounded-full bg-white">
                <Image
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : userInfo.data?.data.avatar?.url ||
                        "/images/profile-placeholder.jpg"
                  }
                  alt="avatar"
                  width={160}
                  height={160}
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* Upload Overlay */}
            {isEditing && (
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100"
                onClick={() => fileInputRef.current?.click()}>
                <div className="flex flex-col items-center gap-1 text-white">
                  <Upload className="size-6" />
                  <span className="text-xs font-medium">تغییر تصویر</span>
                </div>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 text-center xs:text-start">
            <div>
              <h3 className="font-semibold text-gray-900 sm:text-lg">
                {userInfo.data?.data.firstName} {userInfo.data?.data.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {!isEditing
                  ? "برای تغییر تصویر، حالت ویرایش را فعال کنید"
                  : avatarFile
                    ? "تصویر جدید انتخاب شده - با ثبت تغییرات آپلود خواهد شد"
                    : "روی تصویر کلیک کنید یا دکمه انتخاب را استفاده کنید"}
              </p>
            </div>

            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                    }
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-2 xs:w-fit">
                    <Upload className="size-4" />
                    انتخاب تصویر جدید
                  </Button>

                  {avatarFile && (
                    <BorderedButton
                      size="sm"
                      onClick={() => setAvatarFile(null)}
                      className="flex w-full items-center gap-2 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50 xs:w-fit">
                      <XIcon className="size-4" />
                      حذف تصویر
                    </BorderedButton>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 items-start gap-x-7 gap-y-5 md:grid-cols-3">
        <div className="col-span-2 w-full sm:col-span-1">
          <label htmlFor="firstName" className="font-medium">
            نام
          </label>
          <Input
            name="firstName"
            disabled={!isEditing}
            placeholder=""
            containerClassName="mb-2 mt-2"
            className={cn(
              "!cursor-not-allowed",
              isEditing &&
                "!cursor-text border-[1.5px] bg-transparent transition-all focus:border-neutral-400",
            )}
            type="text"
            register={register}
            error={errors.firstName}
          />
        </div>
        <div className="col-span-2 w-full sm:col-span-1">
          <label htmlFor="lastName" className="font-medium">
            نام خانوادگی
          </label>
          <Input
            name="lastName"
            disabled={!isEditing}
            placeholder=""
            containerClassName="mb-2 mt-2"
            className={cn(
              "!cursor-not-allowed",
              isEditing &&
                "!cursor-text border-[1.5px] bg-transparent transition-all focus:border-neutral-400",
            )}
            type="text"
            register={register}
            error={errors.lastName}
          />
        </div>
        <BirthDatePicker
          name="birthDate"
          control={control}
          label="تاریخ تولد"
          disabled={!isEditing}
        />
        <div className="col-span-2 w-full sm:col-span-1">
          <label htmlFor="phoneNumber" className="font-medium">
            شماره موبایل
          </label>
          <div className="relative">
            <Input
              name="phoneNumber"
              disabled
              placeholder=""
              containerClassName="mb-2 mt-2"
              className="!cursor-not-allowed !text-gray-800"
              type="text"
              defaultValue={userInfo.data?.data.phoneNumber}
            />
            <NotificationModal
              actionName="تغییر"
              actionClassName="bg-primary"
              title="تغییر شماره موبایل"
              onSubmit={async () => {
                router.push("/auth/change-number");
                return true;
              }}
              description="آیا میخواهید شماره موبایل خود را تغییر دهید؟"
              className="absolute bottom-0 left-0 top-0 m-auto ml-2 flex aspect-square size-11 items-center justify-center rounded-md bg-primary text-white transition-all hover:brightness-90">
              <IPenToSquare className="size-5" />
            </NotificationModal>
          </div>
        </div>
      </div>
    </>
  );
}
