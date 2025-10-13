import {
  IClockBlue,
  IEnvelopeBlue,
  ILocationBlue,
  IPhone,
} from "@/components/Icons";

const contactItems = [
  {
    icon: <ILocationBlue />,
    text: "تبریز، دانشگاه تبریز، مرکز نوآوری و شکوفایی، واحد ۸",
    className: "border-b md:border-l xl:border-b-0",
  },
  {
    icon: <IPhone className="text-primary-blue" />,
    text: "021-66716554",
    className: "border-b xl:border-b-0 xl:border-l",
  },
  {
    icon: <IClockBlue />,
    text: "24 ساعته در دسترس هستیم",
    className: "border-b md:border-b-0 md:border-l xl:border-l",
  },
  {
    icon: <IEnvelopeBlue />,
    text: "Info@tazminplus.com",
    className: "",
  },
];

export default function ContactUs() {
  return (
    <section className="bg-green-10 h-full w-full pb-[60px] pt-9">
      <h1 className="text-center text-2xl font-bold sm:text-[28px]">
        تماس با ما
      </h1>

      <div className="bg-red-10 mt-[46px] flex h-full w-full flex-col gap-[60px] px-8 sm:px-[70px] lg:px-[115px]">
        <div className="flex h-full min-h-[227px] w-full flex-wrap overflow-hidden rounded-[15px] border border-[#CCCC]">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className={`flex h-[227px] w-full min-w-[260px] flex-col items-center justify-center gap-10 px-6 text-center md:w-1/2 xl:w-1/4 ${item.className} border-[#CCCC]`}>
              {item.icon}
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        {/* location */}
        <div>
          <h2 className="text-2xl font-normal">موقعیت ما</h2>

          {/* map */}

          <div className="mt-2.5 h-[373px] w-full overflow-hidden rounded-15">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2672.867990190754!2d46.32815075210465!3d38.05785916239376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1753871221164!5m2!1sen!2s"
              width="600"
              height="450"
              className="border:0; h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
