"use client";

import ComboBox from "@/components/modules/ComboBox";
import HierarchicalMultiSelect from "@/components/modules/HierarchicalMultiSelect";
import { cn } from "@/lib/utils";
import { useCategories } from "@/services/queries/admin/category/useCategories";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import { type TCategory } from "@/types/admin/category/types";

export default function SelectCategories({
  selectedCategories,
  setSelectedCategories,
  selectedRegions,
  setSelectedRegions,
}: {
  selectedCategories: (Partial<TCategory> & { parents?: { id?: string }[] })[];
  setSelectedCategories: (
    categories: (Partial<TCategory> & { parents?: { id?: string }[] })[],
  ) => void;
  selectedRegions: {
    key: string;
    title: string;
    parent?: { id: string; title: string };
  }[];
  setSelectedRegions: (
    regions: {
      key: string;
      title: string;
      parent?: { id: string; title: string };
    }[],
  ) => void;
}) {
  const { categories } = useCategories();
  // First useRegions call for Property Type
  const { regions: propertyTypeRegions } = useRegions({
    id: selectedCategories?.[1]?.id || "",
    disabled: selectedCategories.length < 2,
  });

  // Second useRegions call for Region (with a different ID)
  const { regions: regionRegions } = useRegions({
    id: selectedCategories?.[2]?.id || "region",
    disabled: selectedCategories.length < 3,
  });

  return (
    <div className="flex w-full flex-col gap-3 xs:gap-4 sm:flex-row sm:gap-2 lg:gap-3">
      {/* Usage Type ComboBox */}
      <div className="w-full flex-1 sm:min-w-[140px] sm:max-w-[170px] lg:min-w-[160px] lg:max-w-[180px]">
        <ComboBox
          options={
            categories.data?.data
              ?.find(
                (category) =>
                  category.dealType === selectedCategories?.[0]?.dealType,
              )
              ?.children.map((cat) => ({
                key: cat.id,
                title: cat.name,
              })) || []
          }
          value={selectedCategories?.[1]?.name || "نوع کاربری"}
          onChange={(value) => {
            const newSelectedCategory = categories.data?.data
              ?.find(
                (category) =>
                  category.dealType === selectedCategories?.[0]?.dealType,
              )
              ?.children.find((cat) => cat.id === value.key);
            if (newSelectedCategory?.id === selectedCategories?.[1]?.id) {
              setSelectedCategories([selectedCategories?.[0]]);
              return;
            }

            if (newSelectedCategory) {
              setSelectedCategories([
                selectedCategories?.[0],
                {
                  ...newSelectedCategory,
                  parents: selectedCategories,
                },
              ]);
            }
            setSelectedRegions([]);
          }}
          containerClassName="w-full min-h-[48px]"
          className="h-[48px] w-full border-primary-border/50 text-sm xs:text-base"
          disable={!selectedCategories?.[0]?.id}
          dropDownClassName="w-full"
        />
      </div>

      {/* Property Type ComboBox */}
      <div className="w-full flex-1 sm:min-w-[140px] sm:max-w-[170px] lg:min-w-[160px] lg:max-w-[180px]">
        <ComboBox
          options={
            propertyTypeRegions.data?.data.children.map((cat) => ({
              key: cat.id,
              title: cat.name,
            })) || []
          }
          value={selectedCategories?.[2]?.name || "نوع ملک"}
          onChange={(value) => {
            const newSelectedCategory =
              propertyTypeRegions.data?.data.children.find(
                (cat) => cat.id === value.key,
              );
            if (newSelectedCategory?.id === selectedCategories?.[2]?.id) {
              setSelectedCategories([
                selectedCategories?.[0],
                selectedCategories?.[1],
              ]);
              return;
            }

            setSelectedCategories([
              selectedCategories?.[0],
              selectedCategories?.[1],
              {
                ...newSelectedCategory,
                parents: selectedCategories,
              },
            ]);
            setSelectedRegions([]);
          }}
          containerClassName="w-full min-h-[48px]"
          className="h-[48px] w-full border-primary-border/50 text-sm xs:text-base"
          disable={!selectedCategories?.[1]?.id}
          dropDownClassName="w-full"
        />
      </div>
      <div className="w-full flex-1 sm:min-w-[140px] sm:max-w-[170px] lg:min-w-[160px] lg:max-w-[180px]">
        <HierarchicalMultiSelect
          options={
            regionRegions.data?.data.children.map((region) => ({
              key: region.id,
              title: region.name,
              children: (region as any).children?.map((subRegion: any) => ({
                key: subRegion.id,
                title: subRegion.name,
              })),
            })) || []
          }
          selectedRegions={selectedRegions}
          setSelectedRegions={(value) => {
            setSelectedRegions(value);
          }}
          containerClassName="w-full min-h-[48px]"
          className={cn(
            "h-[48px] w-full border-primary-border/50 bg-white text-sm xs:text-base",
            selectedCategories?.[1]?.id || "bg-white/50",
          )}
          disable={!selectedCategories?.[2]?.id}
          dropDownClassName="w-full"
          placeholder="منطقه"
        />
      </div>
    </div>
  );
}
