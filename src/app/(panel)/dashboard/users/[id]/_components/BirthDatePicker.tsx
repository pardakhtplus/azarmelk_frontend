"use client";

import React from "react";
import DatePicker from "react-multi-date-picker";
import { Controller } from "react-hook-form";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/teal.css";
import { cn } from "@/lib/utils";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type Props = {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const BirthDatePicker: React.FC<Props> = ({
  name,
  control,
  label,
  disabled,
  onClick,
}) => {
  return (
    <div
      dir="ltr"
      className="col-span-2 flex h-full flex-col gap-2 sm:col-span-2 lg:col-span-1"
      onClick={onClick}>
      {label && (
        <label dir="rtl" className="font-medium">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            value={field.value}
            onChange={(date) => {
              if (date) {
                // Convert Persian date to Gregorian date without timezone issues
                const jsDate = date.toDate();
                const year = jsDate.getFullYear();
                const month = String(jsDate.getMonth() + 1).padStart(2, "0");
                const day = String(jsDate.getDate()).padStart(2, "0");
                const gregorianDate = `${year}-${month}-${day}`;

                // Format as Persian date string
                const persianDate = new Intl.DateTimeFormat("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "Asia/Tehran",
                })
                  .format(new Date(gregorianDate))
                  .replace(/\//g, "/")
                  .trim();

                field.onChange(persianDate);
              } else {
                field.onChange("");
              }
            }}
            calendar={persian}
            locale={persian_fa}
            inputClass={cn(
              "bordered-input cursor-not-allowed",
              disabled ||
                "!cursor-text border-[1.5px] bg-transparent transition-all focus:border-neutral-400",
            )}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
};

export default BirthDatePicker;
