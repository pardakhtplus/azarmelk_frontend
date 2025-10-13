import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TUserListResponse } from "@/types/admin/users/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserListInfinity({
  enabled = true,
  role,
  search,
  limit = 10,
}: {
  enabled?: boolean;
  role?: string;
  search?: string;
  limit?: number;
}) {
  const userListInfinity = useInfiniteQuery({
    queryKey: ["userListInfinity", role, search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await api.admin.management.getUsers({
          page: pageParam,
          limit,
          role,
          search,
        });

        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const data = res.data as {
            message: string;
            details: string;
          };
          if (data.message || data.details)
            toast.error(data.message || data.details);
          console.log(data);
          return null;
        }

        const data = res.data as TUserListResponse;

        if (!data.data?.users?.length) {
          return null;
        }

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.pagination) return undefined;

      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });

  // Flatten all pages data into a single array
  const allUsers =
    userListInfinity.data?.pages
      ?.filter((page) => page !== null)
      ?.flatMap((page) => page!.data.users) || [];

  return {
    userListInfinity,
    allUsers,
    hasNextPage: userListInfinity.hasNextPage,
    fetchNextPage: userListInfinity.fetchNextPage,
    isFetchingNextPage: userListInfinity.isFetchingNextPage,
    isLoading: userListInfinity.isLoading,
    isError: userListInfinity.isError,
  };
}
