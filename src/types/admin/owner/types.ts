import type { TMeta } from "@/types/types";

export interface TMutateOwner {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position?: string;
  id?: string;
}

export interface TOwnerResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    position?: string;
    createdAt: string;
    _count: {
      ownedEstates: number;
    };
  }[];
  meta: TMeta;
}

export interface TOwnerEstateListResponse {
  message: string;
  data?: {
    estates?: {
      id: string;
      title: string;
      estateCode: number;
      createdAt: string;
      owners: {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        position?: string;
      }[];
      posterFile: {
        url: string;
      };
    }[];
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      position?: string;
    };
    pagination?: TMeta;
  };
}
