import {
  IClockBlue,
  IEnvelopeBlue,
  ILocationBlue,
  IPhone,
} from "@/components/Icons";
import {
  address,
  emails,
  iframe,
  phoneNumbers,
  times,
} from "../../../../data/contact-us";

const contactItems = [
  {
    icon: <ILocationBlue />,
    text: address,
    className: "border-b md:border-l xl:border-b-0",
  },
  {
    icon: <IPhone className="text-primary-blue" />,
    text: phoneNumbers.join(" - "),
    className: "border-b xl:border-b-0 xl:border-l",
  },
  {
    icon: <IClockBlue />,
    text: times,
    className: "border-b md:border-b-0 md:border-l xl:border-l",
  },
  {
    icon: <IEnvelopeBlue />,
    text: emails.join(" - "),
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

          <div
            className="mt-2.5 h-[373px] w-full overflow-hidden rounded-15"
            dangerouslySetInnerHTML={{ __html: iframe }}
          />
        </div>
      </div>
    </section>
  );
}
