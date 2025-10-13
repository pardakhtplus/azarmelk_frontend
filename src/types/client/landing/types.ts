import { type TEstate } from "@/types/types";

export type TGetLanding = {
  code: number;
  message: string;
  data: [
    {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      estates: TEstate[];
    },
  ];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};
