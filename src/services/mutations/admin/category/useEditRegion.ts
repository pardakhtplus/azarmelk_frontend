import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TMutateRegion } from "@/types/admin/category/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useEditRegion() {
  const editRegion = useMutation({
    mutationKey: ["category", "editRegion"],
    mutationFn: async (props: TMutateRegion) => {
      try {
        const res = await api.admin.category.editRegion(props);
        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const data = (await res.data) as {
            message: string;
            details: string;
          };
          if (data.message || data.details)
            toast.error(data.message || data.details);
          console.log(data);
          return null;
        }

        const data = (await res.data) as { message: string };

        toast.success(data.message);
        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { editRegion };
}
