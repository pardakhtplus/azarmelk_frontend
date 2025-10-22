import { ICheck, IPenToSquare } from "@/components/Icons";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { cn } from "@/lib/utils";
import { canPerform, hasPermission } from "@/permissions/hasPermission";
import { Action, Permissions, Subject } from "@/permissions/permission.types";
import useUploadFiles from "@/services/mutations/admin/bucket/useUploadFiles";
import useEditUser from "@/services/mutations/admin/users/useEditUser";
import { useGetUser } from "@/services/queries/admin/users/useGetUser";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, XIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BirthDatePicker from "./BirthDatePicker";

const userFormSchema = z.object({
  firstName: z
    .string({ message: "نام را وارد کنید!" })
    .min(2, { message: "نام را وارد کنید!" }),
  lastName: z
    .string({ message: "نام خانوادگی را وارد کنید!" })
    .min(2, { message: "نام خانوادگی را وارد کنید!" }),
  birthDate: z.any().optional(),
  phoneNumber: z
    .string()
    .regex(/^(\+98|0)?9\d{9}$/, { message: "شماره را درست وارد کنید!" }),
  email: z.string().optional(),
  fixPhoneNumber: z.string().optional(),
  address: z.string().optional(),
  education: z.string().optional(),
  avatar: z
    .object({
      url: z.string().optional(),
      file_name: z.string().optional(),
      key: z.string().optional(),
      mimeType: z.string().optional(),
    })
    .optional(),
});

export default function EditUser() {
  const { id } = useParams();
  const { user } = useGetUser({ id: id as string });
  const { uploadFiles } = useUploadFiles();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { editUser } = useEditUser();
  const { userInfo } = useUserInfo();
  // const { personal } = useGetPersonal({ id: id as string });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    values: {
      firstName: user.data?.data.firstName || "",
      lastName: user.data?.data.lastName || "",
      birthDate: user.data?.data.birthdate || "",
      phoneNumber: user.data?.data.phoneNumber || "",
      fixPhoneNumber: user.data?.data.fixPhoneNumber || "",
      address: user.data?.data.address || "",
      education: user.data?.data.education || "",
      email: user.data?.data.email || "",
      avatar: user.data?.data.avatar || undefined,
    },
  });

  // Cleanup object URL when avatar file changes or component unmounts
  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(URL.createObjectURL(avatarFile));
      }
    };
  }, [avatarFile]);

  const handleAvatarUpload = async (file: File) => {
    const result = await uploadFiles.mutateAsync(file);
    if (result && result.data && result.data.length > 0) {
      const uploadedFile = result.data[0];
      setAvatarFile(file);
      setValue("avatar", uploadedFile);
      return uploadedFile;
    }
    return null;
  };

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    const res = await editUser.mutateAsync({
      id: id as string,
      data: {
        ...data,
        userId: user.data?.data.id || "",
        birthDate: data.birthDate || "",
        avatar: undefined,
        ...(data.avatar && {
          avatar: {
            url: data.avatar.url || "",
            file_name: data.avatar.file_name || "",
            key: data.avatar.key || "",
            mimeType: data.avatar.mimeType || "",
          },
        }),
      },
    });

    if (res) {
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    }
  };

  return (
    <>
      <div className="pt-8">
        <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/10 p-4 xs:flex-row sm:gap-6 sm:p-6">
          {/* Avatar Section */}
          <div className="group relative">
            <div className="to-primary-300 relative size-24 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 p-1 shadow-lg sm:size-32">
              <div className="size-full overflow-hidden rounded-full bg-white">
                <Image
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : user.data?.data.avatar?.url ||
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
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100"
              onClick={() => fileInputRef.current?.click()}>
              <div className="flex flex-col items-center gap-1 text-white">
                <Upload className="size-6" />
                <span className="text-xs font-medium">تغییر تصویر</span>
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 text-center xs:text-start">
            <div>
              <h3 className="font-semibold text-gray-900 sm:text-lg">
                {user.data?.data.firstName} {user.data?.data.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {avatarFile
                  ? "تصویر جدید انتخاب شده - برای ثبت کلیک کنید"
                  : "روی تصویر کلیک کنید یا دکمه انتخاب را استفاده کنید"}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,image/HEIC"
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
                <>
                  <Button
                    variant="green"
                    size="sm"
                    onClick={async () => {
                      const uploadedFile = await handleAvatarUpload(avatarFile);
                      if (uploadedFile) {
                        await handleSubmit(onSubmit)();
                        setAvatarFile(null);
                      }
                    }}
                    isLoading={uploadFiles.isPending}
                    className="flex w-full items-center gap-2 xs:w-fit">
                    <ICheck className="size-4" />
                    ثبت تصویر
                  </Button>

                  <BorderedButton
                    size="sm"
                    onClick={() => setAvatarFile(null)}
                    className="flex w-full items-center gap-2 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50 xs:w-fit">
                    <XIcon className="size-4" />
                    لغو
                  </BorderedButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
          <h2 className="text-xl font-medium">اطلاعات عمومی</h2>
          {hasPermission(Permissions.OWNER, []) ? (
            <p className="rounded-md bg-red/10 px-3 py-1 text-sm text-red">
              غیر قابل ویرایش
            </p>
          ) : canPerform(
              Subject.USERS,
              Action.UPDATE,
              userInfo?.data?.data.accessPerms ?? [],
            ) ? (
            isEditingProfile ? (
              <div className="flex items-center gap-4">
                <BorderedButton
                  size="sm"
                  className="max-md:!size-11 max-md:!px-0"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setAvatarFile(null);
                    reset({
                      firstName: user.data?.data.firstName || "",
                      lastName: user.data?.data.lastName || "",
                      birthDate: user.data?.data.birthdate || "",
                      phoneNumber: user.data?.data.phoneNumber || "",
                      fixPhoneNumber: user.data?.data.fixPhoneNumber || "",
                      address: user.data?.data.address || "",
                      education: user.data?.data.education || "",
                      email: user.data?.data.email || "",
                    });
                  }}>
                  <span className="hidden md:block">انصراف</span>
                  <XIcon className="block size-6 md:hidden" />
                </BorderedButton>
                <Button
                  size="sm"
                  spinnerLoading={true}
                  className="max-md:!size-11 max-md:!px-0"
                  onClick={async () => {
                    await handleSubmit(onSubmit)();
                  }}
                  isLoading={editUser.isPending}>
                  <span className="hidden md:block">ثبت تغییرات</span>
                  <ICheck className="size-[18px]" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="blue"
                  size="sm"
                  className="max-md:!size-11 max-md:!px-0"
                  onClick={() => setIsEditingProfile(true)}>
                  <span className="hidden md:block">ویرایش</span>
                  <IPenToSquare className="size-[18px] md:mr-0.5" />
                </Button>
              </>
            )
          ) : null}
        </div>
        <div
          className={cn(
            "mt-5 grid grid-cols-2 items-start gap-x-7 gap-y-5 sm:grid-cols-4 lg:grid-cols-3",
            hasPermission(Permissions.OWNER, []) && "pointer-events-none",
          )}>
          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="firstName" className="font-medium">
              نام
            </label>
            <BorderedInput
              name="firstName"
              placeholder=""
              containerClassName="mb-2 mt-2"
              type="text"
              onClick={() => {
                if (!isEditingProfile) {
                  setIsEditingProfile(true);
                }
              }}
              register={register}
              error={errors.firstName}
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="lastName" className="font-medium">
              نام خانوادگی
            </label>
            <BorderedInput
              name="lastName"
              placeholder=""
              containerClassName="mb-2 mt-2"
              type="text"
              onClick={() => {
                if (!isEditingProfile) {
                  setIsEditingProfile(true);
                }
              }}
              register={register}
              error={errors.lastName}
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="email" className="font-medium">
              ایمیل
            </label>
            <div className="relative">
              <BorderedInput
                name="email"
                placeholder=""
                containerClassName="mb-2 mt-2"
                type="text"
                onClick={() => {
                  if (!isEditingProfile) {
                    setIsEditingProfile(true);
                  }
                }}
                register={register}
                error={errors.email}
                dir="auto"
              />
            </div>
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="phoneNumber" className="font-medium">
              شماره موبایل
            </label>
            <div className="relative">
              <BorderedInput
                name="phoneNumber"
                placeholder=""
                containerClassName="mb-2 mt-2"
                type="text"
                onClick={() => {
                  if (!isEditingProfile) {
                    setIsEditingProfile(true);
                  }
                }}
                register={register}
                error={errors.phoneNumber}
                dir="auto"
              />
            </div>
          </div>

          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="education" className="font-medium">
              تحصیلات
            </label>
            <div className="relative">
              <BorderedInput
                name="education"
                placeholder=""
                containerClassName="mb-2 mt-2"
                type="text"
                onClick={() => {
                  if (!isEditingProfile) {
                    setIsEditingProfile(true);
                  }
                }}
                register={register}
                error={errors.education}
              />
            </div>
          </div>
          <BirthDatePicker
            name="birthDate"
            control={control}
            label="تاریخ تولد"
            onClick={() => {
              if (!isEditingProfile) {
                setIsEditingProfile(true);
              }
            }}
          />
          <div className="col-span-2 w-full lg:col-span-1">
            <label htmlFor="fixPhoneNumber" className="font-medium">
              شماره تلفن ثابت
            </label>
            <div className="relative">
              <BorderedInput
                name="fixPhoneNumber"
                placeholder=""
                containerClassName="mb-2 mt-2"
                type="text"
                onClick={() => {
                  if (!isEditingProfile) {
                    setIsEditingProfile(true);
                  }
                }}
                register={register}
                error={errors.fixPhoneNumber}
                dir="auto"
              />
            </div>
          </div>
          <div className="col-span-2 w-full sm:col-span-4 lg:col-span-3">
            <label htmlFor="address" className="font-medium">
              آدرس
            </label>
            <div className="relative">
              <BorderedInput
                name="address"
                placeholder="آدرس کامل را وارد کنید"
                containerClassName="mb-2 mt-2"
                type="text"
                onClick={() => {
                  if (!isEditingProfile) {
                    setIsEditingProfile(true);
                  }
                }}
                register={register}
                error={errors.address}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
