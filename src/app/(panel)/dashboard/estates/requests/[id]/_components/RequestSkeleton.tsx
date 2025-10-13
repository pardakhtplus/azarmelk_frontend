import React from "react";

export default function RequestSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Back Button and Status Skeleton */}
      <div className="flex gap-4 pt-4 sm:items-center sm:justify-between">
        <div className="h-10 w-48 rounded-lg bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-gray-200" />
          <div className="h-8 w-24 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column Skeleton */}
        <div className="space-y-6">
          {/* Request Info Section Skeleton */}
          <div className="animate-pulse rounded-xl bg-neutral-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* User Info Section Skeleton */}
          <div className="animate-pulse rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-6 w-40 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Status Change Section Skeleton */}
          <div className="animate-pulse rounded-xl bg-neutral-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-20 w-full rounded bg-gray-200" />
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-24 rounded-lg bg-gray-200" />
                <div className="h-10 w-24 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Estate Info Section Skeleton */}
          <div className="animate-pulse rounded-xl bg-neutral-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviewer Info Section Skeleton */}
          <div className="animate-pulse rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-6 w-40 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
