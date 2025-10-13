"use client";

import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import LoadMoreButton from "@/components/modules/LoadMoreButton";
import { type DealType, DealTypeEnum } from "@/lib/categories";
import { useEstateListInfinity } from "@/services/queries/client/estate/useEstateListInfinity";
import Link from "next/link";
import { useRef } from "react";

export default function LatestEstates({
  dealType,
}: {
  dealType: DealTypeEnum;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    allEstates,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEstateListInfinity({
    params: {
      DealType: (dealType || DealTypeEnum.FOR_SALE) as unknown as DealType,
      limit: "6",
      status: "PUBLISH",
    },
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const currentCount = allEstates.length;
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
    <section className="container mb-24 mt-16 flex flex-col">
      <h1 className="mb-12 text-center text-xl font-bold sm:text-2xl">
        جدیدترین آگهی های{" "}
        {dealType === DealTypeEnum.FOR_SALE
          ? "خرید و فروش"
          : dealType === DealTypeEnum.FOR_RENT
            ? "رهن و اجاره"
            : dealType === DealTypeEnum.PRE_SALE
              ? "پیش فروش"
              : dealType === DealTypeEnum.PARTICIPATION
                ? "مشارکت"
                : "خرید و فروش"}
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[13/16] w-full animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-8 text-center text-red-500">
          خطا در بارگذاری آگهی‌ها. لطفاً دوباره تلاش کنید.
        </div>
      ) : allEstates.length > 0 ? (
        <div
          ref={containerRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allEstates.map((estate, idx) => (
            <div
              key={estate.id}
              className="estate-item animate-fadeIn"
              style={{ animationDelay: `${idx * 60}ms` }}>
              <Link href={`/estates/${estate.id}`}>
                <EstateCardItem estate={estate} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          هیچ آگهی جدیدی یافت نشد.
        </div>
      )}

      <LoadMoreButton onClick={handleLoadMore} isVisible={hasNextPage} />
      {isFetchingNextPage && (
        <div className="mt-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        </div>
      )}
    </section>
  );
}
