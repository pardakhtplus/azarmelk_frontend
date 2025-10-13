"use client";

import Button from "@/components/modules/buttons/Button";
import { getFeaturesForCategories } from "@/components/modules/estate/EstateUtils";
import {
  contractTypes,
  elevatorTypes,
} from "@/components/modules/estate/FeatureItems";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import {
  type DealType,
  type MainCategory,
  type PropertyType,
} from "@/lib/categories";
import { type TCategory } from "@/types/admin/category/types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { z } from "zod";
import type { mutateEstateSchema } from "../MutateEstate";
import DocumentIssueDatePicker from "./DocumentIssueDatePicker";
import ExitDatePicker from "./ExitDatePicker";
import SelectionItems from "./SelectionItems";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AddFeatures({
  watch,
  setValue,
  selectedCategories,
}: {
  watch: UseFormWatch<z.infer<typeof mutateEstateSchema>>;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateSchema>>;
  selectedCategories: TCategory[];
}) {
  const [isClient, setIsClient] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // استخراج اطلاعات دسته‌بندی
  const dealType = selectedCategories?.[0]?.dealType as DealType;
  const mainCategory = selectedCategories?.[1]?.mainCategory as MainCategory;
  const propertyType = selectedCategories?.[2]?.propertyType as PropertyType;

  // دریافت امکانات مخصوص این دسته‌بندی
  const features = getFeaturesForCategories(
    dealType,
    mainCategory,
    propertyType,
  );

  const isNoFeaturesAvailable = Object.keys(features).length === 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex items-center gap-x-2 rounded-full border border-primary-blue bg-white px-6 py-3 text-primary-blue shadow-sm transition-all hover:bg-primary-blue/5 active:scale-95",
          isNoFeaturesAvailable && "cursor-not-allowed opacity-50",
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!isNoFeaturesAvailable) {
            setIsOpenModal(true);
          } else {
            toast.error("امکانات موجود نیست");
          }
        }}>
        <PlusIcon className="size-5" />
        <p className="text-sm font-medium">افزودن امکانات</p>
      </button>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title="افزودن امکانات"
          classNames={{
            background: "z-50 !py-0 sm:!px-4 !px-0 sm:!pb-4",
            box: "sm:!max-w-5xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg !h-full !max-h-none sm:!mt-4",
            header: "top-0 rounded-t-lg",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          <div className="flex flex-col gap-y-8 p-6">
            {/* Iterate through each feature category */}
            {Object.entries(features).map(([categoryKey, featureCategory]) => (
              <div key={categoryKey}>
                <p className="text-base font-medium">
                  {featureCategory?.title || "مشخصه ملک"}
                </p>
                {featureCategory?.fields.map((group, groupIndex) => (
                  <React.Fragment key={group.label + groupIndex.toString()}>
                    <div className="mt-5">
                      <p className="mb-1 text-xs font-medium text-gray-800">
                        {group.title}
                      </p>
                      <SelectionItems
                        items={group.items}
                        selectedItems={(() => {
                          const properties = watch("properties");
                          return (
                            (properties?.[
                              group.label as keyof typeof properties
                            ] as string[]) || []
                          );
                        })()}
                        setSelectedItems={(items) => {
                          const currentProperties = watch("properties") || {};
                          setValue("properties", {
                            ...currentProperties,
                            [group.label]: items as string[],
                          });
                        }}
                        containerClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-sm gap-3"
                        multiple
                        itemClassName="flex items-center justify-center py-3 !px-0"
                      />
                    </div>
                    {/* تاریخ خروج مستاجر */}
                    {group.label === "residenceStatus" &&
                    watch("properties.residenceStatus")?.includes(
                      "سکونت مستاجر",
                    ) ? (
                      <div className="flex w-full flex-col gap-y-2 pt-3">
                        <label
                          htmlFor="properties.tenantExiteDate"
                          className="w-full text-sm">
                          تاریخ خروج مستاجر
                        </label>
                        <ExitDatePicker
                          name="properties.tenantExiteDate"
                          setValue={setValue}
                          watch={watch}
                        />
                      </div>
                    ) : null}

                    {/* نوع قرارداد */}
                    {group.label === "documents" &&
                    watch("properties.documents")?.includes("قراردادی") ? (
                      <div className="flex w-full flex-col gap-y-2 pt-4">
                        <label className="w-full text-sm">نوع قرارداد</label>
                        <SelectionItems
                          items={contractTypes.fields[0].items}
                          selectedItems={watch("properties.contractType") || []}
                          setSelectedItems={(items) => {
                            const currentProperties = watch("properties") || {};
                            setValue("properties", {
                              ...currentProperties,
                              contractType: items as string[],
                            });
                          }}
                          containerClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 !mt-1"
                          multiple
                          itemClassName="flex items-center justify-center py-2.5 text-sm"
                        />
                      </div>
                    ) : null}

                    {/* تاریخ صدور سند */}
                    {group.label === "documents" &&
                    (watch("properties.documents")?.includes("در دست اقدام") ||
                      watch("properties.documents")?.includes("پایانکار") ||
                      watch("properties.documents")?.includes("عدم خلافی")) ? (
                      <div className="flex w-full flex-col gap-y-2 pt-3">
                        <label
                          htmlFor="properties.documentIssueDate"
                          className="w-full text-sm">
                          تاریخ صدور سند
                        </label>
                        <DocumentIssueDatePicker
                          name="properties.documentIssueDate"
                          setValue={setValue}
                          watch={watch}
                        />
                      </div>
                    ) : null}

                    {/* مقدار وام */}
                    {group.label === "documents" &&
                    watch("properties.documents")?.includes("وام دار") ? (
                      <div className="flex w-full flex-col gap-y-2 pt-3">
                        <label
                          htmlFor="properties.loanAmount"
                          className="w-full text-sm">
                          مقدار وام (تومان)
                        </label>
                        <BorderedInput
                          name="properties.loanAmount"
                          placeholder="مقدار وام را وارد کنید"
                          value={watch("properties.loanAmount") || ""}
                          onChange={(e) => {
                            const currentProperties = watch("properties") || {};
                            setValue("properties", {
                              ...currentProperties,
                              loanAmount: e.target.value,
                            });
                          }}
                          isCurrency
                        />
                      </div>
                    ) : null}

                    {/* نوع آسانسور */}
                    {group.label === "commonsServices" &&
                    watch("properties.commonsServices")?.includes("آسانسور") ? (
                      <div className="flex w-full flex-col gap-y-2 pt-4">
                        <label className="w-full text-sm">نوع آسانسور</label>
                        <SelectionItems
                          items={elevatorTypes.fields[0].items}
                          selectedItems={watch("properties.elevatorType") || []}
                          setSelectedItems={(items) => {
                            const currentProperties = watch("properties") || {};
                            setValue("properties", {
                              ...currentProperties,
                              elevatorType: items as string[],
                            });
                          }}
                          containerClassName="grid grid-cols-2 sm:grid-cols-3 gap-2 !mt-1"
                          multiple
                          itemClassName="flex items-center justify-center py-2.5 text-sm"
                        />
                      </div>
                    ) : null}

                    {/* تعداد آسانسور نفر بر */}
                    {group.label === "commonsServices" &&
                    watch("properties.elevatorType")?.includes("نفر بر") ? (
                      <div className="flex w-full flex-col gap-y-2 pt-3">
                        <label
                          htmlFor="properties.passengerElevatorCount"
                          className="w-full text-sm">
                          تعداد آسانسور نفر بر
                        </label>
                        <BorderedInput
                          name="properties.passengerElevatorCount"
                          placeholder="تعداد آسانسور نفر بر"
                          value={
                            watch("properties.passengerElevatorCount") || ""
                          }
                          onChange={(e) => {
                            const currentProperties = watch("properties") || {};
                            setValue("properties", {
                              ...currentProperties,
                              passengerElevatorCount: e.target.value,
                            });
                          }}
                          type="number"
                        />
                      </div>
                    ) : null}

                    {/* تعداد آسانسور باری */}
                    {group.label === "commonsServices" &&
                    watch("properties.elevatorType")?.includes("باری") ? (
                      <div className="flex w-full flex-col gap-y-2 pt-3">
                        <label
                          htmlFor="properties.freightElevatorCount"
                          className="w-full text-sm">
                          تعداد آسانسور باری
                        </label>
                        <BorderedInput
                          name="properties.freightElevatorCount"
                          placeholder="تعداد آسانسور باری"
                          value={watch("properties.freightElevatorCount") || ""}
                          onChange={(e) => {
                            const currentProperties = watch("properties") || {};
                            setValue("properties", {
                              ...currentProperties,
                              freightElevatorCount: e.target.value,
                            });
                          }}
                          type="number"
                        />
                      </div>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            ))}

            <Button
              onClick={() => setIsOpenModal(false)}
              className="sticky bottom-4 w-full">
              بستن
            </Button>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
