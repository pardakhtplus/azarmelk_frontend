"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import TextArea from "@/components/modules/inputs/TextArea";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createPortal } from "react-dom";

type TProps = {
  title: string;
  description: string;
  onSubmit: (title?: string, description?: string) => Promise<boolean>;
  actionName?: string;
  actionClassName?: string;
  className?: string;
  children: React.ReactNode;
  variant?: "button" | "borderedButton";
  colorVariant?: "blue" | "red" | "green";
  isHaveTitle?: boolean;
  isHaveDescription?: boolean;
  titleLabel?: string;
  descriptionLabel?: string;
};

export default function StatusNotificationModal({
  description,
  title,
  onSubmit,
  actionName = "حذف",
  actionClassName,
  className,
  children,
  variant,
  colorVariant,
  isHaveTitle,
  isHaveDescription,
  titleLabel,
  descriptionLabel,
}: TProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  return (
    <>
      {variant === "button" || colorVariant ? (
        <Button
          type="button"
          variant={colorVariant}
          className={cn(className)}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpenModal(true);
          }}>
          {children}
        </Button>
      ) : variant === "borderedButton" ? (
        <BorderedButton
          type="button"
          variant={colorVariant}
          className={cn(className)}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpenModal(true);
          }}>
          {children}
        </BorderedButton>
      ) : (
        <button
          type="button"
          className={cn(className)}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpenModal(true);
          }}>
          {children}
        </button>
      )}
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title={title}
          classNames={{
            background: "z-[60] !py-0 !px-4",
            box: "!max-w-2xl !max-h-[95%] rounded-none overflow-x-hidden !h-fit flex flex-col justify-between rounded-xl",
            header: "!py-4",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          <div className="space-y-6 px-6 pb-7 pt-6">
            <p className="font-medium leading-relaxed !text-text-300">
              {description}
            </p>

            {isHaveTitle && (
              <div className="">
                <label className="text-sm font-medium text-text-300">
                  {titleLabel}
                </label>
                <BorderedInput
                  name="title"
                  containerClassName="mt-1.5"
                  type="text"
                  value={titleValue}
                  onInput={(event) => {
                    setTitleValue(event.currentTarget.value);
                  }}
                  placeholder="عنوان را وارد کنید..."
                />
              </div>
            )}

            {isHaveDescription && (
              <div className="">
                <label className="text-sm font-medium text-text-300">
                  {descriptionLabel}
                </label>
                <TextArea
                  name="description"
                  rows={3}
                  className="mt-1.5 w-full pt-1.5"
                  value={descriptionValue}
                  onChange={(event) => {
                    setDescriptionValue(event.currentTarget.value);
                  }}
                  placeholder="توضیحات را وارد کنید..."
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-x-4 px-6 pb-5">
            <Button
              type="button"
              isLoading={isLoading}
              disabled={isLoading}
              action="DELETE"
              className={cn("!px-7 sm:!px-10", actionClassName)}
              onClick={async () => {
                setIsLoading(true);
                const res = await onSubmit(titleValue, descriptionValue);
                setIsLoading(false);

                if (res) {
                  setIsOpenModal(false);
                  // Reset form
                  setTitleValue("");
                  setDescriptionValue("");
                }
              }}>
              {actionName}
            </Button>
            <BorderedButton
              disabled={isLoading}
              type="button"
              className="!px-6 sm:!px-10"
              onClick={() => {
                setIsOpenModal(false);
                // Reset form
                setTitleValue("");
                setDescriptionValue("");
              }}>
              لغو
            </BorderedButton>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
