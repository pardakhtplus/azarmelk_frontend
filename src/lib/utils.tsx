import { clearTokenCache } from "@/services/axios-client";
import { clsx, type ClassValue } from "clsx";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { twMerge } from "tailwind-merge";
import { removeCookie } from "./server-utils";

export const dateType = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function srcToFile(
  url: string,
  fileName: string = "file",
): Promise<File | undefined> {
  try {
    // Fetch the file from the URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get content type from headers with proper fallback
    let contentType = response.headers.get("content-type");

    // If no content type is provided, try to infer from file extension
    if (!contentType) {
      const extension = fileName.split(".").pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        // Add more mime types as needed
      };
      contentType = extension
        ? mimeTypes[extension] || "application/octet-stream"
        : "application/octet-stream";
    }

    const blob = await response.blob();

    // Create a new File object with the determined content type
    const file = new File([blob], `${fileName}.${contentType.split("/")[1]}`, {
      type: contentType,
    });

    return file;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Copy array to avoid mutation
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}

export function userFullName(firstName?: string, lastName?: string) {
  return (
    (firstName || "") + ((firstName || lastName) && " ") + (lastName || "") ||
    ""
  );
}

export function isVideo(file) {
  return file && file.type?.startsWith("video/");
}

export function removeOrigin(url: string) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search + urlObj.hash;
    return decodeURIComponent(path.startsWith("/") ? path.substring(1) : path);
  } catch (error) {
    console.error("Invalid URL:", error);
    return decodeURIComponent(url); // Return original URL if invalid
  }
}

export function isFile(value: unknown): value is File {
  return value instanceof File;
}

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (value: number) => value?.toString(16).padStart(2, "0");
  const alpha = a < 1 ? toHex(Math.round(a * 255)) : "";
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
}

export const isOnlyNumbers = (str: string): boolean => {
  return /^\d+$/.test(str);
};

// Helper function to remove formatting
export const unFormatNumber = (value: string) => {
  return value?.replace(/,/g, "");
};

export const removeDuplicates = (arr: number[]): number[] =>
  Array.from(new Set(arr));

export const remainingDate = (targetDate: Date) => {
  const now = new Date();
  const timeDiff = targetDate.getTime() - now.getTime();

  if (timeDiff <= 0) return { number: 0, key: "" };

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { number: days + 1, label: "روز", key: "day" };
  } else if (hours > 0) {
    return { number: hours + 1, label: "ساعت", key: "hour" };
  } else {
    return { number: minutes + 1, label: "دقیقه", key: "min" };
  }
};

/**
 * Extracts error message from API error response
 * @param error - The caught error object
 * @param shouldLog - Whether to log the error to console (default: false)
 * @returns The error message string to display
 */
export const handleApiError = (
  error: unknown,
  shouldLog: boolean = false,
): string => {
  // Check if error is an object with response data
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const errorData = error.response.data;

    // Log the error data if requested
    if (shouldLog) {
      console.log(errorData);
    }

    if (errorData && typeof errorData === "object") {
      // Try to extract message or details from error response
      if ("message" in errorData && typeof errorData.message === "string") {
        return errorData.message;
      } else if (
        "details" in errorData &&
        typeof errorData.details === "string"
      ) {
        return errorData.details;
      }
    }
  }

  // Fallback to generic error message
  return `${"مشکلی پیش آمده است"}`;
};

export const logout = async () => {
  await removeCookie("accessToken");
  await removeCookie("refreshToken");
  clearTokenCache();
  window.location.reload();
};

export const convertToEnglishNumbers = (str: string) => {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = str.toString();

  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(persianNumbers[i] + "|" + arabicNumbers[i], "g");
    result = result.replace(regex, englishNumbers[i]);
  }

  return result;
};

/**
 * Converts a Persian (Jalali) date string with Persian digits (e.g. "۱۴۰۴/۰۵/۱۳" or "۱۴۰۴/۰۵/۱۳ 12:30")
 * to an ISO UTC string formatted as YYYY-MM-DDTHH:mm:ss.SSSZ
 */
export function faJalaliToIsoUtc(input: string): string | null {
  if (!input) return null;

  // Normalize digits and whitespace
  const normalized = convertToEnglishNumbers(String(input)).trim();
  const [datePartRaw, timePartRaw] = normalized.split(/\s+/);
  if (!datePartRaw) return null;

  const dateParts = datePartRaw.split(/[\/\-]/).map((v) => Number(v));
  if (dateParts.length < 3) return null;
  const [jy, jm, jd] = dateParts;
  if (!jy || !jm || !jd) return null;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (timePartRaw) {
    const t = timePartRaw.split(":").map((v) => Number(v));
    hours = Number.isFinite(t[0]) ? t[0] : 0;
    minutes = Number.isFinite(t[1]) ? t[1] : 0;
    seconds = Number.isFinite(t[2]) ? t[2] : 0;
  }

  try {
    const d = new DateObject({
      date: `${jy}/${jm}/${jd}`,
      format: "YYYY/M/D",
      calendar: persian,
      locale: persian_fa,
    })
      .setHour(hours)
      .setMinute(minutes)
      .setSecond(seconds)
      .setMillisecond(0)
      .convert(gregorian, gregorian_en)
      .toUTC();

    return d.format(dateType);
  } catch {
    return null;
  }
}

/**
 * Converts an ISO UTC string (e.g. "2025-08-04T20:30:00.000Z")
 * to a Jalali date string formatted as YYYY/MM/DD
 */
export function isoUtcToFaJalaliDate(
  iso: string | null | undefined,
): string | null {
  if (!iso) return null;
  try {
    const d = new DateObject({
      date: new Date(iso),
      calendar: gregorian,
      locale: gregorian_en,
    }).convert(persian, persian_fa);

    return d.format("YYYY/MM/DD");
  } catch {
    return null;
  }
}

// Helper function to format number with thousand separators
export const formatNumber = (value: string) => {
  // Remove any non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, "");

  // Split number into integer and decimal parts
  const [integerPart, decimalPart] = cleanValue.split(".");

  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return formatted number with decimal part if it exists
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

/**
 * Safely decode a URL component, handling Persian characters properly
 * Falls back to the original string if decoding fails
 */
export const safeDecodeURIComponent = (encodedString: string): string => {
  try {
    return decodeURIComponent(encodedString);
  } catch {
    // If decoding fails (string is not URL-encoded), return the original
    return encodedString;
  }
};

// number-to-persian-words.ts
export function numberToPersianWords(
  n: number,
  appendCurrency = "تومان",
): string {
  if (!Number.isFinite(n)) throw new Error("عدد نامعتبر است");
  if (Math.abs(n) < 1 && n !== 0) n = Math.round(n);

  const negatives = n < 0;
  n = Math.abs(Math.round(n));

  if (n === 0)
    return (
      (negatives ? "منفی " : "") +
      "صفر" +
      (appendCurrency ? " " + appendCurrency : "")
    );

  const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];

  function threeDigitToWords(num: number): string {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    const parts: string[] = [];

    if (h) parts.push(hundreds[h]);

    if (t === 1) {
      parts.push(teens[o]);
    } else {
      if (t) parts.push(tens[t]);
      if (o) parts.push(ones[o]);
    }

    return parts.join(" و ");
  }

  // تا مقیاس‌های خیلی بزرگ
  const scales = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
    "کوادریلیون",
    "کوینتیلیون",
    "سکستیلیون",
    "سپتیلیون",
    "اکتیلیون",
    "نانیلیون",
    "دسیلیون",
  ];

  const groups: string[] = [];
  let remaining = n;
  let groupIndex = 0;

  while (remaining > 0) {
    const group = remaining % 1000;
    if (group !== 0) {
      const text = threeDigitToWords(group);
      const scaleName = scales[groupIndex] || "";

      // شرط حذف "یک" برای هزار
      if (group === 1 && scaleName === "هزار") {
        groups.push("هزار");
      } else {
        groups.push((text + (scaleName ? " " + scaleName : "")).trim());
      }
    }
    remaining = Math.floor(remaining / 1000);
    groupIndex++;
  }

  const words = groups.reverse().join(" و ");
  const prefix = negatives ? "منفی " : "";
  return prefix + words + (appendCurrency ? " " + appendCurrency : "");
}
