"use client";

import Input from "@/components/modules/inputs/Input";
import NotificationModal from "@/components/modules/NotificationModal";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import ResendCode from "./ResendCode";

const formSchema = z.object({
  code: z.string({ message: "کد را وارد کنید!" }),
});

export default function Verify({
  phoneNumber,
  setPhoneNumber,
  setIsVerified,
  setToken,
}: {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setIsVerified: (isVerified: boolean) => void;
  setToken: (token: string) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const { forgetPassword, sendOtp } = useAuthMutation();

  // WebOTP: auto-read SMS OTP codes when supported
  useEffect(() => {
    let abortController: AbortController | null = null;
    if (typeof window === "undefined") return;
    const nav: any = navigator as any;
    const isSupported =
      Boolean((window as any).OTPCredential) && nav?.credentials?.get;
    if (!isSupported) return;

    try {
      abortController = new AbortController();
      nav.credentials
        .get({ otp: { transport: ["sms"] }, signal: abortController.signal })
        .then((cred: any) => {
          if (cred?.code) {
            setValue("code", cred.code, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        })
        .catch(() => {
          // Ignore errors silently
        });
    } catch {
      // No-op
    }

    return () => {
      if (abortController) abortController.abort();
    };
  }, [setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.code) return;

    const res = await forgetPassword.mutateAsync({
      phoneNumber: phoneNumber,
      code: values.code,
    });

    if (res) {
      setIsSuccess(true);
      setIsVerified(true);
      setToken(res.token);
    }
  }

  const onResend = async () => {
    await sendOtp.mutateAsync({ phoneNumber: phoneNumber, sendOTP: true });
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={forgetPassword.isPending || isSuccess}
      buttonText="ورود"
      onBack={() => setPhoneNumber("")}
      title="تایید شماره موبایل"
      caption="برای ادامه، کد تأیید که به شماره موبایل یا شما ارسال شده رو وارد کنید.">
      <div className="py-14 sm:py-14">
        <p className="font-medium">
          کد تایید ارسال شده به شماره “
          <NotificationModal
            title="تغییر شماره موبایل"
            description="آیا میخواهید شماره موبایل خود را تغییر دهید؟"
            onSubmit={async () => {
              setPhoneNumber("");

              return true;
            }}
            actionName="تغییر"
            actionClassName="bg-primary"
            className="text-primary-blue">
            {phoneNumber}
          </NotificationModal>
          ” را وارد کنید.
        </p>
        <Input
          register={register}
          name="code"
          error={errors.code}
          placeholder=""
          autoComplete="one-time-code"
          inputMode="numeric"
          containerClassName="mb-2 mt-2"
        />
        <ResendCode onClick={onResend} />
      </div>
    </FormCard>
  );
}
