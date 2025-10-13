"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import type { MutateSessionForm } from "./MutateSession";

export default function PaymentMethodInput({
  register,
  error,
}: {
  register: UseFormRegister<MutateSessionForm>;
  error?: FieldError;
}) {
  return (
    <div>
      <label htmlFor="paymentMethod" className="text-sm">
        نحوه پرداخت
      </label>
      <BorderedInput
        register={register}
        name="paymentMethod"
        error={error}
        containerClassName="mb-2 mt-1"
        type="text"
      />
    </div>
  );
}
