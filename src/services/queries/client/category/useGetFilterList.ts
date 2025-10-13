import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetFilterList } from "@/types/client/category/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetFilterList(params: {
  search: string;
  page: number;
  limit: number;
}) {
  const filterList = useQuery({
    queryKey: ["filterList", params],
    queryFn: async () => {
      try {
        if (!params) return null;

        const res = await api.client.category.getFilterList(params);

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

        const data = res.data as TGetFilterList;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    filterList,
  };
}
