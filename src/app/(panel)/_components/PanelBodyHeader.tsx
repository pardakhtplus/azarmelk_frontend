import { cn } from "@/lib/utils";

export default function PanelBodyHeader({
  breadcrumb,
  BRClassName,
  children,
  title,
  isLoading = false,
  className,
  childrenClassName,
}: {
  breadcrumb?: React.ReactNode;
  BRClassName?: string;
  children?: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  className?: string;
  childrenClassName?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-center justify-between gap-y-2",
        className,
      )}>
      {isLoading ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 animate-pulse space-y-2.5">
            <div className="h-4 w-40 rounded bg-primary/10 md:h-5 md:w-56" />
            <div className="h-6 w-28 rounded bg-primary/10 md:h-7 md:w-32" />
          </div>
          <div className="flex items-center gap-x-4">
            <div className="h-11 w-11 animate-pulse rounded-full bg-primary/10 md:h-12 md:w-36" />
            <div className="h-11 w-11 animate-pulse rounded-full bg-primary/10 md:h-12 md:w-36" />
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1 md:space-y-1.5">
            {breadcrumb ? (
              <div
                className={cn("text-xs text-text-200 md:text-sm", BRClassName)}>
                {breadcrumb}
              </div>
            ) : null}
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
          </div>
          <div
            className={cn(
              "mr-auto flex w-fit shrink-0 items-center gap-x-3 md:gap-x-4",
              childrenClassName,
            )}>
            {children}
          </div>
        </>
      )}
    </header>
  );
}
