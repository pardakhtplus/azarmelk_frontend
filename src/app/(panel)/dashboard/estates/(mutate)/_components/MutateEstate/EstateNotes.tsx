"use client";

import Button from "@/components/modules/buttons/Button";
import { cn } from "@/lib/utils";
import useMutateEstateNote from "@/services/mutations/admin/estate/note/useMutateEstateNote";
import { useEstateNoteList } from "@/services/queries/admin/estate/note/useEstateNoteList";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface EstateNotesProps {
  estateId: string;
}

export default function EstateNotes({ estateId }: EstateNotesProps) {
  const [newNote, setNewNote] = useState("");
  const { estateNoteList } = useEstateNoteList({ id: estateId });
  const { mutateEstateNote } = useMutateEstateNote();
  const queryClient = useQueryClient();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await mutateEstateNote.mutateAsync({
        estateId: estateId,
        note: newNote,
      });

      setNewNote("");

      // Refresh the notes list
      queryClient.invalidateQueries({
        queryKey: ["estateNoteList", estateId],
      });
    } catch (error) {
      console.error("خطا در ایجاد یادداشت:", error);
    }
  };

  return (
    <div className="mt-4 w-full">
      <label className="text-sm font-medium">
        گزارش‌ها <span className="text-text-200">(جهت اطلاع همکاران)</span>
      </label>

      <div className="mt-2 space-y-4">
        {/* نمایش لیست نوت‌های موجود */}
        {estateNoteList.isLoading ? (
          <div className="flex justify-center py-4">
            <div className="text-sm text-text-200">در حال بارگذاری...</div>
          </div>
        ) : estateNoteList.data?.data && estateNoteList.data.data.length > 0 ? (
          <div className="space-y-3">
            {estateNoteList.data.data.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-primary-border bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-text-200">
                    <span className="font-medium text-gray-600">
                      {note.createdBy.firstName} {note.createdBy.lastName}
                    </span>
                    <span>|</span>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-800">{note.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-primary-border p-4 text-center">
            <p className="text-sm text-text-200">
              هیچ گزارشی برای این املاک ثبت نشده است
            </p>
          </div>
        )}

        {/* فرم اضافه کردن نوت جدید */}
        <div className="space-y-3">
          <div className="w-full">
            <textarea
              id="newEstateNote"
              className={cn(
                "w-full rounded-xl border border-primary-border p-2.5 outline-none focus:border-black",
              )}
              rows={3}
              placeholder="گزارش جدید اضافه کنید..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || mutateEstateNote.isPending}
              isLoading={mutateEstateNote.isPending}
              className="px-6">
              افزودن گزارش
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
