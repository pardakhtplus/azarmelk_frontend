import CustomImage from "@/components/modules/CustomImage";
import { type StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaX } from "react-icons/fa6";

interface ImageModalProps {
  open: boolean;
  images: { src: string | StaticImageData; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  open,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [current, setCurrent] = useState(initialIndex);

  // Keep current index in sync with initialIndex when modal opens
  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}>
      <div
        className="relative flex h-full w-full flex-col items-center justify-center bg-white"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute left-5 top-5 text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="بستن">
          <FaX size={25} />
        </button>
        <div className="flex h-[90%] w-full items-center justify-center gap-4">
          <button
            className="size-15 rounded-full px-2 py-1 text-3xl hover:bg-gray-200"
            onClick={prevImage}
            aria-label="قبلی">
            <FaAngleRight size={40} className="mx-auto" />
          </button>
          <CustomImage
            src={images[current].src}
            alt={images[current].alt}
            width={600}
            height={400}
            className="h-auto w-[80vw] max-w-2xl rounded-lg object-contain"
          />
          <button
            className="size-15 rounded-full px-2 py-1 text-3xl hover:bg-gray-200"
            onClick={nextImage}
            aria-label="بعدی">
            <FaAngleLeft size={40} className="mx-auto" />
          </button>
        </div>
        <div dir="ltr" className="mt-2 text-center text-xl text-gray-500">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
