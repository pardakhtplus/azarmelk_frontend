export default function Loading() {
  return (
    <div className="container flex min-h-[calc(100vh-597px)] w-full flex-col-reverse gap-10 pt-12 sm:gap-10 lg:flex-row">
      <div className="w-full animate-pulse">
        <div className="h-8 w-2/3 rounded-md bg-gray-200" />

        {/* Prices */}
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="h-6 w-40 rounded-md bg-gray-200" />
          <div className="h-5 w-32 rounded-md bg-gray-200" />
        </div>

        {/* Property Details Grid */}
        <div className="mt-10 grid grid-cols-3 gap-y-6 min-[430px]:grid-cols-4 xs:grid-cols-5 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-gray-200" />
              <div className="h-4 w-20 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Amenities */}
        <section className="mt-10 sm:mt-24">
          <div className="h-5 w-24 rounded-md bg-gray-200" />
          <div className="mt-5 flex w-full flex-wrap gap-2.5">
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="h-8 w-24 rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="my-10 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 w-full rounded-md bg-gray-200" />
            ))}
          </div>
        </section>
      </div>

      {/* Image Section */}
      <div className="flex w-full animate-pulse flex-col items-center gap-5">
        <div className="aspect-[4/3] w-full rounded-xl bg-gray-200" />
        <div className="flex w-full gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] w-1/4 rounded-md bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
