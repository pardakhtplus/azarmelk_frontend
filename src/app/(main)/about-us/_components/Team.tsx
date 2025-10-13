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
  {
    name: "نسترن هدایت",
    role: "تحلیل‌گر مالی",
    imgSrc: "/images/teammate.png",
  },
];

export default function Team() {
  return (
    <section className="mt-[140px] flex w-full flex-col items-center px-6 md:px-[85px]">
      <h1 className="mb-12 text-center text-2xl font-medium md:text-[32px]">
        تیم ما
      </h1>

      <div className="flex w-[265px] flex-wrap justify-start gap-6 sm:w-[552px] lg:w-[823px] lg:gap-[15px] xl:w-[1101px]">
        {teammates.map((person, index) => (
          <div key={index} className="w-[264px] text-right">
            <Image
              src={person.imgSrc}
              width={264}
              height={280}
              alt={`${person.name} - ${person.role}`}
              className="bg-[#D9D9D9] object-cover"
            />
            <p className="mt-5 text-xl font-medium">{person.name}</p>
            <p className="mt-2 text-sm font-medium text-[#0163E4]">
              {person.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
