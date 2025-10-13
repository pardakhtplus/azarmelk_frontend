import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TSessionCountListResponse } from "@/types/admin/session/type";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSessionCountCreatedList(params: {
  start: string;
  end: string;
  enabled?: boolean;
}) {
  const sessionCountCreatedList = useQuery({
    queryKey: ["sessionCountCreatedList", params],
    queryFn: async () => {
      try {
        const res = await api.admin.session.getCountCreatedList(params);

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

        const data = res.data as TSessionCountListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: params.enabled ?? true,
  });

  return {
    sessionCountCreatedList,
  };
}
