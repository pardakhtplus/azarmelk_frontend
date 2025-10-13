"use client";

import { cn } from "@/lib/utils";
import { rooms } from "./types";

interface RoomTabsProps {
  openedRoom: number;
  setOpenedRoom: (room: number) => void;
  statistics?: any;
}

const RoomTabs = ({ openedRoom, setOpenedRoom, statistics }: RoomTabsProps) => {
  return (
    <div className="flex items-center justify-start gap-x-4 border-b border-primary-border px-5">
      {rooms.map((room) => {
        const count = statistics?.[`room${room.room}`];

        return (
          <button
            key={room.id}
            className={cn(
              "flex items-center gap-x-1.5 border-primary-blue px-2 py-3 transition-all [&.active]:border-b-[3px]",
              openedRoom === room.room && "active",
            )}
            onClick={() => {
              setOpenedRoom(room.room);
            }}>
            <span
              className={cn(
                "opacity-70 [&.active]:font-semibold [&.active]:opacity-100",
                openedRoom === room.id && "active",
              )}>
              {room.name}
            </span>
            {count?.confirmed ? (
              <div className="flex size-5 items-center justify-center overflow-hidden rounded-full bg-primary-blue text-xs text-white">
                <span className="-mb-0.5">{count.confirmed}</span>
              </div>
            ) : null}
            {count?.pending ? (
              <div className="flex size-5 items-center justify-center overflow-hidden rounded-full bg-amber-500 text-xs text-white">
                <span className="-mb-0.5">{count.pending}</span>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default RoomTabs;
