import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetAdvisorContactLogs } from "@/types/client/estate/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetAdvisorContactLogs({
  enabled = true,
  userId,
}: {
  enabled?: boolean;
  userId: string;
}) {
  const getAdvisorContactLogs = useQuery({
    queryKey: ["getAdvisorContactLogs", userId],
    queryFn: async () => {
      try {
        const res = await api.client.estate.getAdvisorContactLogs(userId);

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

        const data = res.data as TGetAdvisorContactLogs;

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
    getAdvisorContactLogs,
  };
}
