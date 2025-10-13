import { IEye, IPencil, ITrash } from "@/components/Icons";
import NotificationModal from "@/components/modules/NotificationModal";
import { cn } from "@/lib/utils";
import { canPerform } from "@/permissions/hasPermission";
import useDeleteLanding from "@/services/mutations/admin/landing/useDeleteLanding";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MutateLanding from "./MutateLanding";
import { Action, Subject } from "@/permissions/permission.types";

export default function TableItem({
  landing,
}: {
  landing: {
    id: string;
    title: string;
    createdAt?: string;
    slug: string;
    _count: {
      estates: number;
    };
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useUserInfo();
  const { deleteLanding } = useDeleteLanding();
  const queryClient = useQueryClient();

  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-5 sm:px-8",
        isOpen && "bg-neutral-100",
      )}>
      <div className="basis-full xl:shrink-0 xl:basis-3/12 xl:space-y-2.5">
        <div className="flex items-start gap-x-3">
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <p>{landing.title}</p>
              <div className="flex items-center gap-x-3 xl:hidden">
                <Link
                  title="مشاهده"
                  href={`/landing/${landing.slug}`}
                  className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-colors hover:bg-gray-300">
                  <IEye className="size-5" />
                </Link>
                {canPerform(
                  Subject.LANDINGS,
                  Action.UPDATE,
                  userInfo?.data?.data.accessPerms ?? [],
                ) && (
                  <MutateLanding
                    landingId={landing.id}
                    isEdit
                    title="ویرایش"
                    className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                    <IPencil className="size-[18px]" />
                  </MutateLanding>
                )}
                <NotificationModal
                  colorVariant="red"
                  actionName="حذف"
                  actionClassName="bg-red"
                  title="حذف لندینگ"
                  onSubmit={async () => {
                    const res = await deleteLanding.mutateAsync(landing.id);
                    if (!res) return false;

                    queryClient.invalidateQueries({
                      queryKey: ["landingList"],
                    });

                    return true;
                  }}
                  description={`آیا می خواهید لندینگ "${landing.title}" را حذف کنید؟`}
                  className="flex !size-9 items-center justify-center rounded-full !border-none !p-0">
                  <ITrash className="size-5" />
                </NotificationModal>
                <button
                  className="flex size-9 items-center justify-center rounded-full bg-black/5 transition-all hover:bg-black/10"
                  onClick={() => setIsOpen(!isOpen)}>
                  <ChevronDownIcon
                    className={cn(
                      "size-6 transition-transform duration-300",
                      isOpen ? "rotate-180" : "",
                    )}
                  />
                </button>
              </div>
            </div>
            {/* <div className="invisible flex flex-wrap items-center gap-x-5 gap-y-2 group-hover:visible"></div> */}
            <div
              className={cn(
                "space-y-3.5 pb-4 pt-4 text-sm xl:hidden",
                isOpen ? "block" : "hidden",
              )}>
              <div className="flex items-start gap-x-3">
                <p className="w-28 shrink-0 text-text-200 xs:w-32 sm:w-44">
                  لینک
                </p>
                <p>{landing.slug}</p>
              </div>

              <div className="flex items-start gap-x-3">
                <p className="w-28 shrink-0 text-text-200 xs:w-32 sm:w-44">
                  تاریخ ساخت
                </p>
                <p className="text-text-100">
                  {landing.createdAt
                    ? new Intl.DateTimeFormat("fa-IR", {
                        dateStyle: "full",
                        timeStyle: "long",
                        timeZone: "Asia/Tehran",
                      })
                        .format(new Date(landing.createdAt || ""))
                        .replace(/\(.*گرینویچ\)/, "")
                        .trim()
                    : "_"}
                </p>
              </div>
              <div className="flex items-start gap-x-3">
                <p className="w-28 shrink-0 text-text-200 xs:w-32 sm:w-44">
                  تعداد فایل ها
                </p>
                <p>{landing._count.estates || "_"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cn("hidden shrink-0 basis-2/12 text-sm xl:block")}>
        {landing.createdAt
          ? new Intl.DateTimeFormat("fa-IR", {
              dateStyle: "full",
              timeStyle: "long",
              timeZone: "Asia/Tehran",
            })
              .format(new Date(landing.createdAt || ""))
              .replace(/\(.*گرینویچ\)/, "")
              .trim()
          : "_"}
      </div>
      <div className="hidden shrink-0 basis-2/12 pl-2 text-sm text-text-200 xl:block">
        {landing.slug}
      </div>
      <div className="hidden shrink-0 basis-2/12 pr-9 xl:block">
        <p className="">{landing._count.estates || "_"}</p>
      </div>
      <div className="hidden items-center gap-2 xl:flex">
        <Link
          title="مشاهده"
          href={`/landing/${landing.slug}`}
          className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-colors hover:bg-gray-300">
          <IEye className="size-5" />
        </Link>
        {canPerform(
          Subject.LANDINGS,
          Action.UPDATE,
          userInfo?.data?.data.accessPerms ?? [],
        ) && (
          <MutateLanding
            landingId={landing.id}
            isEdit
            title="ویرایش"
            className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
            <IPencil className="size-[18px]" />
          </MutateLanding>
        )}
        <NotificationModal
          colorVariant="red"
          actionName="حذف"
          actionClassName="bg-red"
          title="حذف لندینگ"
          onSubmit={async () => {
            const res = await deleteLanding.mutateAsync(landing.id);
            if (!res) return false;

            queryClient.invalidateQueries({
              queryKey: ["landingList"],
            });

            return true;
          }}
          description={`آیا می خواهید لندینگ "${landing.title}" را حذف کنید؟`}
          className="flex !size-9 items-center justify-center rounded-full !border-none !p-0">
          <ITrash className="size-5" />
        </NotificationModal>
      </div>
    </div>
  );
}
