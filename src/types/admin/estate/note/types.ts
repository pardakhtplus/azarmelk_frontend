import { type TMeta, type TNote } from "@/types/types";

export interface TEstateNoteListResponse {
  code: number;
  message: string;
  data: TNote[];
  meta: TMeta;
}
