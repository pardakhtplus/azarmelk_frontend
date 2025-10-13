"use client";
import Button from "@/components/modules/buttons/Button";

export default function AuthButtons() {
  return (
    <Button
      href="/auth/login"
      size="sm"
      className="!h-12 w-full !px-5 !text-sm font-medium md:!h-12 md:w-fit md:!px-6">
      ورود / عضویت
    </Button>
  );
}
