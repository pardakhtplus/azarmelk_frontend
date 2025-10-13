import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetRequestInfoResponse } from "@/types/admin/estate/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRequestInfo(params: { enable?: boolean; id: string }) {
  const { id, enable } = params;
  const requestInfo = useQuery({
    queryKey: ["requestInfo", params],
    queryFn: async () => {
      try {
        if (!enable) return null;

        const res = await api.admin.estate.getRequestInfo(id);

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

        const data = res.data as TGetRequestInfoResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: enable,
  });

  return {
    requestInfo,
  };
}
