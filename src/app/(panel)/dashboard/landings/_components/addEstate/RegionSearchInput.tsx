"use client";

import { cn } from "@/lib/utils";
import { useGetFilterList } from "@/services/queries/client/category/useGetFilterList";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface RegionSearchInputProps {
  value: string;
  onRegionSelect: (region: { key: string; title: string } | null) => void;
  selectedRegion: string;
  className?: string;
  placeholder?: string;
}

export default function RegionSearchInput({
  value,
  onRegionSelect,
  selectedRegion: selectedRegionName,
  className,
  placeholder = "جستجو در مناطق...",
}: RegionSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allRegions, setAllRegions] = useState<
    { name: string; createdAt: string; updatedAt: string }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { filterList } = useGetFilterList({
    search: searchTerm,
    page: currentPage,
    limit: 10,
  });

  const currentRegions = useMemo(
    () => filterList?.data?.data?.paginatedRegions || [],
    [filterList],
  );
  const totalPages = filterList?.data?.data?.totalPages || 0;

  // Only update searchTerm when value prop changes (from parent)
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Don't call onChange on every searchTerm change to avoid infinite loop
  // onChange will be called by parent when needed

  useEffect(() => {
    setCurrentPage(1);
    setAllRegions([]);
    setHasMore(true);
  }, [searchTerm]);

  // Update allRegions when new data comes in
  useEffect(() => {
    if (currentRegions.length > 0) {
      if (currentPage === 1) {
        setAllRegions(currentRegions);
      } else {
        setAllRegions((prev) => [...prev, ...currentRegions]);
      }
      setHasMore(currentPage < totalPages);
      setIsLoading(false);
    }
  }, [currentRegions, currentPage, totalPages]);

  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
  };

  const handleRegionSelect = (region: { name: string }) => {
    const regionData = {
      key: region.name,
      title: region.name,
    };
    onRegionSelect(regionData);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClearRegion = () => {
    onRegionSelect(null);
    setSearchTerm("");
  };

  const loadMore = () => {
    if (hasMore && currentPage < totalPages && !isLoading) {
      setIsLoading(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !isLoading) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Selected Region Display */}
      {selectedRegionName && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-primary-blue/10 px-3 py-2 text-sm text-primary-blue">
          <span>{selectedRegionName}</span>
          <button
            type="button"
            onClick={handleClearRegion}
            className="text-primary-blue hover:text-primary-blue/80">
            <XIcon size={14} />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedRegionName ? selectedRegionName : placeholder}
          className="h-12 w-full rounded-xl border border-primary-border bg-background px-4 pr-12 text-sm text-text shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
        />
        {selectedRegionName && (
          <button
            type="button"
            onClick={handleClearRegion}
            className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400">
            <XIcon size={17} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDownIcon
            size={19}
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mb-10 mt-1 max-h-64 overflow-hidden rounded-lg border border-primary-border bg-white shadow-lg">
          <div
            ref={suggestionsRef}
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto">
            {allRegions.length > 0 ? (
              <>
                {allRegions.map((region, index) => (
                  <button
                    key={`${region.name}-${index}`}
                    type="button"
                    onClick={() => handleRegionSelect(region)}
                    className="w-full px-4 py-3 text-right text-sm text-text hover:bg-gray-50 focus:bg-gray-50 focus:outline-none">
                    {region.name}
                  </button>
                ))}
                {isLoading && (
                  <div className="px-4 py-2 text-center text-xs text-gray-500">
                    در حال بارگذاری...
                  </div>
                )}
                {hasMore && !isLoading && (
                  <div className="px-4 py-2 text-center text-xs text-gray-500">
                    برای دیدن نتایج بیشتر اسکرول کنید
                  </div>
                )}
              </>
            ) : searchTerm ? (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                منطقه‌ای یافت نشد
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                برای جستجو در مناطق تایپ کنید
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
