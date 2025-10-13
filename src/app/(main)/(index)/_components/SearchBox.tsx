// components/sections/SearchBox.tsx
"use client";

import Button from "@/components/modules/buttons/Button";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import SelectCategories from "./SelectCategories";
import { DealType, DealTypeEnum } from "@/lib/categories";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  serializeCategories,
  serializeRegions,
} from "@/lib/search-params-utils";
import { useCategories } from "@/services/queries/admin/category/useCategories";

export interface SearchBoxProps {
  tabs?: { label: string; value: string }[];
  onSearch?: (searchParams: { activeTab: string }) => void;
  dealType: DealTypeEnum;
}

const defaultTabs = [
  { label: "خرید", value: DealTypeEnum.FOR_SALE },
  { label: "رهن و اجاره", value: DealTypeEnum.FOR_RENT },
  { label: "پیش‌فروش", value: DealTypeEnum.PRE_SALE },
  { label: "مشارکت", value: DealTypeEnum.PARTICIPATION },
];

export default function SearchBox({
  tabs = defaultTabs,
  onSearch,
  dealType,
}: SearchBoxProps) {
  const { categories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<
    (Partial<TCategory> & { parents?: { id?: string }[] })[]
  >([{ dealType: dealType, id: "1", name: DealType[dealType] }]);
  const [selectedRegions, setSelectedRegions] = useState<
    { key: string; title: string; parent?: { id: string; title: string } }[]
  >([]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ activeTab: dealType });
    }
  };

  useEffect(() => {
    const activeRef = tabRefs.current[dealType];
    if (activeRef) {
      activeRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [dealType]);

  useEffect(() => {
    if (categories.data?.data) {
      const dealTypeCategory = categories.data.data.find(
        (category) => category.dealType === dealType,
      );
      if (dealTypeCategory) {
        setSelectedCategories([
          {
            dealType: dealType,
            id: dealTypeCategory.id,
            name: dealTypeCategory.name,
          },
        ]);
      }
    }
  }, [categories.data?.data, dealType]);

  const href = useMemo(() => {
    const baseQuery: Record<string, string> = {
      tab: dealType,
    };

    // Add categories to URL if selected
    if (selectedCategories.length > 0) {
      const categoriesString = serializeCategories(selectedCategories);
      if (categoriesString) {
        baseQuery.categories = categoriesString;
      }
    }

    // Add regions to URL if selected
    if (selectedRegions.length > 0) {
      const regionsString = serializeRegions(selectedRegions);
      if (regionsString) {
        baseQuery.regions = regionsString;
      }
    }

    return {
      pathname: "/search",
      query: baseQuery,
    };
  }, [dealType, selectedCategories, selectedRegions]);

  return (
    <section
      className="absolute inset-0 m-auto flex h-fit w-[95vw] max-w-[800px] translate-y-[-20px] flex-col gap-3 rounded-[10px] rounded-tr-none bg-white/70 p-3 shadow-lg backdrop-blur-sm xs:gap-4 sm:bg-white sm:p-4 md:p-5"
      aria-label="جستجوی ملک">
      {/* Tabs */}
      <nav
        className="mb-1 flex snap-x gap-1.5 overflow-x-auto scroll-smooth scrollbar-hide xs:gap-2 sm:mb-2"
        aria-label="انتخاب نوع معامله">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[tab.value] = el;
            }}
            type="button"
            className={cn(
              `min-h-[44px] w-fit min-w-[80px] flex-shrink-0 snap-start whitespace-nowrap rounded-[25px] px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 xs:min-w-[88px] xs:px-4 xs:text-base sm:min-h-[48px] sm:min-w-[96px] sm:rounded-[30px] sm:px-4 sm:py-2`,
              dealType === tab.value
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-primary/10 active:bg-primary/20",
            )}
            aria-current={dealType === tab.value ? "page" : undefined}
            onClick={() =>
              router.push(
                `/${tab.value === DealTypeEnum.FOR_SALE ? "" : tab.value}`,
              )
            }>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Selectors */}
      <form
        className="flex flex-col gap-3 xs:gap-4 md:flex-row md:items-end md:justify-between md:gap-4"
        role="search"
        aria-label="فرم جستجو"
        onSubmit={handleSearch}>
        <div className="flex w-full max-w-full flex-col gap-3 xs:gap-4 sm:flex-row sm:gap-2 md:max-w-[520px] lg:gap-3">
          <SelectCategories
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
          />
        </div>
        <Link href={href} className="w-full sm:w-auto md:w-fit">
          <Button
            type="submit"
            className="h-[50px] w-full min-w-0 rounded-[12px] px-6 text-base font-semibold xs:h-[52px] sm:w-auto sm:min-w-[160px] md:h-[48px] md:min-w-[140px] md:text-sm lg:text-base">
            جست و جو
          </Button>
        </Link>
      </form>
    </section>
  );
}
