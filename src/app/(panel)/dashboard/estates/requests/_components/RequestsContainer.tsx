"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import Pagination from "@/components/modules/Pagination";
import useSearchQueries from "@/hooks/useSearchQueries";
import { Permissions } from "@/permissions/permission.types";
import useEditRequestInfo from "@/services/mutations/admin/estate/useEditRequestInfo";
import useEditRequestStatus from "@/services/mutations/admin/estate/useEditRequestStatus";
import { useOwnRequestList } from "@/services/queries/admin/estate/useOwnRequestList";
import { useRequestList } from "@/services/queries/admin/estate/useRequestList";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import { type TEditRequestInfo } from "@/types/admin/estate/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import EmptyRequests from "./EmptyRequests";
import RequestCard from "./RequestCard";
import RequestSkeleton from "./RequestSkeleton";
import RequestStatusTabs from "./RequestStatusTabs";
import RequestTypeFilter from "./RequestTypeFilter";

export default function RequestsContainer() {
  const searchParams = useSearchParams();
  const searchQuery = useSearchQueries();
  const [activeTab, setActiveTab] = useState<REQUEST_STATUS>(
    (searchParams.get("status") as REQUEST_STATUS) || REQUEST_STATUS.PENDING,
  );

  const { userInfo } = useUserInfo();

  const isHighPermission =
    userInfo?.data?.data?.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data?.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data?.accessPerms.includes(Permissions.MANAGE_ESTATE);

  const [selectedType, setSelectedType] = useState<{
    key: string;
    title: string;
  }>({ key: "", title: "همه انواع" });

  const queryClient = useQueryClient();
  const { editRequestStatus } = useEditRequestStatus();
  const { editRequestInfo } = useEditRequestInfo();

  const { requestList: adminRequestList } = useRequestList({
    page: Number(searchParams.get("page") || "1"),
    limit: 10,
    enable: userInfo?.data?.data?.phoneNumber ? isHighPermission : false,
    status: activeTab,
    type: selectedType.key as REQUEST_TYPE,
  });

  const { ownRequestList } = useOwnRequestList({
    page: Number(searchParams.get("page") || "1"),
    limit: 10,
    enable: userInfo?.data?.data?.phoneNumber ? !isHighPermission : false,
    status: activeTab,
    type: selectedType.key as REQUEST_TYPE,
  });

  const requestList = isHighPermission ? adminRequestList : ownRequestList;

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

  const handleStatusChange = async (
    requestId: string,
    newStatus: REQUEST_STATUS,
    note: string = "",
  ) => {
    const result = await editRequestStatus.mutateAsync({
      requestId,
      status: newStatus,
      note,
    });

    if (!result) return false;

    queryClient.invalidateQueries({ queryKey: ["requestList"] });
    queryClient.invalidateQueries({ queryKey: ["ownRequestList"] });

    return true;
  };

  const handleTabChange = (status: REQUEST_STATUS) => {
    setActiveTab(status);
    searchQuery(["status"], [status]);
  };

  const handleTypeChange = (option: { key: string; title: string }) => {
    setSelectedType(option);
    searchQuery(["type"], [option.key]);
  };

  const requests = requestList?.data?.data?.items || [];
  const totalPages = requestList?.data?.data?.pagination?.totalPages || 1;

  // Type filter options
  const typeOptions = [
    { key: "", title: "همه انواع" },
    { key: REQUEST_TYPE.EDIT, title: "ویرایش" },
    { key: REQUEST_TYPE.DELETE, title: "حذف" },
    { key: REQUEST_TYPE.ARCHIVE, title: "بایگانی" },
    { key: REQUEST_TYPE.UNDELETE, title: "خروج از حذف" },
    { key: REQUEST_TYPE.UNARCHIVE, title: "خروج از بایگانی" },
  ];

  // Calculate request counts for tabs
  const requestCounts = {
    pending: requests.filter((r) => r.status === REQUEST_STATUS.PENDING).length,
    approved: requests.filter((r) => r.status === REQUEST_STATUS.APPROVED)
      .length,
    rejected: requests.filter((r) => r.status === REQUEST_STATUS.REJECT).length,
    cancel: requests.filter((r) => r.status === REQUEST_STATUS.CANCEL).length,
  };

  return (
    <>
      <PanelBodyHeader
        title="درخواست ها"
        breadcrumb={
          <>
            <Link
              href="/dashboard"
              className="text-gray-500 transition-colors hover:text-primary">
              داشبورد
            </Link>
            <span className="text-gray-300"> / </span>
            <span className="font-medium text-gray-900">درخواست ها</span>
          </>
        }
      />

      <RequestStatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        requestCounts={requestCounts}
      />

      <RequestTypeFilter
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        typeOptions={typeOptions}
      />

      {/* Requests Content */}
      {requestList?.isLoading ? (
        <RequestSkeleton />
      ) : requests?.length === 0 ? (
        <EmptyRequests />
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onStatusChange={handleStatusChange}
                onEditRequestInfo={handleEditRequestInfo}
              />
            ))}
          </div>

          <Pagination
            pageInfo={{
              currentPage: Number(searchParams.get("page") || "1"),
              totalPages: totalPages,
            }}
          />
        </>
      )}
    </>
  );
}
