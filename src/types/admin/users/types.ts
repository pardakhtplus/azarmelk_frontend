import { type TUser, type TMeta } from "@/types/types";
import { type Permissions } from "@/permissions/permission.types";
export interface TMutateUser {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  fixPhoneNumber?: string;
  address?: string;
  // approximateAddress?: string;
  education?: string;
  email?: string;
  birthDate?: string;
  avatar?: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
  };
}

export interface TMutatePersonalInfo {
  category: {
    id: string;
  }[];
  accessPerms: Permissions[];
}

export interface TUserResponse {
  message: string;
  data: TUser;
}

export interface TPersonalInfoResponse {
  message: string;
  data: TUser;
}

export interface TUserListResponse {
  message: string;
  data: {
    users: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      isActive: boolean;
      createdAt: string;
      avatar?: {
        url: string;
        file_name: string;
        key: string;
        mimeType: string;
      };
      _count: {
        createdEstates: number;
      };
    }[];
    pagination: TMeta;
  };
}
