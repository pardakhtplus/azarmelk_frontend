"use client";

import { IChevronLeft } from "@/components/Icons";
import { useEffect, useState } from "react";

export default function ResendCode({
  onClick,
}: {
  onClick: () => Promise<void>;
}) {
  const [counter, setCounter] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter === 0) {
        clearInterval(interval);
      }

      setCounter((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const minutes = Math.floor(counter / 60);

  const seconds = counter - minutes * 60;

  return (
    <button
      type="button"
      onClick={async () => {
        await onClick();
        setCounter(120);
      }}
      disabled={counter > 0}
      className="mt-4 flex items-center gap-x-1.5 font-medium text-blue-600 disabled:cursor-auto disabled:text-text-300 disabled:opacity-60">
      <IChevronLeft className="size-4" />
      {counter > 0 ? (
        <span>
          ارسال مجدد کد: 0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      ) : (
        <span>ارسال مجدد کد</span>
      )}
    </button>
  );
}
