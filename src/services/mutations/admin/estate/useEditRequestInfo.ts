import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TEditRequestInfo } from "@/types/admin/estate/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useEditRequestInfo() {
  const editRequestInfo = useMutation({
    mutationKey: ["editRequestInfo"],
    mutationFn: async (props: {
      params: { id: string };
      data: TEditRequestInfo;
    }) => {
      try {
        const res = await api.admin.estate.editRequestInfo(
          props.params,
          props.data,
        );
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

  return { editRequestInfo };
}
