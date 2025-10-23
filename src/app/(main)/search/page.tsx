"use client";

import { IFilterLight } from "@/components/Icons";
import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import LoadMoreButton from "@/components/modules/LoadMoreButton";
import useSearchQueries from "@/hooks/useSearchQueries";
import {
  type DealType,
  type MainCategory,
  type PropertyType,
  getEnglishDealType,
  getEnglishMainCategory,
  getEnglishPropertyType,
} from "@/lib/categories";
import {
  deserializeCategories,
  deserializeRegions,
  serializeCategories,
  serializeRegions,
} from "@/lib/search-params-utils";
import { useEstateListInfinity } from "@/services/queries/client/estate/useEstateListInfinity";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import FilterModal, { type FilterState } from "./_components/FilterModal";
import SelectCategories from "./_components/SelectCategories";

const LIMIT_PER_PAGE = 9;

export default function SearchPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    (Partial<TCategory> & { parents?: { id?: string }[] })[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<
    { key: string; title: string; parent?: { id: string; title: string } }[]
  >([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const searchQueries = useSearchQueries();

  // Initialize categories and regions from URL params on mount
  useEffect(() => {
    const categoriesParam = searchParams.get("categories");
    const regionsParam = searchParams.get("regions");

    if (categoriesParam) {
      const categories = deserializeCategories(categoriesParam);
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }

    if (regionsParam) {
      const regions = deserializeRegions(regionsParam);
      setSelectedRegions(regions);
    } else {
      setSelectedRegions([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to avoid infinite loops

  // Custom setters that update both state and URL
  const updateSelectedCategories = (
    categories: (Partial<TCategory> & { parents?: { id?: string }[] })[],
    clearRegions: boolean = false,
  ) => {
    setSelectedCategories(categories);
    if (clearRegions) {
      setSelectedRegions([]);
    }

    const categoriesString = serializeCategories(categories);
    const currentRegions = clearRegions ? [] : selectedRegions;
    const regionsString = serializeRegions(currentRegions);

    const params: string[] = ["categories"];
    const values: string[] = [categoriesString];

    if (clearRegions) {
      params.push("regions");
      values.push(regionsString);
    }

    searchQueries(params, values);
  };

  const updateSelectedRegions = (
    regions: {
      key: string;
      title: string;
      parent?: { id: string; title: string };
    }[],
  ) => {
    setSelectedRegions(regions);
    const regionsString = serializeRegions(regions);
    if (regionsString) {
      searchQueries(["regions"], [regionsString]);
    } else {
      searchQueries(["regions"], []);
    }
  };

  // Read filters from URL
  const currentFilters: FilterState = {
    search: searchParams.get("search") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    metrageMin: searchParams.get("metrageMin")
      ? parseInt(searchParams.get("metrageMin")!)
      : null,
    metrageMax: searchParams.get("metrageMax")
      ? parseInt(searchParams.get("metrageMax")!)
      : null,
    estateCode: searchParams.get("estateCode") || "",
    // New filters
    roomCount: searchParams.get("roomCount") || "",
    floor: searchParams.get("floor") || "",
    buildYear: searchParams.get("buildYear") || "",
    isExchangeable: searchParams.get("isExchangeable") === "true",
    floorCount: searchParams.get("floorCount") || "",
    location: searchParams.get("location") || "",
    parkingCount: searchParams.get("parkingCount") || "",
    regionName: searchParams.get("regionName") || "",
  };

  // Check if any filters are active
  const hasActiveFilters = Object.entries(currentFilters).some(([_, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "" && value !== null && value !== false;
  });

  const { allEstates, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useEstateListInfinity({
      params: {
        ...currentFilters,
        metrageMin: currentFilters.metrageMin?.toString() || "",
        metrageMax: currentFilters.metrageMax?.toString() || "",
        limit: LIMIT_PER_PAGE.toString(),
        DealType: selectedCategories?.[0]?.dealType
          ? getEnglishDealType(selectedCategories[0].dealType) ||
            (selectedCategories[0].dealType as DealType)
          : undefined,
        MainCategory: selectedCategories?.[1]?.name
          ? getEnglishMainCategory(selectedCategories[1].name) ||
            (selectedCategories[1].name as MainCategory)
          : undefined,
        PropertyType: selectedCategories?.[2]?.name
          ? getEnglishPropertyType(selectedCategories[2].name) ||
            (selectedCategories[2].name as PropertyType)
          : undefined,
        ...(currentFilters.regionName && {
          regionName: currentFilters.regionName,
        }),
        // New filter parameters
        roomCount: currentFilters.roomCount || undefined,
        floor: currentFilters.floor || undefined,
        buildYear: currentFilters.buildYear || undefined,
        isExchangeable: currentFilters.isExchangeable || undefined,
        floorCount: currentFilters.floorCount || undefined,
        location: currentFilters.location || undefined,
        parkingCount: currentFilters.parkingCount || undefined,
        categoryIds: selectedRegions
          .map((region) => region.key || "")
          .join(","),
      },
    });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const currentCount = allEstates.length;
      fetchNextPage().then(() => {
        // Scroll to the first new item after data is loaded
        setTimeout(() => {
          if (containerRef.current) {
            const newCard =
              containerRef.current.querySelectorAll(".estate-item")[
                currentCount
              ];
            if (newCard) {
              newCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }, 100);
      });
    }
  };

  return (
    <>
      <section className="container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-start gap-2">
            <SelectCategories
              selectedCategories={selectedCategories}
              setSelectedCategories={updateSelectedCategories}
              selectedRegions={selectedRegions}
              setSelectedRegions={updateSelectedRegions}
            />
          </div>
          <div className="flex shrink-0 items-center justify-center gap-2">
            {(selectedCategories.length > 0 ||
              selectedRegions.length > 0 ||
              hasActiveFilters) && (
              <button
                className="group flex h-12 shrink-0 items-center justify-center rounded-full border border-red-500/70 bg-red-500/10 px-4 text-primary-red shadow-sm transition-all hover:bg-primary-red/20"
                onClick={() => {
                  // Clear both state and URL in one go
                  setSelectedCategories([]);
                  setSelectedRegions([]);

                  // Clear all filters including categories and regions
                  searchQueries(
                    [
                      "search",
                      "priceMin",
                      "priceMax",
                      "metrageMin",
                      "metrageMax",
                      "estateCode",
                      "roomCount",
                      "floor",
                      "buildYear",
                      "isExchangeable",
                      "floorCount",
                      "location",
                      "parkingCount",
                      "regionName",
                      "categoryIds",
                      "categories",
                      "regions",
                    ],
                    [],
                  );

                  toast.success("همه فیلتر ها پاک شدند");
                }}
                title="پاک کردن همه فیلتر ها">
                حذف فیلترها
              </button>
            )}
            <button
              className="group relative flex size-12 items-center justify-center rounded-full border border-primary-border/50 bg-white shadow-sm transition-all hover:border-primary-blue/70 hover:bg-primary-blue/10"
              onClick={() => setIsFilterModalOpen(true)}
              title="فیلترهای جستجو">
              <IFilterLight className="size-5 text-text-300 transition-colors group-hover:text-primary-blue" />
              {hasActiveFilters && (
                <>
                  <div className="absolute -right-0.5 -top-0.5 size-3 animate-ping rounded-full bg-red-500" />
                  <div className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-red-500" />
                </>
              )}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allEstates.map((estate, idx) => (
            <div
              key={estate.id}
              className="estate-item animate-fadeIn"
              style={{ animationDelay: `${idx * 60}ms` }}>
              <Link href={`/estates/${estate.id}`} target="_blank">
                <EstateCardItem estate={estate} isWebsite />
              </Link>
            </div>
          ))}
        </div>
        <LoadMoreButton onClick={handleLoadMore} isVisible={hasNextPage} />
        {isFetchingNextPage && (
          <div className="mt-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          </div>
        )}
      </section>

      {/* مودال فیلترهای جستجو */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={currentFilters}
      />
    </>
  );
}
