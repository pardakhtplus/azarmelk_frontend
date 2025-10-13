"use client";

import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, GripVerticalIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { type ITableField } from "./EstatesContainer";

interface TableFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableFields: ITableField[];
  setTableFields: (fields: ITableField[]) => void;
}

export default function TableFieldsModal({
  isOpen,
  onClose,
  tableFields,
  setTableFields,
}: TableFieldsModalProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleToggleVisibility = (index: number) => {
    const newFields = [...tableFields];
    newFields[index].isVisible = !newFields[index].isVisible;
    setTableFields(newFields);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFields = [...tableFields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedField);

    // به‌روزرسانی ترتیب
    newFields.forEach((field, idx) => {
      field.order = idx;
    });

    setTableFields(newFields);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSelectAll = () => {
    const newFields = tableFields.map((field) => ({
      ...field,
      isVisible: true,
    }));
    setTableFields(newFields);
  };

  const handleDeselectAll = () => {
    const newFields = tableFields.map((field) => ({
      ...field,
      isVisible: false,
    }));
    setTableFields(newFields);
  };

  const visibleCount = tableFields.filter((field) => field.isVisible).length;
  const totalCount = tableFields.length;

  return (
    <Modal
      isOpen={isOpen}
      title={
        <div>
          <div className="text-lg font-bold">تنظیمات ستون‌های جدول</div>
          <div className="mt-1 text-sm text-gray-500">
            {visibleCount} از {totalCount} ستون فعال است
          </div>
        </div>
      }
      onCloseModal={onClose}
      onClickOutside={onClose}
      classNames={{
        background: "z-50 sm:!p-4 !p-0",
        box: "sm:!max-w-lg !w-full !max-w-full !max-h-full overflow-y-auto sm:!rounded-xl !rounded-none !h-full sm:!h-fit",
        header: "!border-b-0 !pb-0",
      }}>
      <div className="p-6">
        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleSelectAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-green/60 bg-primary-green/10 px-4 py-2 text-sm font-medium text-primary-green transition-all hover:bg-primary-green/20 active:scale-95 sm:w-auto">
            <EyeIcon size={16} />
            فعال کردن همه
          </button>
          <button
            onClick={handleDeselectAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-red/60 bg-primary-red/10 px-4 py-2 text-sm font-medium text-primary-red transition-all hover:bg-primary-red/20 active:scale-95 sm:w-auto">
            <EyeOffIcon size={16} />
            غیرفعال کردن همه
          </button>
        </div>

        {/* Fields List */}
        <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
          {tableFields.map((field, index) => {
            if (!field.isEditable) return null;
            return (
              <div
                key={field.field}
                draggable={field.isEditable}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
                  draggedIndex === index && "scale-95 opacity-50",
                  field.isVisible ? "bg-white" : "bg-neutral-100",
                )}>
                {/* Drag Handle */}
                {field.isEditable && (
                  <div className="cursor-grab text-gray-400 transition-colors active:cursor-grabbing group-hover:text-gray-600">
                    <GripVerticalIcon size={18} />
                  </div>
                )}

                {/* Field Info */}
                <div className="flex-1">
                  <div
                    className={cn(
                      "font-semibold transition-colors",
                      field.isVisible ? "text-gray-900" : "text-gray-500",
                    )}>
                    {field.fieldName}
                  </div>
                </div>

                {/* Visibility Toggle */}
                {field.isEditable && (
                  <button
                    onClick={() => handleToggleVisibility(index)}
                    className={cn(
                      "rounded-full p-2 transition-all duration-200 hover:scale-110",
                      field.isVisible
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-100",
                    )}>
                    {field.isVisible ? (
                      <EyeIcon size={18} />
                    ) : (
                      <EyeOffIcon size={18} />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <InfoIcon size={16} className="text-blue-600" />
            <div className="font-medium text-blue-900">راهنما</div>
          </div>
          <ul className="space-y-1 text-sm text-blue-700">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              برای تغییر ترتیب، فیلد را بکشید و رها کنید
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              برای نمایش/مخفی کردن، روی آیکون چشم کلیک کنید
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              تنظیمات در مرورگر شما ذخیره می‌شود
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
