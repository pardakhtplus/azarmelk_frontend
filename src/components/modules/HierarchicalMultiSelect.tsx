import { cn } from "@/lib/utils";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type FieldError } from "react-hook-form";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

export type THierarchicalOption = {
  key: string;
  title: string;
  children?: THierarchicalOption[];
  parent?: {
    id: string;
    title: string;
  };
};

export type TSelectedOption = {
  key: string;
  title: string;
  parent?: {
    id: string;
    title: string;
  };
};

const HierarchicalMultiSelect = ({
  options,
  selectedRegions,
  setSelectedRegions,
  error,
  className,
  containerClassName,
  dropDownClassName,
  disable,
  placeholder = "انتخاب کنید",
}: {
  options: THierarchicalOption[];
  selectedRegions: TSelectedOption[];
  setSelectedRegions: (selectedRegions: TSelectedOption[]) => void;
  error?:
    | FieldError
    | undefined
    | {
        message: string;
      };
  className?: string;
  containerClassName?: string;
  dropDownClassName?: string;
  disable?: boolean;
  placeholder?: string;
}) => {
  const isSm = useMediaQuery("(max-width: 640px)");
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openedRegion, setOpenedRegion] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const toggleDropdown = () => {
    if (!disable) {
      setIsOpen(!isOpen);
    }
  };

  useOnClickOutside(ref as RefObject<HTMLDivElement>, () => {
    if (isSm) return;
    setIsOpen(false);
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 640;

    if (!isOpen) {
      setOpenedRegion(null);
    }

    if (isOpen && isMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <div ref={ref} className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "bg-background-color flex min-h-12 cursor-pointer items-center justify-between gap-x-2 rounded-xl border border-primary-border px-3 py-2 text-sm text-text shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-black",
          isOpen && "border-neutral-600",
          error?.message && "border-[#ff0000]",
          className,
          disable && "pointer-events-none cursor-not-allowed opacity-50",
        )}
        onClick={toggleDropdown}>
        <div className="flex flex-1 flex-wrap gap-2">
          <span>{placeholder}</span>
          {selectedRegions.length > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary-blue/10 text-sm text-primary-blue">
              {selectedRegions.length}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {error ? (
        <p className="pt-1 text-start text-xs text-[#ff0000]">
          {error?.message}
        </p>
      ) : null}
      {isOpen && isSm ? (
        <>
          {createPortal(
            <MultiSelectModal
              options={options}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              openedRegion={openedRegion}
              setOpenedRegion={setOpenedRegion}
              dropDownClassName={dropDownClassName}
              setIsOpen={setIsOpen}
            />,
            document.body,
          )}
        </>
      ) : isOpen ? (
        <MultiSelectModal
          options={options}
          selectedRegions={selectedRegions}
          setSelectedRegions={setSelectedRegions}
          openedRegion={openedRegion}
          setOpenedRegion={setOpenedRegion}
          dropDownClassName={dropDownClassName}
          setIsOpen={setIsOpen}
        />
      ) : null}
    </div>
  );
};

export function MultiSelectModal({
  options,
  selectedRegions,
  setSelectedRegions,
  openedRegion,
  setOpenedRegion,
  dropDownClassName,
  setIsOpen,
}: {
  options: THierarchicalOption[];
  selectedRegions: TSelectedOption[];
  setSelectedRegions: (selectedRegions: TSelectedOption[]) => void;
  openedRegion: {
    id: string;
    title: string;
  } | null;
  setOpenedRegion: (openedRegion: { id: string; title: string } | null) => void;
  dropDownClassName?: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { regions } = useRegions({
    id: openedRegion?.id || "",
    disabled: !openedRegion,
  });

  const handleOptionSelect = (selectedOption: THierarchicalOption) => {
    const isSelected = selectedRegions.some(
      (item) => item.key === selectedOption.key,
    );
    let newValue: TSelectedOption[];

    if (isSelected) {
      // Remove if already selected
      newValue = selectedRegions.filter(
        (item) => item.key !== selectedOption.key,
      );
      // Also remove all children if this is a parent
      if (selectedOption.children) {
        newValue = newValue.filter(
          (item) =>
            !selectedOption.children?.some((child) => child.key === item.key),
        );
      }
    } else {
      // Add if not selected
      newValue = [...selectedRegions, selectedOption];
      // If this is a parent, also add all children
      if (selectedOption.children) {
        const childrenOptions = selectedOption.children.map((child) => ({
          key: child.key,
          title: child.title,
          parent: selectedOption.parent,
        }));
        newValue = [...newValue, ...childrenOptions];
      }
    }

    setSelectedRegions(newValue);
  };

  const isOptionSelected = (option: THierarchicalOption) => {
    return selectedRegions.some((item) => item.key === option.key);
  };

  const getSelectedChildrenCount = (option: THierarchicalOption) => {
    return selectedRegions.filter((item) => item.parent?.id === option.key)
      .length;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 block size-full bg-black/30 backdrop-blur-sm sm:hidden"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 mt-1 size-full max-h-64 w-fit min-w-56 overflow-auto border border-primary-border bg-white py-1 text-base shadow-lg ring-opacity-5 focus:outline-none sm:absolute sm:!inset-auto sm:z-10 sm:h-auto sm:max-h-48 sm:rounded-md sm:text-sm",
          dropDownClassName,
          openedRegion && "!pt-0",
        )}>
        {openedRegion ? (
          <>
            <div key={openedRegion.id}>
              <div
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 bg-neutral-200/70 px-4 py-2.5 opacity-70 transition-all hover:bg-gray-200",
                )}
                onClick={() => {
                  setOpenedRegion(null);
                }}>
                <button type="button">
                  <ChevronRightIcon className="size-5" />
                </button>
                <span className="flex-1">برگشت به منطقه ها</span>
              </div>
            </div>
            {regions.isLoading ? (
              <p className="py-3 text-center text-sm text-gray-500">
                در حال بارگذاری...
              </p>
            ) : regions.data?.data.children.length ? (
              regions.data?.data.children.map((option) => (
                <div key={option.id}>
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 px-4 py-2.5 hover:bg-gray-100",
                    )}>
                    <div
                      className="cntr"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}>
                      <input
                        type="checkbox"
                        id={`cbx-${option.id}`}
                        className="checkbox hidden-xs-up"
                        checked={isOptionSelected({
                          key: option.id,
                          title: option.name,
                        })}
                        onChange={() => {
                          ("object");
                          handleOptionSelect({
                            key: option.id,
                            title: option.name,
                            parent: openedRegion,
                          });
                        }}
                      />
                      <label htmlFor={`cbx-${option.id}`} className="cbx" />
                    </div>
                    <span className="flex-1">{option.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-3 text-center text-sm text-gray-500">
                زیرمنطقه‌ای ای وجود ندارد
              </p>
            )}
          </>
        ) : (
          options.map((option) => (
            <div key={option.key}>
              <div
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2.5 px-4 py-2.5 hover:bg-gray-100",
                )}
                onClick={() => {
                  setOpenedRegion({ id: option.key, title: option.title });
                }}>
                <div
                  className="flex items-center gap-2.5"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}>
                  <div
                    className="cntr"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}>
                    <input
                      type="checkbox"
                      id={`cbx-${option.key}`}
                      className="checkbox hidden-xs-up"
                      checked={isOptionSelected(option)}
                      onChange={() => {
                        handleOptionSelect(option);
                      }}
                    />
                    <label htmlFor={`cbx-${option.key}`} className="cbx" />
                  </div>
                  <span className="flex-1">{option.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getSelectedChildrenCount(option) > 0 && (
                    <p className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                      <span className="-mb-[1.5px]">
                        {getSelectedChildrenCount(option)}
                      </span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenedRegion({
                        id: option.key,
                        title: option.title,
                      });
                    }}
                    className="rounded p-0.5 hover:bg-gray-200">
                    <ChevronLeftIcon className="size-5" />
                  </button>
                </div>
              </div>
              {/* {hasChildren && (
                <div>
                  {option.children?.map((child) =>
                    renderOption(child, level + 1, option.key),
                  )}
                </div>
              )} */}
            </div>
          ))
        )}
      </div>
    </>
  );
}
export default HierarchicalMultiSelect;
