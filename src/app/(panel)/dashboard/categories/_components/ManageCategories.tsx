"use client";

import {
  IArrowRight,
  IChevronLeft,
  IPencil,
  IPlus,
  ITrash,
} from "@/components/Icons";
import NotificationModal from "@/components/modules/NotificationModal";
import { Permissions } from "@/permissions/permission.types";
import useDeleteRegion from "@/services/mutations/admin/category/useDeleteRegion";
import { useCategories } from "@/services/queries/admin/category/useCategories";
import { useRegions } from "@/services/queries/admin/category/useRegions";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { type TCategory } from "@/types/admin/category/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import MutateCategory from "./MutateCategory";

export default function ManageCategories() {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const { categories } = useCategories();
  const { regions } = useRegions({
    id: selectedCategories?.[selectedCategories.length - 1]?.id,
    disabled: selectedCategories.length < 2,
  });
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();

  const { deleteRegion } = useDeleteRegion();

  const isHighAccess =
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER);

  const isAccessToEdit =
    isHighAccess ||
    userInfo?.data?.data.accessPerms.includes(Permissions.EDIT_CAT);
  const isAccessToCreate =
    isHighAccess ||
    userInfo?.data?.data.accessPerms.includes(Permissions.CREATE_CAT);

  return (
    <div className="mt-10 divide-y divide-primary-border overflow-hidden rounded-xl border border-primary-border">
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
      {/* <button className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
        <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
        <div className="flex items-center gap-x-4 pl-2">
          <div className="size-6 animate-pulse rounded-full bg-primary/20" />
          <div className="size-6 animate-pulse rounded-full bg-primary/20" />
        </div>
      </button> */}
      {categories.isLoading ? (
        <>
          <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
            <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
            <div className="flex items-center gap-x-4 pl-2">
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
            <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
            <div className="flex items-center gap-x-4 pl-2">
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
            </div>
          </div>
        </>
      ) : !selectedCategories.length ? (
        categories.data?.data.map((category) => (
          <button
            key={category.id}
            className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80"
            onClick={() => {
              setSelectedCategories([
                {
                  ...category,
                  mainCategory: category.mainCategory ?? undefined,
                },
              ]);
            }}>
            <span>{category.name}</span>
            <IChevronLeft className="ml-2 size-4" />
          </button>
        ))
      ) : selectedCategories.length === 1 ? (
        categories.data?.data
          ?.find((category) => category.id === selectedCategories[0].id)
          ?.children.map((category) => (
            <button
              key={category.id}
              className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80"
              onClick={() => {
                setSelectedCategories([...selectedCategories, category]);
              }}>
              <span>{category.name}</span>
              <IChevronLeft className="ml-2 size-4" />
            </button>
          ))
      ) : regions.isLoading ? (
        <>
          <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
            <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
            <div className="flex items-center gap-x-4 pl-2">
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80">
            <div className="h-6 w-40 animate-pulse rounded-full bg-primary/20" />
            <div className="flex items-center gap-x-4 pl-2">
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
              <div className="size-6 animate-pulse rounded-full bg-primary/20" />
            </div>
          </div>
        </>
      ) : selectedCategories.length === 2 ? (
        regions.data?.data.children.map((category) => (
          <button
            key={category.id}
            className="flex w-full items-center justify-between gap-2 p-5 transition-all hover:bg-neutral-100/80"
            onClick={() => {
              setSelectedCategories([...selectedCategories, category]);
            }}>
            <span>{category.name}</span>
            <IChevronLeft className="ml-2 size-4" />
          </button>
        ))
      ) : (
        regions.data?.data.children.map((area) => (
          <div
            key={area.id}
            className="flex w-full items-center justify-between gap-2 px-5 py-4 transition-all hover:bg-neutral-100/80"
            onClick={() => {
              if (selectedCategories.length >= 4) return;

              setSelectedCategories([...selectedCategories, area]);
            }}>
            <div className="flex flex-col gap-0.5">
              <span>{area.name}</span>
              <span className="text-xs text-text-100">
                تعداد فایل: {area._count?.estates || 0}
              </span>
            </div>
            <div className="flex items-center gap-x-2 pl-2">
              {isHighAccess && (
                <NotificationModal
                  title="حذف"
                  description="آیا از حذف این منطقه مطمئن هستید؟"
                  className="rounded-full p-1.5 text-primary-red transition-all hover:bg-primary-red/10 active:bg-primary-red/20"
                  aria-label="Delete"
                  onSubmit={async () => {
                    const res = await deleteRegion.mutateAsync(area.id);
                    if (!res) return false;

                    queryClient.invalidateQueries({
                      queryKey: [
                        "regions",
                        selectedCategories[selectedCategories.length - 1].id,
                      ],
                    });

                    return true;
                  }}>
                  <ITrash className="size-[18px]" />
                </NotificationModal>
              )}
              {isAccessToEdit && (
                <MutateCategory
                  title="ویرایش"
                  className="rounded-full p-1.5 text-primary-blue transition-all hover:bg-primary-blue/10 active:bg-primary-blue/20"
                  categories={selectedCategories}
                  defaultValues={area}
                  isEdit>
                  <IPencil className="size-[18px]" />
                </MutateCategory>
              )}

              {selectedCategories.length < 4 ? (
                <button className="p-1.5">
                  <IChevronLeft className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        ))
      )}

      {selectedCategories.length > 2 && isAccessToCreate && (
        <>
          <MutateCategory
            title="افزودن منطقه جدید"
            className="flex w-full items-center gap-2 px-5 py-4 text-primary-blue transition-colors hover:bg-primary-blue/5"
            categories={selectedCategories}>
            <IPlus className="size-5" />
            <span>افزودن منطقه جدید</span>
          </MutateCategory>
        </>
      )}
    </div>
  );
}
