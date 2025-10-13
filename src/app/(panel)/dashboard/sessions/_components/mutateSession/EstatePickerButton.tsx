"use client";

import Button from "@/components/modules/buttons/Button";
import { ImageOffIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { type UseFormWatch, type FieldError } from "react-hook-form";
import { type MutateSessionForm } from "./MutateSession";

export default function EstatePickerButton({
  onOpen,
  hasSelected,
  error,
  onClear,
  watch,
}: {
  onOpen: () => void;
  hasSelected: boolean;
  error?: FieldError;
  onClear?: () => void;
  watch: UseFormWatch<MutateSessionForm>;
}) {
  return (
    <div className="w-full rounded-lg border border-primary-border p-4">
      <div className="flex items-center justify-between">
        <label htmlFor="estateId" className="text-sm">
          انتخاب ملک
        </label>
      </div>
      <div className="mt-2 flex items-center gap-x-2">
        <Button
          type="button"
          size="sm"
          className="flex !h-9 items-center gap-x-1 !pl-5 !pr-4 text-xs"
          onClick={onOpen}>
          {hasSelected ? "تغییر ملک" : "انتخاب ملک"}
        </Button>
        {hasSelected && onClear && (
          <Button
            type="button"
            size="sm"
            variant="red"
            className="flex !h-9 items-center gap-x-1 !px-3 text-xs"
            onClick={onClear}>
            <XIcon className="size-3.5" />
            حذف
          </Button>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error.message as string}</p>
        )}
      </div>
      {hasSelected && (
        <div className="mt-3 flex items-center gap-x-3">
          <div className="size-12 overflow-hidden rounded-md bg-neutral-200">
            {watch("estate.thumbnailUrl") ? (
              <Image
                src={
                  watch("estate.thumbnailUrl") ||
                  "/images/image-placeholder.jpg"
                }
                alt="estate"
                width={64}
                height={64}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-gray-500">
                <ImageOffIcon className="size-5" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="mb-0.5 text-sm font-medium">
              {watch("estate.title") || ""}
            </p>
            {watch("estate.estateCode") ? (
              <p className="text-xs text-gray-500">
                کد فایل: {watch("estate.estateCode")}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
