"use client";
import { useEffect, useState } from "react";
import ImagePile from "./imagePile/ImagePile";
import ImageModal from "./imageModal/ImageModal";
import { about } from "../../../../../../data/about-us";

const images = [
  { src: "/images/about.png", alt: "", rotation: "rotate-[-7deg]" },
  { src: "/images/about.png", alt: "", rotation: "rotate-[0deg]" },
  { src: "/images/about.png", alt: "", rotation: "rotate-[7deg]" },
];

export default function AboutSection() {
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal on image pile click
  const openModal = () => {
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup on unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [modalOpen]);

  return (
    <div
      id="about"
      className="mb-[70px] w-full px-5 pt-12 md:px-10 md:pt-[117px] lg:px-20 xl:px-[110px]">
      <h1 className="text-center text-2xl font-medium md:text-[32px]">
        آذرملک کارگزاری{" "}
        <div className="inline-flex h-[65px] w-[175px] items-center justify-center rounded-[50%] border border-[#0058B7]">
          قانونی املاک
        </div>{" "}
        و مستغلات
      </h1>

      <div className="mt-24 flex h-full min-h-[255px] w-full flex-col items-center gap-[60px] text-justify md:mt-[123px] lg:flex-row xl:gap-[60px]">
        {/* Image pile */}
        <ImagePile images={images} onClick={openModal} />
        <p className="lg:max-w-1/2 xl:max-w-2/3 w-full max-w-full whitespace-pre-line">
          {about}
        </p>
      </div>

      {/* Modal */}
      <ImageModal open={modalOpen} images={images} onClose={closeModal} />
    </div>
  );
}
