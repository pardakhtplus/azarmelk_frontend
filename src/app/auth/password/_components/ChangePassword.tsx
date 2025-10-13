"use client";

import Input from "@/components/modules/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import { cn } from "@/lib/utils";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "حداقل ۶ حرف")
      .regex(/\d/, "شامل عدد")
      .regex(/[a-z]/, "شامل یک حرف کوچک")
      .regex(/[A-Z]/, "شامل یک حرف بزرگ"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور مطابقت ندارد",
    path: ["confirmPassword"],
  });

export default function ChangePassword({
  phoneNumber,
  setIsVerified,
  token,
}: {
  phoneNumber: string;
  setIsVerified: (isVerified: boolean) => void;
  token: string;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const [error, setError] = useState<{
    length: boolean;
    number: boolean;
    special: boolean;
    case: boolean;
  }>({
    case: false,
    length: false,
    number: false,
    special: false,
  });

  const router = useRouter();

  const validatePassword = (value) => {
    if (!(value.length < 6)) {
      setError((prev) => ({ ...prev, length: true }));
    } else {
      setError((prev) => ({ ...prev, length: false }));
    }

    if (!!/\d/.test(value)) {
      setError((prev) => ({ ...prev, number: true }));
    } else {
      setError((prev) => ({ ...prev, number: false }));
    }

    if (!(!/[a-z]/.test(value) || !/[A-Z]/.test(value))) {
      setError((prev) => ({ ...prev, case: true }));
    } else {
      setError((prev) => ({ ...prev, case: false }));
    }
  };

  const { forgetPassword } = useAuthMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.password || !values.confirmPassword) return;

    const res = await forgetPassword.mutateAsync({
      phoneNumber,
      token,
      password: values.password,
      repeatPassword: values.confirmPassword,
    });

    if (res) {
      setIsSuccess(true);
      router.push("/");
    }
  }

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={forgetPassword.isPending || isSuccess}
      buttonText="تایید و ادامه"
      onBack={() => setIsVerified(false)}
      title="تنظیم رمز عبور جدید"
      caption="برای تنظیم رمز عبور جدید، لطفاً رمز دلخواه‌ات رو وارد کن.">
      <div className="py-10">
        <div>
          <p className="font-medium">
            رمز عبور جدید <span className="text-red">*</span>
          </p>
          <Input
            register={register}
            name="password"
            error={errors.password}
            placeholder=""
            containerClassName="mb-2 mt-2"
            type="password"
            onInput={(event) => validatePassword(event.currentTarget.value)}
          />
        </div>
        <ol className="list-disc space-y-3.5 pb-7 pr-4 pt-3 text-xs text-text-200">
          <li className={cn(error.length && "text-primary-green")}>
            حداقل ۶ حرف
          </li>
          <li className={cn(error.number && "text-primary-green")}>شامل عدد</li>
          <li className={cn(error.case && "text-primary-green")}>
            شامل یک حرف بزرگ و کوچک
          </li>
        </ol>
        <div>
          <p className="font-medium">
            رمز عبور جدید <span className="text-red">*</span>
          </p>
          <Input
            register={register}
            name="confirmPassword"
            error={errors.confirmPassword}
            placeholder=""
            containerClassName="mb-2 mt-2"
            type="password"
          />
        </div>
      </div>
    </FormCard>
  );
}
