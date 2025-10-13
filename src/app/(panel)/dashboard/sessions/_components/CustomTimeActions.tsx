import { Clock } from "lucide-react";

interface CustomTimeActionsProps {
  // onOpenCustomTimeModal: () => void;
  onOpenCustomTimeSlotModal: () => void;
}

const CustomTimeActions = ({
  // onOpenCustomTimeModal,
  onOpenCustomTimeSlotModal,
}: CustomTimeActionsProps) => (
  <div className="mt-6 space-y-3 border-t border-primary-border pt-4">
    {/* <div>
      <p className="mb-1.5 text-sm font-medium">تعیین ساعت سفارشی</p>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-3"
        onClick={onOpenCustomTimeModal}>
        <Clock className="size-5" strokeWidth={1.5} />
        <span>افزودن جلسه با ساعت سفارشی</span>
      </button>
    </div> */}

    <div>
      {/* <p className="mb-2 text-sm font-medium">ساخت ساعت سفارشی برای جلسه</p> */}
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-blue/50 bg-primary-blue/10 py-3 text-primary-blue transition-all hover:bg-primary-blue/20"
        onClick={onOpenCustomTimeSlotModal}>
        <Clock className="size-5" strokeWidth={1.5} />
        <span>ساخت ساعت سفارشی برای جلسه</span>
      </button>
    </div>
  </div>
);

export default CustomTimeActions;
