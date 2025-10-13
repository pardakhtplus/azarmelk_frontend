'use client';
import { RefreshCcw } from 'lucide-react';

interface Props {
  onClick: () => void;
  isVisible?: boolean;
}

export default function LoadMoreButton({ onClick, isVisible = true }: Props) {
  if (!isVisible) return null;

  return (
    <button
      className="group mx-auto mt-[50px] px-4 py-2 flex flex-row items-center gap-2.5 font-normal text-lg rounded-lg
                 transition-all duration-300 ease-in-out
                 hover:shadow-md hover:-translate-y-0.5"
      onClick={onClick}
      aria-label="بارگزاری بیشتر"
    >
      <RefreshCcw size={18} className="transition-transform duration-300 group-hover:rotate-90" />
      بارگزاری بیشتر
    </button>
  );
}