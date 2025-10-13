import { cn } from "@/lib/utils";

export default function SelectionItems({
  items,
  selectedItems,
  setSelectedItems,
  multiple = false,
  containerClassName,
  itemClassName,
}: {
  items: string[];
  selectedItems: string[] | string;
  setSelectedItems: (items: string[] | string | undefined) => void;
  multiple?: boolean;
  containerClassName?: string;
  itemClassName?: string;
}) {
  return (
    <div
      className={cn(
        "mt-4 flex w-full flex-wrap items-center gap-3",
        containerClassName,
      )}>
      {items.map((item, index) => (
        <div
          key={index + item}
          className={cn(
            "flex cursor-pointer select-none items-center rounded-full bg-neutral-200 px-9 py-2 font-medium transition-all duration-300 ease-in-out hover:bg-neutral-300",
            (Array.isArray(selectedItems)
              ? (selectedItems as string[])?.some((i) => i === item)
              : selectedItems === item) &&
              "active !bg-primary-blue !text-white",
            itemClassName,
          )}
          onClick={() => {
            if (multiple) {
              if (
                Array.isArray(selectedItems)
                  ? (selectedItems as string[])?.some((i) => i === item)
                  : selectedItems === item
              ) {
                setSelectedItems(
                  Array.isArray(selectedItems)
                    ? (selectedItems as string[])?.filter((i) => i !== item)
                    : undefined,
                );
              } else {
                setSelectedItems([...(selectedItems as string[]), item]);
              }
            } else {
              if (
                Array.isArray(selectedItems)
                  ? (selectedItems as string[])?.some((i) => i === item)
                  : selectedItems === item
              ) {
                setSelectedItems(undefined);
              } else {
                setSelectedItems(item);
              }
            }
          }}>
          <label
            htmlFor={item}
            className="cursor-pointer truncate text-nowrap"
            title={item}>
            {item}
          </label>
        </div>
      ))}
    </div>
  );
}
