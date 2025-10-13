import { type TEstate, type TMeta } from "@/types/types";
import { type SESSION_STATUS } from "./enum";

export interface TSession {
  id: string;
  startSession: string;
  endSession: string;
  startSessionJalali: string;
  endSessionJalali: string;
  room: number;
  title: string;
  sellerName: string;
  status: SESSION_STATUS;
  paymentMethod: string;
  ownerPrice: number;
  ownerFinalPrice: number;
  applicantName: string;
  applicantPhoneNumber: string;
  applicantBudget: number;
  applicantFinalBudget: number;
  attractApplicantsMethod: string;
  qOne: string;
  qTwo: string;
  qThree: string;
  qFour: string;
  users: {
    percent: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      avatar?: {
        url: string;
      };
    };
  }[];
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: {
      url: string;
    };
    phoneNumber: string;
  };
  estate: TEstate;
}

export interface TSessionLog {
  id: string;
  description: {
    text: string;
    bold: boolean;
    firstName?: boolean;
    lastName?: boolean;
  }[];
  createdAt: string;
  createdBy?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  note: {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
      id: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface TMutateSession {
  id?: string;
  title: string;
  startSession: string;
  endSession?: string;
  room: number;
  sellerName?: string;
  buyerName?: string;
  maximumBudget?: number;
  lowestSellingPrice?: number;
  status: SESSION_STATUS;
  users: {
    userId: string;
    percent: number;
  }[];
  estateId?: string;
  paymentMethod?: string;
  ownerPrice?: number;
  ownerFinalPrice?: number;
  applicantName?: string;
  applicantPhoneNumber?: number;
  applicantBudget?: number;
  applicantFinalBudget?: number;
  attractApplicantsMethod?: string;
  qOne?: string;
  qTwo?: string;
  qThree?: boolean;
  qFour?: boolean;
}

export interface TSessionResponse {
  code: number;
  message: string;
  data: TSession;
}

export interface TSessionListResponse {
  code: number;
  message: string;
  data: {
    sessions: (TSession & {
      date: string;
      time: string;
      fullDateTime: string;
      jalaliEndDate: string;
    })[];
    statistics: {
      room1: {
        confirmed: number;
        pending: number;
      };
      room2: {
        confirmed: number;
        pending: number;
      };
      room3: {
        confirmed: number;
        pending: number;
      };
    };
  };
  meta: TMeta;
}

export interface TSessionLogListResponse {
  code: number;
  message: string;
  data: TSessionLog[];
  meta: TMeta;
}

export interface TSessionCountListResponse {
  message: string;
  data: {
    [key: string]: {
      [key: string]: {
        confirmed: {
          count: number;
          hours: string[];
        };
        pending: {
          count: number;
          hours: string[];
        };
        rejected: {
          count: number;
          hours: string[];
        };
        canceled: {
          count: number;
          hours: string[];
        };
      };
    };
  };
}

export interface TSessionDateListResponse {
  code: number;
  message: string;
  data: {
    id: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
    };
    date: string;
    time: string;
    fullDateTime: string;
  }[];
}
