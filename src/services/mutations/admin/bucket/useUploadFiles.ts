import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/services/axios-client";

export default function useUploadFiles() {
  const uploadFiles = useMutation({
    mutationKey: ["uploadFiles"],
    mutationFn: async (file: File) => {
      try {
        const res = await api.admin.bucket.uploadFiles(file);

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

        const data = res.data as {
          message: string;
          data: {
            url: string;
            file_name: string;
            key: string;
            mimeType: string;
          }[];
        };

        return data;
      } catch (error) {
        toast.error(`${error}`);

        return null;
      }
    },
  });

  return { uploadFiles };
}
