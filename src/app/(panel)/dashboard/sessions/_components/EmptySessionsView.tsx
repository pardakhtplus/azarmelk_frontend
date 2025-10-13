import { Calendar } from "lucide-react";

const EmptySessionsView = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <Calendar className="mb-3 size-16 text-gray-300" strokeWidth={1} />
    <h3 className="mb-1 text-lg font-semibold text-gray-700">
      جلسه ای موجود نیست
    </h3>
    <p className="text-sm text-gray-500">
      در این روز و اتاق هیچ جلسه ای ثبت نشده است
    </p>
  </div>
);

export default EmptySessionsView;
