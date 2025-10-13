"use client";

import toast from "react-hot-toast";

export default function EstateCode({ estateCode }: { estateCode: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(estateCode);

    toast.success("کد ملک با موفقیت کپی شد");
  };

  return (
    <div className="mt-5 flex items-start gap-x-1" onClick={handleCopy}>
      <p className="text-sm font-normal">کد ملک: </p>
      <p className="text-sm font-normal text-text-200">{estateCode}</p>
    </div>
  );
}
