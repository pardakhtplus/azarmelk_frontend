export type TGetFilterList = {
  message: string;
  data: {
    paginatedRegions: {
      name: string;
      createdAt: string;
      updatedAt: string;
    }[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
