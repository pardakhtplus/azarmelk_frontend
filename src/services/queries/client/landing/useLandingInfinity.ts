import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetLanding } from "@/types/client/landing/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLandingInfinity({
  enabled = true,
  slug,
  initialData,
}: {
  enabled?: boolean;
  slug: string;
  initialData?: TGetLanding;
}) {
  const landingListInfinity = useInfiniteQuery({
    queryKey: ["landingListInfinity", slug],
    queryFn: async ({ pageParam = 1 }) => {
      if (!slug) return null;

      try {
        const res = await api.client.landing.get({
          page: pageParam,
          limit: 9,
          slug,
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

        const data = res.data as TGetLanding;

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
      if (!lastPage?.pagination) return undefined;

      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  });

  // Flatten all pages data into a single array
  const allLandings =
    landingListInfinity.data?.pages
      ?.filter((page) => page !== null)
      ?.flatMap((page) => page!.data) || [];

  return {
    landingListInfinity,
    allLandings,
    hasNextPage: landingListInfinity.hasNextPage,
    fetchNextPage: landingListInfinity.fetchNextPage,
    isFetchingNextPage: landingListInfinity.isFetchingNextPage,
    isLoading: landingListInfinity.isLoading,
    isError: landingListInfinity.isError,
  };
}
