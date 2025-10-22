import CustomImage from "@/components/modules/CustomImage";
import { type DealTypeEnum } from "@/lib/categories";
import SearchBox from "./SearchBox";

export default function Hero({ dealType }: { dealType: DealTypeEnum }) {
  return (
    <div className="relative h-[calc(100vh-85px)] min-h-[600px] w-full bg-green-200 xs:min-h-[650px] sm:min-h-[700px]">
      <CustomImage
        src="/images/elGoli.jpg"
        alt="El Goli Park"
        width={1400}
        height={1000}
        className="h-full w-full object-cover"
        priority={true}
        loading="eager"
        sizes="100vw"
        quality={85}
        placeholder="blur"
        blurDataURL="/images/elGoli.jpg"
      />

      <SearchBox dealType={dealType} />
    </div>
  );
}
