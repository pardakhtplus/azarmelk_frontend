import { cn } from "@/lib/utils";
import { type ChangeEvent } from "react";

export default function CustomSwitch({
  onChange,
  checked,
  className,
  disabled,
  name,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  className: string;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <div className={cn("checkbox-wrapper-51", className)}>
      <input
        id={"cbx-51" + name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="toggle" htmlFor={"cbx-51" + name}>
        <span>
          <svg viewBox="0 0 10 10" height="10px" width="10px">
            <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z" />
          </svg>
        </span>
      </label>
    </div>
  );
}
