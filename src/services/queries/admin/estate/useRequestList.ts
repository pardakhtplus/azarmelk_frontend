import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import {
  type TGetRequestListParams,
  type TGetRequestListResponse,
} from "@/types/admin/estate/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRequestList(
  params: {
    enable?: boolean;
  } & TGetRequestListParams,
) {
  const { page, limit, estateId, userId, status, type } = params;
  const requestList = useQuery({
    queryKey: ["requestList", params],
    queryFn: async () => {
      try {
        if (!params.enable) return null;

        const res = await api.admin.estate.getRequestList({
          page,
          limit,
          estateId,
          userId,
          status,
          type,
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

        const data = res.data as TGetRequestListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: params.enable,
  });

  return {
    requestList,
  };
}
