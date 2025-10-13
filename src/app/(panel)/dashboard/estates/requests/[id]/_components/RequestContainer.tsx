"use client";

import Button from "@/components/modules/buttons/Button";
import { Permissions } from "@/permissions/permission.types";
import useEditRequestInfo from "@/services/mutations/admin/estate/useEditRequestInfo";
import useEditRequestStatus from "@/services/mutations/admin/estate/useEditRequestStatus";
import { useRequestInfo } from "@/services/queries/admin/estate/useRequestInfo";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { REQUEST_STATUS } from "@/types/admin/estate/enum";
import { type TEditRequestInfo } from "@/types/admin/estate/types";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ApproveEditRequestModal from "./ApproveEditRequestModal";
import EditRequestModal from "./EditRequestModal";
import EstateInfoSection from "./EstateInfoSection";
import RequestHeader from "./RequestHeader";
import RequestInfoSection from "./RequestInfoSection";
import RequestSkeleton from "./RequestSkeleton";
import UserInfoSection from "./UserInfoSection";

export default function RequestContainer() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const { requestInfo } = useRequestInfo({
    id: id as string,
    enable: true,
  });

  const { userInfo } = useUserInfo();
  const { editRequestStatus } = useEditRequestStatus();
  const { editRequestInfo } = useEditRequestInfo();
  const request = requestInfo?.data?.data;

  const isHighPermission =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE);

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

    queryClient.invalidateQueries({ queryKey: ["requestInfo", { id }] });
    queryClient.invalidateQueries({ queryKey: ["requestList"] });
    queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });
    setNote("");
    setIsChangingStatus(false);

    return true;
  };

  const handleEditRequest = async (
    requestId: string,
    data: TEditRequestInfo,
  ) => {
    return await handleEditRequestInfo(requestId, data);
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
        const statusResult = await handleStatusChange(
          statusData.status,
          statusData.note,
        );
        return statusResult;
      }

      return true;
    } catch (error) {
      console.error("Error approving edit request:", error);
      return false;
    }
  };

  const handleStatusChange = async (
    newStatus: REQUEST_STATUS,
    noteParam?: string,
  ): Promise<boolean> => {
    if (!request) return false;

    setIsChangingStatus(true);
    const result = await editRequestStatus.mutateAsync({
      requestId: request.id,
      status: newStatus,
      note:
        noteParam || note || `درخواست ${getStatusPersianName(newStatus)} شد`,
    });

    if (!result) return false;

    queryClient.invalidateQueries({ queryKey: ["requestInfo", { id }] });
    queryClient.invalidateQueries({ queryKey: ["requestList"] });
    queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });
    setNote("");
    setIsChangingStatus(false);
    return true;
  };

  const getStatusPersianName = (status: REQUEST_STATUS) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return "در انتظار";
      case REQUEST_STATUS.APPROVED:
        return "تایید شده";
      case REQUEST_STATUS.REJECT:
        return "رد شده";
      case REQUEST_STATUS.DELETED:
        return "حذف شده";
      case REQUEST_STATUS.CANCEL:
        return "لغو شده";
      default:
        return status;
    }
  };

  if (requestInfo?.isLoading) {
    return <RequestSkeleton />;
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-gray-600">درخواست یافت نشد</p>
          <Button onClick={() => router.back()}>بازگشت</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <RequestHeader
        isChangingStatus={isChangingStatus}
        onStatusChange={handleStatusChange}
        onEditRequestInfo={handleEditRequestInfo}
        onOpenApproveModal={() => setIsApproveModalOpen(true)}
        request={request}
      />

      <div className="space-y-6">
        {/* Request Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Request Info */}
          <div className="space-y-6">
            <RequestInfoSection
              request={request}
              canEdit={
                request.status === REQUEST_STATUS.PENDING && isHighPermission
              }
              onEdit={() => setIsEditModalOpen(true)}
            />

            <UserInfoSection
              user={request.user}
              title="اطلاعات درخواست کننده"
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
          </div>

          {/* Right Column - User and Estate Info */}
          <div className="space-y-6">
            <EstateInfoSection estate={request.estate} />

            {/* Reviewer Info */}
            {request.reviewer.id && (
              <UserInfoSection
                user={request.reviewer}
                title="اطلاعات بررسی کننده"
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Request Modal */}
      <EditRequestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        request={request}
        onSave={handleEditRequest}
        canEdit={isHighPermission}
      />

      {/* Approve Edit Request Modal */}
      <ApproveEditRequestModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        request={request}
        onApprove={handleApproveEditRequest}
        isLoading={isChangingStatus || editRequestInfo.isPending}
      />
    </>
  );
}
