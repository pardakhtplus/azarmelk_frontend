import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import {
  type TGetEstateList,
  type TGetEstateListParamsClient,
} from "@/types/client/estate/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useEstateListInfinity({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: Omit<TGetEstateListParamsClient, "page">;
}) {
  const estateListInfinity = useInfiniteQuery({
    queryKey: ["estateListInfinity", params],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await api.client.estate.getList({
          ...params,
          page: pageParam.toString(),
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

        if (!data.data?.length) {
          return null;
        }

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;

      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });

  // Flatten all pages data into a single array
  const allEstates =
    estateListInfinity.data?.pages
      ?.filter((page) => page !== null)
      ?.flatMap((page) => page!.data) || [];

  return {
    estateListInfinity,
    allEstates,
    hasNextPage: estateListInfinity.hasNextPage,
    fetchNextPage: estateListInfinity.fetchNextPage,
    isFetchingNextPage: estateListInfinity.isFetchingNextPage,
    isLoading: estateListInfinity.isLoading,
    isError: estateListInfinity.isError,
  };
}
