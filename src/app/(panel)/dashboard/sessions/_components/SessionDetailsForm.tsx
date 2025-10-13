"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { formatNumber } from "@/lib/utils";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  users: z.array(
    z.object({
      userId: z.string(),
      percent: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      avatar: z
        .object({
          url: z.string().optional(),
        })
        .optional(),
    }),
  ),
  startSession: z.any(),
  room: z.number(),
  sellerName: z.string(),
  buyerName: z.string(),
  lowestSellingPrice: z.string(),
  maximumBudget: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface SessionDetailsFormProps {
  register: UseFormRegister<FormSchemaType>;
  errors: {
    sellerName?: FieldError;
    buyerName?: FieldError;
    lowestSellingPrice?: FieldError;
    maximumBudget?: FieldError;
  };
  defaultSession?: any;
}

export default function SessionDetailsForm({
  register,
  errors,
  defaultSession,
}: SessionDetailsFormProps) {
  return (
    <div className="pt-5">
      <label htmlFor="title" className="font-medium">
        اطلاعات معامله
      </label>
      <div className="flex items-start gap-x-7 pt-3">
        <div className="w-full">
          <label htmlFor="sellerName" className="text-sm">
            نام فروشنده
          </label>
          <BorderedInput
            register={register}
            name="sellerName"
            error={errors.sellerName}
            containerClassName="mb-2 mt-1"
            type="text"
          />
        </div>
        <div className="w-full">
          <label htmlFor="buyerName" className="text-sm">
            نام خریدار
          </label>
          <BorderedInput
            register={register}
            name="buyerName"
            error={errors.buyerName}
            containerClassName="mb-2 mt-1"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-start gap-x-7 pt-3">
        <div className="w-full">
          <label htmlFor="lowestSellingPrice" className="text-sm">
            کف قیمت فروش
          </label>
          <BorderedInput
            register={register}
            name="lowestSellingPrice"
            error={errors.lowestSellingPrice}
            containerClassName="mb-2 mt-1"
            type="text"
            defaultValue={formatNumber(
              defaultSession?.lowestSellingPrice?.toString() || "",
            )}
            isCurrency
            showCurrency
          />
        </div>
        <div className="w-full">
          <label htmlFor="maximumBudget" className="text-sm">
            حداکثر بودجه
          </label>
          <BorderedInput
            register={register}
            name="maximumBudget"
            error={errors.maximumBudget}
            containerClassName="mb-2 mt-1"
            type="text"
            defaultValue={formatNumber(
              defaultSession?.maximumBudget?.toString() || "",
            )}
            isCurrency
            showCurrency
          />
        </div>
      </div>
    </div>
  );
}
