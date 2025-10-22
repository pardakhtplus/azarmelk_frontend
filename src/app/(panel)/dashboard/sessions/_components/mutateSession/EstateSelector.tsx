"use client";

import CustomImage from "@/components/modules/CustomImage";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import Modal from "@/components/modules/Modal";
import { useEstateList } from "@/services/queries/client/estate/useEstateList";
import { type TEstate } from "@/types/types";
import { debounce } from "lodash";
import { Check, ImageOffIcon, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type TSelectedEstate = {
  id: string;
  title: string;
  estateCode?: number;
  thumbnailUrl?: string;
};

interface EstateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEstate: (estate: TSelectedEstate) => void;
  editingEstateId?: string | null;
  currentEstateId?: string | null;
}

export default function EstateSelector({
  isOpen,
  onClose,
  onSelectEstate,
  editingEstateId,
  currentEstateId,
}: EstateSelectorProps) {
  const [selectedEstate, setSelectedEstate] = useState<TSelectedEstate | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [estateListData, setEstateListData] = useState<TEstate[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { estateList } = useEstateList({
    enabled: isOpen,
    params: {
      page: String(page),
      limit: "10",
      search: searchQuery,
      estateCode:
        searchQuery && /^\d+$/.test(searchQuery) ? searchQuery : undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedEstate(null);
    }
  }, [isOpen]);

  // Reset search and pagination when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchInputValue("");
      setPage(1);
      setEstateListData([]);
    } else {
      setSearchQuery("");
      setSearchInputValue("");
      setPage(1);
      setEstateListData([]);
    }
  }, [isOpen]);

  // Update estateListData when query changes
  useEffect(() => {
    if (estateList?.data?.data) {
      if (page === 1) setEstateListData(estateList.data.data);
      else
        setEstateListData((prev) => [
          ...prev,
          ...(estateList.data?.data || []),
        ]);
    }
  }, [estateList?.data?.data, page, searchQuery]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const totalPages = (estateList?.data?.meta as any)?.totalPages;
      const currentPage = (estateList?.data?.meta as any)?.page;
      if (
        entry.isIntersecting &&
        totalPages &&
        currentPage &&
        currentPage < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [estateList?.data?.meta, isOpen]);

  useEffect(() => {
    if (observerRef.current && loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [estateListData.length, isOpen]);

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
      setEstateListData([]);
    }, 500),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  const selectEstate = (estate: {
    id: string;
    title: string;
    estateCode: number;
    files: { url: string }[];
  }) => {
    setSelectedEstate({
      id: estate.id,
      title: estate.title,
      estateCode: estate.estateCode,
      thumbnailUrl: estate.files?.[0]?.url,
    });
  };

  const handleAddEstate = () => {
    if (selectedEstate || editingEstateId) {
      if (
        editingEstateId &&
        currentEstateId === editingEstateId &&
        selectedEstate === null
      ) {
        onClose();
        return;
      }
      onSelectEstate(
        selectedEstate || {
          id: editingEstateId || "",
          title: "",
        },
      );
    }
  };

  const handleClose = () => {
    setSearchInputValue("");
    setSearchQuery("");
    onClose();
  };

  return createPortal(
    <Modal
      doNotHiddenOverflow
      isOpen={isOpen}
      title="انتخاب ملک"
      classNames={{
        background: "z-[60] !py-0 sm:!px-4 !px-0",
        box: "sm:!max-w-md sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}>
      <div className="flex h-full flex-col gap-y-4 px-6 py-7">
        <div>
          <label className="text-sm">جستجوی ملک</label>
          <div className="relative mt-2">
            <input
              type="text"
              value={searchInputValue}
              onChange={handleSearch}
              placeholder="جستجوی نام یا کد فایل"
              className="w-full rounded-xl border border-primary-border px-3 py-3 pr-5 text-sm outline-none focus:border-black/50"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-primary-border md:max-h-64">
            {estateList.isLoading && estateListData.length === 0 ? (
              <div className="flex h-12 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
              </div>
            ) : estateListData.length === 0 ? (
              <div className="flex h-12 items-center justify-center text-sm text-gray-500">
                ملکی یافت نشد
              </div>
            ) : (
              <>
                {estateListData.map((estate) => (
                  <div
                    key={estate.id}
                    className={`cursor-pointer border-b border-primary-border px-3 py-3 transition-all duration-200 hover:bg-gray-50 ${
                      selectedEstate?.id === estate.id
                        ? "border-r-4 border-r-primary bg-primary/5 shadow-sm"
                        : ""
                    }`}
                    onClick={() => selectEstate(estate)}>
                    <div className="flex items-center gap-x-3">
                      <div className="size-10 overflow-hidden rounded-md bg-neutral-200">
                        {estate.posterFile?.url ? (
                          <CustomImage
                            src={
                              estate.posterFile?.url ||
                              "/images/image-placeholder.jpg"
                            }
                            alt="estate"
                            width={80}
                            height={80}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs font-medium">
                            <ImageOffIcon className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{estate.title}</p>
                        <p className="text-xs text-gray-500">
                          کد فایل: {estate.estateCode}
                        </p>
                      </div>
                      {selectedEstate?.id === estate.id && (
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div ref={loadMoreRef} className="h-4 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4 pb-7">
        <Button
          type="button"
          className="!px-10"
          onClick={handleAddEstate}
          disabled={!selectedEstate}>
          انتخاب
        </Button>
        <BorderedButton type="button" className="!px-10" onClick={handleClose}>
          لغو
        </BorderedButton>
      </div>
    </Modal>,
    document.body,
  );
}
