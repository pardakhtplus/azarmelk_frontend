"use client";

// import useAuthMutation from "@/hooks/mutations/useAuthMutation";
import Input from "@/components/modules/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";
import { setCookie } from "@/lib/server-utils";
import { updateTokenCache } from "@/services/axios-client";

const formSchema = z.object({
  firstName: z.string({ message: "نام را وارد کنید!" }).min(1, {
    message: "نام را وارد کنید!",
  }),
  lastName: z.string({ message: "نام خانوادگی را وارد کنید!" }).min(1, {
    message: "نام خانوادگی را وارد کنید!",
  }),
});

export default function CreateAccount({
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

  const router = useRouter();

  const { login } = useAuthMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.firstName || !values.lastName) return;

    const res = await login.mutateAsync({
      phoneNumber: phoneNumber,
      firstName: values.firstName,
      lastName: values.lastName,
      token: token,
    });

    if (res) {
      setIsSuccess(true);
      await setCookie("accessToken", res.accessToken);
      await setCookie("refreshToken", res.refreshToken);
      updateTokenCache(res.accessToken);
      router.push("/");
    }
  }

  return (
    <FormCard
      isLoading={login.isPending || isSuccess}
      onSubmit={handleSubmit(onSubmit)}
      buttonText="ورود"
      onBack={() => setIsVerified(false)}
      title="ایجاد حساب کاربری"
      caption="برای ایجاد حساب کاربری، لطفاً اطلاعات خواسته‌شده را وارد کنید. این اطلاعات بصورت اتوماتیک احراز خواهد شد."
      captionClassName=" !text-xs">
      <div className="pb-10 pt-14">
        <div className="flex items-start gap-x-4">
          <div className="w-full">
            <p className="font-medium">نام</p>
            <Input
              register={register}
              name="firstName"
              error={errors.firstName}
              placeholder=""
              containerClassName="mt-2"
            />
          </div>
          <div className="w-full">
            <p className="font-medium">نام خانوادگی</p>
            <Input
              register={register}
              name="lastName"
              error={errors.lastName}
              placeholder=""
              containerClassName="mt-2"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-x-3">
          {/* <input type="checkbox" className="size-5 shrink-0" /> */}
          <p className="text-sm text-text-200">
            با ورود یا ثبت نام تایید میکنید که توافقنامه{" "}
            <Link href="#" className="text-primary-blue hover:underline">
              قوانین و شرایط استفاده{" "}
            </Link>
            و{" "}
            <Link href="#" className="text-primary-blue hover:underline">
              حریم خصوصی
            </Link>{" "}
            را مطالعه و قبول دارید.
          </p>
        </div>
      </div>
    </FormCard>
  );
}
