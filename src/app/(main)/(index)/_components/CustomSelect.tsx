import React, { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  type?: "gray" | "white";
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  type,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-[167px] flex-1" ref={selectRef}>
      <button
        type="button"
        className={`h-[43px] w-full appearance-none rounded-[15px] px-3 py-2 pr-6 text-xs font-normal outline-none focus:border-primary/60 ${type === "gray" ? "bg-[#FAFAFA]" : "border border-[#EEEE] bg-white"} text-right`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}>
        {value || label}
      </button>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black sm:left-[15px]">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-[#EEEE] bg-white shadow-lg"
          role="listbox"
          aria-label={label}>
          <li
            className="cursor-pointer px-3 py-2 text-gray-500 hover:bg-gray-100"
            onClick={() => handleOptionClick("")}
            role="option"
            aria-selected={value === ""}>
            {label}
          </li>
          {options.map((option) => (
            <li
              key={option}
              className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${value === option ? "bg-primary/80 text-white hover:!bg-primary/90" : ""}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={value === option}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
