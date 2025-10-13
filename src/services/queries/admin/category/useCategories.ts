import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TMainCategoriesResponse } from "@/types/admin/category/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCategories() {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await api.admin.category.getMainCategories();

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

        const data = res.data as TMainCategoriesResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    categories,
  };
}
