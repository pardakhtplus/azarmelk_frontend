import { useQuery } from "@tanstack/react-query";
import { useEstateList } from "../estate/useEstateList";
import { useUserList } from "../users/useUserList";
import { useRequestList } from "../estate/useRequestList";
import { REQUEST_STATUS } from "@/types/admin/estate/enum";

export function useDashboardStats({
  canSeeEstates = false,
  canManageUsers = false,
  canManageEstates = false,
}: {
  canSeeEstates?: boolean;
  canManageUsers?: boolean;
  canManageEstates?: boolean;
}) {
  // Fetch estates with status counts
  const { estateList } = useEstateList({
    enabled: canSeeEstates,
    params: {
      page: "1",
      limit: "1",
    },
  });

  // Fetch users
  const { userList } = useUserList({
    page: 1,
    limit: 1,
    enabled: canManageUsers,
  });

  // Fetch pending requests
  const { requestList: pendingRequests } = useRequestList({
    page: 1,
    limit: 1,
    status: REQUEST_STATUS.PENDING,
    enable: canManageEstates,
  });

  // Fetch approved requests
  const { requestList: approvedRequests } = useRequestList({
    page: 1,
    limit: 1,
    status: REQUEST_STATUS.APPROVED,
    enable: canManageEstates,
  });

  // Aggregate stats
  const stats = useQuery({
    queryKey: [
      "dashboardStats",
      estateList.data?.data,
      userList.data?.data,
      pendingRequests.data?.data,
      approvedRequests.data?.data,
      estateList.data?.meta?.countByStatus,
      estateList.data?.meta?.total,
      userList.data?.data?.pagination.total,
      pendingRequests.data?.data?.pagination.total,
      approvedRequests.data?.data?.pagination.total,
    ],
    queryFn: () => {
      const estateCountByStatus = estateList.data?.meta?.countByStatus || [];

      // Calculate estate counts
      const publishedCount =
        estateCountByStatus.find(
          (item) => item.status === "PUBLISH" && !item.archiveStatus,
        )?.count || 0;

      const pendingCount =
        estateCountByStatus.find(
          (item) => item.status === "PENDING" && !item.archiveStatus,
        )?.count || 0;

      const archivedCount =
        estateCountByStatus.find((item) => item.archiveStatus === "ARCHIVE")
          ?.count || 0;

      const deletedCount =
        estateCountByStatus.find((item) => item.archiveStatus === "DELETE")
          ?.count || 0;

      const totalEstates = estateList.data?.meta?.total || 0;
      const totalUsers = userList.data?.data.pagination.total || 0;
      const totalPendingRequests =
        pendingRequests.data?.data.pagination.total || 0;
      const totalApprovedRequests =
        approvedRequests.data?.data.pagination.total || 0;
      const totalRequests = totalPendingRequests + totalApprovedRequests;

      return {
        estates: {
          total: totalEstates,
          published: publishedCount,
          pending: pendingCount,
          archived: archivedCount,
          deleted: deletedCount,
        },
        users: {
          total: totalUsers,
        },
        requests: {
          total: totalRequests,
          pending: totalPendingRequests,
          approved: totalApprovedRequests,
        },
        recentEstates: estateList.data?.data || [],
      };
    },
    enabled:
      !estateList.isLoading &&
      !userList.isLoading &&
      !pendingRequests.isLoading &&
      !approvedRequests.isLoading,
  });

  return {
    stats,
    isLoading:
      estateList.isLoading ||
      userList.isLoading ||
      pendingRequests.isLoading ||
      approvedRequests.isLoading,
  };
}
