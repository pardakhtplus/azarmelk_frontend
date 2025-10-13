"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { formatNumber } from "@/lib/utils";
import { type TSession } from "@/types/admin/session/type";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import type { MutateSessionForm } from "./MutateSession";

export default function ApplicantInfoForm({
  register,
  errors,
  setValue,
  session,
}: {
  register: UseFormRegister<MutateSessionForm>;
  errors: {
    buyerName?: FieldError;
    applicantName?: FieldError;
    applicantPhoneNumber?: FieldError;
    applicantBudget?: FieldError;
    applicantFinalBudget?: FieldError;
    attractApplicantsMethod?: FieldError;
  };
  setValue: (
    name: keyof MutateSessionForm,
    value: MutateSessionForm[keyof MutateSessionForm],
  ) => void;
  session?: TSession;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-4 text-sm font-medium">اطلاعات خریدار / متقاضی</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="applicantName" className="text-sm">
            نام متقاضی
          </label>
          <BorderedInput
            register={register}
            name="applicantName"
            error={errors.applicantName}
            containerClassName="mb-2 mt-1"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="applicantPhoneNumber" className="text-sm">
            شماره تلفن متقاضی
          </label>
          <BorderedInput
            register={register}
            name="applicantPhoneNumber"
            error={errors.applicantPhoneNumber}
            containerClassName="mb-2 mt-1"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="applicantBudget" className="text-sm">
            بودجه متقاضی (تومان)
          </label>
          <BorderedInput
            register={register}
            name="applicantBudget"
            error={errors.applicantBudget}
            containerClassName="mb-2 mt-1"
            type="text"
            onChange={(e) => {
              const formattedValue = formatNumber(e.target.value);
              setValue("applicantBudget", formattedValue);
            }}
            isCurrency
            defaultValue={session?.applicantBudget}
          />
        </div>
        <div>
          <label htmlFor="applicantFinalBudget" className="text-sm">
            بودجه نهایی متقاضی (تومان)
          </label>
          <BorderedInput
            register={register}
            name="applicantFinalBudget"
            error={errors.applicantFinalBudget}
            containerClassName="mb-2 mt-1"
            type="text"
            onChange={(e) => {
              const formattedValue = formatNumber(e.target.value);
              setValue("applicantFinalBudget", formattedValue);
            }}
            isCurrency
            defaultValue={session?.applicantFinalBudget}
          />
        </div>
      </div>
      <div>
        <label htmlFor="attractApplicantsMethod" className="text-sm">
          نحوه جذب متقاضی
        </label>
        <BorderedInput
          register={register}
          name="attractApplicantsMethod"
          error={errors.attractApplicantsMethod}
          containerClassName="mb-2 mt-1"
          type="text"
        />
      </div>
    </div>
  );
}
