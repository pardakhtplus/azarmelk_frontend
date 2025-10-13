import React, { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
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
            onClick={onClose}
        >
            <div
                className="relative w-full h-full bg-white flex flex-col justify-center items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 left-5 text-gray-700 hover:text-black"
                    onClick={onClose}
                    aria-label="بستن"
                >
                    <FaX size={25} />
                </button>
                <div className="flex items-center justify-center w-full h-[90%] gap-4">
                    <button
                        className="text-3xl size-15 px-2 py-1 hover:bg-gray-200 rounded-full"
                        onClick={prevImage}
                        aria-label="قبلی"
                    >
                        <FaAngleRight size={40} className="mx-auto" />
                    </button>
                    <Image
                        src={images[current].src}
                        alt={images[current].alt}
                        width={600}
                        height={400}
                        className="rounded-lg w-[80vw] max-w-2xl h-auto object-contain"
                    />
                    <button
                        className="text-3xl size-15 px-2 py-1 hover:bg-gray-200 rounded-full"
                        onClick={nextImage}
                        aria-label="بعدی"
                    >
                        <FaAngleLeft size={40} className="mx-auto" />
                    </button>
                </div>
                <div dir="ltr" className="text-center text-xl text-gray-500 mt-2">
                    {current + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;