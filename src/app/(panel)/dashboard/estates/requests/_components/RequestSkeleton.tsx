"use client";

export default function RequestSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="flex flex-wrap gap-4">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-8 rounded-lg bg-gray-200" />
                <div className="h-8 w-8 rounded-lg bg-gray-200" />
                <div className="h-8 w-8 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
