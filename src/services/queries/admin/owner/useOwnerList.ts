import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TOwnerResponse } from "@/types/admin/owner/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useOwnerList({
  page,
  limit,
  enabled = true,
  search,
}: {
  page?: number;
  limit?: number;
  enabled?: boolean;
  search?: string;
}) {
  const ownerList = useQuery({
    queryKey: ["ownerList", page, limit, search],
    enabled,
    queryFn: async () => {
      try {
        const res = await api.admin.owner.getList({ page, limit, search });

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

        const data = res.data as TOwnerResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    ownerList,
  };
}
