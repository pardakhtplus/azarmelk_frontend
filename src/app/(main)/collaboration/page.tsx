import Image from "next/image";

export default function CollaborationPage() {
    return (
        <div className="w-full min-h-[calc(100vh-597px)] h-full flex flex-col items-center pt-9">
            <h1 className="text-2xl sm:text-[28px] font-bold">
                همکاری با ما
            </h1>

            <section className="px-5 md:px-[114px] xl:px-[228px] w-full mt-[26px] flex flex-col gap-[37px]">

                <div className="w-full aspect-[823/396] bg-[#D9D9D9] overflow-hidden relative">
                    <Image
                        src="/images/elGoli.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="w-full h-full flex flex-col gap-6 font-normal text-sm sm:text-base text-justify">

                    <div>
                        <p>
                            خانواده بزرگ آذر ملک از افراد واجد شرایط و جویای کار با مشخصات ذیل دعوت به همکاری مینماید
                        </p>
                        <ul className="list-disc list-inside">
                            <li>
                                رده سنی: 25 الی 45
                            </li>
                            <li>
                                تحصیلات: حداقل لیسانس
                            </li>
                            <li>
                                الویت: رشته های عمران، معماری، مدیریت، بازاریابی، حقوق
                            </li>

                            <li>
                                نحوه همکاری: تمام وقت
                            </li>
                            <li>
                                حقوق: پورسانتی
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p>
                            امکانات مجموعه:
                        </p>

                        <ul className="list-disc list-inside">
                            <li>
                                سیستم دپارتمانی
                            </li>
                            <li>

                                اتاق جلسه VIP
                            </li>
                            <li>
                                مدیر قرارداد و متخصص حقوقی
                            </li>
                            <li>
                                تسویه آنی
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p>
                            سوالات متداول
                        </p>

                        <ul className="list-disc list-inside">
                            <li>
                                تایم کاری: 10 صبح تا 9 شب
                            </li>
                            <li>
                                تایم‌استراحت: 14 الی 17
                            </li>
                            <li>
                                نحوه همکاری: فقط تمام وقت
                            </li>
                            <li>
                                حقوق: 40 الی 50 درصد از کمسیون دریافتی از هر معامله
                            </li>
                            <li>
                                تسویه: پس دریافت وجه از دو طرف معامله درجا تسویه خواهد شد
                            </li>
                            <li>
                                آموزش: صفر تا صد کارهای ملکی و اصول معامله در طی یک هفته آموزش داده خواهد شد
                            </li>
                            <li>
                                شروع همکاری: طی یک قرارداد کاری و به مدت یک الی سه ماه به صورت آزمایشی
                            </li>
                        </ul>
                    </div>

                </div>
            </section>
        </div>
    )
}