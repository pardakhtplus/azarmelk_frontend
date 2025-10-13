import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TSessionDateListResponse } from "@/types/admin/session/type";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSessionDateList({ day }: { day: string }) {
  const sessionDateList = useQuery({
    queryKey: ["sessionDateList", day],
    queryFn: async () => {
      try {
        const res = await api.admin.session.getSessionDateList({
          day: day,
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

        const data = res.data as TSessionDateListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    sessionDateList,
  };
}
