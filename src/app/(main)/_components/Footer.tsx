import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import {
  address,
  instagram,
  phoneNumbers,
  telegram,
} from "../../../../data/footer";

export default function Footer() {
  return (
    <footer className="mt-[107px] flex h-[404px] w-full flex-col items-center bg-[#FAFAFA] px-7 pt-[37px] sm:px-[50px] md:px-[90px]">
      <div className="flex w-full flex-col items-center justify-center border-b pb-12">
        <Image
          src="/images/logo-footer.png"
          alt="Azarmalek Logo"
          width={100}
          height={100}
        />

        <p className="mt-8 text-center text-sm font-normal">
          شماره تماس: {phoneNumbers.join(" - ")}
        </p>
        <p className="mt-4 text-center text-sm font-normal">آدرس: {address}</p>

        {/* Social Links */}
        <div className="mt-[30px] flex flex-row gap-2.5">
          {[
            {
              href: telegram,
              icon: (
                <FaTelegramPlane
                  size={18}
                  className="mr-0.5 text-gray-700 transition-colors group-hover:text-[#0058B7]"
                />
              ),
              label: "Telegram",
            },
            {
              href: instagram,
              icon: (
                <FaInstagram
                  size={18}
                  className="text-gray-700 transition-colors group-hover:text-[#0058B7]"
                />
              ),
              label: "Instagram",
            },
          ].map(({ href, icon, label }, index) => (
            <Link
              key={index}
              href={href}
              aria-label={label}
              className="group flex size-10 items-center justify-center rounded-full border border-[#CCCC] transition-all hover:border-[#0058B7] hover:bg-[#0058B7]">
              <div className="flex size-6 items-center justify-center rounded-full bg-white">
                {icon}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <p className="mb-7 mt-6 text-center text-xs font-normal">
        تمامی حقوق این وبسایت متعلق به آذرملک می‌باشد. طراحی و توسعه توسط تیم
        پلاس
      </p>
    </footer>
  );
}
