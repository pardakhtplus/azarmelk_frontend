import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetEstateRequestResponse } from "@/types/client/dashboard/estate/request/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserEstateRequest({
  id,
  enable = true,
}: {
  id: string;
  enable?: boolean;
}) {
  const userEstateRequest = useQuery({
    queryKey: ["userEstateRequest", id],
    queryFn: async () => {
      try {
        if (!id || !enable) return null;

        const res = await api.client.dashboard.estate.request.getRequest(id);

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

        const data = res.data as TGetEstateRequestResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: enable,
  });

  return {
    userEstateRequest,
  };
}
