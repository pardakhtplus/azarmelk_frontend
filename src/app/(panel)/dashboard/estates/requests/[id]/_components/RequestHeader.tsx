"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import NotificationModal from "@/components/modules/NotificationModal";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import {
  type TEditRequestInfo,
  type TRequest,
} from "@/types/admin/estate/types";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RequestStatusBadges from "./RequestStatusBadges";
import Button from "@/components/modules/buttons/Button";

interface RequestHeaderProps {
  isChangingStatus: boolean;
  onStatusChange: (status: REQUEST_STATUS, note?: string) => Promise<boolean>;
  onEditRequestInfo: (
    requestId: string,
    body: TEditRequestInfo,
  ) => Promise<boolean>;
  onOpenApproveModal?: () => void;
  request: TRequest;
}

export default function RequestHeader({
  // isChangingStatus,
  onStatusChange,
  onEditRequestInfo,
  onOpenApproveModal,
  request,
}: RequestHeaderProps) {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isHighPermission =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE);

  return (
    <>
      <PanelBodyHeader
        title="جزئیات درخواست"
        breadcrumb={
          <>
            <Link
              href="/dashboard"
              className="text-gray-500 transition-colors hover:text-primary">
              داشبورد
            </Link>
            <span className="text-gray-300"> / </span>
            <Link
              href="/dashboard/estates/requests"
              className="text-gray-500 transition-colors hover:text-primary">
              درخواست ها
            </Link>
            <span className="text-gray-300"> / </span>
            <span className="font-medium text-gray-900">
              {request.title || "جزییات درخواست"}
            </span>
          </>
        }>
        {request.status === REQUEST_STATUS.PENDING && isHighPermission && (
          <div className="flex gap-3">
            <NotificationModal
              variant="button"
              className="max-md:!size-11 max-md:!px-0"
              colorVariant="red"
              title="رد"
              description="آیا از رد این درخواست مطمئن هستید؟"
              actionName="رد درخواست"
              isHaveNote
              noteTitle="توضیحات رد"
              actionClassName="text-white bg-red-600"
              onSubmit={async (note) => {
                const result = await onStatusChange(
                  REQUEST_STATUS.REJECT,
                  note,
                );

                if (!result) return false;

                queryClient.invalidateQueries({
                  queryKey: ["requestInfo", { id: id as string }],
                });
                queryClient.invalidateQueries({ queryKey: ["requestList"] });
                queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });

                return true;
                return true;
              }}>
              <XCircle className="size-5 md:ml-1" />
              <span className="hidden md:block">رد درخواست</span>
            </NotificationModal>

            {request.type === REQUEST_TYPE.EDIT ? (
              <Button variant="blue" onClick={onOpenApproveModal}>
                <CheckCircle className="size-5 md:ml-1" />
                <span className="hidden md:block">تایید درخواست</span>
              </Button>
            ) : (
              <NotificationModal
                variant="button"
                className="max-md:!size-11 max-md:!px-0"
                colorVariant="green"
                title="تایید"
                description="آیا از تایید این درخواست مطمئن هستید؟"
                actionName="تایید درخواست"
                isHaveNote
                noteTitle="توضیحات تایید"
                actionClassName="text-white bg-green-600"
                onSubmit={async (note) => {
                  const result = await onStatusChange(
                    REQUEST_STATUS.APPROVED,
                    note,
                  );

                  if (!result) return false;

                  queryClient.invalidateQueries({
                    queryKey: ["requestInfo", { id: id as string }],
                  });
                  queryClient.invalidateQueries({ queryKey: ["requestList"] });
                  queryClient.invalidateQueries({
                    queryKey: ["ownRequestList"],
                  });

                  return true;
                }}>
                <CheckCircle className="size-5 md:ml-1" />
                <span className="hidden md:block">تایید درخواست</span>
              </NotificationModal>
            )}
          </div>
        )}

        {request.status === REQUEST_STATUS.PENDING && !isHighPermission && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <NotificationModal
              variant="button"
              className="max-md:!size-11 max-md:!px-0"
              colorVariant="red"
              title="لغو درخواست"
              description="آیا از لغو این درخواست مطمئن هستید؟"
              actionName="لغو درخواست"
              actionClassName="text-white bg-red-600"
              onSubmit={async () => {
                const result = await onEditRequestInfo(id as string, {
                  status: REQUEST_STATUS.CANCEL,
                  estateStatus: request.estateStatus,
                  title: request.title,
                  description: request.description,
                  changes: request.change,
                  ...(request.contractEndTime
                    ? { contractEndTime: request.contractEndTime }
                    : {}),
                  ...(request.file ? { file: request.file } : {}),
                });

                if (!result) return false;

                queryClient.invalidateQueries({
                  queryKey: ["requestInfo", { id: id as string }],
                });
                queryClient.invalidateQueries({ queryKey: ["requestList"] });
                queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });

                return true;
              }}>
              <XCircle className="size-5 md:ml-1" />
              <span className="hidden md:block">لغو درخواست</span>
            </NotificationModal>
          </div>
        )}
      </PanelBodyHeader>

      <div className="my-4 flex flex-wrap justify-between gap-x-4 gap-y-3 pt-4 sm:items-center">
        <button
          onClick={() => router.back()}
          className="hidden w-fit items-center gap-2 rounded-lg border border-primary-border/30 bg-white px-4 py-2 text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 sm:flex">
          <ArrowRight className="h-5 w-5" />
          <span className="hidden md:block">بازگشت به لیست درخواست‌ها</span>
          <span className="block md:hidden">بازگشت</span>
        </button>

        <RequestStatusBadges status={request.status} type={request.type} />
      </div>
    </>
  );
}
