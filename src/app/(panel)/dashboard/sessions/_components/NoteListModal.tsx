"use client";

import Modal from "@/components/modules/Modal";
import { createPortal } from "react-dom";
import { useSessionNoteList } from "@/services/queries/admin/session/note/useSessionNoteList";
import { useState } from "react";
import Button from "@/components/modules/buttons/Button";
import useMutateSessionNote from "@/services/mutations/admin/session/note/useMutateSessionNote";
import { useQueryClient } from "@tanstack/react-query";

interface NoteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  sessionId: string;
}

export default function NoteListModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionId,
}: NoteListModalProps) {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  // Use a large limit to load all notes at once
  const { sessionNoteList } = useSessionNoteList({
    id: sessionId,
  });

  const { mutateSessionNote } = useMutateSessionNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const res = await mutateSessionNote.mutateAsync({
      sessionId: sessionId,
      note: newNote,
    });
    if (res) {
      setNewNote("");

      // Refresh the notes list
      queryClient.invalidateQueries({
        queryKey: ["sessionNoteList", sessionId],
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal
      doNotHiddenOverflow
      isOpen={isOpen}
      title={`یادداشت های جلسه ${sessionTitle}`}
      classNames={{
        background: "z-50 !py-0 sm:!py-4 sm:!px-4 !px-0",
        box: "sm:!max-w-2xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg  !max-h-none",
        header: "sticky top-0 bg-white sm:bg-transparent sm:static",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="flex h-full flex-col">
        {/* Notes list */}
        <div className="flex-1 overflow-auto p-5">
          <p className="mb-4 text-sm font-medium">یادداشت ها</p>

          {sessionNoteList.isLoading ? (
            <div className="flex justify-center py-8">در حال بارگذاری...</div>
          ) : sessionNoteList.data?.data &&
            sessionNoteList.data.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {sessionNoteList.data.data.map((note) => (
                <div key={note.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-700">
                        {note.createdBy.firstName} {note.createdBy.lastName}
                      </span>
                      <span className="mx-2">•</span>
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
                  <p className="text-sm">{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-500">
              یادداشتی وجود ندارد
            </div>
          )}
        </div>

        {/* Add new note section - moved to bottom */}
        <div className="border-t p-4">
          <p className="mb-2 text-sm font-medium">افزودن یادداشت جدید</p>
          <div className="flex flex-col gap-2">
            <textarea
              name="newNote"
              placeholder="یادداشت خود را بنویسید..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-black/50 focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                isLoading={mutateSessionNote.isPending}
                className="whitespace-nowrap">
                افزودن یادداشت
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
