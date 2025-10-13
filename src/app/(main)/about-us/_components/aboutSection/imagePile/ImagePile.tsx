import React from "react";
import Image, { type StaticImageData } from "next/image";

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
    <div className="w-full max-w-[80%] sm:max-w-[50%] xl:max-w-[33%] aspect-[3/2] relative cursor-pointer my-auto">
        {images.map((img, index) => (
            <Image
                key={index}
                src={img.src}
                alt={img.alt || `Image ${index + 1}`}
                fill
                className={`absolute top-0 lg:translate-x-0 lg:right-0 object-cover ${img.rotation}`}
                onClick={() => onClick(index)}
                style={{ zIndex: index }}
            />
        ))}
    </div>
);

export default ImagePile;