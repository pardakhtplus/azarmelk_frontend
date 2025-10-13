"use client";

import { IArrowRight, ICheck, IChevronLeft } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { useCategories } from "@/services/queries/admin/category/useCategories";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import { type TCategory } from "@/types/admin/category/types";
import { useState } from "react";

export default function SelectCategories({
  onSelect,
}: {
  onSelect: (region: TCategory, parentCategory: TCategory[]) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<
    (TCategory & { parents: { id: string }[] })[]
  >([]);
  const { categories } = useCategories();
  const { regions } = useRegions({
    id: selectedCategories?.[selectedCategories.length - 1]?.id,
    disabled: selectedCategories.length < 2,
  });

  return (
    <div className="divide-y divide-primary-border overflow-hidden rounded-xl border border-primary-border">
      {selectedCategories.length ? (
        <button
          className="flex w-full items-center gap-2 px-5 py-4 text-sm text-primary-blue transition-colors hover:bg-primary-blue/5"
          onClick={() => {
            setSelectedCategories([...selectedCategories.slice(0, -1)]);
          }}>
          <IArrowRight className="size-4" />
          {selectedCategories.length === 1 ? (
            <span>بازگشت به دسته بندی نوع معامله</span>
          ) : selectedCategories.length === 2 ? (
            <span>بازگشت به دسته بندی نوع کاربری</span>
          ) : selectedCategories.length === 3 ? (
            <span>بازگشت به دسته بندی نوع ملک</span>
          ) : selectedCategories.length === 4 ? (
            <span>بازگشت به مناطق</span>
          ) : null}
        </button>
      ) : null}
      {categories.isLoading ? (
        <>
          <LoadingCategoryButton />
          <LoadingCategoryButton />
        </>
      ) : !selectedCategories.length ? (
        categories.data?.data.map((category) => (
          <CategoryButton
            key={category.id}
            category={{
              id: category.id,
              name: category.name,
              parentId: category.parentId,
              dealType: category.dealType,
              mainCategory: category.mainCategory ?? undefined,
            }}
            onClick={() => {
              setSelectedCategories([
                {
                  ...category,
                  parents: [],
                },
              ]);
            }}
            onSelect={() => {
              onSelect(category, selectedCategories);
            }}
          />
        ))
      ) : selectedCategories.length === 1 ? (
        categories.data?.data
          ?.find((category) => category.id === selectedCategories[0].id)
          ?.children.map((category) => (
            <CategoryButton
              key={category.id}
              category={{
                id: category.id,
                name: category.name,
                parentId: category.parentId,
                dealType: category.dealType,
              }}
              onClick={() => {
                setSelectedCategories([
                  ...selectedCategories,
                  {
                    ...category,
                    parents: selectedCategories,
                  },
                ]);
              }}
              onSelect={() => {
                onSelect(category, selectedCategories);
              }}
            />
          ))
      ) : regions.isLoading ? (
        <>
          <LoadingCategoryButton />
          <LoadingCategoryButton />
        </>
      ) : selectedCategories.length === 2 ? (
        regions.data?.data.children.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            onClick={() => {
              setSelectedCategories([
                ...selectedCategories,
                {
                  ...category,
                  parents: selectedCategories,
                },
              ]);
            }}
            onSelect={() => {
              onSelect(category, selectedCategories);
            }}
          />
        ))
      ) : (
        regions.data?.data.children.map((area) => (
          <CategoryButton
            key={area.id}
            category={area}
            onClick={() => {
              if (selectedCategories.length >= 4) return;

              setSelectedCategories([
                ...selectedCategories,
                {
                  ...area,
                  parents: selectedCategories,
                },
              ]);
            }}
            onSelect={() => {
              onSelect(area, selectedCategories);
            }}
            canSelect
          />
        ))
      )}
    </div>
  );
}

function CategoryButton({
  category,
  onClick,
  onSelect,
  canSelect,
}: {
  category: TCategory;
  onClick: () => void;
  onSelect: () => void;
  canSelect?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 px-5 py-4 transition-all hover:bg-neutral-100/80",
        !canSelect && "py-5",
      )}
      onClick={() => {
        onClick();
      }}>
      <div className="flex items-center gap-x-3">
        <span>{category.name}</span>
      </div>
      <div className="flex items-center gap-x-4">
        {canSelect && (
          <button
            className="flex items-center gap-x-1.5 rounded-md bg-primary-blue py-1.5 pl-3 pr-2.5 text-xs font-medium text-white transition-colors hover:bg-primary-blue/90"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}>
            <ICheck className="size-3.5" />
            <span>انتخاب</span>
          </button>
        )}

        <IChevronLeft className="ml-2 size-4" />
      </div>
    </div>
  );
}

function LoadingCategoryButton() {
  return (
    <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
      <div className="h-6 w-40 animate-pulse rounded-full bg-primary/10" />
      <div className="flex items-center gap-x-4 pl-2">
        <div className="size-6 animate-pulse rounded-full bg-primary/20" />
        <div className="size-6 animate-pulse rounded-full bg-primary/20" />
      </div>
    </div>
  );
}
