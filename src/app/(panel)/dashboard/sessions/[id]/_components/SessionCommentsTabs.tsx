import Button from "@/components/modules/buttons/Button";
import { cn } from "@/lib/utils";
import useMutateSessionNote from "@/services/mutations/admin/session/note/useMutateSessionNote";
import { useSessionNoteList } from "@/services/queries/admin/session/note/useSessionNoteList";
import { useSessionLogList } from "@/services/queries/admin/session/useSessionlogList";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SessionReminders from "./SessionReminders";
import { REMINDER_CONTENT } from "@/components/modules/reminder/sectionUtils";

interface SessionCommentsTabsProps {
  sessionId: string;
  sessionTitle: string;
}

export default function SessionCommentsTabs({
  sessionId,
  sessionTitle,
}: SessionCommentsTabsProps) {
  const [activeTab, setActiveTab] = useState<"notes" | "logs" | "reminders">(
    "notes",
  );
  const [newNote, setNewNote] = useState("");
  const { sessionNoteList } = useSessionNoteList({ id: sessionId });
  const { sessionLogList } = useSessionLogList(sessionId);
  const { mutateSessionNote } = useMutateSessionNote();
  const queryClient = useQueryClient();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const res = await mutateSessionNote.mutateAsync({
      sessionId,
      note: newNote,
    });
    if (res) {
      setNewNote("");
      queryClient.invalidateQueries({
        queryKey: ["sessionNoteList", sessionId],
      });
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-4 flex gap-2 border-b border-primary-border/30">
        <button
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-all",
            activeTab === "notes"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary",
          )}
          onClick={() => setActiveTab("notes")}>
          یادداشت‌ها
        </button>
        <button
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-all",
            activeTab === "logs"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary",
          )}
          onClick={() => setActiveTab("logs")}>
          تاریخچه تغییرات
        </button>
        <button
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-all",
            activeTab === "reminders"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary",
          )}
          onClick={() => setActiveTab("reminders")}>
          یادآورها
        </button>
      </div>
      <div>
        {activeTab === "notes" && (
          <>
            {sessionNoteList.isLoading ? (
              <div className="flex justify-center py-8">در حال بارگذاری...</div>
            ) : sessionNoteList.data?.data &&
              sessionNoteList.data.data.length > 0 ? (
              <div className="flex flex-col gap-4">
                {sessionNoteList.data.data.map((note) => (
                  <div key={note.id} className="rounded-lg border bg-white p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-700">
                          {note.createdBy.firstName} {note.createdBy.lastName}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString(
                            "fa-IR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            },
                          )}
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
            {/* Add new note */}
            <div className="mt-8 border-t pt-4">
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
          </>
        )}
        {activeTab === "logs" && (
          <>
            {sessionLogList.isLoading ? (
              <div className="flex justify-center py-8">در حال بارگذاری...</div>
            ) : sessionLogList.data?.data &&
              sessionLogList.data.data.length > 0 ? (
              <div className="flex flex-col gap-4">
                {sessionLogList.data.data.map((log) => (
                  <div key={log.id} className="rounded-lg border bg-white p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-700">
                          {log.createdBy?.firstName} {log.createdBy?.lastName}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(log.createdAt).toLocaleDateString("fa-IR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">
                      {log.description.map((part, idx) => (
                        <span
                          key={idx}
                          className={part.bold ? "font-bold" : ""}>
                          {part.firstName
                            ? log.createdBy?.firstName
                            : part.lastName
                              ? log.createdBy?.lastName
                              : part.text}
                        </span>
                      ))}
                    </p>
                    {log.note?.text && (
                      <div className="mt-2 rounded border border-gray-100 bg-gray-50 p-2 text-xs text-gray-600">
                        یادداشت: {log.note.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8 text-gray-500">
                تاریخچه‌ای وجود ندارد
              </div>
            )}
          </>
        )}
        {activeTab === "reminders" && (
          <SessionReminders
            contentId={sessionId}
            contentTitle={sessionTitle}
            contentType={REMINDER_CONTENT.MEETING}
          />
        )}
      </div>
    </div>
  );
}
