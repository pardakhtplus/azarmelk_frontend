import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TOwnerEstateListResponse } from "@/types/admin/owner/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useOwnerEstateList({
  phoneNumber,
  categoryId,
  enabled = true,
}: {
  phoneNumber: string;
  categoryId: string;
  enabled?: boolean;
}) {
  const ownerEstateList = useQuery({
    queryKey: ["ownerEstateList", phoneNumber],
    enabled,
    queryFn: async () => {
      try {
        const res = await api.admin.owner.getEstateList({
          phoneNumber,
          categoryId,
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

        const data = res.data as TOwnerEstateListResponse;

        return data.data || null;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    ownerEstateList,
  };
}
