import type { DealType, MainCategory, PropertyType } from "@/lib/categories";
import type { TEstate, TMeta } from "@/types/types";

export interface TGetEstateList {
  data: TEstate[];
  meta: TMeta;
}

export interface TGetEstateListParamsClient {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  DealType?: DealType;
  MainCategory?: MainCategory;
  PropertyType?: PropertyType;
  ownerId?: string;
  priceMin?: string;
  priceMax?: string;
  metrageMin?: string;
  metrageMax?: string;
  estateCode?: string;
  categoryIds?: string;
  // New advanced filters
  roomCount?: string;
  floor?: string;
  buildYear?: string;
  isExchangeable?: boolean;
  floorCount?: string;
  location?: string;
  parkingCount?: string;
  percentage?: number;
  regionName?: string;
}

export interface TGetEstate {
  message: string;
  data: TEstate;
}

export interface TPostAdvisorContactLog {
  estateId: string;
}

export interface TGetAdvisorContactLogs {
  data: TAdvisorContactLog[];
}

export interface TAdvisorContactLog {
  id: string;
  estateId: string;
  estate: TEstate;
  userId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    description: string;
  };
}
