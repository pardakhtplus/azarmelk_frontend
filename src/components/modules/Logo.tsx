import Link from "next/link";
import CustomImage from "./CustomImage";

export default function Logo() {
  return (
    <Link href="/" className="flex h-full w-12 shrink-0 items-center">
      <CustomImage
        className="h-full object-contain"
        src="/images/logo.png"
        alt="LOGO"
        width={100}
        height={100}
      />
    </Link>
  );
}
