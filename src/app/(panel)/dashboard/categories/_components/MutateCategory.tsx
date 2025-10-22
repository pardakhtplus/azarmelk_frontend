"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import useCreateRegion from "@/services/mutations/admin/category/useCreateRegion";
import useEditRegion from "@/services/mutations/admin/category/useEditRegion";
import { type TCategory } from "@/types/admin/category/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema
const formSchema = z.object({
  name: z
    .string({ message: "نام منطقه را وارد کنید!" })
    .min(1, { message: "نام منطقه را وارد کنید!" }),
  description: z.string().optional(),
});

export default function MutateCategory({
  categories,
  children,
  className,
  isEdit,
  defaultValues,
  title,
}: {
  categories: TCategory[];
  children: React.ReactNode;
  className?: string;
  isEdit?: boolean;
  defaultValues?: TCategory;
  title?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const { createRegion } = useCreateRegion();
  const { editRegion } = useEditRegion();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res: any;

    if (isEdit) {
      res = await editRegion.mutateAsync({
        id: defaultValues?.id,
        name: values.name.trim(),
        description: values.description || "",
        parentId: categories[categories.length - 1].id,
        isRegion: true,
        DealType: categories[0].dealType,
        MainCategory: categories[1].mainCategory || "",
        PropertyType: categories[2].propertyType || "",
      });
    } else {
      res = await createRegion.mutateAsync({
        name: values.name.trim(),
        description: values.description || "",
        parentId: categories[categories.length - 1].id,
        isRegion: true,
        DealType: categories[0].dealType,
        MainCategory: categories[1].mainCategory || "",
        PropertyType: categories[2].propertyType || "",
      });
    }

    if (!res) return;

    queryClient.invalidateQueries({
      queryKey: ["regions", categories[categories.length - 1].id],
    });

    setIsOpenModal(false);
    reset();
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <button
        title={title}
        type="button"
        className={cn(className)}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpenModal(true);
        }}>
        {children}
      </button>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title={
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm font-normal sm:gap-x-2 sm:text-base">
              <span>{categories[0].name}</span> /
              <span>{categories[1].name}</span> /
              <span>{categories[2].name}</span> /
              {categories.length > 3 && (
                <>
                  <span>{categories[3].name}</span> /
                </>
              )}
              {isEdit ? (
                <span className="text-primary-blue">
                  ویرایش {defaultValues?.name}
                </span>
              ) : (
                <span className="text-primary-blue">افزودن دسته بندی جدید</span>
              )}
            </div>
          }
          classNames={{
            background: "z-50 !py-0 sm:!px-4 !px-0",
            box: "sm:!max-w-2xl sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          <div className="flex flex-col gap-y-3 px-6 py-7">
            <div className="">
              <p className="text-sm">نام منطقه را وارد کنید</p>
              <BorderedInput
                register={register}
                name="name"
                error={errors.name}
                placeholder="مثال: آبرسان"
                containerClassName="mb-2 mt-2"
                type="text"
              />
            </div>
            <div className="h-fit w-full">
              <label
                htmlFor="description"
                className="mb-2 flex items-center justify-start gap-x-1 text-sm">
                <span>توضیحات را وارد کنید (اختیاری)</span>
              </label>
              <div className="relative w-full">
                <textarea
                  id="description"
                  className={cn(
                    "bordered-input h-auto rounded-xl py-2",
                    errors.description && "!border-[#ff0000]",
                  )}
                  rows={4}
                  {...register("description")}
                />
              </div>
              {errors.description ? (
                <p className="pt-1 text-start text-xs text-[#ff0000]">
                  {errors.description?.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-4 pb-7">
            <Button
              type="button"
              className="!px-10"
              onClick={handleSubmit(onSubmit)}
              isLoading={createRegion.isPending || editRegion.isPending}>
              {isEdit ? "ویرایش" : "افزودن"}
            </Button>
            <BorderedButton
              type="button"
              className="!px-10"
              onClick={() => setIsOpenModal(false)}>
              لغو
            </BorderedButton>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
