import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetAdviserListResponse } from "@/types/admin/estate/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAdviserList({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: {
    page: number;
    limit: number;
    search: string;
  };
}) {
  const adviserList = useQuery({
    queryKey: ["adviserList", params],
    queryFn: async () => {
      try {
        const res = await api.admin.estate.getAdviserList({
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
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

        const data = res.data as TGetAdviserListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled,
  });

  return {
    adviserList,
  };
}
