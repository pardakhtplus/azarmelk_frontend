"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type EmptyStateAction =
  | { type: "button"; label: string; onClick: () => void }
  | { type: "link"; label: string; href: string };

export default function EmptyState({
  className,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  className?: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl bg-white/60 p-10 text-center shadow-sm",
        className,
      )}>
      {icon ? (
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-blue/10 text-primary-blue">
          <div className="scale-110">{icon}</div>
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-[520px] text-sm leading-6 text-gray-500">
          {description}
        </p>
      ) : null}
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            primaryAction.type === "link" ? (
              <Link
                href={primaryAction.href}
                className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-blue/90">
                {primaryAction.label}
              </Link>
            ) : (
              <button
                onClick={primaryAction.onClick}
                className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-blue/90">
                {primaryAction.label}
              </button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.type === "link" ? (
              <Link
                href={secondaryAction.href}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                {secondaryAction.label}
              </button>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
