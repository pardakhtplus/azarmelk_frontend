import Image from "next/image";

interface Teammate {
    name: string;
    role: string;
    imgSrc: string;
}

const teammates: Teammate[] = [
    { name: "سالار زمانخانی", role: "مدیریت", imgSrc: "/images/teammate.png" },
    { name: "مینا قادری", role: "مشاور فروش", imgSrc: "/images/teammate.png" },
    { name: "علی رحیمی", role: "بازاریاب", imgSrc: "/images/teammate.png" },
    { name: "نسترن هدایت", role: "تحلیل‌گر مالی", imgSrc: "/images/teammate.png" },
];

export default function Team() {
    return (
        <section className="w-full mt-[140px] px-6 md:px-[85px] flex flex-col items-center">
            <h1 className="text-2xl md:text-[32px] font-medium text-center mb-12">
                تیم ما
            </h1>

            <div className="flex flex-wrap justify-start gap-6 lg:gap-[15px] xl:w-[1101px] lg:w-[823px] sm:w-[552px] w-[265px]">
                {teammates.map((person, index) => (
                    <div key={index} className="w-[264px] text-right">
                        <Image
                            src={person.imgSrc}
                            width={264}
                            height={280}
                            alt={`${person.name} - ${person.role}`}
                            className="bg-[#D9D9D9] object-cover"
                        />
                        <p className="font-medium text-xl mt-5">{person.name}</p>
                        <p className="font-medium text-sm text-[#0163E4] mt-2">
                            {person.role}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
