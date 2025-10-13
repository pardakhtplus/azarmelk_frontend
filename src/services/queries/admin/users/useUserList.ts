import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TUserListResponse } from "@/types/admin/users/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserList({
  page,
  limit,
  role,
  search,
  enabled = true,
}: {
  page: number;
  limit: number;
  role?: string;
  search?: string;
  enabled?: boolean;
}) {
  const userList = useQuery({
    queryKey: ["userList", page, limit, role, search],
    enabled,
    queryFn: async () => {
      try {
        const res = await api.admin.management.getUsers({
          page,
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

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    userList,
  };
}
