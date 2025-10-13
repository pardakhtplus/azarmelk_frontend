"use client";

import { cn } from "@/lib/utils";
import React from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import type { mutateEstateSchema } from "../MutateEstate";
import type { z } from "zod";

type Props = {
  name: string;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateSchema>>;
  watch: UseFormWatch<z.infer<typeof mutateEstateSchema>>;
};

const ExitDatePicker: React.FC<Props> = ({ name, setValue, watch }) => {
  return (
    <DatePicker
      className="w-full"
      // @ts-expect-error not
      value={watch(name as keyof z.infer<typeof mutateEstateSchema>)}
      onChange={(date) => {
        if (date) {
          const jsDate = date.toDate();
          const year = jsDate.getFullYear();
          const month = String(jsDate.getMonth() + 1).padStart(2, "0");
          const day = String(jsDate.getDate()).padStart(2, "0");
          const gregorianDate = `${year}-${month}-${day}`;
          setValue(
            name as keyof z.infer<typeof mutateEstateSchema>,
            new Intl.DateTimeFormat("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
              .format(new Date(gregorianDate))
              .replace(/\//g, "/")
              .trim(),
          );
        } else {
          setValue(name as keyof z.infer<typeof mutateEstateSchema>, "");
        }
      }}
      calendar={persian}
      locale={persian_fa}
      inputClass={cn(
        "bordered-input",
        "!cursor-text border-[1.5px] bg-transparent transition-all focus:border-neutral-400",
      )}
    />
  );
};

export default ExitDatePicker;
