import { IEye } from "@/components/Icons";
import { cn, userFullName } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TableItem({
  user,
  type,
}: {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
    _count?: {
      createdEstates?: number;
      ownedEstates?: number;
    };
  };
  type: "owner" | "user";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-5 sm:px-8",
        isOpen && "bg-neutral-100",
      )}>
      <div className="basis-full xl:shrink-0 xl:basis-3/12 xl:space-y-2.5">
        <div className="flex items-start gap-x-3">
          {/* TODO: profile image */}
          {/* <div className="size-10 shrink-0">
            <CustomImage
              className="size-full object-cover"
              src={user.files[0]?.url || "/svg/image-placeholder.svg"}
              alt=""
              width={150}
              height={200}
            />
          </div> */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <p>{userFullName(user.firstName, user.lastName)}</p>
              <div className="flex items-center gap-x-3 xl:hidden">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                  <IEye className="size-5" />
                </Link>
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
                  شماره تلفن
                </p>
                <p>{user.phoneNumber}</p>
              </div>

              <div className="flex items-start gap-x-3">
                <p className="w-28 shrink-0 text-text-200 xs:w-32 sm:w-44">
                  تاریخ عضویت
                </p>
                <p className="text-text-100">
                  {new Intl.DateTimeFormat("fa-IR", {
                    dateStyle: "full",
                    timeStyle: "long",
                    timeZone: "Asia/Tehran",
                  })
                    .format(new Date(user.createdAt || ""))
                    .replace(/\(.*گرینویچ\)/, "")
                    .trim()}
                </p>
              </div>
              <div className="flex items-start gap-x-3">
                <p className="w-28 shrink-0 text-text-200 xs:w-32 sm:w-44">
                  تعداد فایل ها
                </p>
                <p>
                  {type === "owner"
                    ? user._count?.ownedEstates || 0
                    : user._count?.createdEstates || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cn("hidden shrink-0 basis-2/12 text-sm xl:block")}>
        {user.phoneNumber}
      </div>
      <div className="hidden shrink-0 basis-2/12 pl-2 text-sm text-text-200 xl:block">
        {new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: "Asia/Tehran",
        })
          .format(new Date(user.createdAt || ""))
          .replace(/\(.*گرینویچ\)/, "")
          .trim()}
      </div>
      <div className="hidden shrink-0 basis-2/12 pr-9 xl:block">
        <p className="">
          {type === "owner"
            ? user._count?.ownedEstates || 0
            : user._count?.createdEstates || 0}
        </p>
      </div>
      <div className="hidden items-center gap-2 xl:flex">
        <Link
          title="مشاهده"
          href={`/dashboard/users/${user.id}`}
          className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
          <IEye className="size-5" />
        </Link>
      </div>
    </div>
  );
}
