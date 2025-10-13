import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TLandingListResponse } from "@/types/admin/landing/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLandingList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const landingList = useQuery({
    queryKey: ["landingList", page, limit],
    queryFn: async () => {
      try {
        const res = await api.admin.landing.getList({ page, limit });

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

        const data = res.data as TLandingListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    landingList,
  };
}
