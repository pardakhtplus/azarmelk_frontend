"use client";

import { IFilterLight, ITrash } from "@/components/Icons";
import Modal from "@/components/modules/Modal";
import Pagination from "@/components/modules/Pagination";

import {
  type DealType,
  getEnglishDealType,
  getEnglishMainCategory,
  getEnglishPropertyType,
  type MainCategory,
  type PropertyType,
} from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useEstateList } from "@/services/queries/client/estate/useEstateList";
import { type TCategory } from "@/types/admin/category/types";
import { type TEstate } from "@/types/types";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { UseFormSetValue } from "react-hook-form";
import type { z } from "zod";
import type { mutateLandingSchema } from "../MutateLanding";
import FilterModal, { type FilterState } from "./FilterModal";
import SelectableEstateCard from "./SelectableEstateCard";
import SelectCategories from "./SelectCategories";

const LIMIT_PER_PAGE = 9;

export default function AddEstate({
  setValue,
  defaultEstates,
}: {
  setValue: UseFormSetValue<z.infer<typeof mutateLandingSchema>>;
  defaultEstates: {
    id: string;
    title: string;
    estateCode?: number;
    posterFile?: {
      url?: string;
    };
  }[];
}) {
  const [isClient, setIsClient] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<
    (Partial<TCategory> & { parents?: { id?: string }[] })[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<
    { key: string; title: string; parent?: { id: string; title: string } }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state instead of URL queries
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    search: "",
    priceMin: "",
    priceMax: "",
    metrageMin: null,
    metrageMax: null,
    estateCode: "",
    roomCount: "",
    floor: "",
    buildYear: "",
    isExchangeable: false,
    floorCount: "",
    location: "",
    parkingCount: "",
    regionName: "",
  });

  // Selection state
  const [selectedEstates, setSelectedEstates] = useState<
    {
      id: string;
      title: string;
      estateCode?: number;
      posterFile?: {
        url?: string;
      };
    }[]
  >(defaultEstates || []);

  // Fetch estates and categories
  const { estateList } = useEstateList({
    enabled: isOpenModal,
    params: {
      ...currentFilters,
      metrageMin: currentFilters.metrageMin?.toString() || "",
      metrageMax: currentFilters.metrageMax?.toString() || "",
      page: currentPage.toString(),
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
      categoryIds: selectedRegions.map((region) => region.key || "").join(","),
    },
  });

  // Check if any filters are active
  const hasActiveFilters = Object.entries(currentFilters).some(([_, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "" && value !== null && value !== false;
  });

  const handleClearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    const clearedFilters = {
      search: "",
      priceMin: "",
      priceMax: "",
      metrageMin: null,
      metrageMax: null,
      estateCode: "",
      roomCount: "",
      floor: "",
      buildYear: "",
      isExchangeable: false,
      floorCount: "",
      location: "",
      parkingCount: "",
      regionName: "",
    };
    setCurrentFilters(clearedFilters);
  }, []);

  const handleEstateSelection = (estate: TEstate) => {
    setSelectedEstates((prev) => {
      const isSelected = prev.some((e) => e.id === estate.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== estate.id);
      } else {
        return [...prev, estate];
      }
    });
  };

  const handleSelectAll = () => {
    if (estateList?.data?.data) {
      setSelectedEstates(estateList.data.data);
    }
  };

  const handleDeselectAll = () => {
    setSelectedEstates(defaultEstates || []);
  };

  const handleAddSelectedEstates = () => {
    setValue("estateIds", [
      ...defaultEstates,
      ...selectedEstates.filter(
        (estate) => !defaultEstates.some((e) => e.id === estate.id),
      ),
    ]);
    setIsOpenModal(false);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters, selectedCategories, selectedRegions]);

  useEffect(() => {
    if (!isOpenModal) {
      setSelectedEstates(defaultEstates || []);
      handleClearAllFilters();
      setCurrentPage(1);
    }
  }, [isOpenModal, defaultEstates, handleClearAllFilters]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <button
        type="button"
        className="flex h-20 w-full items-center justify-center gap-x-2 rounded-xl border border-dashed border-primary-blue text-primary-blue transition-all hover:bg-primary-blue/10"
        onClick={() => {
          setIsOpenModal(true);
        }}>
        <PlusIcon className="size-7" />
        <span>افزودن فایل</span>
      </button>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title="افزودن فایل"
          classNames={{
            background: "z-50 !py-0 md:!p-4 !px-0",
            box: " overflow-x-hidden !max-h-none !max-w-none !max-w-[1400px] rounded-none !h-full flex flex-col justify-between md:rounded-xl",
            header: "sticky top-0 z-10 bg-white",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          <div className="flex h-full flex-col gap-y-6 px-6 py-7">
            {/* Filters Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">فیلترها</h3>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Category Filters */}
                <SelectCategories
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedRegions={selectedRegions}
                  setSelectedRegions={setSelectedRegions}
                />
                <div className="flex items-center gap-3">
                  <button
                    className="group relative flex size-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-primary-blue/70 hover:bg-primary-blue/10 hover:shadow-md"
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
                  {(hasActiveFilters ||
                    selectedCategories.length > 0 ||
                    selectedRegions.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearAllFilters}
                      className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700">
                      <ITrash className="size-5" />
                      پاک کردن همه فیلترها
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Estates List */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-y-2">
                <h3 className="shrink-0 text-lg font-semibold text-gray-900">
                  لیست املاک
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-700">
                        {
                          selectedEstates.filter(
                            (estate) =>
                              !defaultEstates.some((e) => e.id === estate.id),
                          ).length
                        }
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      ملک انتخاب شده
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-all hover:border-green-300 hover:bg-green-100">
                    <CheckIcon className="size-4" />
                    انتخاب همه
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                    <XIcon className="size-4" />
                    حذف انتخاب
                  </button>
                </div>
              </div>

              {estateList?.data?.data && estateList.data.data.length > 0 ? (
                <div className="grid grid-cols-1 grid-rows-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {estateList.data.data.map((estate: TEstate) => (
                    <div
                      key={estate.id}
                      className={cn(
                        "rounded-2xl",
                        defaultEstates.some((e) => e.id === estate.id) &&
                          "pointer-events-none opacity-70",
                      )}>
                      <SelectableEstateCard
                        estate={estate}
                        isSelected={selectedEstates.some(
                          (e) => e.id === estate.id,
                        )}
                        onSelect={handleEstateSelection}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  {!estateList?.isLoading
                    ? "املاکی یافت نشد"
                    : "در حال بارگذاری..."}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                pageInfo={{
                  totalPages: estateList?.data?.meta?.totalPages || 1,
                  currentPage: currentPage,
                }}
                noSearchParams={true}
                onChangePage={setCurrentPage}
              />
            </div>

            {/* Floating Action Button for Adding Selected Estates */}
            {selectedEstates.filter(
              (estate) => !defaultEstates.some((e) => e.id === estate.id),
            ).length > 0 && (
              <div className="sticky bottom-6 right-6 z-50">
                <button
                  type="button"
                  onClick={handleAddSelectedEstates}
                  className="flex items-center gap-2 rounded-full bg-primary-blue px-6 py-3 text-white shadow-lg transition-all hover:bg-primary-blue/90 hover:shadow-xl">
                  <PlusIcon className="size-5" />
                  <span className="font-medium">
                    افزودن{" "}
                    {
                      selectedEstates.filter(
                        (estate) =>
                          !defaultEstates.some((e) => e.id === estate.id),
                      ).length
                    }{" "}
                    ملک انتخاب شده
                  </span>
                </button>
              </div>
            )}
          </div>
        </Modal>,
        document.body,
      )}

      {/* Filter Modal */}
      {createPortal(
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={currentFilters}
          onApplyFilters={(filters) => setCurrentFilters(filters)}
          onClearFilters={handleClearAllFilters}
        />,
        document.body,
      )}
    </>
  );
}
