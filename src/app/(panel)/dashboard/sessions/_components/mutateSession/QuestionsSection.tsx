"use client";

import CustomSwitch from "@/components/modules/CustomSwitch";
import TextArea from "@/components/modules/inputs/TextArea";
import {
  type UseFormWatch,
  type FieldError,
  type UseFormRegister,
} from "react-hook-form";
import type { MutateSessionForm } from "./MutateSession";

export default function QuestionsSection({
  register,
  errors,
  setValue,
  watch,
}: {
  register: UseFormRegister<MutateSessionForm>;
  errors: {
    qOne?: FieldError;
    qTwo?: FieldError;
  };
  setValue: <K extends keyof MutateSessionForm>(
    name: K,
    value: MutateSessionForm[K],
  ) => void;
  watch: UseFormWatch<MutateSessionForm>;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-4 text-sm font-medium">سوالات</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="qOne" className="text-sm">
            به نظر شما کدام یک از طرفین انعطاف بیشتری دارند؟
          </label>
          <TextArea
            register={register}
            name="qOne"
            error={errors.qOne}
            containerClassName="mb-2 mt-1"
            rows={2}
          />
        </div>
        <div>
          <label htmlFor="qTwo" className="text-sm">
            آیا ۱٪ حق الزحمه فروش را به طرفین اعلام کردید؟
          </label>
          <TextArea
            register={register}
            name="qTwo"
            error={errors.qTwo}
            containerClassName="mb-2 mt-1"
            rows={2}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-x-3">
          <label className="text-sm">
            آیا فروشنده یا موجر یادآوری کرده‌اید کلیه مدارک مورد معامله را همراه
            خود بیاورند؟
          </label>
          <CustomSwitch
            key="qThree"
            name="qThree"
            checked={watch("qThree")}
            onChange={(e) => setValue("qThree", e.target.checked)}
            className=""
          />
        </div>
        <div className="flex w-full items-center justify-between gap-x-3">
          <label className="text-sm">
            آیا به خریدار یا مستاجر یادآوری کرده اید که دسته چک و کارت ملی خود
            را همراه بیاورند؟
          </label>
          <CustomSwitch
            key="qFour"
            name="qFour"
            checked={watch("qFour")}
            onChange={(e) => setValue("qFour", e.target.checked)}
            className=""
          />
        </div>
      </div>
    </div>
  );
}
