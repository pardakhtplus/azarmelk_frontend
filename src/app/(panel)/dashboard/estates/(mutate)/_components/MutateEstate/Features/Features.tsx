import { getFeaturesForCategories } from "@/components/modules/estate/EstateUtils";
import {
  type DealType,
  type MainCategory,
  type PropertyType,
} from "@/lib/categories";
import { type TCategory } from "@/types/admin/category/types";
import { XIcon } from "lucide-react";
import { type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { z } from "zod";
import type { mutateEstateSchema } from "../MutateEstate";
import AddFeatures from "./AddFeatures";

// Helper function to find the category title for a specific item
const findCategoryTitleForItem = (
  features: any,
  fieldName: string,
  itemValue: string,
): string => {
  // Look through all feature categories to find the item
  for (const categoryKey in features) {
    const featureCategory = features[categoryKey];
    if (!featureCategory?.fields) continue;

    for (const group of featureCategory.fields) {
      if (
        group.label === fieldName &&
        group.items &&
        group.items.includes(itemValue)
      ) {
        // ترکیب mainTitle (featureCategory.title) و title (group.title)
        // مثال: "ویژگی‌های معماری/سبک"
        const mainTitle = featureCategory.title;
        const subTitle = group.title;

        if (subTitle && subTitle !== mainTitle) {
          return `${mainTitle}/${subTitle}`;
        }
        return mainTitle;
      }
    }
  }
  return getDefaultTitle(fieldName);
};

// Default titles for each field label
const getDefaultTitle = (fieldName: string): string => {
  const titleMap: Record<string, string> = {
    architectureStyle: "سبک",
    architectureStatus: "وضعیت",
    architectureSpaces: "فضاها",
    property: "مشخصه ملک",
    facadeMaterials: "مصالح",
    facadeStyle: "سبک",
    commonsFeatures: "امکانات تفریحی",
    commonsSpaces: "فضاهای خارجی",
    commonsServices: "امنیت و خدمات",
    coolingHeating: "سرمایش و گرمایش",
    floorCovering: "کف",
    wallAndCeiling: "سقف و دیوار",
    kitchenCabinet: "کابینت",
    kitchenCabinetPanel: "صفحه کابینت",
    kitchenEquipment: "تجهیزات",
    kitchenSpaces: "فضاها",
    wcType: "سرویس بهداشتی",
    otherFacilitiesSpaces: "فضاها",
    facilities: "امکانات",
    points: "امتیازات",
    parking: "پارکینگ",
    documents: "سند",
    documentType: "نوع سند",
    residenceStatus: "وضعیت سکونت",
    elevatorType: "نوع آسانسور",
  };
  return titleMap[fieldName] || fieldName;
};

export default function Features({
  watch,
  setValue,
  selectedCategories,
}: {
  watch: UseFormWatch<z.infer<typeof mutateEstateSchema>>;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateSchema>>;
  selectedCategories: TCategory[];
}) {
  // استخراج اطلاعات دسته‌بندی برای دریافت امکانات
  const dealType = selectedCategories?.[0]?.dealType as DealType;
  const mainCategory = selectedCategories?.[1]?.mainCategory as MainCategory;
  const propertyType = selectedCategories?.[2]?.propertyType as PropertyType;

  // دریافت امکانات مخصوص این دسته‌بندی
  const features = getFeaturesForCategories(
    dealType,
    mainCategory,
    propertyType,
  );

  // Get all selected features from the form
  const properties = watch("properties") || {};

  // Create an array of all selected feature items with their labels
  const allSelectedFeatures: Array<{
    label: string;
    value: string;
    title: string;
  }> = [];

  // Iterate through all properties and collect selected items
  Object.entries(properties).forEach(([fieldLabel, items]) => {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item: string) => {
        allSelectedFeatures.push({
          label: fieldLabel,
          value: item,
          title: findCategoryTitleForItem(features, fieldLabel, item),
        });
      });
    }
  });

  return (
    <div className="pt-6">
      <p className="-mb-0.5 font-medium">امکانات</p>
      <div className="flex flex-wrap items-center gap-4 pt-5">
        {allSelectedFeatures.map((feature, index) => (
          <FeaturesItem
            key={`${feature.label}-${feature.value}-${index}`}
            title={feature.title}
            value={feature.value}
            setValue={setValue}
            watch={watch}
            fieldName={`properties.${feature.label}`}
            type="array"
          />
        ))}

        {/* Special handling for tenantExiteDate */}
        {watch("properties.tenantExiteDate") && (
          <FeaturesItem
            key="properties.tenantExiteDate"
            title="وضعیت ملک/تاریخ خروج مستاجر"
            value={watch("properties.tenantExiteDate")?.toString() || ""}
            setValue={setValue}
            watch={watch}
            fieldName="properties.tenantExiteDate"
            type="string"
          />
        )}

        {/* Special handling for documentIssueDate */}
        {watch("properties.documentIssueDate") && (
          <FeaturesItem
            key="properties.documentIssueDate"
            title="وضعیت ملک/تاریخ صدور سند"
            value={watch("properties.documentIssueDate")?.toString() || ""}
            setValue={setValue}
            watch={watch}
            fieldName="properties.documentIssueDate"
            type="string"
          />
        )}

        {/* Special handling for loanAmount */}
        {watch("properties.loanAmount") && (
          <FeaturesItem
            key="properties.loanAmount"
            title="وضعیت ملک/مقدار وام"
            value={`${Number(watch("properties.loanAmount")).toLocaleString("fa-IR")} تومان`}
            setValue={setValue}
            watch={watch}
            fieldName="properties.loanAmount"
            type="string"
          />
        )}

        {/* Special handling for contractType */}
        {watch("properties.contractType") &&
          Array.isArray(watch("properties.contractType")) &&
          watch("properties.contractType")!.length > 0 && (
            <FeaturesItem
              key="properties.contractType"
              title="وضعیت ملک/نوع قرارداد"
              value={watch("properties.contractType")!.join("، ")}
              setValue={setValue}
              watch={watch}
              fieldName="properties.contractType"
              type="array"
            />
          )}

        {/* Special handling for passengerElevatorCount */}
        {watch("properties.passengerElevatorCount") && (
          <FeaturesItem
            key="properties.passengerElevatorCount"
            title="مشاعات عمومی/تعداد آسانسور نفر بر"
            value={watch("properties.passengerElevatorCount")!.toString()}
            setValue={setValue}
            watch={watch}
            fieldName="properties.passengerElevatorCount"
            type="string"
          />
        )}

        {/* Special handling for freightElevatorCount */}
        {watch("properties.freightElevatorCount") && (
          <FeaturesItem
            key="properties.freightElevatorCount"
            title="مشاعات عمومی/تعداد آسانسور باری"
            value={watch("properties.freightElevatorCount")!.toString()}
            setValue={setValue}
            watch={watch}
            fieldName="properties.freightElevatorCount"
            type="string"
          />
        )}

        <AddFeatures
          watch={watch}
          setValue={setValue}
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
}

function FeaturesItem({
  title,
  value,
  setValue,
  watch,
  fieldName,
  type,
}: {
  title: string;
  value: string;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateSchema>>;
  watch: UseFormWatch<z.infer<typeof mutateEstateSchema>>;
  fieldName: string;
  type: "array" | "string";
}) {
  const onDelete = () => {
    if (type === "array") {
      if (fieldName.startsWith("properties.")) {
        const propertyName = fieldName.replace("properties.", "");
        const currentProperties = watch("properties") || {};
        setValue("properties", {
          ...currentProperties,
          [propertyName as keyof typeof currentProperties]:
            currentProperties[
              propertyName as keyof typeof currentProperties
            ]?.filter((item: string) => item !== value) || [],
        });
      }
    } else {
      if (fieldName.startsWith("properties.")) {
        const propertyName = fieldName.replace("properties.", "");
        const currentProperties = watch("properties") || {};
        setValue("properties", {
          ...currentProperties,
          [propertyName]:
            propertyName === "loanAmount"
              ? ""
              : propertyName === "contractType"
                ? []
                : propertyName === "passengerElevatorCount"
                  ? ""
                  : propertyName === "freightElevatorCount"
                    ? ""
                    : undefined,
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-x-3 rounded-full border border-primary-border py-2 pl-3 pr-5 text-sm font-medium">
      <div className="flex items-center gap-x-2">
        <p className="text-xs text-text-200">{title}</p>
        <p>{value}</p>
      </div>
      <button
        onClick={onDelete}
        className="rounded-full p-1 transition-colors hover:bg-primary-red/20">
        <XIcon className="size-4 text-text-200" />
      </button>
    </div>
  );
}
