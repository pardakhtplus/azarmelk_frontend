import Image from "next/image";

export default function CollaborationPage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-597px)] w-full flex-col items-center pt-9">
      <h1 className="text-2xl font-bold sm:text-[28px]">همکاری با ما</h1>

      <section className="mt-[26px] flex w-full flex-col gap-[37px] px-5 md:px-[114px] xl:px-[228px]">
        <div className="relative aspect-[823/396] w-full overflow-hidden bg-[#D9D9D9]">
          <Image
            src="/images/elGoli.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex h-full w-full flex-col gap-6 text-justify text-sm font-normal sm:text-base">
          <p className="mb-5 text-lg font-medium">
            دپارتمان املاک آذرملک از میان بانوان و آقایان واجد شرایط و علاقمند
            به حوزه املاک ، دعوت به همکاری می نماید:
          </p>
          <div>
            <p className="mb-2 text-lg font-medium">شرایط استخدام:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>سن :20 الی 60</li>
              <li>تحصیلات: دیپلم به بالا</li>
              <li>توانایی کار با دیوار و سایت آذرملک و سایت های مرتبط</li>
              <li>امکان همکاری فقط به صورت تمام وقت می باشد</li>
              <li>ساعات کاری :10 الی 14 – 17الی 21</li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-lg font-medium">امکانات مجموعه:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>3 اتاق قرارداد مجهز</li>
              <li>اتاق قرارداد vip</li>
              <li>
                حضور کارشناس حقوقی و مدیر قرارداد به صورت تمام وقت در مجموعه
              </li>
              <li>
                برگزاری لیگ رقابتی هر 4 ماه یکبار و پرداخت هدایای دلاری ویژه
              </li>
              <li>سهمیه آگهی دیوار طبق قوانین مجموعه </li>
              <li>سایت فعال و حرفه ای دارای زنگ خور</li>
              <li>
                اینستاگرام فعال و دارای زنگ خور با حضور مسئول تولید محتوا به
                صورت تمام وقت
              </li>
              <li>
                حضور تمام وقت مسئول crm )ارتباط با مشتری) و مدیر مالی در مجموعه
              </li>
              <li>تبلیغات پیامکی و تراکت و در بستر وب برای جذب ملک و مشتری </li>
              <li>
                پرداختی های مجموعه بصورت درصدی می باشد و تسویه ها بصورت هفتگی
                انجام می پذیرد.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
