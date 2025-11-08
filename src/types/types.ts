import type { ESTATE_ARCHIVE_STATUS, ESTATE_STATUS } from "@/enums";
import type { DealType, MainCategory, PropertyType } from "@/lib/categories";
import { type Permissions } from "@/permissions/permission.types";

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  accessPerms?: Permissions[];
  education: string | null;
  email: string;
  fixPhoneNumber: string | null;
  birthdate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userPermission?: {
    category: {
      id: string;
      name: string;
      parents?: { id: string }[];
    }[];
  };
  phoneNumber: string;
  address?: string;
  avatar?: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
  };
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TFile = {
  key: string;
  url: string;
  mimeType: string;
  file_name: string;
  isPoster: boolean;
};

export interface TNote {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface TEstate {
  id: string;
  title: string;
  description: string;
  note: string;
  findBy: string;
  address?: string;
  // approximateAddress: string;
  buildYear: number;
  floor: string;
  categoryId: string;
  inventory: number;
  status: ESTATE_STATUS;
  archiveStatus: ESTATE_ARCHIVE_STATUS;
  estateCode: number;
  roomCount: number;
  unitCount: number;
  floorCount: number;
  floorUnitCount: number;
  metrage: number;
  soleMetrage: number;
  ayanMetrage: number;
  floorMetrage: number;
  dahaneMetrage: number;
  balkonMetrage: number;
  banaMetrage: number;
  arzMelk: number;
  arzGozar: number;
  tolMelk: number;
  height: number;
  files: TFile[];
  totalPrice: number;
  rahnPrice: number;
  ejarePrice: number;
  metragePrice: number;
  location: string[];
  parkingCount: number;
  tenantExiteDate: string;
  residenceStatus: string;
  landType?: string;
  banaPrice: number;
  percentage?: string;
  createdAt: string;
  updatedAt: string;
  category: TEstateCategory;
  categoryTree: TEstateCategory[];
  posterFile?: TFile;
  owners?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    position: string;
    fixPhoneNumber: string;
  }[];
  adviser?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    avatar: {
      url: string;
      file_name: string;
      key: string;
      mimeType: string;
    };
  };
  isSaved: boolean;
  properties: TEstateProperties;
}

export interface TEstateCategory {
  id: string;
  dealType: string;
  mainCategory: string;
  propertyType: string;
  name: string;
  description: string;
  parentId: string;
  isRegion: boolean;
  allChildren: string[];
  createdAt: string;
  updatedAt: string;
}
export interface TEstateProperties {
  // مشخصه ملک
  architectureStyle?: { title: string; mainTitle: string; values: string[] };
  architectureStatus?: { title: string; mainTitle: string; values: string[] };
  architectureSpaces?: { title: string; mainTitle: string; values: string[] };
  property?: { title: string; mainTitle: string; values: string[] }; // برای مغازه
  // نما ساختمان
  facadeMaterials?: { title: string; mainTitle: string; values: string[] };
  facadeStyle?: { title: string; mainTitle: string; values: string[] };
  // مشاعات
  commonsFeatures?: { title: string; mainTitle: string; values: string[] };
  commonsSpaces?: { title: string; mainTitle: string; values: string[] };
  commonsServices?: { title: string; mainTitle: string; values: string[] };
  // سرمایش و گرمایش
  coolingHeating?: { title: string; mainTitle: string; values: string[] };
  // پوشش‌ها
  floorCovering?: { title: string; mainTitle: string; values: string[] };
  wallAndCeiling?: { title: string; mainTitle: string; values: string[] };
  // آشپزخانه
  kitchenCabinet?: { title: string; mainTitle: string; values: string[] };
  kitchenCabinetPanel?: {
    title: string;
    mainTitle: string;
    values: string[];
  };
  kitchenEquipment?: { title: string; mainTitle: string; values: string[] };
  kitchenSpaces?: { title: string; mainTitle: string; values: string[] };
  // نوع سرویس بهداشتی
  wcType?: { title: string; mainTitle: string; values: string[] };
  // سایر امکانات و امتیازات
  otherFacilitiesSpaces?: {
    title: string;
    mainTitle: string;
    values: string[];
  };
  facilities?: { title: string; mainTitle: string; values: string[] };
  points?: { title: string; mainTitle: string; values: string[] };
  parking?: { title: string; mainTitle: string; values: string[] };
  // وضعیت ملک
  documents?: { title: string; mainTitle: string; values: string[] };
  documentType?: { title: string; mainTitle: string; values: string[] };
  residenceStatus?: { title: string; mainTitle: string; values: string[] };
  // تاریخ خروج مستاجر
  tenantExiteDate?:
    | string
    | { title: string; mainTitle: string; values: string[] };
  // نوع قرارداد
  contractType?:
    | string[]
    | { title: string; mainTitle: string; values: string[] };
  // تاریخ صدور سند
  documentIssueDate?:
    | string
    | { title: string; mainTitle: string; values: string[] };
  // مقدار وام
  loanAmount?: string | { title: string; mainTitle: string; values: string[] };
  // نوع آسانسور
  elevatorType?:
    | string[]
    | { title: string; mainTitle: string; values: string[] };
  // تعداد آسانسور نفر بر
  passengerElevatorCount?:
    | string
    | { title: string; mainTitle: string; values: string[] };
  // تعداد آسانسور باری
  freightElevatorCount?:
    | string
    | { title: string; mainTitle: string; values: string[] };
}

export interface TGetEstateListParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  archiveStatus?: string;
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
  roomCount?: string;
  floor?: string;
  buildYear?: string;
  isExchangeable?: boolean;
  floorCount?: string;
  location?: string;
  parkingCount?: string;
  // completionStatus?: "all" | "incomplete";
  percentage?: number;
  hasFile?: boolean;
}
