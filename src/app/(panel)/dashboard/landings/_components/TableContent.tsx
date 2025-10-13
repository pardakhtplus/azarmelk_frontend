"use client";

import { TableBody } from "@/components/modules/Table";
import { canPerform } from "@/permissions/hasPermission";
import { useLandingList } from "@/services/queries/admin/landing/useLandingList";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import MutateLanding from "./MutateLanding";
import TableItem from "./TableItem";
import { Action, Subject } from "@/permissions/permission.types";

export default function TableContent() {
  const searchParams = useSearchParams();
  const { userInfo } = useUserInfo();

  const { landingList } = useLandingList({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  });

  return (
    <TableBody>
      {landingList.isLoading ? (
        <div className="group flex items-start gap-4 p-4">
          <div className="shrink-0 basis-full space-y-2.5 text-sm font-medium lg:basis-3/12">
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-primary-border/50" />
          </div>
          <div className="hidden shrink-0 basis-2/12 space-y-2 text-sm lg:block">
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-primary-border/50" />
          </div>
          <div className="hidden shrink-0 basis-2/12 pr-8 text-sm lg:block">
            <div className="size-6 animate-pulse rounded-md bg-primary-border/50" />
          </div>
          <div className="hidden shrink-0 basis-2/12 space-y-2 text-xs text-gray-500 lg:block">
            <div className="h-3 w-11/12 animate-pulse rounded-sm bg-primary-border/50" />
            <div className="h-3 w-1/2 animate-pulse rounded-sm bg-primary-border/50" />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <div className="h-6 w-24 animate-pulse rounded-full bg-primary-border/50" />
          </div>
        </div>
      ) : landingList.data?.data?.length ? (
        landingList.data?.data?.map((landing) => (
          <TableItem key={landing.id} landing={landing} />
        ))
      ) : (
        <p className="py-6 text-center text-sm">لندینگی موجود نیست!</p>
      )}
      {canPerform(
        Subject.LANDINGS,
        Action.CREATE,
        userInfo?.data?.data.accessPerms ?? [],
      ) && (
        <MutateLanding className="flex w-full items-center justify-start px-6 py-4 text-start text-primary-blue transition-colors hover:bg-primary-blue/5">
          <PlusIcon className="size-5" />
          <span>افزودن لندینگ</span>
        </MutateLanding>
      )}
    </TableBody>
  );
}
