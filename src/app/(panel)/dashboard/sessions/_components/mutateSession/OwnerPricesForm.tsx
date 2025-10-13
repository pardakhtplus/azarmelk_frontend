"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { formatNumber } from "@/lib/utils";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import type { MutateSessionForm } from "./MutateSession";
import { type TSession } from "@/types/admin/session/type";

export default function OwnerPricesForm({
  register,
  errors,
  setValue,
  isLockedByEstate,
  session,
}: {
  register: UseFormRegister<MutateSessionForm>;
  errors: {
    sellerName?: FieldError;
    ownerPrice?: FieldError;
    ownerFinalPrice?: FieldError;
  };
  setValue: (
    name: keyof MutateSessionForm,
    value: MutateSessionForm[keyof MutateSessionForm],
  ) => void;
  isLockedByEstate?: boolean;
  session?: TSession;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">اطلاعات فروشنده</h3>
        {isLockedByEstate && (
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-gray-600">
            بر اساس ملک
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="sellerName" className="text-sm">
            نام فروشنده/موجر
          </label>
          <BorderedInput
            register={register}
            name="sellerName"
            error={errors.sellerName}
            containerClassName="mb-2 mt-1"
            type="text"
            disabled={isLockedByEstate}
          />
        </div>
        <div>
          <label htmlFor="ownerPrice" className="text-sm">
            قیمت اعلامی مالک (تومان)
          </label>
          <BorderedInput
            register={register}
            name="ownerPrice"
            error={errors.ownerPrice}
            containerClassName="mb-2 mt-1"
            type="text"
            onChange={(e) => {
              const formattedValue = formatNumber(e.target.value);
              setValue("ownerPrice", formattedValue);
            }}
            disabled={isLockedByEstate}
            isCurrency
            defaultValue={session?.ownerPrice}
          />
        </div>
        <div>
          <label htmlFor="ownerFinalPrice" className="text-sm">
            قیمت نهایی مالک قبل از جلسه (تومان)
          </label>
          <BorderedInput
            register={register}
            name="ownerFinalPrice"
            error={errors.ownerFinalPrice}
            containerClassName="mb-2 mt-1"
            type="text"
            onChange={(e) => {
              const formattedValue = formatNumber(e.target.value);
              setValue("ownerFinalPrice", formattedValue);
            }}
            disabled={isLockedByEstate}
            isCurrency
            defaultValue={session?.ownerFinalPrice}
          />
        </div>
      </div>
    </div>
  );
}
