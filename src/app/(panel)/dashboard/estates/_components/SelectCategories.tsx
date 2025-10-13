"use client";

import ComboBox from "@/components/modules/ComboBox";
import HierarchicalMultiSelect from "@/components/modules/HierarchicalMultiSelect";
import { useCategories } from "@/services/queries/admin/category/useCategories";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import { type TCategory } from "@/types/admin/category/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSearchQueries from "@/hooks/useSearchQueries";

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
  const searchParams = useSearchParams();
  const setSearchQuery = useSearchQueries();

  // Second useRegions call for Region (with a different ID)
  const { regions: regionRegions } = useRegions({
    id: selectedCategories?.[2]?.id || "region",
    disabled: selectedCategories.length < 3,
  });

  useEffect(() => {
    const mainCategory = localStorage.getItem("mainCategory");
    const subCategory = localStorage.getItem("subCategory");
    const propertyType = localStorage.getItem("propertyType");
    const regions = localStorage.getItem("regions");
    if (mainCategory) {
      setSelectedCategories([JSON.parse(mainCategory)]);
      if (subCategory) {
        setSelectedCategories([
          JSON.parse(mainCategory),
          JSON.parse(subCategory),
        ]);
        if (propertyType) {
          setSelectedCategories([
            JSON.parse(mainCategory),
            JSON.parse(subCategory),
            JSON.parse(propertyType),
          ]);
          if (regions) {
            setSelectedRegions([...JSON.parse(regions)]);
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex w-fit shrink-0 flex-wrap gap-4">
      {/* Deal Type ComboBox */}
      <div className="w-full shrink-0 sm:w-[170px]">
        <ComboBox
          options={
            categories.data?.data.map((cat) => ({
              key: cat.id,
              title: cat.name,
            })) || []
          }
          value={selectedCategories?.[0]?.name || "نوع معامله"}
          onChange={(value) => {
            const newSelectedCategory = categories.data?.data.find(
              (cat) => cat.id === value.key,
            );

            if (newSelectedCategory?.id === selectedCategories?.[0]?.id) {
              setSelectedCategories([]);
              localStorage.removeItem("mainCategory");
              localStorage.removeItem("subCategory");
              localStorage.removeItem("propertyType");
              localStorage.removeItem("regions");
              return;
            }

            localStorage.setItem(
              "mainCategory",
              JSON.stringify({
                ...newSelectedCategory,
                parents: selectedCategories,
              }),
            );
            localStorage.removeItem("subCategory");
            localStorage.removeItem("propertyType");
            localStorage.removeItem("regions");
            if (newSelectedCategory) {
              setSelectedCategories([
                {
                  ...newSelectedCategory,
                  parents: selectedCategories,
                },
              ]);
            }
            setSelectedRegions([]);
            setSearchQuery(["page"], ["1"]);
          }}
          containerClassName="w-full sm:w-[170px]"
          className="w-full border-primary-border/50"
          dropDownClassName="w-full"
        />
      </div>

      {/* Usage Type ComboBox */}
      <div className="w-full shrink-0 sm:w-[170px]">
        <ComboBox
          options={
            categories.data?.data
              ?.find((category) => category.id === selectedCategories?.[0]?.id)
              ?.children.map((cat) => ({
                key: cat.id,
                title: cat.name,
              })) || []
          }
          value={selectedCategories?.[1]?.name || "نوع کاربری"}
          onChange={(value) => {
            const newSelectedCategory = categories.data?.data
              ?.find((category) => category.id === selectedCategories?.[0]?.id)
              ?.children.find((cat) => cat.id === value.key);
            if (newSelectedCategory?.id === selectedCategories?.[1]?.id) {
              setSelectedCategories([selectedCategories?.[0]]);
              localStorage.removeItem("subCategory");
              localStorage.removeItem("propertyType");
              localStorage.removeItem("regions");
              return;
            }
            localStorage.setItem(
              "subCategory",
              JSON.stringify({
                ...newSelectedCategory,
                parents: selectedCategories,
              }),
            );
            localStorage.removeItem("propertyType");
            localStorage.removeItem("regions");
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
            setSearchQuery(["page"], ["1"]);
          }}
          containerClassName="w-full sm:w-[170px]"
          className="w-full border-primary-border/50"
          disable={!selectedCategories?.[0]?.id}
          dropDownClassName="w-full"
        />
      </div>

      {/* Property Type ComboBox */}
      <div className="w-full shrink-0 sm:w-[170px]">
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
              localStorage.removeItem("propertyType");
              localStorage.removeItem("regions");
              return;
            }
            localStorage.setItem(
              "propertyType",
              JSON.stringify({
                ...newSelectedCategory,
                parents: selectedCategories,
              }),
            );
            localStorage.removeItem("regions");
            setSelectedCategories([
              selectedCategories?.[0],
              selectedCategories?.[1],
              {
                ...newSelectedCategory,
                parents: selectedCategories,
              },
            ]);
            setSelectedRegions([]);
            setSearchQuery(["page"], ["1"]);
          }}
          containerClassName="w-full sm:w-[170px]"
          className="w-full border-primary-border/50"
          disable={!selectedCategories?.[1]?.id}
          dropDownClassName="w-full"
        />
      </div>
      <div className="w-full shrink-0 sm:w-[170px]">
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
            localStorage.setItem(
              "regions",
              JSON.stringify(value.map((item) => item)),
            );
            setSearchQuery(["page"], ["1"]);
          }}
          containerClassName="w-full max-w-[400px]"
          className="w-full border-primary-border/50"
          disable={!selectedCategories?.[2]?.id}
          dropDownClassName="w-full"
          placeholder="منطقه"
        />
      </div>
    </div>
  );
}
