import { IChevronLeft } from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function FormCard({
  children,
  buttonText = "بعدی",
  title,
  caption,
  onBack,
  captionClassName,
  isLoading,
  className,
  onSubmit,
}: {
  children: React.ReactNode;
  title: string;
  caption: string;
  buttonText?: string;
  onBack?: () => void;
  captionClassName?: string;
  isLoading?: boolean;
  className?: string;
  onSubmit?: (data: any) => void;
}) {
  return (
    <section className="m-auto grid h-full min-h-dvh w-full max-w-[2000px] gap-5 xs:p-5 md:grid-cols-10 xl:gap-10 xl:p-10">
      <form
        onSubmit={onSubmit}
        className={cn(
          "relative my-auto h-full max-h-[1000px] w-full bg-background px-6 pb-20 pt-10 xs:rounded-2xl sm:px-7 md:col-span-5 lg:col-span-4",
          className,
        )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1.5 text-xl font-semibold xs:text-[22px]">
              {title}
            </p>
            {/* TODO */}
            <p
              className={cn(
                "w-[90%] text-xs text-text-100 xs:text-sm",
                captionClassName,
              )}>
              {caption}
            </p>
          </div>
          <div className="flex items-center justify-center border-r border-primary-border px-4 py-2">
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-y-2"
              onClick={onBack}>
              <IChevronLeft className="size-6 text-primary-border" />
              <span className="text-xs text-text-100">بازگشت</span>
            </button>
          </div>
        </div>
        {children}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 sm:px-7">
          <Button
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            className="!h-14 w-full">
            {buttonText}
          </Button>
        </div>
      </form>

      <div className="my-auto hidden h-full max-h-[1000px] w-full overflow-hidden rounded-2xl md:col-span-5 md:block lg:col-span-6">
        <Image
          src="/images/auth-background-image.jpg"
          alt="auth/login"
          width={1000}
          height={1000}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  );
}
