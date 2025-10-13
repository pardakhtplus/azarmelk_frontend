import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetLanding } from "@/types/client/landing/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const getLanding = async (slug: string) => {
  try {
    if (!slug) return null;

    const res = await api.client.landing.get({
      slug,
      page: 1,
      limit: 9,
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

    return data;
  } catch (error) {
    toast.error(handleApiError(error, true));

    return null;
  }
};

export function useLanding(slug: string) {
  const landing = useQuery({
    queryKey: ["landing", slug],
    queryFn: async () => await getLanding(slug),
  });

  return {
    landing,
  };
}
