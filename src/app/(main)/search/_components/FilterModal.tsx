"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import useSearchQueries from "@/hooks/useSearchQueries";
import { cn, formatNumber } from "@/lib/utils";
import {
  AlertCircleIcon,
  SearchIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RangeSlider from "./RangeSlider";
import ComboBox from "@/components/modules/ComboBox";
import RegionSearchInput from "./RegionSearchInput";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterState;
}

export interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  metrageMin: number | null;
  metrageMax: number | null;
  estateCode: string;
  // New filters
  roomCount: string;
  floor: string;
  buildYear: string;
  isExchangeable: boolean;
  floorCount: string;
  location: string;
  parkingCount: string;
  regionName: string;
}

export default function FilterModal({
  isOpen,
  onClose,
  currentFilters,
}: FilterModalProps) {
  const setSearchQuery = useSearchQueries();
  const [filters, setFilters] = useState<FilterState>({
    ...currentFilters,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Update local state when currentFilters change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAreaChange = (
    field: "metrageMin" | "metrageMax",
    value: number | null,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBooleanChange = (field: keyof FilterState, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegionChange = (
    region: { key: string; title: string } | null,
  ) => {
    setFilters((prev) => ({
      ...prev,
      regionName: region?.title || "",
    }));
  };

  const handleClearFilters = () => {
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
    setFilters(clearedFilters);

    // Update URL with cleared filters
    setSearchQuery(
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
        "page",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    );
  };

  const handleApplyFilters = () => {
    // Validate filters before applying
    if (!validateFilters()) {
      return;
    }

    // Update URL with current filters
    setSearchQuery(
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
        "page",
      ],
      [
        filters.search,
        filters.priceMin,
        filters.priceMax,
        filters.metrageMin ? filters.metrageMin?.toString() : "",
        filters.metrageMax ? filters.metrageMax?.toString() : "",
        filters.estateCode,
        filters.roomCount,
        filters.floor,
        filters.buildYear,
        filters.isExchangeable ? "true" : "",
        filters.floorCount,
        filters.location,
        filters.parkingCount,
        filters.regionName,
        "1",
      ],
    );
    onClose();
  };

  const hasActiveFilters = Object.entries(filters).some(([_, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "" && value !== null && value !== false;
  });

  // Validation functions
  const validatePriceRange = () => {
    const minPrice = filters.priceMin ? parseInt(filters.priceMin) : null;
    const maxPrice = filters.priceMax ? parseInt(filters.priceMax) : null;

    if (minPrice && maxPrice && minPrice > maxPrice) {
      return "حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد";
    }
    return null;
  };

  const validateMetrageRange = () => {
    if (
      filters.metrageMin &&
      filters.metrageMax &&
      filters.metrageMin > filters.metrageMax
    ) {
      return "حداقل متراژ نمی‌تواند از حداکثر متراژ بیشتر باشد";
    }
    return null;
  };

  const validateFilters = () => {
    const priceError = validatePriceRange();
    const metrageError = validateMetrageRange();

    if (priceError) {
      toast.error(priceError);
      return false;
    }

    if (metrageError) {
      toast.error(metrageError);
      return false;
    }

    return true;
  };

  // Property direction options
  const directionOptions = ["شمالی", "جنوبی", "شرقی", "غربی"];

  return (
    <Modal
      isOpen={isOpen}
      title={
        <div>
          <div className="text-lg font-bold">فیلترهای جستجو</div>
          <div className="mt-1 text-sm text-text-100">
            فیلترهای مورد نظر خود را اعمال کنید
          </div>
        </div>
      }
      onCloseModal={onClose}
      // onClickOutside={onClose}
      classNames={{
        background: "z-50 sm:!p-4 !p-0",
        box: "sm:!max-w-2xl !w-full !max-w-full overflow-hidden !max-h-full overflow-y-auto sm:!rounded-xl !rounded-none !h-full sm:!h-fit",
        header: "sticky top-0 z-10 bg-background border-b-0",
      }}>
      <div className="px-6">
        {/* Main Filters Section */}
        <div className="mb-6">
          {/* Search Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-text-300">
              جستجو
            </label>
            <div className="relative">
              <SearchIcon className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <BorderedInput
                name="search"
                type="text"
                placeholder="جستجو در عنوان، آدرس و..."
                value={filters.search}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pr-14"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-text-300">
              محدوده قیمت (تومان)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <BorderedInput
                  name="priceMin"
                  type="number"
                  placeholder="حداقل قیمت"
                  value={formatNumber(filters.priceMin)}
                  onChange={(e) =>
                    handleInputChange("priceMin", e.target.value)
                  }
                  className={cn(
                    validatePriceRange() &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                  )}
                  isCurrency
                  showCurrency
                />
              </div>
              <div>
                <BorderedInput
                  name="priceMax"
                  type="number"
                  placeholder="حداکثر قیمت"
                  value={formatNumber(filters.priceMax)}
                  onChange={(e) =>
                    handleInputChange("priceMax", e.target.value)
                  }
                  className={cn(
                    validatePriceRange() &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                  )}
                  isCurrency
                  showCurrency
                />
              </div>
            </div>
            {validatePriceRange() && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                <AlertCircleIcon size={16} />
                <span>{validatePriceRange()}</span>
              </div>
            )}
          </div>

          {/* Area Range */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-text-300">
              محدوده متراژ (متر مربع)
            </label>
            <RangeSlider
              min={0}
              max={1400}
              step={5}
              minValue={filters.metrageMin}
              maxValue={filters.metrageMax}
              onMinChange={(value) => handleAreaChange("metrageMin", value)}
              onMaxChange={(value) => handleAreaChange("metrageMax", value)}
            />
            {validateMetrageRange() && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                <AlertCircleIcon size={16} />
                <span>{validateMetrageRange()}</span>
              </div>
            )}
          </div>

          {/* File Code */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-text-300">
              کد فایل
            </label>
            <BorderedInput
              name="estateCode"
              type="text"
              placeholder="کد فایل مورد نظر"
              value={filters.estateCode}
              onChange={(e) => handleInputChange("estateCode", e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex w-full items-center justify-between rounded-lg border border-primary-border bg-gray-50 px-4 py-3 text-sm font-medium text-text-300 transition-colors hover:bg-gray-100">
            <span>فیلترهای پیشرفته</span>
            {showAdvancedFilters ? (
              <ChevronUpIcon size={20} />
            ) : (
              <ChevronDownIcon size={20} />
            )}
          </button>
        </div>

        {/* Advanced Filters Section */}
        {showAdvancedFilters && (
          <div className="mb-6 space-y-6">
            <h3 className="text-base font-semibold text-text-300">
              فیلترهای پیشرفته
            </h3>

            {/* Region Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                منطقه
              </label>
              <RegionSearchInput
                value=""
                onRegionSelect={(region) => {
                  handleRegionChange(region);
                }}
                selectedRegion={filters.regionName}
                className="w-full"
                placeholder="جستجو در مناطق..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                موقعیت ملک
              </label>
              <ComboBox
                options={[
                  {
                    key: "",
                    title: "همه",
                  },
                  ...directionOptions.map((direction) => ({
                    key: direction,
                    title: direction,
                  })),
                ]}
                value={filters.location}
                onChange={(value) => {
                  handleInputChange("location", value.key as string);
                }}
                className="w-full"
                containerClassName="w-full"
                dropDownClassName="w-full"
              />
            </div>

            {/* Room Count */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                تعداد اتاق
              </label>
              <BorderedInput
                name="roomCount"
                type="number"
                placeholder="تعداد اتاق"
                value={filters.roomCount}
                onChange={(e) => handleInputChange("roomCount", e.target.value)}
                min="0"
              />
            </div>

            {/* Floor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                طبقه
              </label>
              <BorderedInput
                name="floor"
                type="number"
                placeholder="طبقه مورد نظر"
                value={filters.floor}
                onChange={(e) => handleInputChange("floor", e.target.value)}
                min="0"
              />
            </div>

            {/* Building Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                سال ساخت
              </label>
              <BorderedInput
                name="buildYear"
                type="number"
                placeholder="سال ساخت مورد نظر"
                value={filters.buildYear}
                onChange={(e) => handleInputChange("buildYear", e.target.value)}
                min="1300"
                max="1450"
              />
            </div>

            {/* Exchangeable Property */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                قابل معاوضه
              </label>
              <div className="flex items-center gap-3">
                <div className="cntr">
                  <input
                    type="checkbox"
                    id="isExchangeable"
                    className="checkbox hidden-xs-up"
                    checked={filters.isExchangeable}
                    onChange={(event) => {
                      if (event.target.checked) {
                        handleBooleanChange("isExchangeable", true);
                      } else {
                        handleBooleanChange("isExchangeable", false);
                      }
                    }}
                  />
                  <label htmlFor="isExchangeable" className="cbx" />
                </div>
                <label
                  htmlFor="isExchangeable"
                  className="text-sm text-text-300">
                  فقط ملک‌های قابل معاوضه
                </label>
              </div>
            </div>

            {/* Floor Count */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                تعداد طبقات
              </label>
              <BorderedInput
                name="floorCount"
                type="number"
                placeholder="تعداد طبقات"
                value={filters.floorCount}
                onChange={(e) =>
                  handleInputChange("floorCount", e.target.value)
                }
                min="0"
              />
            </div>

            {/* Parking Count */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-300">
                تعداد پارکینگ
              </label>
              <BorderedInput
                name="parkingCount"
                type="number"
                placeholder="تعداد پارکینگ"
                value={filters.parkingCount}
                onChange={(e) =>
                  handleInputChange("parkingCount", e.target.value)
                }
                min="0"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-0 z-30 flex gap-3 bg-white py-5">
          <Button
            onClick={handleApplyFilters}
            className={cn("w-full", hasActiveFilters || "cursor-not-allowed")}
            disabled={!hasActiveFilters}>
            اعمال فیلترها
          </Button>
          <BorderedButton
            onClick={handleClearFilters}
            className="shrink-0 bg-background">
            <XIcon size={18} />
            پاک کردن
          </BorderedButton>
        </div>
      </div>
    </Modal>
  );
}
