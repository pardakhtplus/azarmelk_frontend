import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";


/**
 * تبدیل تاریخ شمسی به میلادی با منطقه زمانی تهران (UTC+3:30)
 *
 * @param persianDate - تاریخ شمسی برای تبدیل
 * @returns تاریخ میلادی با فرمت ISO و منطقه زمانی تهران
 */
export const convertToGregorianWithTehranTimezone = (
  persianDate: DateObject,
): string => {
  // کپی از تاریخ اصلی برای جلوگیری از تغییر آن
  const dateCopy = new DateObject(persianDate);

  // تبدیل به تقویم میلادی با حفظ ساعت و دقیقه و ثانیه
  const gregorianDate = dateCopy.convert(gregorian, gregorian_en);

  // تنظیم ساعت با توجه به منطقه زمانی تهران (داخلی)
  // اما در خروجی فقط از فرمت ISO 8601 استاندارد با Z استفاده می‌کنیم

  // فرمت‌بندی تاریخ با Z به معنی UTC
  return gregorianDate.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
};

/**
 * بررسی می‌کند که آیا تاریخ داده شده در آینده است (امروز یا بعد از امروز)
 *
 * @param date - تاریخ مورد بررسی
 * @returns آیا تاریخ در آینده است یا خیر
 */
export const isFutureDate = (date: DateObject): boolean => {
  // ایجاد یک تاریخ جدید برای امروز با همان تقویم و زبان تاریخ ورودی
  const today = new DateObject({
    calendar: date.calendar,
    locale: date.locale,
  });

  // تنظیم ساعت، دقیقه و ثانیه به صفر برای هر دو تاریخ برای مقایسه درست
  today.setHour(0).setMinute(0).setSecond(0).setMillisecond(0);
  const dateToCompare = new DateObject(date)
    .setHour(0)
    .setMinute(0)
    .setSecond(0)
    .setMillisecond(0);

  // مقایسه تاریخ‌ها: اگر تاریخ مورد نظر بزرگتر یا مساوی امروز باشد، یعنی در آینده است
  return dateToCompare.valueOf() >= today.valueOf();
};

/**
 * Generates an array of DateObjects representing all days to be displayed in the calendar
 *
 * @param date - The current date (DateObject with Persian calendar)
 * @returns An array of DateObjects for the calendar grid
 */
export const generateCalendarDays = (date: DateObject): DateObject[] => {
  // Get current Persian month and year
  const year = date.year;
  const month = date.month.number;

  // Create a date object for the first day of the month
  const firstDay = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: year,
    month: month,
    day: 1,
  });

  // Get day of the week for the first day (0 = Saturday in Persian calendar, 1 = Sunday, etc.)
  const firstDayOfWeek = firstDay.weekDay.index;

  // Get the number of days in the current month
  const daysInMonth = firstDay.month.length;

  // Get the number of days in the previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthLength = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: prevYear,
    month: prevMonth,
    day: 1,
  }).month.length;

  const days: DateObject[] = [];

  // Add previous month's days to fill the first row
  for (let i = 0; i < firstDayOfWeek; i++) {
    const day = prevMonthLength - firstDayOfWeek + i + 1;
    days.push(
      new DateObject({
        calendar: persian,
        locale: persian_fa,
        year: prevYear,
        month: prevMonth,
        day: day,
      }),
    );
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      new DateObject({
        calendar: persian,
        locale: persian_fa,
        year: year,
        month: month,
        day: i,
      }),
    );
  }

  // Calculate how many rows we need based on first day of week and days in month
  // Then add only enough days from next month to complete the last row
  const totalDaysSoFar = firstDayOfWeek + daysInMonth;
  const rowsNeeded = Math.ceil(totalDaysSoFar / 7);
  const cellsNeeded = rowsNeeded * 7;
  const remainingDays = cellsNeeded - totalDaysSoFar;

  // Add next month's days to fill just the remaining cells in the last row
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let i = 1; i <= remainingDays; i++) {
    days.push(
      new DateObject({
        calendar: persian,
        locale: persian_fa,
        year: nextYear,
        month: nextMonth,
        day: i,
      }),
    );
  }

  return days;
};

/**
 * Checks if the given date is in the current month
 *
 * @param date - The date to check
 * @param currentDate - The reference date for the current month
 * @returns boolean indicating if the date is in the current month
 */
export const isCurrentMonth = (
  date: DateObject,
  currentDate: DateObject,
): boolean => {
  return (
    date.month.number === currentDate.month.number &&
    date.year === currentDate.year
  );
};

/**
 * Checks if the given date is today
 *
 * @param date - The date to check
 * @returns boolean indicating if the date is today
 */
export const isToday = (date: DateObject): boolean => {
  const today = new DateObject({ calendar: persian, locale: persian_fa });
  return (
    date.day === today.day &&
    date.month.number === today.month.number &&
    date.year === today.year
  );
};

/**
 * Object containing all Iranian holidays with their names
 * Key format: "MM/DD" for recurring annual holidays
 * Key format: "YYYY/MM/DD" for specific one-time holidays
 */
const HOLIDAY_MAP: Record<string, string> = {
  // تعطیلات مناسبتی در تقویم شمسی (نوروز و...)
  "01/01": "عید نوروز",
  "01/02": "عید نوروز",
  "01/03": "عید نوروز",
  "01/04": "عید نوروز",
  "01/13": "روز طبیعت (سیزده بدر)",
  "03/14": "رحلت امام خمینی",
  "03/15": "قیام 15 خرداد",
  "11/22": "پیروزی انقلاب اسلامی",
  "12/29": "ملی شدن صنعت نفت",

  // برخی از تعطیلات مذهبی ثابت شمسی
  "08/28": "رحلت پیامبر و شهادت امام حسن",
  "10/08": "شهادت امام رضا",

  // می‌توان تعطیلات خاص هر سال را به صورت کامل اضافه کرد
  "1403/01/01": "عید نوروز",
  "1403/01/02": "عید نوروز",
  "1403/01/03": "عید نوروز",
  "1403/01/04": "عید نوروز",
};

/**
 * Checks if the given date is a holiday (Friday or official holiday)
 *
 * @param date - The date to check
 * @returns object with isHoliday boolean and the holiday name if applicable
 */
export const isHoliday = (
  date: DateObject,
): { isHoliday: boolean; name?: string } => {
  // جمعه‌ها تعطیل رسمی هستند (شاخص 6 در تقویم فارسی)
  if (date.weekDay.index === 6) {
    return { isHoliday: true, name: "جمعه" };
  }

  // بررسی تعطیلات سالانه تکرار شونده (بدون سال)
  const monthDay = `${date.month.number.toString().padStart(2, "0")}/${date.day.toString().padStart(2, "0")}`;

  // بررسی تعطیلات خاص با سال
  const fullDate = `${date.year}/${monthDay}`;

  // اگر در تعطیلات سالانه بود
  if (HOLIDAY_MAP[monthDay]) {
    return { isHoliday: true, name: HOLIDAY_MAP[monthDay] };
  }

  // اگر در تعطیلات خاص سال بود
  if (HOLIDAY_MAP[fullDate]) {
    return { isHoliday: true, name: HOLIDAY_MAP[fullDate] };
  }

  return { isHoliday: false };
};
