import { SESSION_STATUS } from "@/types/admin/session/enum";
import { type TSession } from "@/types/admin/session/type";
import {
  BanIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import OwnerModal from "./OwnerModal";

interface SessionInfoProps {
  session: TSession;
}

export default function SessionInfo({ session }: SessionInfoProps) {
  const { userInfo } = useUserInfo();
  const accessPerms: string[] = userInfo?.data?.data?.accessPerms || [];
  const canSeeOwners = [
    "OWNER",
    "SUPER_USER",
    "MANAGE_FILES",
    "GET_ESTATE_OWNERS",
  ].some((p) => accessPerms.includes(p));

  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    position?: string;
  } | null>(null);

  const StatusBadge = () => {
    switch (session.status) {
      case SESSION_STATUS.CONFIRMED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-primary-green/20 px-4 py-1.5">
            <CheckIcon className="size-3.5 text-primary-green" />
            <span className="text-sm text-primary-green">تایید شده</span>
          </div>
        );
      case SESSION_STATUS.PENDING:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-amber-500/20 px-4 py-1.5">
            <ClockIcon className="size-3.5 text-amber-600" />
            <span className="text-sm text-amber-600">در انتظار تایید</span>
          </div>
        );
      case SESSION_STATUS.REJECTED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-red-500/20 px-4 py-1.5">
            <XIcon className="size-3.5 text-red-600" />
            <span className="text-sm text-red-600">رد شده</span>
          </div>
        );
      case SESSION_STATUS.CANCELED:
        return (
          <div className="flex items-center gap-x-1 rounded-full bg-neutral-100 px-4 py-1.5">
            <BanIcon className="size-3.5 text-neutral-600" />
            <span className="text-sm text-neutral-600">لغو شده</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatToman = (num?: number | string) => {
    if (num === undefined || num === null || num === "") return "-";
    const n =
      typeof num === "string"
        ? Number(num.toString().replace(/\D/g, ""))
        : Number(num);
    if (Number.isNaN(n)) return "-";
    return `${n.toLocaleString("fa-IR")} تومان`;
  };

  const openOwner = (owner: any) => {
    setSelectedOwner(owner);
    setOwnerModalOpen(true);
  };

  return (
    <div className="mt-10">
      <div className="rounded-lg border border-primary-border/50 p-4">
        <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
          <h2 className="text-lg font-medium">اطلاعات جلسه</h2>
          <StatusBadge />
        </div>

        {/* Top meta info */}
        <div className="mt-5 grid grid-cols-2 items-start gap-x-7 gap-y-5 sm:grid-cols-4 lg:grid-cols-3">
          <div className="col-span-2 w-full lg:col-span-1">
            <label className="font-medium">عنوان جلسه</label>
            <p className="mt-2 text-gray-700">{session.title}</p>
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label className="font-medium">اتاق</label>
            <p className="mt-2 text-gray-700">اتاق {session.room}</p>
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label className="font-medium">تاریخ و زمان شروع</label>
            <p className="mt-2 text-gray-700">
              {new Date(session.startSession || "").toLocaleDateString(
                "fa-IR",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                },
              )}
            </p>
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <label className="font-medium">نحوه پرداخت</label>
            <p className="mt-2 text-gray-700">
              {session?.paymentMethod || "-"}
            </p>
          </div>
          {session?.endSession && (
            <div className="col-span-2 w-full lg:col-span-1">
              <label className="font-medium">تاریخ و زمان پایان</label>
              <p className="mt-2 text-gray-700">
                {new Date(session.endSession).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estate section with owners list */}
      {(session?.estate?.title || session?.estate?.estateCode) && (
        <div className="mt-7 rounded-lg border border-primary-border/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <label className="font-medium">ملک</label>
              <p className="mt-1 text-gray-700">
                {session?.estate?.title || "-"}
                {session?.estate?.estateCode
                  ? ` — کد فایل: ${session.estate.estateCode}`
                  : ""}
              </p>
            </div>
          </div>

          {canSeeOwners ? (
            Array.isArray(session?.estate?.owners) &&
            session.estate.owners.length > 0 && (
              <div className="mt-3">
                <label className="text-sm">مالکان</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {session.estate.owners.map((o: any) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => openOwner(o)}
                      className="group flex items-center gap-x-2 rounded-full border border-primary-border px-3 py-1.5 text-sm hover:bg-neutral-50">
                      <UserIcon className="size-4 text-gray-500 group-hover:text-gray-700" />
                      <span>
                        {`${o.firstName || ""} ${o.lastName || ""}`.trim() ||
                          "مالک"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              شما دسترسی مشاهده اطلاعات مالک را ندارید.
            </div>
          )}
        </div>
      )}

      {/* Seller section */}
      <div className="mt-7 rounded-lg border border-primary-border/50 p-4">
        <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
          <h3 className="text-lg font-medium">اطلاعات فروشنده</h3>
          {!session?.sellerName && session?.estate ? (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-gray-600">
              بر اساس ملک انتخاب شده
            </span>
          ) : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div>
            <label className="font-medium">نام فروشنده/موجر</label>
            <p className="mt-2 text-gray-700">{session?.sellerName || "-"}</p>
          </div>
          <div>
            <label className="font-medium">قیمت اعلامی مالک</label>
            <p className="mt-2 text-gray-700">
              {session?.ownerPrice ? formatToman(session?.ownerPrice) : "-"}
            </p>
          </div>
          <div>
            <label className="font-medium">قیمت نهایی مالک قبل از جلسه</label>
            <p className="mt-2 text-gray-700">
              {session?.ownerFinalPrice
                ? formatToman(session?.ownerFinalPrice)
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Applicant section */}
      <div className="mt-7 rounded-lg border border-primary-border/50 p-4">
        <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
          <h3 className="text-lg font-medium">اطلاعات خریدار / متقاضی</h3>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div>
            <label className="font-medium">نام خریدار / متقاضی</label>
            <p className="mt-2 text-gray-700">
              {session?.applicantName || "-"}
            </p>
          </div>
          <div>
            <label className="font-medium">شماره متقاضی</label>
            <p className="mt-2 flex items-center gap-x-1 text-gray-700">
              <PhoneIcon className="size-4 text-gray-500" />
              {session?.applicantPhoneNumber || "-"}
            </p>
          </div>
          <div>
            <label className="font-medium">بودجه متقاضی</label>
            <p className="mt-2 text-gray-700">
              {session?.applicantBudget
                ? formatToman(session?.applicantBudget)
                : "-"}
            </p>
          </div>
          <div>
            <label className="font-medium">بودجه نهایی متقاضی</label>
            <p className="mt-2 text-gray-700">
              {session?.applicantFinalBudget
                ? formatToman(session?.applicantFinalBudget)
                : "-"}
            </p>
          </div>

          <div>
            <label className="font-medium">نحوه جذب متقاضی</label>
            <p className="mt-2 text-gray-700">
              {session?.attractApplicantsMethod || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="mt-7 rounded-lg border border-primary-border/50 p-4">
        <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
          <h3 className="text-lg font-medium">سوالات</h3>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4">
          <div>
            <label className="font-medium">
              {" "}
              به نظر شما کدام یک از طرفین انعطاف بیشتری دارند؟
            </label>
            <p className="mt-2 text-gray-700">{session?.qOne || "-"}</p>
          </div>
          <div>
            <label className="font-medium">
              آیا ۱٪ حق الزحمه فروش را به طرفین اعلام کردید؟
            </label>
            <p className="mt-2 text-gray-700">{session?.qTwo || "-"}</p>
          </div>
          <div>
            <label className="font-medium">
              آیا فروشنده یا موجر یادآوری کرده‌اید کلیه مدارک مورد معامله را
              همراه خود بیاورند؟
            </label>
            <p className="mt-2 text-gray-700">
              {session?.qThree === "true" ? "بله" : "خیر"}
            </p>
          </div>
          <div>
            <label className="font-medium">
              آیا به خریدار یا مستاجر یادآوری کرده اید که دسته چک و کارت ملی خود
              را همراه بیاورند؟
            </label>
            <p className="mt-2 text-gray-700">
              {session?.qFour === "true" ? "بله" : "خیر"}
            </p>
          </div>
        </div>
      </div>

      {/* Owner modal */}
      <OwnerModal
        isOpen={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        owner={selectedOwner}
        canSeeOwners={canSeeOwners}
      />
    </div>
  );
}
