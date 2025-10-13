"use client";

import Modal from "@/components/modules/Modal";
import { createPortal } from "react-dom";
import { useState } from "react";
import Button from "@/components/modules/buttons/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useEstateNoteList } from "@/services/queries/admin/estate/note/useEstateNoteList";
import useMutateEstateNote from "@/services/mutations/admin/estate/note/useMutateEstateNote";

interface EstateNoteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateTitle: string;
  estateId: string;
}

export default function EstateNoteListModal({
  isOpen,
  onClose,
  estateTitle,
  estateId,
}: EstateNoteListModalProps) {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  const { estateNoteList } = useEstateNoteList(
    { id: estateId },
    { enabled: isOpen },
  );
  const { mutateEstateNote } = useMutateEstateNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const res = await mutateEstateNote.mutateAsync({
      estateId: estateId,
      note: newNote,
    });
    if (res) {
      setNewNote("");
      queryClient.invalidateQueries({
        queryKey: ["estateNoteList", estateId],
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal
      isOpen={isOpen}
      title={`گزارش های فایل ${estateTitle}`}
      classNames={{
        background: "z-50 !py-0 sm:!py-4 sm:!px-4 !px-0",
        box: "sm:!max-w-2xl sm:!h-fit !max-w-none !rounded-none sm:!rounded-lg  !max-h-none",
        header: "sticky top-0 bg-white sm:bg-transparent sm:static",
      }}
      onCloseModal={onClose}
      onClickOutside={onClose}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-5">
          <p className="mb-4 text-sm font-medium">گزارش ها</p>

          {estateNoteList.isLoading ? (
            <div className="flex justify-center py-8">در حال بارگذاری...</div>
          ) : estateNoteList.data?.data &&
            estateNoteList.data.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {estateNoteList.data.data.map((note) => (
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
              گزارشی وجود ندارد
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <p className="mb-2 text-sm font-medium">افزودن گزارش جدید</p>
          <div className="flex flex-col gap-2">
            <textarea
              name="newNote"
              placeholder="گزارش خود را بنویسید..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-black/50 focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                isLoading={mutateEstateNote.isPending}
                className="whitespace-nowrap">
                افزودن گزارش
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
