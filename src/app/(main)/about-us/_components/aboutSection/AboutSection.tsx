'use client'
import { useEffect, useState } from "react";
import ImagePile from "./imagePile/ImagePile";
import ImageModal from "./imageModal/ImageModal";


const images = [
    { src: '/images/about.png', alt: "", rotation: 'rotate-[-7deg]' },
    { src: '/images/about.png', alt: "", rotation: 'rotate-[0deg]' },
    { src: '/images/about.png', alt: "", rotation: 'rotate-[7deg]' },
];

const about =
    'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد.';


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
        <div id="about" className="w-full px-5 md:px-10 lg:px-20 xl:px-[110px] pt-12 md:pt-[117px] mb-[70px]">

            <h1 className="text-2xl md:text-[32px] font-medium text-center">
                آذرملک کارگزاری{" "}
                <div className="inline-flex w-[175px] h-[65px] items-center justify-center border border-[#0058B7] rounded-[50%]">
                    قانونی املاک
                </div>{" "}
                و مستغلات
            </h1>

            <div className="w-full h-full mt-24 md:mt-[123px] min-h-[255px] flex flex-col lg:flex-row text-justify gap-[60px]  xl:gap-[60px] items-center">
                {/* Image pile */}
                <ImagePile images={images} onClick={openModal} />
                <p className="w-full max-w-full lg:max-w-1/2 xl:max-w-2/3">
                    {about}
                </p>
            </div>

            {/* Modal */}
            <ImageModal
                open={modalOpen}
                images={images}
                onClose={closeModal}
            />
        </div>
    )
}