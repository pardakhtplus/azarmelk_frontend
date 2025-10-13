import { type TEstate } from "@/types/types";

export enum REMINDER_TYPE {
  SMS = "SMS",
  NOTIFICATION = "Notification",
}

export enum REMINDER_STATUS {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface TReminder {
  id: string;
  reminderDate: string; // Date when reminder should be sent
  title: string;
  description: string;
  message: string; // Message to be sent via SMS or notification
  type: REMINDER_TYPE[]; // Array of SMS and/or NOTIFICATION
  estateId?: string;
  mettingId?: string | null;
  userId: string;
  status: REMINDER_STATUS;
  estate?: TEstate;
  createdAt: string;
  updatedAt?: string;
}

export interface TCreateReminder {
  reminderDate: string;
  title: string;
  description: string;
  message: string;
  type: REMINDER_TYPE[];
  estateId?: string;
  mettingId?: string;
}

export interface TEditReminder {
  id: string;
  reminderDate: string;
  title: string;
  description: string;
  message: string;
  type: REMINDER_TYPE[];
}

export interface TGetReminderListResponse {
  message: string;
  data: {
    reminders: TReminder[];
    pagination?: any;
  };
}

export interface TGetReminderResponse {
  message: string;
  data: TReminder;
}

export interface TReminderListParams {
  estateId?: string;
  mettingId?: string;
  page?: number;
  limit?: number;
}
