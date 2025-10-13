import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetEstateRequestListResponse } from "@/types/client/dashboard/estate/request/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserEstateRequestList({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: {
    page: number;
    limit: number;
    search?: string;
  };
}) {
  const userEstateRequestList = useQuery({
    queryKey: ["userEstateRequestList", params],
    queryFn: async () => {
      try {
        const res = await api.client.dashboard.estate.request.getRequestList(
          params || {},
        );

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

        const data = res.data as TGetEstateRequestListResponse;

        console.log(data);

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled,
  });

  return {
    userEstateRequestList,
  };
}
