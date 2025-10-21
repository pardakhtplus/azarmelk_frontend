"use client";

import Input from "@/components/modules/inputs/Input";
import NotificationModal from "@/components/modules/NotificationModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import ResendCode from "./ResendCode";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";
import { setCookie } from "@/lib/server-utils";
import { updateTokenCache } from "@/services/axios-client";
import toast from "react-hot-toast";

const formSchema = z.object({
  code: z.string({ message: "کد را وارد کنید!" }),
});

export default function Verify({
  phoneNumber,
  setPhoneNumber,
  setIsVerified,
  isExisted,
  setToken,
}: {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setIsVerified: (isVerified: boolean) => void;
  isExisted: boolean;
  setToken: (token: string) => void;
}) {
  const router = useRouter();

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

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const { login, sendOtp } = useAuthMutation();

  toast.success("test");

  // WebOTP: auto-read SMS OTP codes when supported
  useEffect(() => {
    let abortController: AbortController | null = null;
    if (typeof window === "undefined") {
      toast.error("window is undefined");
      return;
    }
    const nav: any = navigator as any;
    const isSupported =
      Boolean((window as any).OTPCredential) && nav?.credentials?.get;
    toast.success("1" + JSON.stringify(isSupported));
    if (!isSupported) {
      toast.error("not supported");
      return;
    }

    try {
      abortController = new AbortController();
      nav.credentials
        .get({ otp: { transport: ["sms"] }, signal: abortController.signal })
        .then((cred: any) => {
          toast.success("2" + JSON.stringify(cred));

          if (cred?.code) {
            toast.success("5" + cred.code);
            toast.success(
              "کد تایید ارسال شده به شماره “" + phoneNumber + "” را وارد کنید.",
            );
            toast.success("6" + JSON.stringify(cred));
            setValue("code", cred.code, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        })
        .catch((error) => {
          toast.error("3" + JSON.stringify(error));
          // Ignore errors silently
        });
    } catch (error) {
      toast.error("4" + JSON.stringify(error));
      // No-op
    }

    return () => {
      if (abortController) abortController.abort();
    };
  }, [setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.code) return;

    const res = await login.mutateAsync({
      phoneNumber: phoneNumber,
      code: values.code,
    });

    if (res) {
      setIsSuccess(true);
      if (isExisted) {
        await setCookie("accessToken", res.accessToken);
        await setCookie("refreshToken", res.refreshToken);
        updateTokenCache(res.accessToken);
        if (callbackUrl) router.push(callbackUrl);
        else router.push("/");
      } else {
        setIsVerified(true);
        setToken(res.token);
      }
    }
  }

  const onResend = async () => {
    await sendOtp.mutateAsync({ phoneNumber: phoneNumber, sendOTP: true });
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={login.isPending || isSuccess}
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
