"use client";

import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import LoadMoreButton from "@/components/modules/LoadMoreButton";
import { useLandingInfinity } from "@/services/queries/client/landing/useLandingInfinity";
import { type TGetLanding } from "@/types/client/landing/types";
import Link from "next/link";
import { useRef } from "react";

export default function EstateList({
  slug,
  initialData,
}: {
  slug: string;
  initialData: TGetLanding;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { allLandings, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useLandingInfinity({
      enabled: true,
      slug,
      initialData,
    });

  const landingEstates = allLandings.map((landing) => landing.estates);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const currentCount = landingEstates?.[0]?.length || 0;
      fetchNextPage().then(() => {
        // Scroll to the first new item after data is loaded
        setTimeout(() => {
          if (containerRef.current) {
            const newCard =
              containerRef.current.querySelectorAll(".estate-item")[
                currentCount
              ];
            if (newCard) {
              newCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }, 100);
      });
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {landingEstates?.[0]?.map((estate, idx) => (
          <div
            key={estate.id}
            className="estate-item animate-fadeIn"
            style={{ animationDelay: `${idx * 60}ms` }}>
            <Link href={`/estates/${estate.id}`} target="_blank">
              <EstateCardItem estate={estate} isWebsite />
            </Link>
          </div>
        ))}
      </div>
      <LoadMoreButton onClick={handleLoadMore} isVisible={hasNextPage} />
      {isFetchingNextPage && (
        <div className="mt-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        </div>
      )}
    </>
  );
}
