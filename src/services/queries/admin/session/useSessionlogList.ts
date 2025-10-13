import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TSessionLogListResponse } from "@/types/admin/session/type";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSessionLogList(id: string) {
  const sessionLogList = useQuery({
    queryKey: ["session", "logList", id],
    queryFn: async () => {
      try {
        const res = await api.admin.session.getLogList(id);

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

        const data = res.data as TSessionLogListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    sessionLogList,
  };
}
