import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetEstateList } from "@/types/admin/estate/types";
import { type TGetEstateListParams } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUserEstateList({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: TGetEstateListParams;
}) {
  const userEstateList = useQuery({
    queryKey: ["userEstateList", params],
    queryFn: async () => {
      try {
        const res = await api.client.dashboard.estate.getList({
          ...params,
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

        const data = res.data as TGetEstateList;

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
    userEstateList,
  };
}
