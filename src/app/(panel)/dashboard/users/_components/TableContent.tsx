"use client";

import { TableBody } from "@/components/modules/Table";
import { useUserList } from "@/services/queries/admin/users/useUserList";
import { useSearchParams } from "next/navigation";
import TableItem from "./TableItem";
import Pagination from "@/components/modules/Pagination";
import { useOwnerList } from "@/services/queries/admin/owner/useOwnerList";

export default function TableContent() {
  const searchParams = useSearchParams();

  const { userList } = useUserList({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    role: searchParams.get("type") === "personnel" ? "OTHER" : "USER",
    enabled:
      !searchParams.get("type") ||
      searchParams.get("type") === "users" ||
      searchParams.get("type") === "personnel",
    search: searchParams.get("search") || "",
  });

  const { ownerList } = useOwnerList({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    enabled: searchParams.get("type") === "owners",
    search: searchParams.get("search") || "",
  });

  return (
    <TableBody>
      {userList.isLoading ? (
        <div className="group flex items-start gap-4 p-4">
          <div className="flex aspect-square h-full items-start justify-end">
            <div className="size-6 animate-pulse rounded-md bg-primary-border/50" />
          </div>
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
      ) : (searchParams.get("type") === "users" ||
          searchParams.get("type") === "personnel") &&
        userList.data?.data?.users?.length ? (
        userList.data?.data?.users?.map((user) => (
          <TableItem key={user.id} user={user} type="user" />
        ))
      ) : searchParams.get("type") === "owners" &&
        ownerList.data?.data?.length ? (
        ownerList.data?.data?.map((owner) => (
          <TableItem key={owner.id} user={owner} type="owner" />
        ))
      ) : (
        <p className="py-6 text-center text-sm">
          {searchParams.get("type") === "users"
            ? "کاربری موجود نیست!"
            : searchParams.get("type") === "personnel"
              ? "پرسنلی موجود نیست!"
              : "مالک ای موجود نیست!"}
        </p>
      )}
      <Pagination
        pageInfo={{
          totalPages:
            searchParams.get("type") === "users"
              ? userList.data?.data?.pagination?.totalPages || 1
              : searchParams.get("type") === "personnel"
                ? userList.data?.data?.pagination?.totalPages || 1
                : ownerList.data?.meta?.totalPages || 1,
          currentPage:
            searchParams.get("type") === "users"
              ? userList.data?.data?.pagination?.page || 1
              : searchParams.get("type") === "personnel"
                ? userList.data?.data?.pagination?.page || 1
                : ownerList.data?.meta?.page || 1,
        }}
      />
    </TableBody>
  );
}
