import { type TSession } from "@/types/admin/session/type";

// Extended session type to include custom properties
export type ExtendedSession = TSession & {
  customTime?: boolean;
  timeDisplay?: string;
  startTime?: number;
  startMinute?: number;
  endTime?: number;
};

// Custom time slot type
export type CustomTimeSlot = {
  id: string;
  title?: string;
  startTime: number;
  startMinute?: number;
};

// Static room data
export const rooms = [
  {
    id: 1,
    name: "اتاق یک",
    room: 1,
  },
  {
    id: 2,
    name: "اتاق دو",
    room: 2,
  },
  {
    id: 3,
    name: "اتاق سه",
    room: 3,
  },
];

// Static session times
export const staticSessionTimes = [
  {
    id: "1",
    title: "ساعت 10 تا 12",
    startTime: 10,
    startMinute: 0,
    endTime: 12,
  },
  {
    id: "2",
    title: "ساعت 12 تا 14",
    startTime: 12,
    startMinute: 0,
    endTime: 14,
  },
  {
    id: "3",
    title: "ساعت 17 تا 19",
    startTime: 17,
    startMinute: 0,
    endTime: 19,
  },
  {
    id: "4",
    title: "ساعت 19 تا 21",
    startTime: 19,
    startMinute: 0,
    endTime: 21,
  },
];
