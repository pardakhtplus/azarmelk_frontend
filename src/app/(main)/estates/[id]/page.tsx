import {
  IArrowsLeftRightToLine,
  IBedRegular,
  IBoxesStacked,
  IBuildingRegular,
  ICalendarWeek,
  IExpand,
  IGrid2Regular,
  ILayerGroup,
  ILocationDotLight,
  IToman,
} from "@/components/Icons";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/services/api-config";
import { handleQueries } from "@/services/axios-client";
import { serverApi } from "@/services/server-api";
import { type TGetEstate } from "@/types/client/estate/types";
import { notFound } from "next/navigation";
import AdvisorCard from "./_components/AdvisorCard";
import AmenityTag from "./_components/AmenityTag";
import EstateGalleryView from "./_components/EstateGalleryView";
import OwnersSection from "./_components/OwnersSection";
import PropertyDetailItem from "./_components/PropertyDetailItem";
import EstateCode from "./_components/EstateCode";
import ShareButton from "@/components/modules/buttons/ShareButton";
import SaveButton from "@/components/modules/buttons/SaveButton";
import { ESTATE_STATUS } from "@/enums";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const estate = await serverApi.get<TGetEstate>(
    API_CONFIG.endpoints.client.estate.get + "?" + handleQueries({ id }),
  );

  return {
    title: estate.data.title,
    description: estate.data.description,
  };
}

export default async function EstatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let estate: TGetEstate | null = null;

  try {
    const res = await serverApi.get<TGetEstate>(
      API_CONFIG.endpoints.client.estate.get + "?" + handleQueries({ id }),
    );

    console.log(res);

    estate = res;
  } catch {
    notFound();
  }

  console.log(estate.data);

  const estateDetails = [
    {
      label: "متراژ",
      value: estate?.data?.metrage?.toString() || "",
      isVisible: !!estate?.data?.metrage,
      icon: <IExpand className="size-6" />,
    },
    {
      label: "تعداد اتاق",
      value: estate?.data?.roomCount?.toString() || "",
      isVisible: !!estate?.data?.roomCount,
      icon: <IBedRegular className="size-6" />,
    },
    {
      label: "طبقه",
      value: estate?.data?.floor?.toString() || "",
      isVisible: !!estate?.data?.floor,
      icon: <ILayerGroup className="size-6" />,
    },
    {
      label: "سال ساخت",
      value: estate?.data?.buildYear?.toString() || "",
      isVisible: !!estate?.data?.buildYear,
      icon: <ICalendarWeek className="size-6" />,
    },
    {
      label: "تعداد طبقات",
      value: estate?.data?.floorCount?.toString() || "",
      isVisible: !!estate?.data?.floorCount,
      icon: <IBuildingRegular className="size-[26px]" />,
    },
    {
      label: "متراژ سوله",
      value: estate?.data?.soleMetrage?.toString() || "",
      isVisible: !!estate?.data?.soleMetrage,
      icon: <IExpand className="size-6" />,
    },
    {
      label: "متراژ کف",
      value: estate?.data?.floorMetrage?.toString() || "",
      isVisible: !!estate?.data?.floorMetrage,
      icon: <IExpand className="size-6" />,
    },
    {
      label: "متراژ دهنه",
      value: estate?.data?.dahaneMetrage?.toString() || "",
      isVisible: !!estate?.data?.dahaneMetrage,
      icon: <IArrowsLeftRightToLine className="size-6" />,
    },
    {
      label: "متراژ بنا",
      value: estate?.data?.banaMetrage?.toString() || "",
      isVisible: !!estate?.data?.banaMetrage,
      icon: <IExpand className="size-6" />,
    },
    {
      label: "عرض ملک",
      value: estate?.data?.arzMelk?.toString() || "",
      isVisible: !!estate?.data?.arzMelk,
      icon: <IArrowsLeftRightToLine className="size-6" />,
    },
    {
      label: "تعداد واحد در طبقه",
      value: estate?.data?.floorUnitCount?.toString() || "",
      isVisible: !!estate?.data?.floorUnitCount,
      icon: <IGrid2Regular className="size-6" />,
    },
    {
      label: "عرض گذر",
      value: estate?.data?.arzGozar?.toString() || "",
      isVisible: !!estate?.data?.arzGozar,
      icon: <IArrowsLeftRightToLine className="size-6" />,
    },
    {
      label: "موقعیت ملک",
      value: estate?.data?.location?.join(", ").toString() || "",
      isVisible: !!estate?.data?.location,
      icon: <ILocationDotLight className="size-6" />,
    },
    {
      label: "طول ملک",
      value: estate?.data?.tolMelk?.toString() || "",
      isVisible: !!estate?.data?.tolMelk,
      icon: <IArrowsLeftRightToLine className="size-6" />,
    },
    {
      label: "ارتفاع",
      value: estate?.data?.height?.toString() || "",
      isVisible: !!estate?.data?.height,
      icon: <IExpand className="size-6" />,
    },
    {
      label: "انباری",
      value: estate?.data?.inventory?.toString() || "",
      isVisible: !!estate?.data?.inventory,
      icon: <IBoxesStacked className="size-6" />,
    },
    {
      label: "متراژ اعیان",
      value: estate?.data?.ayanMetrage?.toString() || "",
      isVisible: !!estate?.data?.ayanMetrage,
      icon: <IExpand className="size-6" />,
    },
  ];

  // ایجاد آرایه امکانات از فیلدهای estate
  const createAmenitiesArray = () => {
    const amenitiesMap = new Map<string, string[]>();

    // استفاده از ساختار جدید properties
    const properties = estate?.data?.properties;

    if (!properties) return [];

    // استفاده از ساختار جدید که شامل title، mainTitle و values است
    Object.entries(properties).forEach(([_, property]) => {
      if (
        property &&
        typeof property === "object" &&
        "title" in property &&
        "mainTitle" in property &&
        "values" in property
      ) {
        if (
          property.values &&
          Array.isArray(property.values) &&
          property.values.length > 0
        ) {
          // ترکیب mainTitle و title برای نمایش کامل
          // مثال: "ویژگی‌های معماری/سبک دوبلکس"
          let displayTitle = property.mainTitle;
          if (property.title && property.title !== property.mainTitle) {
            displayTitle = `${property.mainTitle}/${property.title}`;
          }
          if (property.title === "مقدار وام") {
            amenitiesMap.set(displayTitle, [
              `${Number(property.values[0]).toLocaleString("fa-IR")} تومان`,
            ]);
          } else amenitiesMap.set(displayTitle, property.values);
        }
      }
    });

    // تعداد پارکینگ (این فیلد جداگانه است)
    if (estate?.data?.parkingCount) {
      amenitiesMap.set("تعداد پارکینگ", [estate.data.parkingCount.toString()]);
    }

    // تبدیل Map به آرایه
    const amenities: { label: string; values: string[] }[] = [];
    amenitiesMap.forEach((values, label) => {
      amenities.push({ label, values });
    });

    return amenities;
  };

  const estateAmenities = createAmenitiesArray();

  return (
    <div className="container flex min-h-[calc(100vh-597px)] w-full flex-col-reverse gap-5 pt-8 sm:gap-10 sm:pt-12 lg:flex-row">
      <div className="w-full">
        <div className="flex flex-col gap-5">
          {estate.data.status === ESTATE_STATUS.PENDING && (
            <span className="w-fit rounded-full bg-orange-500/10 px-4 py-1 text-sm font-normal text-orange-500">
              غیر فعال
            </span>
          )}
          <div className="flex items-center gap-2">
            <ShareButton />
            <SaveButton estateId={id} initialIsSaved={estate?.data?.isSaved} />
          </div>

          <h1 className="text-2xl font-semibold leading-relaxed sm:text-[32px]">
            {estate?.data?.title}
          </h1>
        </div>

        {/* Prices */}
        {estate?.data?.totalPrice && estate.data.metragePrice ? (
          <div className="mt-[15px] flex flex-wrap items-center gap-5 text-[#373737]">
            <span className="flex items-center gap-0.5 text-xl font-normal text-black">
              <span className="text-sm text-[#373737]">قیمت کل: </span>
              {estate?.data?.totalPrice.toLocaleString()}{" "}
              <IToman className="size-5" />
            </span>
            <span className="flex items-center gap-0.5 text-sm font-normal">
              قیمت هر متر: {estate?.data?.metragePrice.toLocaleString()}{" "}
              <IToman className="size-5" />
            </span>
          </div>
        ) : (
          <div className="mt-[15px] flex flex-wrap items-center gap-5 text-[#373737]">
            <span className="flex items-center gap-0.5 text-xl font-normal text-black">
              <span className="text-sm text-[#373737]">قیمت رهن: </span>
              {estate?.data?.rahnPrice.toLocaleString()}{" "}
              <IToman className="size-5" />
            </span>
            <span className="flex items-center gap-0.5 text-sm font-normal">
              قیمت اجاره: {estate?.data?.ejarePrice.toLocaleString()}{" "}
              <IToman className="size-5" />
            </span>
          </div>
        )}

        {/* <div className="mt-5 flex items-start gap-x-1">
          <p className="text-sm font-normal">کد ملک: </p>
          <p className="text-sm font-normal text-text-200">
            {estate?.data?.estateCode}
          </p>
        </div> */}

        <EstateCode estateCode={estate?.data?.estateCode?.toString() || ""} />

        {estate?.data?.approximateAddress && (
          <div className="mt-5 flex items-start gap-x-1">
            <p className="text-sm font-normal">آدرس حدودی: </p>
            <p className="text-sm font-normal text-text-200">
              {estate?.data?.approximateAddress}
            </p>
          </div>
        )}

        {/* Property Details */}
        <div className="mt-10 grid grid-cols-3 gap-y-6 min-[430px]:grid-cols-4 xs:grid-cols-5 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {estateDetails
            .filter((item) => item.isVisible)
            .map((item, i) => (
              <PropertyDetailItem key={i} {...item} delay={i} />
            ))}
        </div>

        {/* Amenities */}
        <section className="my-10 flex flex-col gap-10 sm:my-16">
          {estateAmenities.length ? (
            <div>
              <h2 className="text-base font-medium"> امکانات</h2>
              <div className="mt-5 flex w-full flex-wrap gap-2.5">
                {estateAmenities.map((item, i) => (
                  <AmenityTag key={i} {...item} delay={i} />
                ))}
              </div>
            </div>
          ) : null}
          {estate.data.description && (
            <div className="">
              <h2 className="text-base font-medium">توضیحات</h2>
              <p className="mt-2 whitespace-pre-line text-right text-sm/[30px] font-normal">
                {estate?.data?.description}
              </p>
            </div>
          )}
          {estate.data.address ? (
            <div className="">
              <h2 className="text-base font-medium">آدرس دقیق</h2>
              <p className="mt-2 whitespace-pre-line text-right text-sm/[30px] font-normal">
                {estate?.data?.address}
              </p>
            </div>
          ) : null}
        </section>

        {/* Owners Section */}
        <OwnersSection owners={estate?.data?.owners} />

        {/* Advisor Section */}
        {estate?.data?.adviser &&
          estate?.data?.adviser.firstName &&
          estate?.data?.adviser.lastName && (
            <AdvisorCard
              adviser={estate?.data?.adviser}
              className={cn("mt-0", !estateAmenities.length && "mt-10")}
              estateId={id}
            />
          )}
      </div>

      {/* Image Section */}
      <div className={cn("flex w-full flex-col items-center gap-5")}>
        <EstateGalleryView
          files={estate?.data?.files || []}
          estate={estate?.data}
        />
      </div>
    </div>
  );
}
