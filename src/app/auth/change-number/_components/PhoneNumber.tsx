import Input from "@/components/modules/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormCard from "../../_components/FormCard";
import useAuthMutation from "@/services/mutations/client/auth/useAuthMutation";

const formSchema = z.object({
  number: z
    .string({ message: "شماره را وارد کنید!" })
    .regex(/^(\+98|0)?9\d{9}$/, { message: "شماره را درست وارد کنید!" }),
});

export default function PhoneNumber({
  onLogin,
}: {
  onLogin: ({ phoneNumber }: { phoneNumber: string }) => void;
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
      sendOTP: true,
    });

    if (res) {
      onLogin({ phoneNumber: data.number });
      setIsSuccess(true);
    }
  };

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      isLoading={sendOtp.isPending || isSuccess}
      onBack={() => router.back()}
      title="تغییر شماره موبایل"
      caption="تغییر شماره موبایل حساب کاربری، با احراز هویت از طریق شماره همراه شما امکان‌پذیر است.">
      <div className="py-14 sm:py-14">
        <p className="font-medium">شماره موبایل جدید را وارد کنید</p>
        <Input
          register={register}
          name="number"
          error={errors.number}
          placeholder=""
          containerClassName="mb-2 mt-2"
          type="tel"
          pattern="^09[0-9]{9}$"
        />
      </div>
    </FormCard>
  );
}
