"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import type { MutateSessionForm } from "./MutateSession";
import PaymentMethodInput from "./PaymentMethodInput";

export default function SessionBasicInfoForm({
  register,
  errors,
}: {
  register: UseFormRegister<MutateSessionForm>;
  errors: {
    title?: FieldError;
    paymentMethod?: FieldError;
  };
}) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="">
        <label htmlFor="title" className="text-sm">
          موضوع جلسه
        </label>
        <BorderedInput
          register={register}
          name="title"
          error={errors.title}
          containerClassName="mb-2 mt-1"
          type="text"
        />
      </div>
      {/* Payment Method */}
      <PaymentMethodInput register={register} error={errors.paymentMethod} />
    </div>
  );
}
