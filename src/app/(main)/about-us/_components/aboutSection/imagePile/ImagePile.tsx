import CustomImage from "@/components/modules/CustomImage";
import { type StaticImageData } from "next/image";
import React from "react";

interface ImageType {
  src: string | StaticImageData;
  alt: string;
  rotation: string;
}

interface ImagePileProps {
  images: ImageType[];
  onClick: (idx: number) => void;
}

const ImagePile: React.FC<ImagePileProps> = ({ images, onClick }) => (
  <div className="relative my-auto aspect-[3/2] w-full max-w-[80%] cursor-pointer sm:max-w-[50%] xl:max-w-[33%]">
    {images.map((img, index) => (
      <CustomImage
        key={index}
        src={img.src}
        alt={img.alt || `Image ${index + 1}`}
        fill
        className={`absolute top-0 object-cover lg:right-0 lg:translate-x-0 ${img.rotation}`}
        onClick={() => onClick(index)}
        style={{ zIndex: index }}
      />
    ))}
  </div>
);

export default ImagePile;
