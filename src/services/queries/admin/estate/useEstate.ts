import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetEstate } from "@/types/admin/estate/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useEstate({
  id,
  enable = true,
  staleTime = 0,
  gcTime = 0,
}: {
  id: string;
  enable?: boolean;
  staleTime?: number;
  gcTime?: number;
}) {
  const estate = useQuery({
    queryKey: ["estate", id],
    queryFn: async () => {
      try {
        if (!id || !enable) return null;

        const res = await api.admin.estate.get(id);

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

        const data = res.data as TGetEstate;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
    enabled: enable,
    staleTime,
    gcTime,
  });

  return {
    estate,
  };
}
