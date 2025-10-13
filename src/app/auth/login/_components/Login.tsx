import Input from "@/components/modules/inputs/Input";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";

const formSchema = z.object({
  number: z
    .string({ message: "شماره را وارد کنید!" })
    .regex(/^(\+98|0)?9\d{9}$/, { message: "شماره را درست وارد کنید!" }),
});

export default function Login({
  onLogin,
  setIsExisted,
  setIsPasswordSet,
}: {
  onLogin: ({ phoneNumber }: { phoneNumber: string }) => void;
  setIsExisted: (isExisted: boolean) => void;
  setIsPasswordSet: (isPasswordSet: boolean) => void;
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
  const { sendOtp } = useAuthMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.number) return;

    const res = await sendOtp.mutateAsync({
      phoneNumber: data.number,
    });

    if (res) {
      onLogin({ phoneNumber: data.number });
      setIsExisted(res.isExist || false);
      setIsPasswordSet(res.isPasswordSet || false);
      setIsSuccess(true);
    }
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={sendOtp.isPending || isSuccess}
      onBack={() => router.back()}
      title="ورود / عضویت"
      caption="برای استفاده از خدمات آذرملک لطفا شماره موبایل خود را وارد کنید. کد تایید به این شماره ارسال خواهد شد.">
      <div className="py-14 sm:py-14">
        <p className="font-medium">شماره موبایل رو وارد کن</p>
        <Input
          register={register}
          name="number"
          error={errors.number}
          placeholder=""
          containerClassName="mb-2 mt-2"
          type="tel"
          pattern="^09[0-9]{9}$"
        />
        <p className="text-sm text-text-200">
          با ورود یا ثبت‌نام، تأیید می‌کنید که{" "}
          <Link href="#" className="border-b border-blue text-blue">
            قوانین و شرایط استفاده
          </Link>{" "}
          و{" "}
          <Link href="#" className="border-b border-blue text-blue">
            سیاست حریم خصوصی
          </Link>{" "}
          را مطالعه کرده و پذیرفته‌اید.
        </p>
      </div>
    </FormCard>
  );
}
