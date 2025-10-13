import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TOwnerResponse } from "@/types/admin/owner/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserOwnerList({
  page,
  limit,
  enabled = true,
}: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const userOwnerList = useQuery({
    queryKey: ["userOwnerList", page, limit],
    enabled,
    queryFn: async () => {
      try {
        const res = await api.client.dashboard.owner.getList({ page, limit });

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
    userOwnerList,
  };
}
