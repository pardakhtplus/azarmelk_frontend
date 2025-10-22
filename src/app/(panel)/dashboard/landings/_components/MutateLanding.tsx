"use client";

import CustomImage from "@/components/modules/CustomImage";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import {
  getDefaultPosterFileByCategory,
  getStatusInfo,
} from "@/components/modules/estate/EstateUtils";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Loader from "@/components/modules/Loader";
import Modal from "@/components/modules/Modal";
import { type ESTATE_ARCHIVE_STATUS, ESTATE_STATUS } from "@/enums";
import { type PropertyTypeEnum } from "@/lib/categories";
import { cn } from "@/lib/utils";
import useCreateLanding from "@/services/mutations/admin/landing/useCreateLanding";
import useEditLanding from "@/services/mutations/admin/landing/useEditLanding";
import { useLanding } from "@/services/queries/admin/landing/useLanding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ImageOffIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddEstate from "./addEstate/AddEstate";

export const mutateLandingSchema = z.object({
  title: z
    .string({ message: "عنوان لندینگ را وارد کنید!" })
    .min(1, { message: "عنوان لندینگ را وارد کنید!" }),
  description: z.string().optional(),
  slug: z.string().min(1, { message: "آدرس لندینگ را وارد کنید!" }),
  estateIds: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        estateCode: z.number().optional(),
        posterFile: z.object({ url: z.string().optional() }).optional(),
        propertyType: z.string().optional(),
        status: z.any().optional(),
        archiveStatus: z.any().optional(),
      }),
    )
    .optional(),
});

// Helper function to get estate status info using the existing utility
const getEstateDisplayStatus = (estate?: {
  status?: ESTATE_STATUS;
  archiveStatus?: ESTATE_ARCHIVE_STATUS;
}) => {
  if (!estate) {
    return {
      label: "نامشخص",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      dotColor: "bg-gray-500",
      badgeColor: "bg-gray-500",
    };
  }

  // Use the existing getStatusInfo function
  const statusInfo = getStatusInfo(
    estate.status || ESTATE_STATUS.PENDING,
    estate.archiveStatus || ("" as ESTATE_ARCHIVE_STATUS),
  );

  const status = statusInfo.mainStatus;

  if (!status) {
    return {
      label: "نامشخص",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      dotColor: "bg-gray-500",
      badgeColor: "bg-gray-500",
    };
  }

  // Convert the existing status colors to our UI format
  const bgColorMap: Record<string, string> = {
    "bg-orange-500/90": "bg-orange-50",
    "bg-green-500/90": "bg-green-50",
    "bg-gray-500/90": "bg-gray-50",
    "bg-red/90": "bg-red-50",
  };

  const textColorMap: Record<string, string> = {
    "bg-orange-500/90": "text-orange-700",
    "bg-green-500/90": "text-green-700",
    "bg-gray-500/90": "text-gray-700",
    "bg-red/90": "text-red-700",
  };

  const dotColorMap: Record<string, string> = {
    "bg-orange-500/90": "bg-orange-500",
    "bg-green-500/90": "bg-green-500",
    "bg-gray-500/90": "bg-gray-500",
    "bg-red/90": "bg-red-500",
  };

  const badgeColorMap: Record<string, string> = {
    "bg-orange-500/90": "bg-orange-500",
    "bg-green-500/90": "bg-green-500",
    "bg-gray-500/90": "bg-gray-500",
    "bg-red/90": "bg-red-500",
  };

  return {
    label: status.label,
    bgColor: bgColorMap[status.bgColor] || "bg-gray-50",
    textColor: textColorMap[status.bgColor] || "text-gray-700",
    dotColor: dotColorMap[status.bgColor] || "bg-gray-500",
    badgeColor: badgeColorMap[status.bgColor] || "bg-gray-500",
  };
};

export default function MutateLanding({
  children,
  className,
  isEdit,
  landingId,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  isEdit?: boolean;
  landingId?: string;
  title?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { landing } = useLanding(
    isOpenModal && landingId ? landingId : undefined,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof mutateLandingSchema>>({
    resolver: zodResolver(mutateLandingSchema),
    values: {
      title: landing?.data?.data.title || "",
      description: landing?.data?.data.description || "",
      slug: landing?.data?.data.slug || "",
      estateIds:
        landing?.data?.data.estates.map((estate) => ({
          id: estate.id,
          title: estate.title,
          estateCode: estate.estateCode,
          posterFile: estate.posterFile,
          propertyType: estate.category.propertyType,
          status: estate.status,
          archiveStatus: estate.archiveStatus,
        })) || [],
    },
  });
  const queryClient = useQueryClient();
  const { createLanding } = useCreateLanding();
  const { editLanding } = useEditLanding();

  async function onSubmit(values: z.infer<typeof mutateLandingSchema>) {
    let res: any;

    if (isEdit) {
      res = await editLanding.mutateAsync({
        id: landingId || "",
        data: {
          title: values.title,
          description: values.description || "",
          slug: values.slug || "",
          landingId: landingId || "",
          estateIds:
            values.estateIds?.map((estate) => ({
              id: estate.id,
            })) || [],
        },
      });
    } else {
      res = await createLanding.mutateAsync({
        title: values.title,
        description: values.description || "",
        slug: values.slug || "",
        estateIds:
          values.estateIds?.map((estate) => ({
            id: estate.id,
          })) || [],
      });
    }

    if (!res) return;

    queryClient.invalidateQueries({
      queryKey: ["landingList"],
    });

    setIsOpenModal(false);
    reset();
  }

  useEffect(() => {
    if (!isOpenModal) {
      reset();
    }
  }, [isOpenModal, reset]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <button
        title={title}
        type="button"
        className={cn(className)}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpenModal(true);
        }}>
        {children}
      </button>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title={
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm font-normal sm:gap-x-2 sm:text-base">
              {isEdit ? (
                <span className="font-medium">
                  ویرایش لندینگ {landing?.data?.data.title}
                </span>
              ) : (
                <span className="font-medium">افزودن لندینگ جدید</span>
              )}
            </div>
          }
          classNames={{
            background: "z-50 !py-0 sm:!px-4 !px-0",
            box: "sm:!max-w-2xl sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          {landing.isLoading ? (
            <div className="flex flex-col gap-y-3 px-6 py-7">
              <div className="flex items-center justify-center gap-x-4 pb-7">
                <Loader />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-y-3 px-6 py-7">
                <div className="">
                  <p className="text-sm">عنوان لندینگ را وارد کنید</p>
                  <BorderedInput
                    register={register}
                    name="title"
                    error={errors.title}
                    containerClassName="mb-2 mt-2"
                    type="text"
                  />
                </div>
                <div className="h-fit w-full">
                  <label
                    htmlFor="description"
                    className="mb-2 flex items-center justify-start gap-x-1 text-sm">
                    <span>توضیحات را وارد کنید (اختیاری)</span>
                  </label>
                  <div className="relative w-full">
                    <textarea
                      id="description"
                      className={cn(
                        "bordered-input h-auto rounded-xl py-2",
                        errors.description && "!border-[#ff0000]",
                      )}
                      rows={4}
                      {...register("description")}
                    />
                  </div>
                  {errors.description ? (
                    <p className="pt-1 text-start text-xs text-[#ff0000]">
                      {errors.description?.message}
                    </p>
                  ) : null}
                </div>
                <div className="">
                  <p className="text-sm">آدرس لندینگ را وارد کنید</p>
                  <BorderedInput
                    register={register}
                    name="slug"
                    error={errors.slug}
                    containerClassName="mb-2 mt-2"
                    type="text"
                  />
                </div>
                <div className="">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        فایل های مرتبط
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {watch("estateIds")?.length || 0} فایل انتخاب شده
                      </p>
                    </div>
                    {(watch("estateIds")?.length || 0) > 0 && (
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                        <div className="size-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-blue-700">
                          {watch("estateIds")?.length} فایل
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {watch("estateIds")?.map((estate) => (
                      <div
                        key={estate.id}
                        className="group relative flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary-blue/30 hover:shadow-md">
                        {/* Estate Image */}
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {estate.posterFile?.url ||
                          getDefaultPosterFileByCategory({
                            propertyType:
                              estate.propertyType as PropertyTypeEnum,
                          }) ? (
                            <CustomImage
                              src={
                                estate.posterFile?.url ||
                                getDefaultPosterFileByCategory({
                                  propertyType:
                                    estate.propertyType as PropertyTypeEnum,
                                })
                              }
                              alt={estate.title}
                              width={64}
                              height={64}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-gray-100">
                              <ImageOffIcon className="size-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Estate Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-primary-blue">
                                {estate.title}
                              </h4>

                              <div className="mt-2 flex items-center gap-3">
                                {estate.estateCode && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">
                                      کد:
                                    </span>
                                    <span className="text-xs font-medium text-gray-700">
                                      {estate.estateCode}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-1 rounded-full ${getEstateDisplayStatus(estate).bgColor} px-2 py-1`}>
                          <div
                            className={`size-2 rounded-full ${getEstateDisplayStatus(estate).dotColor}`}
                          />
                          <span
                            className={`text-xs font-medium ${getEstateDisplayStatus(estate).textColor}`}>
                            {getEstateDisplayStatus(estate).label}
                          </span>
                        </div>

                        {/* Remove Button (Optional - for future use) */}
                        <button
                          type="button"
                          className="rounded-full p-1 text-red-500 transition-opacity hover:bg-red-50"
                          onClick={() => {
                            setValue(
                              "estateIds",
                              watch("estateIds")?.filter(
                                (e) => e.id !== estate.id,
                              ),
                            );
                          }}>
                          <XIcon className="size-5" />
                        </button>
                      </div>
                    ))}

                    {/* Add Estate Button */}
                    <div className="mt-4 w-full">
                      <AddEstate
                        setValue={setValue}
                        defaultEstates={watch("estateIds") || []}
                      />
                    </div>
                  </div>

                  {/* Empty State */}
                  {/* {(!watch("estateIds") ||
                    watch("estateIds")?.length === 0) && (
                    <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100">
                        <svg
                          className="size-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-sm font-medium text-gray-900">
                        هیچ فایلی انتخاب نشده
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        برای شروع، فایل های مورد نظر خود را اضافه کنید
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-4 pb-7">
                <Button
                  type="button"
                  className="!px-10"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={createLanding.isPending || editLanding.isPending}>
                  {isEdit ? "ویرایش" : "افزودن"}
                </Button>
                <BorderedButton
                  type="button"
                  className="!px-10"
                  onClick={() => setIsOpenModal(false)}>
                  لغو
                </BorderedButton>
              </div>
            </>
          )}
        </Modal>,
        document.body,
      )}
    </>
  );
}
