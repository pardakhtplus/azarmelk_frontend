import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-400">?</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          صفحه مورد نظر یافت نشد
        </h1>

        <p className="mb-8 leading-relaxed text-gray-600">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری
          منتقل شده است.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Button className="w-full">بازگشت به صفحه اصلی</Button>
          </Link>

          <Link href="/search">
            <BorderedButton className="w-full">جستجو در املاک</BorderedButton>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="mb-2 text-sm text-gray-500">نیاز به کمک دارید؟</p>
          <Link
            href="/contact-us"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800">
            تماس با ما
          </Link>
        </div>
      </div>
    </div>
  );
}
