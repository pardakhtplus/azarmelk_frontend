"use client";

import { IArrowRight, IChevronLeft } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { useCategories } from "@/services/queries/admin/category/useCategories";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import { type TCategory } from "@/types/admin/category/types";
import { useState } from "react";
import { type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import { type personalFormSchema } from "./EditPersonal";

export default function SelectCategories({
  watch,
  setValue,
  setIsEditingProfilePermissions,
  isEditingPermissions,
}: {
  watch: UseFormWatch<z.infer<typeof personalFormSchema>>;
  setValue: UseFormSetValue<z.infer<typeof personalFormSchema>>;
  setIsEditingProfilePermissions: (
    isEditingProfilePermissions: boolean,
  ) => void;
  isEditingPermissions: boolean;
}) {
  const [selectedCategories, setSelectedCategories] = useState<
    (TCategory & { parents: { id: string }[]; parentId?: string })[]
  >([]);
  const { categories } = useCategories();
  const { regions } = useRegions({
    id: selectedCategories?.[selectedCategories.length - 1]?.id,
    disabled: selectedCategories.length < 2,
  });

  return (
    <div className="mt-3 divide-y divide-primary-border overflow-hidden rounded-xl border border-primary-border">
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
            watch={watch}
            category={{
              id: category.id,
              name: category.name,
              parentId: category.parentId,
              dealType: category.dealType,
            }}
            onClick={() => {
              setSelectedCategories([
                {
                  ...category,
                  parents: [],
                  parentId: "",
                },
              ]);
            }}
            onSelect={(event) => {
              if (!isEditingPermissions) setIsEditingProfilePermissions(true);
              if (event.target.checked) {
                setValue("categories", [
                  ...watch("categories"),
                  {
                    ...category,
                    parents: selectedCategories,
                    parentId: category.parentId || undefined,
                  },
                ]);
              } else {
                setValue(
                  "categories",
                  watch("categories").filter((c) => c.id !== category.id),
                );
              }
            }}
            isChosen={watch("categories").some((c) => c.id === category.id)}
          />
        ))
      ) : selectedCategories.length === 1 ? (
        categories.data?.data
          ?.find((category) => category.id === selectedCategories[0].id)
          ?.children.map((category) => (
            <CategoryButton
              key={category.id}
              watch={watch}
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
                    parentId: category.parentId || "",
                  },
                ]);
              }}
              onSelect={(event) => {
                if (!isEditingPermissions) setIsEditingProfilePermissions(true);
                if (event.target.checked) {
                  setValue("categories", [
                    ...watch("categories"),
                    {
                      ...category,
                      parents: selectedCategories,
                      parentId: category.parentId,
                    },
                  ]);
                } else {
                  setValue(
                    "categories",
                    watch("categories").filter((c) => c.id !== category.id),
                  );
                }
              }}
              isChosen={watch("categories").some((c) => c.id === category.id)}
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
            watch={watch}
            category={category}
            onClick={() => {
              setSelectedCategories([
                ...selectedCategories,
                {
                  ...category,
                  parents: selectedCategories,
                  parentId: category.parentId,
                },
              ]);
            }}
            onSelect={(event) => {
              if (!isEditingPermissions) setIsEditingProfilePermissions(true);
              if (event.target.checked) {
                setValue("categories", [
                  ...watch("categories"),
                  {
                    ...category,
                    parents: selectedCategories,
                    parentId: category.parentId,
                  },
                ]);
              } else {
                setValue(
                  "categories",
                  watch("categories").filter((c) => c.id !== category.id),
                );
              }
            }}
            isChosen={watch("categories").some((c) => c.id === category.id)}
          />
        ))
      ) : (
        regions.data?.data.children.map((area) => (
          <CategoryButton
            key={area.id}
            watch={watch}
            category={area}
            onClick={() => {
              if (selectedCategories.length >= 4) return;

              setSelectedCategories([
                ...selectedCategories,
                {
                  ...area,
                  parents: selectedCategories,
                  parentId: area.parentId || "",
                },
              ]);
            }}
            onSelect={(event) => {
              if (!isEditingPermissions) setIsEditingProfilePermissions(true);
              if (event.target.checked) {
                setValue("categories", [
                  ...watch("categories"),
                  {
                    ...area,
                    parents: selectedCategories,
                    parentId: area.parentId || "",
                  },
                ]);
              } else {
                setValue(
                  "categories",
                  watch("categories").filter((c) => c.id !== area.id),
                );
              }
            }}
            isChosen={watch("categories").some((c) => c.id === area.id)}
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
  isChosen,
  isDisabled,
  watch,
}: {
  category: TCategory;
  onClick: () => void;
  onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChosen?: boolean;
  isDisabled?: boolean;
  watch: UseFormWatch<z.infer<typeof personalFormSchema>>;
}) {
  const selectedCategoriesCount = watch("categories").filter(
    (selectedCategory) =>
      selectedCategory.parents?.some((parent) => parent.id === category.id) ||
      selectedCategory.parentId === category.id,
  ).length;
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80",
        isChosen && "bg-neutral-100",
      )}
      onClick={() => {
        if (isChosen)
          return toast.error("این دسته بندی قبلا انتخاب شده است", {
            duration: 1000,
          });
        onClick();
      }}>
      <div className="flex items-center gap-x-3">
        <span>{category.name}</span>
        {selectedCategoriesCount ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary-blue pt-0.5 text-xs text-white">
            {selectedCategoriesCount}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-x-4">
        <div
          className="cntr"
          onClick={(e) => {
            e.stopPropagation();

            if (isDisabled)
              return toast.error("شما در حالت ویرایش نیستید!", {
                duration: 1000,
              });
          }}>
          <input
            type="checkbox"
            id={`cbx-${category.id}`}
            className="checkbox hidden-xs-up"
            onChange={onSelect}
            checked={isChosen}
            disabled={isDisabled}
          />
          <label htmlFor={`cbx-${category.id}`} className="cbx" />
        </div>
        <IChevronLeft className="ml-2 size-4" />
      </div>
    </button>
  );
}

function LoadingCategoryButton() {
  return (
    <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
      <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
      <div className="flex items-center gap-x-4 pl-2">
        <div className="size-6 animate-pulse rounded-full bg-primary/20" />
        <div className="size-6 animate-pulse rounded-full bg-primary/20" />
      </div>
    </div>
  );
}
