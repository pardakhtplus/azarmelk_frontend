import { IChevronLeft } from "@/components/Icons";
import Input from "@/components/modules/inputs/Input";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import { setCookie } from "@/lib/server-utils";
import { updateTokenCache } from "@/services/axios-client";

const formSchema = z.object({
  password: z.string({ message: "رمز عبور را وارد کنید!" }),
});

export default function Password({
  phoneNumber,
  setIsPasswordSet,
  setIsVerified,
  isExisted,
  setToken,
}: {
  phoneNumber: string;
  setIsPasswordSet: (isPasswordSet: boolean) => void;
  setIsVerified: (isVerified: boolean) => void;
  isExisted: boolean;
  setToken: (token: string) => void;
}) {
  const router = useRouter();

  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { login, sendOtp } = useAuthMutation();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onLoginUsingOTP = async () => {
    const res = await sendOtp.mutateAsync({
      phoneNumber: phoneNumber,
      sendOTP: true,
    });

    if (res) {
      setIsPasswordSet(false);
    }
  };

  const onForgetPassword = () => {
    router.push("/auth/password");
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.password) return;

    const res = await login.mutateAsync({
      phoneNumber: phoneNumber,
      password: data.password,
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
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={login.isPending || isSuccess}
      onBack={() => router.back()}
      title="ورود به حساب کاربری"
      caption="برای استفاده از خدمات آذرملک لطفا رمز عبور خود را وارد کنید.">
      <div className="py-14 sm:py-14">
        <p className="font-medium">رمز عبور را وارد کنید</p>
        <Input
          dir="auto"
          register={register}
          name="password"
          error={errors.password}
          placeholder=""
          containerClassName="mb-2 mt-2"
          className="pl-16"
          type="password"
        />
        <button
          type="button"
          className="mt-5 flex items-center gap-x-1.5 fill-primary-blue font-medium text-primary-blue disabled:cursor-auto disabled:text-text-100 disabled:opacity-60"
          onClick={onLoginUsingOTP}>
          <IChevronLeft className="size-4" />
          <span>ورود با رمز عبور یک بار مصرف</span>
        </button>
        <button
          type="button"
          className="mt-4 flex items-center gap-x-1.5 fill-primary-blue font-medium text-primary-blue disabled:cursor-auto disabled:text-text-100 disabled:opacity-60"
          onClick={onForgetPassword}>
          <IChevronLeft className="size-4" />
          <span>فراموشی رمز عبور</span>
        </button>
      </div>
    </FormCard>
  );
}
