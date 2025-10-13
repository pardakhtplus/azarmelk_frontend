 "use client";

import { FileText } from "lucide-react";

export default function EmptyRequests() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-2xl">
        <FileText className="mx-auto size-16 text-gray-400" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900">
        هیچ درخواستی یافت نشد
      </h3>
      <p className="max-w-md text-gray-500">
        در حال حاضر هیچ درخواستی برای مدیریت وجود ندارد. درخواست‌های جدید در
        اینجا نمایش داده خواهند شد.
      </p>
    </div>
  );
}