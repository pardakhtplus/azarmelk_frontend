"use client";

import { cn, formatNumber, unFormatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  type FieldError,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

// Function to convert Persian numbers to English
const convertPersianToEnglish = (str: string) => {
  if (!str) return "";

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[۰-۹]/g, (match) => {
    return persianDigits.indexOf(match).toString();
  });
};

export default function TextArea({
  placeholder,
  name,
  register,
  error,
  className,
  containerClassName,
  value,
  defaultValue,
  onChange,
  onClick,
  dir,
  disable,
  isCurrency = false,
  setValue,
  showCurrency = false,
  currencyClassName,
  ...props
}: {
  placeholder?: string;
  name: string;
  register?: UseFormRegister<any>;
  error?:
    | FieldError
    | undefined
    | {
        message: string;
      };
  className?: string;
  containerClassName?: string;
  value?: string;
  defaultValue?: any;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: () => void;
  dir?: "rtl" | "ltr" | "auto";
  disable?: boolean;
  isCurrency?: boolean;
  setValue?: UseFormSetValue<any>;
  showCurrency?: boolean;
  currencyClassName?: string;
} & React.ComponentProps<"textarea">) {
  const [displayValue, setDisplayValue] = useState("");

  // Handle initial value
  useEffect(() => {
    if (isCurrency && (value || defaultValue)) {
      setDisplayValue(formatNumber(String(value || defaultValue)));
    }
  }, [value, defaultValue, isCurrency]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Convert Persian digits to English first
    const convertedValue = convertPersianToEnglish(event.target.value);

    if (isCurrency) {
      const rawValue = unFormatNumber(convertedValue);
      const formattedValue = formatNumber(rawValue);
      setDisplayValue(formattedValue);

      // Create a synthetic event with unformatted value for form handling
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          value: rawValue,
        },
      };

      if (onChange)
        onChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    } else {
      if (convertedValue !== event.target.value) {
        event.target.value = convertedValue;
      }
      if (onChange) onChange(event as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };

  if (isCurrency && register) {
    const registration = register(name as any);

    return (
      <div
        className={cn(
          "w-full",
          showCurrency && "relative",
          containerClassName,
        )}>
        <textarea
          dir={dir}
          id={name}
          placeholder={placeholder}
          className={cn(
            "bordered-textarea",
            className,
            error && "!border-[#ff0000]",
          )}
          value={displayValue}
          onClick={onClick}
          onChange={(e) => {
            const convertedValue = convertPersianToEnglish(e.target.value);
            if (isCurrency) {
              if (setValue) setValue(name, unFormatNumber(convertedValue)); // Ensure react-hook-form gets the unformatted value
              handleChange(e);
            } else {
              if (setValue) setValue(name, convertedValue); // Ensure react-hook-form gets the unformatted value
            }
          }}
          onBlur={registration.onBlur}
          name={registration.name}
          ref={registration.ref}
          {...props}
        />
        {showCurrency && (
          <span
            className={cn(
              "absolute left-3 top-[23px] -translate-y-1/2 text-sm text-text-100",
              currencyClassName,
            )}>
            تومان
          </span>
        )}
        {error ? (
          <p className="m-0 pt-1 text-start text-xs text-[#ff0000]">
            {error?.message}
          </p>
        ) : null}
      </div>
    );
  }

  if (register) {
    const registration = register(name as any);
    return (
      <div
        className={cn(
          "w-full",
          showCurrency && "relative",
          containerClassName,
        )}>
        <textarea
          disabled={disable}
          dir={dir}
          id={name}
          placeholder={placeholder}
          className={cn(
            "bordered-textarea",
            className,
            error && "!border-[#ff0000]",
          )}
          {...(value !== undefined ? { value } : { defaultValue })}
          onClick={onClick}
          onBlur={registration.onBlur}
          name={registration.name}
          ref={registration.ref}
          {...props}
        />
        {showCurrency && (
          <span
            className={cn(
              "absolute left-3 top-[23px] -translate-y-1/2 text-sm text-text-100",
              currencyClassName,
            )}>
            تومان
          </span>
        )}
        {error ? (
          <p className="pt-1 text-start text-xs text-[#ff0000]">
            {error?.message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn("w-full", showCurrency && "relative", containerClassName)}>
      <textarea
        disabled={disable}
        dir={dir}
        id={name}
        placeholder={placeholder}
        className={cn(
          "bordered-textarea",
          className,
          error && "!border-[#ff0000]",
        )}
        onClick={onClick}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={handleChange}
        {...props}
      />
      {showCurrency && (
        <span
          className={cn(
            "absolute left-3 top-[23px] -translate-y-1/2 text-sm text-text-100",
            currencyClassName,
          )}>
          تومان
        </span>
      )}
      {error ? (
        <p className="pt-1 text-start text-xs text-[#ff0000]">
          {error?.message}
        </p>
      ) : null}
    </div>
  );
}
