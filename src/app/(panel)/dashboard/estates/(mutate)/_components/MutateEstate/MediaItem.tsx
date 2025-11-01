import { IEye, IStar, IStarFill, ITrash } from "@/components/Icons";
import CustomImage from "@/components/modules/CustomImage";
import { cn, isFile } from "@/lib/utils";
import useUploadWatermarkedFileChunking from "@/services/mutations/admin/bucket/useUploadWatermarkedFileChunking";
import useUserUploadWatermarkedFileChunking from "@/services/mutations/client/bucket/useUserUploadWatermarkedFileChunking";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type UseFieldArrayReturn } from "react-hook-form";
import { type z } from "zod";
import { type mutateEstateSchema } from "./MutateEstate";

export default function MediaItem({
  mediaItem,
  index,
  medias,
  isUserPanel,
}: {
  mediaItem: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
    isPoster: boolean;
    file: any;
  };
  index: number;
  medias: UseFieldArrayReturn<z.infer<typeof mutateEstateSchema>, "files">;
  isUserPanel?: boolean;
}) {
  const firstTimeRender = useRef(false);
  const adminUpload = useUploadWatermarkedFileChunking({
    id: mediaItem.key,
  });
  const clientUpload = useUserUploadWatermarkedFileChunking({
    id: mediaItem.key,
  });
  const [isShowFullSize, setIsShowFullSize] = useState(false);

  const {
    uploadingProgress,
    uploadWatermarkedFileChunking,
    isUploading,
    // cancelUpload,
  } = isUserPanel
    ? {
        uploadingProgress: clientUpload.uploadingProgress,
        uploadWatermarkedFileChunking:
          clientUpload.uploadWatermarkedFileChunkingUser,
        isUploading: clientUpload.isUploading,
        // cancelUpload: clientUpload.cancelUpload,
      }
    : {
        ...adminUpload,
        uploadWatermarkedFileChunking:
          adminUpload.uploadWatermarkedFileChunking,
      };

  useEffect(() => {
    if (firstTimeRender.current) return;
    firstTimeRender.current = true;

    async function uploadFileHandler() {
      if (!isFile(mediaItem.file) || isUploading) return;

      const res = await uploadWatermarkedFileChunking.mutateAsync({
        file: mediaItem.file,
      });

      if (!res?.url) {
        return medias.remove(index);
      }

      medias.update(index, {
        url: res.url,
        key: res.key,
        mimeType: res.mimeType,
        file_name: res.fileName,
        file: undefined,
        // Only images can be poster
        isPoster: false,
      });
    }

    uploadFileHandler();
  }, [mediaItem, medias, index, isUploading, uploadWatermarkedFileChunking]);

  return (
    <>
      <div
        className={cn(
          "group relative flex aspect-[16/10] h-full w-full items-center justify-center overflow-hidden rounded-xl bg-primary-blue/10 transition-all",
          isUploading && "bg-primary-blue/5",
          !mediaItem.url && !isUploading && !mediaItem.file && "bg-red-500/10",
          mediaItem.isPoster && "ring-2 ring-primary ring-offset-2",
        )}>
        {isUploading ? null : (
          <>
            <button
              onClick={() => {
                medias.remove(index);
              }}
              className="absolute right-1.5 top-1.5 z-10 flex size-9 items-center justify-center rounded-full bg-red/30 shadow-lg backdrop-blur-md transition-all hover:bg-red/40">
              <ITrash className="size-5 text-red" />
            </button>
            {mediaItem.url &&
              mediaItem.mimeType.toLowerCase().startsWith("image") && (
                <button
                  onClick={() => {
                    // Set all other images to not poster
                    medias.fields.forEach((_, fieldIndex) => {
                      if (fieldIndex !== index) {
                        medias.update(fieldIndex, {
                          ...medias.fields[fieldIndex],
                          isPoster: false,
                        });
                      }
                    });
                    // Set current image as poster
                    medias.update(index, {
                      ...mediaItem,
                      isPoster: !mediaItem.isPoster,
                    });
                  }}
                  className="absolute left-1.5 top-1.5 z-10 flex size-9 items-center justify-center rounded-full bg-primary/30 shadow-lg backdrop-blur-md transition-all hover:bg-primary/40">
                  {mediaItem.isPoster ? (
                    <IStarFill className="size-5 text-primary" />
                  ) : (
                    <IStar className="size-5 text-primary" />
                  )}
                </button>
              )}
          </>
        )}
        {mediaItem.url ? (
          <>
            <button
              onClick={() => setIsShowFullSize(true)}
              className="invisible absolute inset-0 z-10 m-auto flex size-12 items-center justify-center rounded-full bg-blue/20 opacity-0 backdrop-blur-md transition-all hover:bg-blue/30 group-hover:visible group-hover:opacity-100 max-lg:!visible max-lg:!opacity-100">
              <IEye className="size-7 text-blue/80" />
            </button>
            {createPortal(
              <div
                className={cn(
                  "invisible fixed inset-0 z-40 size-full bg-black/50 p-10 opacity-0 transition-all",
                  isShowFullSize && "visible opacity-100",
                )}>
                <button
                  onClick={() => setIsShowFullSize(false)}
                  className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full bg-red/30 shadow-lg backdrop-blur-md transition-all hover:bg-red/40">
                  <XIcon className="size-7 text-red" />
                </button>
                {mediaItem.mimeType.toLowerCase().startsWith("image") ? (
                  <CustomImage
                    src={mediaItem.url}
                    alt={`ملک تصویر ${index + 1}`}
                    width={1200}
                    height={1200}
                    className="size-full object-contain transition-transform"
                  />
                ) : mediaItem.mimeType.toLowerCase().startsWith("video") ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <video
                      src={mediaItem.url}
                      width={1200}
                      height={1200}
                      className="m-auto size-fit max-h-full max-w-full transition-transform"
                      controls
                    />
                  </div>
                ) : null}
              </div>,
              document.body,
            )}
          </>
        ) : null}
        {isUploading ? (
          <>
            <div className="absolute inset-0 z-10 m-auto flex flex-col items-center justify-center gap-y-2">
              <CircleUploader progress={uploadingProgress} size={70} />
              {/* <button
                onClick={async () => {
                  await cancelUpload();
                  medias.remove(index);
                }}
                className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600">
                لغو آپلود
              </button> */}
            </div>
            {mediaItem.file.type.startsWith("image") ? (
              <CustomImage
                unoptimized
                src={URL.createObjectURL(mediaItem.file)}
                alt={`ملک تصویر ${index + 1}`}
                width={400}
                height={250}
                className="size-full object-cover brightness-50 transition-transform"
              />
            ) : null}
          </>
        ) : mediaItem.url &&
          mediaItem.mimeType.toLowerCase().startsWith("image") ? (
          <CustomImage
            unoptimized
            src={mediaItem.url}
            alt={`ملک تصویر ${index + 1}`}
            width={400}
            height={250}
            className="size-full object-cover transition-transform"
          />
        ) : mediaItem.url &&
          mediaItem.mimeType.toLowerCase().startsWith("video") ? (
          <video
            src={mediaItem.url}
            width={400}
            height={250}
            className="size-full object-cover transition-transform"
            controls
          />
        ) : !mediaItem.file ? (
          <div className="flex flex-col items-center justify-center gap-y-2 p-2">
            <p className="text-center text-xs font-medium text-red">
              مشکلی پیش آمده
            </p>
          </div>
        ) : null}

        {/* Poster indicator */}
        {mediaItem.isPoster && mediaItem.url && (
          <div className="absolute bottom-2 left-2 z-20 rounded-full bg-primary px-2 py-1 text-xs font-medium text-white shadow-lg">
            تصویر اصلی
          </div>
        )}
      </div>
    </>
  );
}

interface CircleUploaderProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  text?: string;
  className?: string;
}

export function CircleUploader({
  progress,
  size = 80,
  strokeWidth = 5,
  text,
  className = "",
}: CircleUploaderProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary-blue transition-all duration-300 ease-in-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        {text ? (
          <span className="text-xs font-medium text-gray-600">{text}</span>
        ) : (
          <span className="text-sm font-semibold text-primary-blue">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
}
