"use client";

import { getDefaultPosterFileByCategory } from "@/components/modules/estate/EstateUtils";
import { type PropertyTypeEnum } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { TEstate, TFile } from "@/types/types";
import {
  ChevronLeft,
  ChevronRight,
  ImageOffIcon,
  Play,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "usehooks-ts";
import "./EstateGalleryView.css";
import CustomImage from "@/components/modules/CustomImage";

export default function EstateGalleryView({
  files,
  estate,
}: {
  files: TFile[];
  estate: TEstate;
}) {
  const isXl = useMediaQuery("(min-width: 1024px)");
  const [isClient, setIsClient] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // تعداد عکس‌های نمایشی در حالت دسکتاپ
  const MAX_DESKTOP_IMAGES = 3;

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    }
    if (isLightboxOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, activeIndex]);

  const openLightbox = (index: number, file: TFile) => {
    const isSupported =
      file.mimeType?.toLowerCase().startsWith("image") ||
      file.mimeType?.toLowerCase().startsWith("video");
    if (!isSupported) return;
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % files.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const renderSkeleton = () => (
    <div className="grid w-full grid-cols-1">
      <div className="flex w-full flex-col gap-3">
        {/* Mobile skeleton */}
        <div className="w-full lg:hidden">
          <div className="aspect-[16/10] w-full animate-pulse overflow-hidden rounded-md bg-gray-200/80" />
        </div>
        {/* Desktop skeleton */}
        <div className="hidden w-full grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[16/10] w-full animate-pulse overflow-hidden rounded-md bg-gray-200/80"
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (!isClient) return renderSkeleton();

  if (!files?.length)
    return (
      <div className="sticky top-8 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {getDefaultPosterFileByCategory({
          propertyType: estate.category.propertyType as PropertyTypeEnum,
        }) ? (
          <Image
            src={getDefaultPosterFileByCategory({
              propertyType: estate.category.propertyType as PropertyTypeEnum,
            })}
            alt="ملک تصویر"
            width={1200}
            height={750}
            className="size-full cursor-pointer object-cover"
          />
        ) : (
          <ImageOffIcon className="size-12 text-gray-800" />
        )}
      </div>
    );

  return (
    <div className="sticky top-8 grid w-full grid-cols-1">
      <div className="flex w-full flex-col gap-3 overflow-hidden">
        {!isXl ? (
          <div className="w-full lg:hidden">
            <Swiper
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1.4,
                },
              }}
              spaceBetween={12}
              centeredSlides={false}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={true}
              modules={[Pagination, Navigation, EffectCoverflow]}
              className="mySwiper"
              dir="rtl">
              {files.map((file, index) => (
                <SwiperSlide key={`${file.key}-${index}`}>
                  <div
                    className="group relative aspect-[16/10] w-full overflow-hidden rounded-md border border-primary/10 bg-primary/10"
                    onClick={() => openLightbox(index, file)}>
                    {file.mimeType?.toLowerCase().startsWith("image") ? (
                      <CustomImage
                        src={file.url}
                        alt={`ملک تصویر ${index + 1}`}
                        width={1200}
                        height={750}
                        className="size-full cursor-pointer object-cover"
                      />
                    ) : file.mimeType?.toLowerCase().startsWith("video") ? (
                      <video
                        src={file.url}
                        width={1200}
                        height={750}
                        className="size-full cursor-pointer object-cover"
                      />
                    ) : null}

                    {file.mimeType?.toLowerCase().startsWith("video") ? (
                      <>
                        <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-md md:size-14">
                            <Play className="size-6" />
                          </span>
                        </div>
                        <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                          ویدیو
                        </span>
                      </>
                    ) : null}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div
            className={cn(
              "hidden w-full lg:grid lg:grid-cols-2 lg:gap-3",
              files.length === 1 && "!grid-cols-1",
            )}>
            {/* نمایش عکس‌های محدود */}
            {files.slice(0, MAX_DESKTOP_IMAGES).map((file, index) => (
              <div
                key={`${file.key}-${index}`}
                className="group relative aspect-[16/10] w-full overflow-hidden rounded-md border border-primary/10 bg-primary/10"
                onClick={() => openLightbox(index, file)}>
                {file.mimeType?.toLowerCase().startsWith("image") ? (
                  <CustomImage
                    src={file.url}
                    alt={`ملک تصویر ${index + 1}`}
                    width={1000}
                    height={750}
                    className="size-full cursor-pointer object-cover"
                  />
                ) : file.mimeType?.toLowerCase().startsWith("video") ? (
                  <video
                    src={file.url}
                    width={1200}
                    height={750}
                    className="size-full cursor-pointer object-cover"
                  />
                ) : null}

                {file.mimeType?.toLowerCase().startsWith("video") ? (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-md md:size-14">
                        <Play className="size-6" />
                      </span>
                    </div>
                    <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                      ویدیو
                    </span>
                  </>
                ) : null}
              </div>
            ))}

            {/* دکمه دیدن همه */}
            {files.length > MAX_DESKTOP_IMAGES && (
              <div
                className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-md border border-primary/20 transition-all hover:bg-primary/10"
                onClick={() => {
                  setActiveIndex(0);
                  setIsLightboxOpen(true);
                }}>
                {/* بکگراند با عکس‌های باقی‌مانده */}
                <div className="absolute inset-0 grid grid-cols-2 gap-1">
                  {files.slice(MAX_DESKTOP_IMAGES).map((file, index) => (
                    <div
                      key={`bg-${file.key}-${index}`}
                      className="relative overflow-hidden"
                      style={{
                        filter: "blur(4px)",
                        opacity: 0.4,
                      }}>
                      {file.mimeType?.toLowerCase().startsWith("image") ? (
                        <CustomImage
                          src={file.url}
                          alt={`ملک تصویر ${MAX_DESKTOP_IMAGES + index + 1}`}
                          width={400}
                          height={300}
                          className="size-full object-cover"
                        />
                      ) : file.mimeType?.toLowerCase().startsWith("video") ? (
                        <video
                          src={file.url}
                          width={400}
                          height={300}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* محتوای اصلی دکمه */}
                <div className="relative z-10 flex size-full flex-col items-center justify-center gap-3 text-primary backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">
                    +{files.length - MAX_DESKTOP_IMAGES}
                  </div>
                  <span className="text-sm font-medium">دیدن همه</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isLightboxOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 size-full bg-black/90 p-4 md:p-10">
            {/* دکمه بستن */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 z-50 flex size-12 items-center justify-center rounded-full bg-red/30 shadow-lg backdrop-blur-md transition-all hover:bg-red/40">
              <XIcon className="size-7 text-red" />
            </button>

            {/* دکمه‌های ناوبری */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-md transition-all hover:bg-white/30">
              <ChevronLeft className="size-7 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-md transition-all hover:bg-white/30">
              <ChevronRight className="size-7 text-white" />
            </button>

            {/* شماره عکس */}
            <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              {activeIndex + 1} از {files.length}
            </div>

            {/* محتوای اصلی */}
            <div
              className="relative z-40 m-auto flex size-full max-h-[100vh] max-w-[1400px] items-center justify-center"
              onClick={(e) => e.stopPropagation()}>
              {files[activeIndex]?.mimeType
                ?.toLowerCase()
                .startsWith("image") ? (
                <CustomImage
                  src={files[activeIndex].url}
                  alt={`ملک تصویر ${activeIndex + 1}`}
                  width={1600}
                  height={1000}
                  className="size-full object-contain"
                />
              ) : files[activeIndex]?.mimeType
                  ?.toLowerCase()
                  .startsWith("video") ? (
                <video
                  src={files[activeIndex].url}
                  width={1600}
                  height={1000}
                  className="size-full object-contain"
                  controls
                  autoPlay
                />
              ) : null}
            </div>

            {/* میانبر تماس با مشاور */}
            {/* <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-6 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {adviser?.avatar?.url ? (
                    <Image
                      src={adviser.avatar.url}
                      alt={`عکس پروفایل ${adviser.firstName} ${adviser.lastName}`}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/20 text-primary">
                      <span className="text-lg font-semibold">
                        {adviser?.firstName?.[0]}
                        {adviser?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {adviser?.firstName} {adviser?.lastName}
                  </h3>
                  <p className="text-xs text-gray-600">مشاور</p>
                </div>
              </div>
              <div className="flex gap-2">
                {adviser?.phoneNumber && (
                  <a
                    href={`tel:${adviser?.phoneNumber}`}
                    className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:bg-green-600"
                    title="تماس تلفنی">
                    <Phone className="size-5" />
                  </a>
                )}
              </div>
            </div> */}
          </div>,
          document.body,
        )}
    </div>
  );
}
