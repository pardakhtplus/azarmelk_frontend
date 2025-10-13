import type { ESTATE_ARCHIVE_STATUS, ESTATE_STATUS } from "@/enums";
import { type PropertyTypeEnum } from "@/lib/categories";
import { type TMeta, type TFile, type TEstate } from "@/types/types";

export interface TMutateLanding {
  landingId?: string;
  title: string;
  description: string;
  slug: string;
  estateIds: {
    id: string;
  }[];
}

export interface TLanding {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  estates: {
    id: string;
    title: string;
    posterFile: TFile;
    estateCode: number;
    category: {
      propertyType: PropertyTypeEnum;
    };
    status: ESTATE_STATUS;
    archiveStatus: ESTATE_ARCHIVE_STATUS;
  }[];
}

export interface TLandingListResponse {
  code: number;
  message: string;
  data: {
    id: string;
    title: string;
    slug: string;
    _count: {
      estates: number;
    };
  }[];
}

export interface TLandingResponse {
  code: number;
  message: string;
  data: TLanding;
}

export interface TGetLandingEstates {
  data: TEstate[];
  meta: TMeta;
}
