import { ICloudUpload } from "@/components/Icons";
import { type Control, useFieldArray } from "react-hook-form";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "usehooks-ts";
import type { z } from "zod";
import "./EstateGallery.css";
import MediaItem from "./MediaItem";
import { type mutateEstateSchema } from "./MutateEstate";

export default function EstateGallery({
  control,  
  isUserPanel,
}: {
  control: Control<z.infer<typeof mutateEstateSchema>>;
  isUserPanel?: boolean;
}) {
  const isXl = useMediaQuery("(min-width: 1280px)");

  const medias = useFieldArray({
    control,
    name: "files",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file) => {
      medias.append({
        url: "",
        file_name: "",
        key: "",
        mimeType: "",
        isPoster: false,
        file: file,
      });
    });
  };

  return (
    <div className="grid w-full grid-cols-1">
      <div className="flex w-full flex-col gap-3">
        {/* Mobile view - Swiper */}
        {!isXl ? (
          <div className="w-full xl:hidden">
            <Swiper
              slidesPerView={1.4}
              spaceBetween={12}
              centeredSlides={false}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation, EffectCoverflow]}
              className="mySwiper"
              dir="rtl">
              <SwiperSlide>
                <label className="flex aspect-[16/10] h-full w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary-blue bg-primary-blue/10 transition-colors hover:bg-primary-blue/20">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center gap-y-2 p-2">
                    <ICloudUpload className="size-8" />
                    <p className="text-center text-xs font-medium">
                      بکشید و رها کنید یا انتخاب کنید
                    </p>
                    <p className="text-center text-xs text-text-300">
                      برای انتخاب تصویر اصلی روی ستاره کلیک کنید
                    </p>
                  </div>
                </label>
              </SwiperSlide>

              {medias.fields.map((field, index) => (
                <SwiperSlide key={field.id}>
                  <MediaItem
                    key={field.id}
                    mediaItem={{
                      url: field.url,
                      file_name: field.file_name,
                      key: field.key,
                      mimeType: field.mimeType,
                      isPoster: field.isPoster,
                      file: field.file,
                    }}
                    index={index}
                    medias={medias}
                    isUserPanel={isUserPanel}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="hidden w-full grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid xl:grid-cols-1">
            <label className="flex aspect-[16/10] h-full w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary-blue bg-primary-blue/10 transition-colors hover:bg-primary-blue/20">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-y-2 p-2">
                <ICloudUpload className="size-8 md:size-12" />
                <p className="text-center text-xs font-medium md:text-sm lg:text-base">
                  بکشید و رها کنید یا انتخاب کنید
                </p>
                <p className="hidden text-xs text-text-300 md:block">
                  میتونید فایل های تصویری و ویدیویی برای آپلود انتخاب کنید.
                </p>
                <p className="hidden text-xs text-text-300 md:block">
                  برای انتخاب تصویر اصلی روی ستاره کلیک کنید
                </p>
              </div>
            </label>

            {medias.fields.map((src, index) => (
              <MediaItem
                key={src.id}
                mediaItem={{
                  url: src.url,
                  file_name: src.file_name,
                  key: src.key,
                  mimeType: src.mimeType,
                  isPoster: src.isPoster,
                  file: src.file,
                }}
                index={index}
                medias={medias}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
