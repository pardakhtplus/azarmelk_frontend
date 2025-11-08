import { type ESTATE_ARCHIVE_STATUS, type ESTATE_STATUS } from "@/enums";
import type { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import type { TCategory } from "@/types/admin/category/types";
import type { TEstate, TFile, TMeta } from "@/types/types";

export interface TEstateLog {
  id: string;
  description: TStatusChangedLog[] | TEditLog[];
  createdAt: string;
  actionType: string;
  modelName: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface TStatusChangedLog {
  bold?: string;
  text?: string;
  firstName?: boolean;
  lastName?: boolean;
}

export interface TEditLog {
  user: {
    firstName: string;
    lastName: string;
  };
  message: string;
  changes: {
    oldData: {
      عنوان: string;
      "قیمت کل": number;
    };
    newData: {
      عنوان: string;
      "قیمت کل": number;
    };
  };
}

export interface TMutateEstate {
  estateId?: string;
  adviserId?: string;
  owners: {
    id: string;
  }[];
  title: string;
  description?: string;
  note?: string;
  findBy?: string;
  address?: string;
  // approximateAddress?: string;
  buildYear?: number;
  landingId?: string;
  roomCount?: number;
  metrage?: number;
  totalPrice?: number;
  metragePrice?: number;
  rahnPrice?: number;
  ejarePrice?: number;
  floorMetrage?: number;
  dahaneMetrage?: number;
  soleMetrage?: number;
  height?: number;
  inventory?: number;
  arzMelk?: number;
  arzGozar?: number;
  tolMelk?: number;
  banaMetrage?: number;
  balkonMetrage?: number;
  ayanMetrage?: number;
  unitCount?: number;
  floorCount?: number;
  floorUnitCount?: number;
  floor?: string;
  categoryId?: string;
  files: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
    isPoster: boolean;
  }[];
  location?: string[];
  parkingCount?: number;
  properties?: any;
  percentage?: string;
  landType?: string;
}

export interface TGetEstateList {
  data: TEstate[];
  meta: TMeta & {
    countByStatus?: {
      status: ESTATE_STATUS;
      archiveStatus: ESTATE_ARCHIVE_STATUS;
      count: number;
    }[];
  };
}

export interface TGetEstate {
  message: string;
  data: TEstate;
  allParents: TCategory[];
}

export interface TGetEstateLogList {
  message: string;
  data: TEstateLog[];
}

export interface TGetAdviserListResponse {
  message: string;
  data: {
    advisers: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      accessPerms: string[];
      createdAt: string;
      avatar: {
        url: string;
      };
    }[];
    pagination: {
      total: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

// statuses

export interface TRequest {
  id: string;
  estateId: string;
  userId: string;
  type: REQUEST_TYPE;
  status: REQUEST_STATUS;
  estateStatus: ESTATE_STATUS;
  file: Omit<TFile, "isPoster">;
  note: string;
  title: string;
  description: string;
  contractEndTime: string;
  change: Record<string, any>;
  createdAt: string;
  updateAt: string;
  estate: TEstate;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export interface TGetRequestListResponse {
  message: string;
  data: {
    items: TRequest[];
    pagination: {
      total: number;
      totalPages: number;
      pageNumber: number;
      pageSize: number;
    };
  };
}

export interface TCreateRequest {
  estateId: string;
  estateStatus: ESTATE_STATUS;
  changes?: Record<string, any>;
  file?: Omit<TFile, "isPoster">;
  type: REQUEST_TYPE;
  contractEndTime?: string;
  title?: string;
  description?: string;
}

export interface TEditRequestInfo {
  title?: string;
  description?: string;
  estateStatus: ESTATE_STATUS;
  status: REQUEST_STATUS;
  changes?: Record<string, any>;
  file?: Omit<TFile, "isPoster">;
  contractEndTime?: string;
}

export interface TGetRequestListParams {
  page: number;
  limit: number;
  estateId?: string;
  userId?: string;
  status?: REQUEST_STATUS;
  type?: REQUEST_TYPE;
}

export interface TGetRequestInfoResponse {
  message: string;
  data: {
    id: string;
    estateStatus: ESTATE_STATUS;
    estateId: string;
    userId: string;
    type: REQUEST_TYPE;
    status: REQUEST_STATUS;
    file: Omit<TFile, "isPoster">;
    note: string;
    title: string;
    description: string;
    contractEndTime: string;
    reviewerId: string;
    change: Record<string, any>;
    createdAt: string;
    updateAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    reviewer: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    estate: TEstate;
  };
}
