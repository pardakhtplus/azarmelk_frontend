import { cn } from "@/lib/utils";

export default function TruncatedTableCell({
  text,
  maxLength = 10,
}: {
  text: string;
  maxLength?: number;
}) {
  const truncatedText =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const needToTruncate = text.length > maxLength;

  return (
    <div className="group relative">
      <div className="truncate">{truncatedText}</div>

      {needToTruncate && (
        <div
          className={cn(
            "absolute bottom-full right-0 z-50 hidden rounded-md bg-neutral-100 p-2 text-sm text-neutral-900 group-hover:block",
          )}>
          {text}
        </div>
      )}
    </div>
  );
}
