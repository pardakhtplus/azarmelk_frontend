import { type TMeta, type TNote } from "@/types/types";

export interface TSessionNoteListResponse {
  code: number;
  message: string;
  data: TNote[];
  meta: TMeta;
}
