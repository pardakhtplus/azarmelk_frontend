import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TSessionResponse } from "@/types/admin/session/type";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSession({ id, enabled }: { id: string; enabled?: boolean }) {
  const session = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      try {
        if (!id) return null;

        const res = await api.admin.session.get(id);

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

        const data = res.data as TSessionResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: enabled === undefined ? true : enabled,
  });

  return {
    session,
  };
}
