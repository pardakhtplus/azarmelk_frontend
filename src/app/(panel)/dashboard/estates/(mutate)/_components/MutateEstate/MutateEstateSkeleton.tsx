import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";

export default function MutateEstateSkeleton() {
  return (
    <>
      <PanelBodyHeader isLoading />
      <div className="flex flex-col-reverse items-start gap-6 pt-6 md:gap-8 md:pt-8 lg:gap-10 lg:pt-10 xl:flex-row">
        {/* Form side skeleton */}
        <div className="flex w-full flex-col gap-y-5">
          {/* Title */}
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
            <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
          </div>

          {/* Owners */}
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
            <div className="mt-2 flex flex-col gap-y-3">
              <div className="h-14 w-full animate-pulse rounded-xl bg-neutral-100" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-neutral-100" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-neutral-100" />
              <div className="h-14 w-full animate-pulse rounded-xl border border-dashed border-primary/20" />
            </div>
          </div>

          {/* A few grouped fields */}
          <div className="flex items-start gap-x-4">
            <div className="w-full">
              <div className="h-4 w-16 animate-pulse rounded bg-primary/10" />
              <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
            </div>
            <div className="w-full">
              <div className="h-4 w-16 animate-pulse rounded bg-primary/10" />
              <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
            <div className="mt-2 h-24 w-full animate-pulse rounded-xl bg-neutral-100" />
          </div>

          {/* Approx address */}
          <div>
            <div className="h-4 w-28 animate-pulse rounded bg-primary/10" />
            <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
          </div>

          {/* Features chips */}
          <div className="pt-4">
            <div className="h-4 w-20 animate-pulse rounded bg-primary/10" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-28 animate-pulse rounded-full bg-neutral-100"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gallery side skeleton */}
        <div className="grid w-full grid-cols-1 xl:w-[40%]">
          <div className="flex w-full flex-col gap-3">
            <div className="aspect-[16/10] w-full animate-pulse overflow-hidden rounded-xl bg-neutral-100" />
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] w-full animate-pulse rounded-xl bg-neutral-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
