import type { TCategory } from "@/types/admin/category/types";
import type { TEstateProperties } from "@/types/types";

export interface TEstateRequest {
  id: string;
  title: string;
  description?: string;
  minMetrage?: number;
  maxMetrage?: number;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  maxRahnPrice?: number;
  minRahnPrice?: number;
  maxEjarePrice?: number;
  minEjarePrice?: number;
  maxMetragePrice?: number;
  minMetragePrice?: number;
  minFloor?: string;
  maxFloor?: string;
  buildYear?: number;
  location?: string[];
  roomCount?: number;
  floorCount?: number;
  floorUnitCount?: number;
  category: TCategory;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  properties?: TEstateProperties;
}

export interface TCreateEstateRequest {
  id?: string;
  categoryId: string;
  title: string;
  description?: string;
  minMetrage?: number;
  maxMetrage?: number;
  roomCount?: number;
  floorCount?: number;
  floorUnitCount?: number;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  maxRahnPrice?: number;
  minRahnPrice?: number;
  maxEjarePrice?: number;
  minEjarePrice?: number;
  maxMetragePrice?: number;
  minMetragePrice?: number;
  minFloor?: string;
  maxFloor?: string;
  buildYear?: number;
  location?: string[];
  properties?: TEstateProperties;
}

export interface TGetEstateRequestResponse {
  allParents: TCategory[];
  data: TEstateRequest;
  message: string;
}

export interface TGetEstateRequestListResponse {
  data: TEstateRequest[];
  message: string;
}
