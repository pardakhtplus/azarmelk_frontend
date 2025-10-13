"use client";

import NotificationModal from "@/components/modules/NotificationModal";
import { cn } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import {
  type TEditRequestInfo,
  type TRequest,
} from "@/types/admin/estate/types";
import {
  Building,
  Calendar,
  CheckCircle,
  Eye,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getStatusColor,
  getStatusIcon,
  getStatusPersianName,
  getTypeColor,
  getTypePersianName,
} from "./RequestUtils";
import toast from "react-hot-toast";
import { ESTATE_STATUS } from "@/enums";
import { useState } from "react";
import useEditRequestStatus from "@/services/mutations/admin/estate/useEditRequestStatus";
import useEditRequestInfo from "@/services/mutations/admin/estate/useEditRequestInfo";
import { useQueryClient } from "@tanstack/react-query";
import ApproveEditRequestModal from "../[id]/_components/ApproveEditRequestModal";

interface RequestCardProps {
  request: TRequest;
  onStatusChange: (
    requestId: string,
    newStatus: REQUEST_STATUS,
    note: string,
  ) => Promise<boolean>;
  onEditRequestInfo: (
    requestId: string,
    body: TEditRequestInfo,
  ) => Promise<boolean>;
}

export default function RequestCard({
  request,
  onStatusChange,
  onEditRequestInfo,
}: RequestCardProps) {
  const { userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const { editRequestStatus } = useEditRequestStatus();
  const { editRequestInfo } = useEditRequestInfo();

  const isHighPermission =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE);

  const isAccessToUsers =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.GET_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.EDIT_USERS);

  const handleEditRequestInfo = async (
    requestId: string,
    body: TEditRequestInfo,
  ) => {
    const result = await editRequestInfo.mutateAsync({
      params: {
        id: requestId,
      },
      data: {
        ...body,
      },
    });

    if (!result) return false;

    queryClient.invalidateQueries({ queryKey: ["requestList"] });
    queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });

    return true;
  };

  const handleApproveEditRequest = async (
    requestId: string,
    editData?: TEditRequestInfo,
    statusData?: { status: REQUEST_STATUS; note?: string },
  ): Promise<boolean> => {
    try {
      // If we have edit data, update the request first
      if (editData) {
        const editResult = await handleEditRequestInfo(requestId, editData);
        if (!editResult) return false;
      }

      // Then change the status
      if (statusData) {
        const statusResult = await onStatusChange(
          requestId,
          statusData.status,
          statusData.note || "",
        );
        return statusResult;
      }

      return true;
    } catch (error) {
      console.error("Error approving edit request:", error);
      return false;
    }
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Status and Type Badges */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  getStatusColor(request.status),
                )}>
                {getStatusIcon(request.status)}
                {getStatusPersianName(request.status)}
              </div>
              <div
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold",
                  getTypeColor(request.type),
                )}>
                {getTypePersianName(request.type)}
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-end">
              <div className="flex gap-2">
                {/* View Button */}
                <Link
                  href={`/dashboard/estates/requests/${request.id}`}
                  title="مشاهده جزئیات"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all hover:bg-blue-100">
                  <Eye className="size-4" />
                </Link>

                {request.status === REQUEST_STATUS.PENDING &&
                  isHighPermission && (
                    <>
                      {request.type === REQUEST_TYPE.EDIT ? (
                        <button
                          onClick={() => setIsApproveModalOpen(true)}
                          title="تایید درخواست ویرایش"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-green/10 text-primary-green transition-all hover:bg-primary-green/20 disabled:cursor-not-allowed disabled:opacity-50">
                          <CheckCircle className="size-4" />
                        </button>
                      ) : (
                        <NotificationModal
                          title="تایید"
                          description="آیا از تایید این درخواست مطمئن هستید؟"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-green/10 text-primary-green transition-all hover:bg-primary-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="تایید"
                          actionName="تایید"
                          isHaveNote
                          noteTitle="توضیحات تایید"
                          actionClassName="text-white bg-primary-green"
                          onSubmit={async (note) => {
                            const res = await onStatusChange(
                              request.id,
                              REQUEST_STATUS.APPROVED,
                              note || "",
                            );

                            if (!res) return false;

                            return true;
                          }}>
                          <CheckCircle className="size-4" />
                        </NotificationModal>
                      )}

                      <NotificationModal
                        title="رد"
                        description="آیا از رد این درخواست مطمئن هستید؟"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="رد"
                        actionName="رد"
                        actionClassName="text-white bg-red"
                        isHaveNote
                        noteTitle="توضیحات رد"
                        onSubmit={async (note) => {
                          const res = await onStatusChange(
                            request.id,
                            REQUEST_STATUS.REJECT,
                            note || "",
                          );

                          if (!res) return false;

                          return true;
                        }}>
                        <XCircle className="size-4" />
                      </NotificationModal>
                    </>
                  )}
                {request.status === REQUEST_STATUS.PENDING &&
                  !isHighPermission && (
                    <>
                      <NotificationModal
                        title="لغو درخواست"
                        description="آیا از لغو این درخواست مطمئن هستید؟"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="لغو درخواست"
                        actionName="لغو درخواست"
                        actionClassName="text-white bg-red"
                        onSubmit={async () => {
                          const res = await onEditRequestInfo(request.id, {
                            estateStatus: request.estateStatus,
                            status: REQUEST_STATUS.CANCEL,
                            changes: request.change,
                            file: request.file,

                            ...(request.contractEndTime && {
                              contractEndTime: request.contractEndTime,
                            }),
                            title: request.title,
                            description: request.description,
                          });

                          if (!res) return false;

                          return true;
                        }}>
                        <XCircle className="size-4" />
                      </NotificationModal>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900">
                {request.title || "بدون عنوان"}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                {request.description || "توضیحی برای این درخواست وجود ندارد."}
              </p>
            </div>
          </div>

          {/* Estate and User Info */}
          <div
            className={cn(
              "mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2",
              request.reviewer?.id ? "lg:grid-cols-4" : "lg:grid-cols-3",
            )}>
            <div className="flex items-center gap-3 pl-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Building className="size-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-gray-500">ملک</span>
                <Link
                  onClick={(event) => {
                    if (request.estate.status === ESTATE_STATUS.PENDING) {
                      event.preventDefault();
                    }
                  }}
                  href={`/estates/${request.estate.id}`}
                  className="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors hover:text-primary">
                  {request.estate.title}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                <Calendar className="size-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-gray-500">تاریخ ایجاد</span>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                <User className="size-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-gray-500">
                  درخواست کننده
                </span>
                <Link
                  onClick={(event) => {
                    if (!isAccessToUsers) {
                      toast.error("شما دسترسی به بخش کاربران را ندارید");
                      event.preventDefault();
                    }
                  }}
                  href={`/dashboard/users/${request.user.id}`}
                  className="text-sm font-semibold text-gray-900 transition-colors hover:text-primary">
                  {request.user.firstName} {request.user.lastName}
                </Link>
              </div>
            </div>

            {request.reviewer?.id ? (
              <div className="flex items-center gap-3 pl-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <User className="size-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs text-gray-500">ناظر</span>
                  <Link
                    onClick={(event) => {
                      if (!isAccessToUsers) {
                        toast.error("شما دسترسی به بخش کاربران را ندارید");
                        event.preventDefault();
                      }
                    }}
                    href={`/dashboard/users/${request.reviewer.id}`}
                    className="text-sm font-semibold text-gray-900 transition-colors hover:text-primary">
                    {request.reviewer.firstName} {request.reviewer.lastName}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Approve Edit Request Modal */}
      {request.type === REQUEST_TYPE.EDIT && (
        <ApproveEditRequestModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          request={request}
          onApprove={handleApproveEditRequest}
          isLoading={editRequestInfo.isPending || editRequestStatus.isPending}
        />
      )}
    </div>
  );
}
